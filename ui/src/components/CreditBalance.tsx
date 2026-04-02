import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { creditsApi } from "../api/credits";
import { useLanguage } from "../context/LanguageContext";
import { useCompany } from "../context/CompanyContext";
import { RechargeModal } from "./RechargeModal";

/**
 * Currency configuration by country code.
 * Maps ISO country codes to their currency symbol and code.
 */
const CURRENCY_BY_COUNTRY: Record<string, { symbol: string; code: string; locale: string }> = {
  // West & Central Africa (FCFA)
  bf: { symbol: "", code: "FCFA", locale: "fr-FR" },
  ml: { symbol: "", code: "FCFA", locale: "fr-FR" },
  sn: { symbol: "", code: "FCFA", locale: "fr-FR" },
  ci: { symbol: "", code: "FCFA", locale: "fr-FR" },
  ne: { symbol: "", code: "FCFA", locale: "fr-FR" },
  bj: { symbol: "", code: "FCFA", locale: "fr-FR" },
  tg: { symbol: "", code: "FCFA", locale: "fr-FR" },
  cm: { symbol: "", code: "FCFA", locale: "fr-FR" },
  ga: { symbol: "", code: "FCFA", locale: "fr-FR" },
  gq: { symbol: "", code: "FCFA", locale: "fr-FR" },
  td: { symbol: "", code: "FCFA", locale: "fr-FR" },
  cf: { symbol: "", code: "FCFA", locale: "fr-FR" },
  cg: { symbol: "", code: "FCFA", locale: "fr-FR" },
  cd: { symbol: "", code: "FCFA", locale: "fr-FR" },
  gn: { symbol: "", code: "GNF", locale: "fr-FR" },
  // Europe
  fr: { symbol: "€", code: "EUR", locale: "fr-FR" },
  be: { symbol: "€", code: "EUR", locale: "fr-BE" },
  ch: { symbol: "CHF", code: "CHF", locale: "fr-CH" },
  lu: { symbol: "€", code: "EUR", locale: "fr-LU" },
  // Other
  us: { symbol: "$", code: "USD", locale: "en-US" },
  ca: { symbol: "CA$", code: "CAD", locale: "en-CA" },
  gb: { symbol: "£", code: "GBP", locale: "en-GB" },
};

/**
 * Default currency for companies without a specific country.
 */
const DEFAULT_CURRENCY = { symbol: "", code: "FCFA", locale: "fr-FR" };

interface CreditBalanceProps {
  companyId: string;
  compact?: boolean;
}

export function CreditBalance({ companyId, compact }: CreditBalanceProps) {
  const { t } = useLanguage();
  const { selectedCompany } = useCompany();
  const [showRecharge, setShowRecharge] = useState(false);

  const { data: creditData, refetch } = useQuery({
    queryKey: ["credits", companyId],
    queryFn: () => creditsApi.getBalance(companyId),
    enabled: !!companyId,
  });

  const currency = useMemo(() => {
    if (!selectedCompany) return DEFAULT_CURRENCY;
    const meta = (selectedCompany as any).metadata as Record<string, unknown> | undefined;
    const country = meta?.country as string | undefined;
    if (country && CURRENCY_BY_COUNTRY[country]) {
      return CURRENCY_BY_COUNTRY[country];
    }
    // Fallback: check agent metadata for country
    return DEFAULT_CURRENCY;
  }, [selectedCompany]);

  const credits = creditData?.balance ?? 0;
  const balance = credits * 10;
  const isLow = credits > 0 && credits < 100;
  const isEmpty = credits === 0;
  const progressPercent = Math.min(100, (credits / 500) * 100);

  const formattedBalance = currency.code === "FCFA"
    ? `${balance.toLocaleString(currency.locale)} ${currency.code}`
    : `${currency.symbol}${balance.toLocaleString(currency.locale)}`;

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowRecharge(true)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-accent/50 ${
            isEmpty
              ? "border-red-500/30 bg-red-500/5 text-red-500"
              : isLow
                ? "border-orange-500/30 bg-orange-500/5 text-orange-500"
                : "border-border bg-card"
          }`}
        >
          <span>💰</span>
          <span>{formattedBalance}</span>
        </button>
        <RechargeModal
          open={showRecharge}
          onOpenChange={setShowRecharge}
          companyId={companyId}
          onSuccess={() => refetch()}
        />
      </>
    );
  }

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
            💰 {formattedBalance}
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
