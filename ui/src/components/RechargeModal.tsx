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
import { BAARALY_RECHARGE_PACKS, BAARALY_PAYMENT_METHODS } from "@paperclipai/shared/baaraly-agents";

interface RechargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  onSuccess?: () => void;
}

export function RechargeModal({ open, onOpenChange, companyId, onSuccess }: RechargeModalProps) {
  const { t } = useLanguage();
  const [selectedPack, setSelectedPack] = useState<string>("standard");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

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
          <DialogTitle>{t("Recharge my credits")}</DialogTitle>
          <DialogDescription>{t("Choose a pack and payment method")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {BAARALY_RECHARGE_PACKS.map((pack) => {
            const isSelected = selectedPack === pack.id;
            const borderColor = pack.badgeColor ?? "transparent";
            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? "ring-2 ring-offset-1 ring-offset-background"
                    : "border-border hover:border-muted-foreground/30"
                }`}
                style={isSelected ? { borderColor } : undefined}
                title={`${pack.name} - ${pack.fcfa.toLocaleString("fr-FR")} FCFA`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{pack.name}</span>
                      {pack.badge && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            color: pack.badgeColor ?? "inherit",
                            backgroundColor: pack.badgeColor
                              ? `${pack.badgeColor}15`
                              : "var(--muted)",
                          }}
                        >
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pack.credits.toLocaleString("fr-FR")} {t("credits")}
                    </p>
                  </div>
                  <span className="text-lg font-bold">
                    {pack.fcfa.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-3">{t("Payment method")}</p>
          <div className="grid grid-cols-2 gap-2">
            {BAARALY_PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`rounded-lg border-2 p-3 text-sm font-medium text-left transition-all ${
                  selectedPayment === method.id
                    ? "border-[#0071E3] bg-[#0071E3]/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
                title={method.label}
              >
                {method.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            {t("Secure payment")} 🔒
          </p>
        </div>

        <div className="mt-4">
          <button
            onClick={() => rechargeMutation.mutate()}
            disabled={!selectedPayment || rechargeMutation.isPending}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "#0071E3" }}
          >
            {rechargeMutation.isPending
              ? t("Processing...")
              : t("Confirm payment")}
          </button>
          {rechargeMutation.isError && (
            <p className="text-xs text-red-500 text-center mt-2">
              {t("Payment failed. Please try again.")}
            </p>
          )}
          {rechargeMutation.isSuccess && (
            <p className="text-xs text-green-500 text-center mt-2">
              {t("Recharge successful!")}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
