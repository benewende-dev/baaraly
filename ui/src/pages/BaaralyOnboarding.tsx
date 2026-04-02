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
  { id: "bj", flag: "🇧🇯", label: "Bénin" },
  { id: "ml", flag: "🇲🇱", label: "Mali" },
  { id: "sn", flag: "🇸🇳", label: "Sénégal" },
  { id: "ci", flag: "🇨🇮", label: "Côte d'Ivoire" },
  { id: "ne", flag: "🇳🇪", label: "Niger" },
  { id: "tg", flag: "🇹🇬", label: "Togo" },
  { id: "gh", flag: "🇬🇭", label: "Ghana" },
  { id: "ng", flag: "🇳🇬", label: "Nigeria" },
  { id: "ga", flag: "🇬🇦", label: "Gabon" },
  { id: "cm", flag: "🇨🇲", label: "Cameroun" },
  { id: "td", flag: "🇹🇩", label: "Tchad" },
  { id: "cf", flag: "🇨🇫", label: "Centrafrique" },
  { id: "gq", flag: "🇬🇶", label: "Guinée Équatoriale" },
  { id: "gw", flag: "🇬🇼", label: "Guinée-Bissau" },
  { id: "gn", flag: "🇬🇳", label: "Guinée" },
  { id: "mu", flag: "🇲🇺", label: "Maurice" },
  { id: "mr", flag: "🇲🇷", label: "Mauritanie" },
];

