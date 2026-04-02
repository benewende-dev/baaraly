import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { creditsApi } from "../api/credits";
import { useLanguage } from "../context/LanguageContext";
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

interface RechargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  onSuccess?: () => void;
  /** User country code for currency/payment detection */
  userCountry?: string;
}

export function RechargeModal({ open, onOpenChange, companyId, onSuccess, userCountry }: RechargeModalProps) {
  const { t } = useLanguage();
  const [selectedPack, setSelectedPack] = useState<string>("standard");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const providers = getPaymentProvidersForCountry(userCountry);

  const rechargeMutation = useMutation({
    mutationFn: () => {
      const pack = BAARALY_RECHARGE_PACKS.find((p) => p.id === selectedPack);
      if (!pack || !selectedPayment) throw new Error("Missing selection");
      return creditsApi.recharge(companyId, {
        packId: pack.id,
        credits: pack.credits,
        fcfa: pack.fcfa,
        paymentMethod: selectedPayment,
      });
    },
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
      setSelectedPayment(null);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Recharger mes crédits")}</DialogTitle>
          <DialogDescription>{t("Choisissez un pack et un moyen de paiement")}</DialogDescription>
        </DialogHeader>

        {/* Packs */}
        <div className="space-y-2 mt-2">
          {BAARALY_RECHARGE_PACKS.map((pack) => {
            const isSelected = selectedPack === pack.id;
            const borderColor = pack.badgeColor ?? "transparent";
            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
                  isSelected
                    ? "ring-2 ring-offset-1 ring-offset-background"
                    : "border-border hover:border-muted-foreground/30"
                }`}
                style={isSelected ? { borderColor } : undefined}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{pack.name}</span>
                      {pack.badge && (
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            color: pack.badgeColor ?? "inherit",
                            backgroundColor: pack.badgeColor ? `${pack.badgeColor}15` : "var(--muted)",
                          }}
                        >
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {pack.credits.toLocaleString("fr-FR")} {t("crédits")}
                    </p>
                  </div>
                  <span className="text-base font-bold">
                    {formatPriceFromEur(pack.fcfa / 655.96, userCountry)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment providers */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">{t("Moyen de paiement")}</p>
          <div className="grid grid-cols-2 gap-2">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setSelectedPayment(provider.id)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  selectedPayment === provider.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{provider.icon}</span>
                  <span className="text-xs font-medium">{provider.name}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            🔒 {t("Paiement sécurisé")}
          </p>
        </div>

        {/* Submit */}
        <div className="mt-3">
          <button
            onClick={() => rechargeMutation.mutate()}
            disabled={!selectedPayment || rechargeMutation.isPending}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "#0071E3" }}
          >
            {rechargeMutation.isPending ? t("Traitement en cours...") : t("Confirmer le paiement")}
          </button>
          {rechargeMutation.isError && (
            <p className="text-xs text-red-500 text-center mt-2">
              {t("Le paiement a échoué. Veuillez réessayer.")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
