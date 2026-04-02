import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  BAARALY_BILLING_PLANS,
  getPaymentProvidersForCountry,
  formatPriceFromEur,
  type BillingPlanId,
  type PaymentProvider,
} from "@paperclipai/shared/baaraly-agents";

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  currentPlan?: BillingPlanId;
  userCountry?: string;
}

type CheckoutStep = "plan" | "provider" | "payment" | "success";

/* ═══════════════════════════════════════════
   Checkout Modal
   ═══════════════════════════════════════════ */
export function CheckoutModal({
  open,
  onOpenChange,
  companyId,
  currentPlan = "trial",
  userCountry,
}: CheckoutModalProps) {
  const { t } = useLanguage();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<CheckoutStep>("plan");
  const [selectedPlan, setSelectedPlan] = useState<BillingPlanId>("pro");
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const providers = getPaymentProvidersForCountry(userCountry);
  const plans = BAARALY_BILLING_PLANS.filter((p) => p.id !== "trial" && p.id !== currentPlan);

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => {
      setStep("plan");
      setSelectedPlan("pro");
      setSelectedProvider(null);
      setPhoneNumber("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvc("");
      setCardName("");
    }, 300);
  }

  /* ── Plan selection step ── */
  function PlanStep() {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          {t("Choisissez votre forfait")}
        </p>
        {BAARALY_BILLING_PLANS.filter((p) => p.id !== "trial").map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isCurrentPlan = plan.id === currentPlan;
          const price = formatPriceFromEur(plan.priceEur, userCountry);
          return (
            <button
              key={plan.id}
              disabled={isCurrentPlan}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                isCurrentPlan
                  ? "border-muted bg-muted/30 opacity-50 cursor-not-allowed"
                  : isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border hover:border-muted-foreground/30 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{plan.id === "pro" ? "⚡" : "🚀"}</span>
                    <span className="text-base font-bold">{plan.name}</span>
                    {isCurrentPlan && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {t("Forfait actuel")}
                      </span>
                    )}
                    {plan.id === "pro" && !isCurrentPlan && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                        ⭐ {t("Populaire")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>👥 {plan.maxAgents} {t("agents")}</span>
                    <span>📊 {plan.maxProspectsPerDay} {t("prospects/jour")}</span>
                    <span>📱 WhatsApp</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{price}</p>
                  <p className="text-[10px] text-muted-foreground">/{t("mois")}</p>
                </div>
              </div>
            </button>
          );
        })}
        <button
          onClick={() => setStep("provider")}
          disabled={!selectedPlan || selectedPlan === currentPlan}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 hover:opacity-90"
          style={{ backgroundColor: "#0071E3" }}
        >
          {t("Continuer")} →
        </button>
      </div>
    );
  }

  /* ── Provider selection step ── */
  function ProviderStep() {
    const mobileProviders = providers.filter((p) => p.types.includes("mobile_money"));
    const cardProviders = providers.filter((p) => p.types.includes("card"));
    const otherProviders = providers.filter((p) => !p.types.includes("mobile_money") && !p.types.includes("card"));

    return (
      <div className="space-y-4">
        <button
          onClick={() => setStep("plan")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {t("Retour")}
        </button>

        <div>
          <p className="text-sm font-medium mb-2">{t("Comment voulez-vous payer ?")}</p>

          {/* Mobile Money */}
          {mobileProviders.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("Mobile Money")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mobileProviders.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProvider(p);
                      setStep("payment");
                    }}
                    className={`rounded-xl border-2 p-3.5 text-left transition-all hover:shadow-md ${
                      selectedProvider?.id === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{p.icon}</span>
                    <span className="text-xs font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card payments */}
          {cardProviders.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("Carte bancaire")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {cardProviders.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProvider(p);
                      setStep("payment");
                    }}
                    className={`rounded-xl border-2 p-3.5 text-left transition-all hover:shadow-md ${
                      selectedProvider?.id === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{p.icon}</span>
                    <span className="text-xs font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Other (Crypto) */}
          {otherProviders.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("Autre")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {otherProviders.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProvider(p);
                      setStep("payment");
                    }}
                    className={`rounded-xl border-2 p-3.5 text-left transition-all hover:shadow-md ${
                      selectedProvider?.id === p.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{p.icon}</span>
                    <span className="text-xs font-semibold">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Payment form step ── */
  function PaymentStep() {
    if (!selectedProvider) return null;
    const plan = BAARALY_BILLING_PLANS.find((p) => p.id === selectedPlan);
    if (!plan) return null;
    const price = formatPriceFromEur(plan.priceEur, userCountry);
    const isCard = selectedProvider.types.includes("card");
    const isMobile = selectedProvider.types.includes("mobile_money");
    const isCrypto = selectedProvider.types.includes("crypto");

    return (
      <div className="space-y-4">
        <button
          onClick={() => setStep("provider")}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {t("Retour")}
        </button>

        {/* Order summary */}
        <div className="rounded-xl bg-muted/30 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{plan.name}</span>
            <span className="text-sm font-bold">{price}/{t("mois")}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("Paiement via")} {selectedProvider.name}</span>
            <span>{selectedProvider.icon}</span>
          </div>
        </div>

        {/* Mobile Money form */}
        {isMobile && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                {t("Numéro de téléphone")}
              </label>
              <div className="flex gap-2">
                <div className="rounded-xl border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                  {selectedProvider.icon}
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="70 00 00 00"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {t("Vous recevrez une notification pour confirmer le paiement")}
              </p>
            </div>
          </div>
        )}

        {/* Card form */}
        {isCard && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                {t("Nom sur la carte")}
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                {t("Numéro de carte")}
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  v = v.replace(/(\d{4})/g, "$1 ").trim();
                  setCardNumber(v);
                }}
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  {t("Expiration")}
                </label>
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
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                  CVC
                </label>
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="123"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 font-mono"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>🔒</span>
              <span>{t("Paiement sécurisé par")} {selectedProvider.name}</span>
            </div>
          </div>
        )}

        {/* Crypto */}
        {isCrypto && (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <span className="text-3xl block mb-2">₿</span>
            <p className="text-sm font-medium">{t("Paiement crypto")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("Vous serez redirigé vers la passerelle de paiement crypto")}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={() => setStep("success")}
          disabled={
            (isMobile && phoneNumber.length < 8) ||
            (isCard && (cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3 || !cardName))
          }
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#0071E3" }}
        >
          {t("Payer")} {price}
        </button>
      </div>
    );
  }

  /* ── Success step ── */
  function SuccessStep() {
    return (
      <div className="space-y-4 text-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-lg font-bold">{t("Paiement réussi !")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("Votre forfait a été activé. Vous pouvez maintenant utiliser tous les agents disponibles.")}
        </p>
        <button
          onClick={handleClose}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: "#0071E3" }}
        >
          {t("Fermer")}
        </button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "plan" && t("Choisir un forfait")}
            {step === "provider" && t("Moyen de paiement")}
            {step === "payment" && t("Paiement")}
            {step === "success" && t("Confirmation")}
          </DialogTitle>
          {step !== "success" && (
            <DialogDescription>
              {step === "plan" && t("Débloquez plus d'agents et de prospects")}
              {step === "provider" && t("Choisissez comment payer")}
              {step === "payment" && t("Finalisez votre achat")}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Step indicator */}
        {step !== "success" && (
          <div className="flex items-center gap-2 mb-2">
            {["plan", "provider", "payment"].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : i < ["plan", "provider", "payment"].indexOf(step)
                        ? "bg-green-500/20 text-green-600"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < ["plan", "provider", "payment"].indexOf(step) ? "✓" : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-0.5 rounded ${
                      i < ["plan", "provider", "payment"].indexOf(step) ? "bg-green-500/30" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {step === "plan" && <PlanStep />}
        {step === "provider" && <ProviderStep />}
        {step === "payment" && <PaymentStep />}
        {step === "success" && <SuccessStep />}
      </DialogContent>
    </Dialog>
  );
}
