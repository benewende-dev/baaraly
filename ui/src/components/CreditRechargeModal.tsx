import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../context/LanguageContext";
import { creditsApi } from "../api/credits";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  BAARALY_RECHARGE_PACKS,
  getPaymentProvidersForCountry,
  formatPriceFromEur,
  type PaymentProvider,
} from "@paperclipai/shared/baaraly-agents";

interface CreditRechargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  userCountry?: string;
}

type Step = "packs" | "provider" | "payment" | "success";

/* ─── Provider colors ─── */
const PROVIDER_COLORS: Record<string, string> = {
  orange_money: "#FF6600",
  wave: "#1DC8FF",
  moov_money: "#0055A4",
  mtn_momo: "#FFC800",
  airtel_money: "#E4002B",
  mpesa: "#4CAF50",
  cinetpay: "#0071E3",
  stripe: "#635BFF",
  paypal: "#003087",
  crypto: "#F7931A",
};

export function CreditRechargeModal({ open, onOpenChange, companyId, userCountry }: CreditRechargeModalProps) {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("packs");
  const [selectedPack, setSelectedPack] = useState<string>("standard");
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providers = getPaymentProvidersForCountry(userCountry);
  const pack = BAARALY_RECHARGE_PACKS.find((p) => p.id === selectedPack);
  const packPriceEur = pack ? pack.fcfa / 655.96 : 0;
  const packPrice = formatPriceFromEur(packPriceEur, userCountry);

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => {
      setStep("packs");
      setSelectedPack("standard");
      setSelectedProvider(null);
      setPhoneNumber("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvc("");
      setCardName("");
      setError(null);
    }, 300);
  }

  async function handlePayment() {
    if (!selectedProvider || !pack) return;
    setIsProcessing(true);
    setError(null);
    try {
      const checkout = await creditsApi.checkout(companyId, {
        planId: `recharge_${pack.id}`,
        provider: selectedProvider.id,
        amount: packPriceEur,
        currency: getCurrencyCode(userCountry),
        credits: pack.credits,
        phoneNumber: selectedProvider.types.includes("mobile_money") ? phoneNumber : undefined,
        cardLast4: selectedProvider.types.includes("card") ? cardNumber.slice(-4) : undefined,
      });
      await creditsApi.confirmPayment(companyId, checkout.paymentId);
      queryClient.invalidateQueries({ queryKey: ["credits", companyId] });
      setStep("success");
    } catch (err: any) {
      setError(err?.message || t("Le paiement a échoué"));
    } finally {
      setIsProcessing(false);
    }
  }

  function getCurrencyCode(country?: string): string {
    const map: Record<string, string> = {
      fr: "EUR", be: "EUR", lu: "EUR", mc: "EUR",
      ch: "CHF", ca: "CAD", us: "USD", gb: "GBP",
      bf: "XOF", ml: "XOF", sn: "XOF", ci: "XOF", ne: "XOF", bj: "XOF", tg: "XOF",
      cm: "XAF", ga: "XAF", cd: "CDF", gn: "GNF",
    };
    return (country && map[country]) || "XOF";
  }

  const mobileProviders = providers.filter((p) => p.types.includes("mobile_money"));
  const cardProviders = providers.filter((p) => p.types.includes("card"));
  const cryptoProviders = providers.filter((p) => p.types.includes("crypto"));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* ═══ Step indicator ═══ */}
        {step !== "success" && (
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-center gap-3">
              {["packs", "provider", "payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                      s === step
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : i < ["packs", "provider", "payment"].indexOf(step)
                          ? "bg-green-500/15 text-green-600"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < ["packs", "provider", "payment"].indexOf(step) ? "✓" : i + 1}
                  </div>
                  {i < 2 && (
                    <div
                      className={`flex-1 h-[2px] rounded-full transition-all ${
                        i < ["packs", "provider", "payment"].indexOf(step)
                          ? "bg-green-500/30"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex mt-1.5">
              <span className="flex-1 text-[10px] text-muted-foreground text-center">Pack</span>
              <span className="flex-1 text-[10px] text-muted-foreground text-center">Paiement</span>
              <span className="flex-1 text-[10px] text-muted-foreground text-center">Confirmation</span>
            </div>
          </div>
        )}

        <div className="px-6 pb-6">
          {/* ═══ PACKS STEP ═══ */}
          {step === "packs" && (
            <div className="space-y-3">
              <h3 className="text-base font-bold">{t("Choisissez votre pack")}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {BAARALY_RECHARGE_PACKS.map((p) => {
                  const isSelected = selectedPack === p.id;
                  const price = formatPriceFromEur(p.fcfa / 655.96, userCountry);
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPack(p.id)}
                      className={`relative text-left rounded-2xl border-2 p-4 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/[0.04] shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                          : "border-border/60 hover:border-border hover:shadow-sm"
                      }`}
                    >
                      {p.badge && (
                        <span
                          className="absolute -top-2 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            color: p.badgeColor ?? "#666",
                            backgroundColor: p.badgeColor ? `${p.badgeColor}12` : "var(--muted)",
                            border: `1px solid ${p.badgeColor ? `${p.badgeColor}25` : "var(--border)"}`,
                          }}
                        >
                          {p.badge}
                        </span>
                      )}
                      <div className="text-center">
                        <p className="text-xl font-bold mb-0.5">{price}</p>
                        <p className="text-[11px] font-semibold text-foreground/80">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {p.credits.toLocaleString("fr-FR")} {t("crédits")}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setStep("provider")}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] mt-2"
                style={{ backgroundColor: "#0071E3" }}
              >
                {t("Continuer")} →
              </button>
            </div>
          )}

          {/* ═══ PROVIDER STEP ═══ */}
          {step === "provider" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("packs")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {t("Retour")}
              </button>

              <h3 className="text-base font-bold">{t("Comment voulez-vous payer ?")}</h3>

              {/* Mobile Money */}
              {mobileProviders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <span className="text-xs">📱</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Mobile Money
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {mobileProviders.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProvider(p);
                          setStep("payment");
                        }}
                        className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-all hover:shadow-md ${
                          selectedProvider?.id === p.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border/60 hover:border-border"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${PROVIDER_COLORS[p.id] || "#888"}12` }}
                        >
                          {p.icon}
                        </div>
                        <span className="text-[10px] font-semibold text-center leading-tight">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Carte bancaire */}
              {cardProviders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <span className="text-xs">💳</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("Carte bancaire")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {cardProviders.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProvider(p);
                          setStep("payment");
                        }}
                        className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-all hover:shadow-md ${
                          selectedProvider?.id === p.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border/60 hover:border-border"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${PROVIDER_COLORS[p.id] || "#888"}12` }}
                        >
                          {p.icon}
                        </div>
                        <span className="text-[10px] font-semibold text-center leading-tight">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Crypto */}
              {cryptoProviders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <span className="text-xs">₿</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {t("Crypto")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {cryptoProviders.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProvider(p);
                          setStep("payment");
                        }}
                        className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 transition-all hover:shadow-md ${
                          selectedProvider?.id === p.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border/60 hover:border-border"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${PROVIDER_COLORS[p.id] || "#888"}12` }}
                        >
                          {p.icon}
                        </div>
                        <span className="text-[10px] font-semibold text-center leading-tight">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 pt-2">
                <span className="text-[10px] text-muted-foreground">🔒</span>
                <span className="text-[10px] text-muted-foreground">{t("Paiement 100% sécurisé")}</span>
              </div>
            </div>
          )}

          {/* ═══ PAYMENT STEP ═══ */}
          {step === "payment" && selectedProvider && (
            <div className="space-y-4">
              <button
                onClick={() => { setStep("provider"); setSelectedProvider(null); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {t("Retour")}
              </button>

              {/* Order summary */}
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{t("Récapitulatif")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${PROVIDER_COLORS[selectedProvider.id] || "#888"}12` }}
                    >
                      {selectedProvider.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{pack?.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {pack?.credits.toLocaleString("fr-FR")} {t("crédits")}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">{packPrice}</span>
                </div>
              </div>

              {/* Mobile Money form */}
              {selectedProvider.types.includes("mobile_money") && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">
                      {t("Numéro de téléphone")}
                    </label>
                    <div className="flex gap-2">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: `${PROVIDER_COLORS[selectedProvider.id] || "#888"}12` }}
                      >
                        {selectedProvider.icon}
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="70 00 00 00"
                        className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/50"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t("Vous recevrez une notification USSD pour confirmer")}
                    </p>
                  </div>
                </div>
              )}

              {/* Card form */}
              {selectedProvider.types.includes("card") && (
                <div className="space-y-3">
                  {/* Card preview */}
                  <div
                    className="rounded-2xl p-4 text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${PROVIDER_COLORS[selectedProvider.id] || "#333"}, ${PROVIDER_COLORS[selectedProvider.id] || "#333"}88)`,
                    }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -mr-10 -mt-10" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -ml-6 -mb-6" />
                    <p className="text-[10px] font-medium opacity-70 mb-4 uppercase">{selectedProvider.name}</p>
                    <p className="font-mono text-sm tracking-widest mb-3">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex justify-between text-[10px]">
                      <div>
                        <p className="opacity-50 uppercase">{t("Titulaire")}</p>
                        <p className="font-medium">{cardName || "NOM PRÉNOM"}</p>
                      </div>
                      <div>
                        <p className="opacity-50 uppercase">{t("Expire")}</p>
                        <p className="font-medium">{cardExpiry || "MM/AA"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">{t("Nom sur la carte")}</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">{t("Numéro de carte")}</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        v = v.replace(/(\d{4})/g, "$1 ").trim();
                        setCardNumber(v);
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 font-mono tracking-wider"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">{t("Expiration")}</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                          setCardExpiry(v);
                        }}
                        placeholder="MM/AA"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="•••"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Crypto */}
              {selectedProvider.types.includes("crypto") && (
                <div className="rounded-2xl border border-border bg-muted/20 p-6 text-center">
                  <span className="text-4xl block mb-3">₿</span>
                  <p className="text-sm font-bold">{t("Paiement crypto")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Vous serez redirigé vers la passerelle de paiement")}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handlePayment}
                disabled={
                  isProcessing ||
                  !selectedProvider ||
                  (selectedProvider.types.includes("mobile_money") && phoneNumber.length < 8) ||
                  (selectedProvider.types.includes("card") && (cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3 || !cardName))
                }
                className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all disabled:opacity-40 hover:opacity-90 active:scale-[0.98] shadow-lg"
                style={{ backgroundColor: "#0071E3" }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("Traitement...")}
                  </span>
                ) : (
                  `${t("Payer")} ${packPrice}`
                )}
              </button>
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            </div>
          )}

          {/* ═══ SUCCESS STEP ═══ */}
          {step === "success" && (
            <div className="space-y-4 text-center py-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto animate-bounce">
                <span className="text-4xl">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">{t("Recharge réussie !")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  +{pack?.credits.toLocaleString("fr-FR")} {t("crédits ajoutés")}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-2xl font-bold">{packPrice}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pack?.name} · {selectedProvider?.name}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#0071E3" }}
              >
                {t("Fermer")}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
