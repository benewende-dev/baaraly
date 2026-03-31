import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { creditsApi } from "../api/credits";
import { useLanguage } from "../context/LanguageContext";
import { RechargeModal } from "./RechargeModal";

interface CreditBalanceProps {
  companyId: string;
}

export function CreditBalance({ companyId }: CreditBalanceProps) {
  const { t } = useLanguage();
  const [showRecharge, setShowRecharge] = useState(false);

  const { data: creditData, refetch } = useQuery({
    queryKey: ["credits", companyId],
    queryFn: () => creditsApi.getBalance(companyId),
    enabled: !!companyId,
  });

  const credits = creditData?.balance ?? 0;
  const fcfa = credits * 10;
  const isLow = credits > 0 && credits < 100;
  const isEmpty = credits === 0;

  const progressPercent = Math.min(100, (credits / 500) * 100);

  return (
    <>
      <div
        className={`rounded-xl border p-4 ${
          isEmpty
            ? "border-red-500/30 bg-red-500/5"
            : isLow
              ? "border-orange-500/30 bg-orange-500/5"
              : "border-border bg-card"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {t("Credits")}
          </span>
          {isEmpty && (
            <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
              {t("Credits exhausted")}
            </span>
          )}
          {isLow && !isEmpty && (
            <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
              {t("Running low")}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold">
            💰 {fcfa.toLocaleString("fr-FR")} FCFA
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          {credits.toLocaleString("fr-FR")} {t("credits remaining")}
        </p>

        <div className="w-full h-2 rounded-full bg-muted mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isEmpty
                ? "bg-red-500"
                : isLow
                  ? "bg-orange-500"
                  : "bg-[#0071E3]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {isEmpty && (
          <p className="text-xs text-red-500 mb-3">
            {t("Credits exhausted — Recharge to continue")}
          </p>
        )}

        <button
          onClick={() => setShowRecharge(true)}
          className="w-full py-2 px-4 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#0071E3" }}
        >
          {t("Recharge")}
        </button>
      </div>

      <RechargeModal
        open={showRecharge}
        onOpenChange={setShowRecharge}
        companyId={companyId}
        onSuccess={() => refetch()}
      />
    </>
  );
}
