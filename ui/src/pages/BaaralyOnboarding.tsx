import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "../api/companies";
import { agentsApi } from "../api/agents";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { BAARALY_AGENTS } from "@paperclipai/shared/baaraly-agents";
import type { BaaralyAgentDefinition } from "@paperclipai/shared/baaraly-agents";
import { queryKeys } from "../lib/queryKeys";

const BUSINESS_TYPES = [
  { id: "boutique", emoji: "🛍️", label: "Boutique" },
  { id: "agriculture", emoji: "🌾", label: "Agriculture" },
  { id: "service", emoji: "💼", label: "Service" },
  { id: "autre", emoji: "🏢", label: "Autre" },
];

const COUNTRIES = [
  { id: "bf", flag: "🇧🇫", label: "Burkina Faso" },
  { id: "ml", flag: "🇲🇱", label: "Mali" },
  { id: "sn", flag: "🇸🇳", label: "Sénégal" },
  { id: "ci", flag: "🇨🇮", label: "Côte d'Ivoire" },
  { id: "ne", flag: "🇳🇪", label: "Niger" },
];

export function BaaralyOnboarding() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { selectedCompanyId, setSelectedCompanyId } = useCompany();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSelectAgent(agent: BaaralyAgentDefinition) {
    setLoading(true);
    try {
      let companyId = selectedCompanyId;

      if (!companyId) {
        const businessLabel = BUSINESS_TYPES.find((b) => b.id === businessType)?.label ?? "Mon entreprise";
        const countryLabel = COUNTRIES.find((c) => c.id === country)?.label ?? "";
        const companyName = countryLabel ? `${businessLabel} — ${countryLabel}` : businessLabel;
        const company = await companiesApi.create({ name: companyName });
        companyId = company.id;
        setSelectedCompanyId(company.id);
        await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      }

      await agentsApi.hire(companyId, {
        name: agent.name,
        role: "general",
        title: agent.role,
        adapterType: "process",
        adapterConfig: { promptTemplate: agent.systemPrompt },
        metadata: {
          emoji: agent.emoji,
          color: agent.color,
          description: agent.description,
          tools: agent.tools,
          superpowers: agent.superpowers,
          baaralyTemplate: true,
        },
      });

      await queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(companyId) });

      pushToast({
        tone: "success",
        title: `${t("Ton assistant est prêt")} 🚀`,
        body: `${agent.name} ${t("a été ajouté à ton équipe")}`,
      });

      navigate("/dashboard");
    } catch (err) {
      pushToast({
        tone: "error",
        title: t("Erreur"),
        body: err instanceof Error ? err.message : t("Une erreur est survenue"),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Business type */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{t("Quel est ton activité ?")}</h1>
              <p className="text-sm text-muted-foreground mt-2">{t("On adapte tout pour toi")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {BUSINESS_TYPES.map((bt) => (
                <button
                  key={bt.id}
                  onClick={() => {
                    setBusinessType(bt.id);
                    setStep(2);
                  }}
                  className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-6 transition-all hover:shadow-md hover:border-muted-foreground/30 active:scale-[0.97]"
                >
                  <span className="text-3xl">{bt.emoji}</span>
                  <span className="font-semibold text-sm">{bt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Country */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{t("Où es-tu basé ?")}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {t("Pour adapter les prix et les services")}
              </p>
            </div>
            <div className="space-y-3">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCountry(c.id);
                    setStep(3);
                  }}
                  className="w-full flex items-center gap-4 rounded-2xl border-2 border-border min-h-[56px] px-5 py-3 text-left transition-all hover:shadow-md hover:border-muted-foreground/30 active:scale-[0.98]"
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className="font-semibold">{c.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {t("Retour")}
            </button>
          </div>
        )}

        {/* Step 3 — Agent choice */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{t("Choisis ton premier assistant")}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {t("Ils travaillent pour toi automatiquement")}
              </p>
            </div>
            <div className="space-y-3">
              {BAARALY_AGENTS.map((agent) => (
                <button
                  key={agent.name}
                  disabled={loading}
                  onClick={() => handleSelectAgent(agent)}
                  className="w-full flex items-center gap-4 rounded-2xl border-2 border-border p-5 text-left transition-all hover:shadow-md hover:border-muted-foreground/30 active:scale-[0.98] disabled:opacity-50"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      backgroundColor: `${agent.color}20`,
                      border: `1px solid ${agent.color}40`,
                    }}
                  >
                    {agent.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{agent.name}</span>
                      {agent.name === "Aminata" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500">
                          {t("Recommandé")}
                        </span>
                      )}
                      {agent.name === "Ibrahim" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                          Business
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{agent.role}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {agent.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {t("Retour")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
