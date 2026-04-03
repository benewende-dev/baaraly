import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router";
import { useLanguage } from "../context/LanguageContext";
import { plansApi } from "../api/pricing";
import { queryKeys } from "../lib/queryKeys";
import { ThemeLangToggle } from "../components/ThemeLangToggle";

const FALLBACK_PLANS = [
  {
    id: "fallback-trial",
    name: "gratuit",
    displayName: "Essai Gratuit",
    priceFcfa: 0,
    durationDays: 7,
    maxAgents: 1,
    creditsIncluded: 500,
    features: ["1 agent Standard", "WhatsApp inclus", "Dashboard basique", "Support email"],
    isPublic: true,
    isPopular: false,
    color: "#30D158",
    order: 1,
  },
  {
    id: "fallback-pro",
    name: "pro",
    displayName: "Pro",
    priceFcfa: 30000,
    durationDays: null,
    maxAgents: 10,
    creditsIncluded: 5000,
    features: ["10 agents (Standard + Avancé)", "Multi WhatsApp", "Rapports avancés", "Support prioritaire", "Agents Finance, Commerce, Conformité"],
    isPublic: true,
    isPopular: true,
    color: "#0071E3",
    order: 2,
  },
  {
    id: "fallback-max",
    name: "max",
    displayName: "Max",
    priceFcfa: 95000,
    durationDays: null,
    maxAgents: 999,
    creditsIncluded: 20000,
    features: ["Tous les agents disponibles", "API access", "Multi-entreprise", "Support dédié", "Agents premium inclus"],
    isPublic: true,
    isPopular: false,
    color: "#BF5AF2",
    order: 3,
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [annual, setAnnual] = useState(false);

  const { data: plansData, isLoading } = useQuery({
    queryKey: queryKeys.plans,
    queryFn: plansApi.list,
  });

  const plans = plansData?.plans && plansData.plans.length > 0 ? plansData.plans : FALLBACK_PLANS;

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000] text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-5xl mx-auto">
        <span className="text-xl font-extrabold tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          Baaraly <span className="text-gradient">AI</span>
        </span>
        <ThemeLangToggle compact />
      </nav>

      {/* Header */}
      <section className="text-center px-5 pt-12 pb-8 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          {t("Choisis ton équipe digitale")} 🤖
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {t("Des agents IA qui travaillent pour toi 24h/24, 7j/7. Commence gratuitement.")}
        </p>

        {/* Toggle mensuel/annuel */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !annual ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {t("Mensuel")}
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              annual ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {t("Annuel")} <span className="text-green-500 font-bold">-20%</span>
          </button>
        </div>
      </section>

      {/* Plans */}
      <section className="px-5 pb-20 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const monthlyPrice = plan.priceFcfa;
            const annualPrice = Math.round(monthlyPrice * 0.8);
            const displayPrice = annual ? annualPrice : monthlyPrice;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`rounded-[20px] p-6 transition-all hover:-translate-y-1 ${
                  isPopular
                    ? "bg-gradient-to-b from-[#0071E3] to-[#0071E3]/80 text-white shadow-xl shadow-[#0071E3]/20 scale-[1.02] border-2 border-[#0071E3]"
                    : "bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-gray-800"
                }`}
              >
                {isPopular && (
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
                    ⭐ {t("Populaire")}
                  </span>
                )}
                {!isPopular && plan.durationDays && (
                  <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4 ${
                    isPopular ? "bg-white/20" : "bg-green-500/10 text-green-600 dark:text-green-400"
                  }`}>
                    {plan.durationDays} {t("jours gratuits")}
                  </span>
                )}

                <h3 className="text-lg font-bold">{plan.displayName}</h3>
                <p className={`text-xs mt-1 ${isPopular ? "text-white/70" : "text-muted-foreground"}`}>
                  {plan.maxAgents === 999 ? t("Illimité") : `${plan.maxAgents} ${t("agents")}`}
                </p>

                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold">
                    {displayPrice === 0 ? "0" : displayPrice.toLocaleString("fr-FR")}
                  </span>
                  <span className={`text-sm ml-1 ${isPopular ? "text-white/70" : "text-muted-foreground"}`}>
                    {displayPrice === 0 ? `FCFA · ${plan.durationDays} ${t("jours")}` : "FCFA/mois"}
                  </span>
                  {annual && displayPrice > 0 && (
                    <p className={`text-xs mt-1 ${isPopular ? "text-white/60" : "text-green-500"}`}>
                      {t("Soit")} {(displayPrice / 30).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA/{t("jour")}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <span className={`shrink-0 ${isPopular ? "text-white" : "text-green-500"}`}>✔</span>
                      {t(f)}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-sm">
                    <span className={`shrink-0 ${isPopular ? "text-white" : "text-green-500"}`}>✔</span>
                    {plan.creditsIncluded.toLocaleString("fr-FR")} {t("crédits inclus/mois")}
                  </li>
                </ul>

                <button
                  onClick={() => navigate("/welcome")}
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                    isPopular
                      ? "bg-white text-[#0071E3] hover:bg-white/90"
                      : "bg-[#0071E3] text-white hover:bg-[#0071E3]/90"
                  }`}
                >
                  {displayPrice === 0 ? t("Commencer gratuitement") : `${t("Choisir")} ${plan.displayName}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-xs text-muted-foreground">🔒 {t("Paiement sécurisé")}</p>
          <p className="text-xs text-muted-foreground">
            💳 {t("Orange Money · Wave · Moov · MTN · Carte bancaire")}
          </p>
          <p className="text-xs text-muted-foreground">
            ❓ {t("Une question ?")} <button onClick={() => navigate("/")} className="text-primary underline">{t("Contacte-nous")}</button>
          </p>
        </div>
      </section>
    </div>
  );
}
