import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { creditsApi } from "../api/credits";
import { agentsApi } from "../api/agents";
import { useLanguage } from "../context/LanguageContext";
import { useCompany } from "../context/CompanyContext";
import { CheckoutModal } from "./CheckoutModal";

const CURRENCY_BY_COUNTRY: Record<string, { symbol: string; code: string; locale: string }> = {
  bf: { symbol: "", code: "FCFA", locale: "fr-FR" },
  ml: { symbol: "", code: "FCFA", locale: "fr-FR" },
  sn: { symbol: "", code: "FCFA", locale: "fr-FR" },
  ci: { symbol: "", code: "FCFA", locale: "fr-FR" },
  ne: { symbol: "", code: "FCFA", locale: "fr-FR" },
  bj: { symbol: "", code: "FCFA", locale: "fr-FR" },
  tg: { symbol: "", code: "FCFA", locale: "fr-FR" },
  cm: { symbol: "", code: "FCFA", locale: "fr-FR" },
  ga: { symbol: "", code: "FCFA", locale: "fr-FR" },
  fr: { symbol: "€", code: "EUR", locale: "fr-FR" },
  be: { symbol: "€", code: "EUR", locale: "fr-BE" },
  ch: { symbol: "CHF", code: "CHF", locale: "fr-CH" },
  ca: { symbol: "CA$", code: "CAD", locale: "fr-CA" },
  us: { symbol: "$", code: "USD", locale: "en-US" },
  gb: { symbol: "£", code: "GBP", locale: "en-GB" },
};

const DEFAULT_CURRENCY = { symbol: "", code: "FCFA", locale: "fr-FR" };

interface CreditBalanceProps {
  companyId: string;
  compact?: boolean;
}

export function CreditBalance({ companyId, compact }: CreditBalanceProps) {
  const { t } = useLanguage();
  const { selectedCompany } = useCompany();
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: creditData, refetch } = useQuery({
    queryKey: ["credits", companyId],
    queryFn: () => creditsApi.getBalance(companyId),
    enabled: !!companyId,
  });

  const { data: agents } = useQuery({
    queryKey: ["agents", companyId],
    queryFn: () => agentsApi.list(companyId),
    enabled: !!companyId,
  });

  const currency = useMemo(() => {
    if (agents && agents.length > 0) {
      for (const agent of agents) {
        const meta = (agent.metadata ?? {}) as Record<string, unknown>;
        const country = meta.country as string | undefined;
        if (country && CURRENCY_BY_COUNTRY[country]) return CURRENCY_BY_COUNTRY[country];
      }
    }
    if (selectedCompany) {
      const meta = (selectedCompany as any).metadata as Record<string, unknown> | undefined;
      const country = meta?.country as string | undefined;
      if (country && CURRENCY_BY_COUNTRY[country]) return CURRENCY_BY_COUNTRY[country];
    }
    return DEFAULT_CURRENCY;
  }, [selectedCompany, agents]);

  const userCountry = useMemo(() => {
    if (agents && agents.length > 0) {
      for (const agent of agents) {
        const meta = (agent.metadata ?? {}) as Record<string, unknown>;
        if (meta.country) return meta.country as string;
      }
    }
    return undefined;
  }, [agents]);

  const credits = creditData?.balance ?? 0;
  const balance = credits * 10;
  const isLow = credits > 0 && credits < 50;
  const isEmpty = credits === 0;
  const progressPercent = Math.min(100, (credits / 500) * 100);

  const formattedBalance = currency.code === "FCFA"
    ? `${balance.toLocaleString(currency.locale)} ${currency.code}`
    : `${currency.symbol}${balance.toLocaleString(currency.locale)}`;

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowCheckout(true)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-accent/50 ${
            isEmpty ? "border-red-500/30 bg-red-500/5 text-red-500"
            : isLow ? "border-orange-500/30 bg-orange-500/5 text-orange-500"
            : "border-border bg-card"
          }`}
        >
          <span>💰</span>
          <span>{formattedBalance}</span>
        </button>
        <CheckoutModal
          open={showCheckout}
          onOpenChange={setShowCheckout}
          companyId={companyId}
          userCountry={userCountry}
        />
      </>
    );
  }

  return (
    <>
      <div className={`rounded-xl border p-4 ${
        isEmpty ? "border-red-500/30 bg-red-500/5"
        : isLow ? "border-orange-500/30 bg-orange-500/5"
        : "border-border bg-card"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{t("Solde")}</span>
          {isEmpty && (
            <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
              {t("Solde épuisé")}
            </span>
          )}
          {isLow && !isEmpty && (
            <span className="text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
              {t("Solde bas")}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold">{formattedBalance}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {credits.toLocaleString(currency.locale)} {t("crédits restants")}
        </p>
        <div className="w-full h-2 rounded-full bg-muted mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isEmpty ? "bg-red-500" : isLow ? "bg-orange-500" : "bg-[#0071E3]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {isEmpty && (
          <p className="text-xs text-red-500 mb-3">{t("Rechargez pour continuer")}</p>
        )}
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full py-2 px-4 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#0071E3" }}
        >
          {t("Recharger")}
        </button>
      </div>
      <CheckoutModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        companyId={companyId}
        userCountry={userCountry}
      />
    </>
  );
}