export function BaaralyOnboarding() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setSelectedCompanyId } = useCompany();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  // All 5 steps
  const [step, setStep] = useState(1);

  // Step 1 - Company info
  const [companyName, setCompanyName] = useState("");
  const [companyMission, setCompanyMission] = useState("");

  // Step 2 - Business type
  const [businessType, setBusinessType] = useState<string | null>(null);

  // Step 3 - Country
  const [country, setCountry] = useState<string | null>(null);

  // Step 4 - Agent choice
  const [selectedAgent, setSelectedAgent] = useState<BaaralyAgentDefinition | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Total steps
  const TOTAL_STEPS = 5;

  // Validation
  const canProceedStep1 = companyName.trim().length >= 2;
  const canProceedStep2 = businessType !== null;
  const canProceedStep3 = country !== null;
  const canProceedStep4 = selectedAgent !== null;

  async function handleLaunch() {
    if (!canProceedStep4 || !selectedAgent) return;

    setLoading(true);
    try {
      // Create company with user-provided name
      const countryLabel = COUNTRIES.find((c) => c.id === country)?.label ?? "";
      const finalCompanyName = companyName.trim();

      const company = await companiesApi.create({
        name: finalCompanyName,
      });

      setSelectedCompanyId(company.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });

      // Hire the selected agent
      await agentsApi.hire(company.id, {
        name: selectedAgent.name,
        role: "general",
        title: selectedAgent.role,
        adapterType: "process",
        adapterConfig: { promptTemplate: selectedAgent.systemPrompt },
        metadata: {
          emoji: selectedAgent.emoji,
          color: selectedAgent.color,
          description: selectedAgent.description,
          tools: selectedAgent.tools,
          superpowers: selectedAgent.superpowers,
          baaralyTemplate: true,
          // Store business type and country as agent metadata
          businessType: businessType,
          country: country,
          companyMission: companyMission.trim() || undefined,
        },
      });

      await queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(company.id) });

      pushToast({
        tone: "success",
        title: `${t("Tout est prêt !")} 🚀`,
        body: `${selectedAgent.name} ${t("est prêt à travailler pour")} ${finalCompanyName}`,
      });

      const companyPrefix = company.issuePrefix;
      navigate(`/${companyPrefix}/dashboard`);
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
        {/* Progress bar - Apple style */}
        <div className="flex items-center gap-2 mb-10">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${
                s < step ? "bg-primary" : s === step ? "bg-primary animate-pulse" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step indicator */}
        <div className="text-center mb-6">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("Étape")} {step} / {TOTAL_STEPS}
          </span>
        </div>

        {/* ========== STEP 1: Company Name & Mission ========== */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{t("Comment s'appelle ton entreprise ?")}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {t("C'est pour elle que tes agents travailleront")}
              </p>
            </div>

            <div className="space-y-5">
              {/* Company name input */}
              <div className="space-y-2">
                <label htmlFor="company-name" className="text-sm font-medium text-foreground">
                  {t("Nom de l'entreprise")} <span className="text-destructive">*</span>
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t("Ex: Ma Boutique, Mon Restaurant...")}
                  className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                  autoFocus
                />
              </div>

              {/* Mission/Objective textarea */}
              <div className="space-y-2">
                <label htmlFor="company-mission" className="text-sm font-medium text-foreground">
                  {t("Objectif / Mission")} <span className="text-xs text-muted-foreground">({t("optionnel")})</span>
                </label>
                <textarea
                  id="company-mission"
                  value={companyMission}
                  onChange={(e) => setCompanyMission(e.target.value)}
                  placeholder={t("Ex: Vendre des produits en ligne, Aider les fermiers à augmenter leur récolte...")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {t("Décris brièvement ce que ton entreprise cherche à accomplir")}
                </p>
              </div>
            </div>

            {/* Continue button */}
            <button
              onClick={() => canProceedStep1 && setStep(2)}
              disabled={!canProceedStep1}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {t("Continuer")}
              <span>→</span>
            </button>
          </div>
        )}

        {/* ========== STEP 2: Business Type ========== */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{t("Quel est ton activité ?")}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {t("On adapte tout pour toi")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BUSINESS_TYPES.map((bt) => (
                <button
                  key={bt.id}
                  onClick={() => {
                    setBusinessType(bt.id);
                    setStep(3);
                  }}
                  className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all hover:shadow-lg active:scale-[0.97] ${
                    businessType === bt.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <span className="text-3xl">{bt.emoji}</span>
                  <span className="font-semibold text-sm">{bt.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              ← {t("Retour")}
            </button>
          </div>
        )}

        {/* ========== STEP 3: Country ========== */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                    setStep(4);
                  }}
                  className={`w-full flex items-center gap-4 rounded-2xl border-2 min-h-[56px] px-5 py-3 text-left transition-all hover:shadow-lg active:scale-[0.98] ${
                    country === c.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className="font-semibold">{c.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              ← {t("Retour")}
            </button>
          </div>
        )}

        {/* ========== STEP 4: Agent Choice ========== */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  onClick={() => {
                    setSelectedAgent(agent);
                    setStep(5);
                  }}
                  className={`w-full flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all hover:shadow-lg active:scale-[0.98] ${
                    selectedAgent?.name === agent.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
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
              onClick={() => setStep(3)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              ← {t("Retour")}
            </button>
          </div>
        )}

        {/* ========== STEP 5: Confirmation ========== */}
        {step === 5 && selectedAgent && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{selectedAgent.emoji}</span>
              </div>
              <h1 className="text-2xl font-bold">{t("Tout est prêt !")}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {t("Confirme pour démarrer avec")} {selectedAgent.name}
              </p>
            </div>

            {/* Summary card */}
            <div className="rounded-2xl border-2 border-border p-5 space-y-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">🏢</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("Entreprise")}</p>
                  <p className="font-semibold">{companyName}</p>
                </div>
              </div>

              {companyMission && (
                <div className="pl-13">
                  <p className="text-xs text-muted-foreground">{t("Mission")}</p>
                  <p className="text-sm text-muted-foreground">{companyMission}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">{BUSINESS_TYPES.find(b => b.id === businessType)?.emoji}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("Activité")}</p>
                  <p className="font-semibold">{BUSINESS_TYPES.find(b => b.id === businessType)?.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">{COUNTRIES.find(c => c.id === country)?.flag}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("Localisation")}</p>
                  <p className="font-semibold">{COUNTRIES.find(c => c.id === country)?.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${selectedAgent.color}20`,
                    border: `1px solid ${selectedAgent.color}40`,
                  }}
                >
                  <span className="text-lg">{selectedAgent.emoji}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("Assistant")}</p>
                  <p className="font-semibold">{selectedAgent.name}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLaunch}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {t("Création en cours...")}
                  </>
                ) : (
                  <>
                    🚀 {t("Créer mon espace")}
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(4)}
                disabled={loading}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                ← {t("Retour")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
