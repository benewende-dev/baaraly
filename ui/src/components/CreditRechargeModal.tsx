import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../context/LanguageContext";
import { creditsApi } from "../api/credits";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

type Step = "packs" | "payment" | "success";

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
  const otherProviders = providers.filter((p) => !p.types.includes("mobile_money") && !p.types.includes("card"));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "packs" && t("Recharger mes crédits")}
            {step === "payment" && t("Paiement")}
            {step === "success" && t("Recharge réussie !")}
          </DialogTitle>
          {step !== "success" && (
            <DialogDescription>
              {step === "packs" && t("Choisissez un pack de crédits")}
              {step === "payment" && t("Finalisez votre achat")}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* ── Packs step ── */}
        {step === "packs" && (
          <div className="space-y-3">
            {BAARALY_RECHARGE_PACKS.map((p) => {
              const isSelected = selectedPack === p.id;
              const price = formatPriceFromEur(p.fcfa / 655.96, userCountry);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPack(p.id)}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm">{p.name}</span>
                        {p.badge && (
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{
                              color: p.badgeColor ?? "inherit",
                              backgroundColor: p.badgeColor ? `${p.badgeColor}15` : "var(--muted)",
                            }}
                          >
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {p.credits.toLocaleString("fr-FR")} {t("crédits")}
                      </p>
                    </div>
                    <span className="text-lg font-bold">{price}</span>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setStep("payment")}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#0071E3" }}
            >
              {t("Continuer")} →
            </button>
          </div>
        )}

        {/* ── Payment step ── */}
        {step === "payment" && (
          <div className="space-y-4">
            <button
              onClick={() => setStep("packs")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← {t("Retour")}
            </button>

            {/* Order summary */}
            <div className="rounded-xl bg-muted/30 p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{pack?.name}</span>
                <span className="font-bold">{packPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{pack?.credits.toLocaleString("fr-FR")} {t("crédits")}</span>
              </div>
            </div>

            {/* Provider selection */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{t("Moyen de paiement")}</p>
              {mobileProviders.length > 0 && (
                <div className="space-y-2 mb-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">{t("Mobile Money")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {mobileProviders.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProvider(p)}
                        className={`rounded-xl border-2 p-3 text-left transition-all ${
                          selectedProvider?.id === p.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <span className="text-lg block mb-0.5">{p.icon}</span>
                        <span className="text-[11px] font-semibold">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {cardProviders.length > 0 && (
                <div className="space-y-2 mb-3">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">{t("Carte bancaire")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {cardProviders.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProvider(p)}
                        className={`rounded-xl border-2 p-3 text-left transition-all ${
                          selectedProvider?.id === p.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <span className="text-lg block mb-0.5">{p.icon}</span>
                        <span className="text-[11px] font-semibold">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {otherProviders.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {otherProviders.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProvider(p)}
                      className={`rounded-xl border-2 p-3 text-left transition-all ${
                        selectedProvider?.id === p.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{p.icon}</span>
                      <span className="text-[11px] font-semibold">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment form */}
            {selectedProvider && (
              <div className="space-y-3">
                {selectedProvider.types.includes("mobile_money") && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">{t("Numéro de téléphone")}</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="70 00 00 00"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">{t("Vous recevrez une notification pour confirmer")}</p>
                  </div>
                )}
                {selectedProvider.types.includes("card") && (
                  <>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">{t("Nom sur la carte")}</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Jean Dupont"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">{t("Numéro de carte")}</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                          v = v.replace(/(\d{4})/g, "$1 ").trim();
                          setCardNumber(v);
                        }}
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">{t("Expiration")}</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                            if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                            setCardExpiry(v);
                          }}
                          placeholder="MM/AA"
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                          placeholder="123"
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={
                isProcessing ||
                !selectedProvider ||
                (selectedProvider?.types.includes("mobile_money") && phoneNumber.length < 8) ||
                (selectedProvider?.types.includes("card") && (cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3 || !cardName))
              }
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 hover:opacity-90"
              style={{ backgroundColor: "#0071E3" }}
            >
              {isProcessing ? t("Traitement en cours...") : `${t("Payer")} ${packPrice}`}
            </button>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          </div>
        )}

        {/* ── Success step ── */}
        {step === "success" && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-lg font-bold">{t("Recharge réussie !")}</h3>
            <p className="text-sm text-muted-foreground">
              +{pack?.credits.toLocaleString("fr-FR")} {t("crédits ajoutés à votre compte")}
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#0071E3" }}
            >
              {t("Fermer")}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
