import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "../api/companies";
import { agentsApi } from "../api/agents";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { BAARALY_AGENTS, AGENT_CATEGORIES } from "@paperclipai/shared/baaraly-agents";
import type { BaaralyAgentDefinition, AgentCategory } from "@paperclipai/shared/baaraly-agents";
import { queryKeys } from "../lib/queryKeys";

const BUSINESS_TYPES = [
  { id: "boutique", emoji: "🛍️", label: "Boutique" },
  { id: "agriculture", emoji: "🌾", label: "Agriculture" },
  { id: "service", emoji: "💼", label: "Service" },
  { id: "autre", emoji: "🏢", label: "Autre" },
];

const COUNTRIES = [
  // ═══ AFRIQUE DE L'OUEST ═══
  { id: "bf", flag: "🇧🇫", label: "Burkina Faso" },
  { id: "bj", flag: "🇧🇯", label: "Bénin" },
  { id: "ml", flag: "🇲🇱", label: "Mali" },
  { id: "sn", flag: "🇸🇳", label: "Sénégal" },
  { id: "ci", flag: "🇨🇮", label: "Côte d'Ivoire" },
  { id: "ne", flag: "🇳🇪", label: "Niger" },
  { id: "tg", flag: "🇹🇬", label: "Togo" },
  { id: "gh", flag: "🇬🇭", label: "Ghana" },
  { id: "ng", flag: "🇳🇬", label: "Nigeria" },
  { id: "gw", flag: "🇬🇼", label: "Guinée-Bissau" },
  { id: "gn", flag: "🇬🇳", label: "Guinée" },
  // ═══ AFRIQUE CENTRALE ═══
  { id: "ga", flag: "🇬🇦", label: "Gabon" },
  { id: "cm", flag: "🇨🇲", label: "Cameroun" },
  { id: "td", flag: "🇹🇩", label: "Tchad" },
  { id: "cf", flag: "🇨🇫", label: "Centrafrique" },
  { id: "gq", flag: "🇬🇶", label: "Guinée Équatoriale" },
  { id: "cg", flag: "🇨🇩", label: "Congo" },
  { id: "cd", flag: "🇨🇩", label: "Congo (RDC)" },
  // ═══ AFRIQUE DE L'EST & OCÉAN INDIEN ═══
  { id: "mu", flag: "🇲🇺", label: "Maurice" },
  { id: "mr", flag: "🇲🇷", label: "Mauritanie" },
  { id: "sc", flag: "🇸🇨", label: "Seychelles" },
  { id: "mg", flag: "🇲🇬", label: "Madagascar" },
  // ═══ EUROPE FRANCOPHONE ═══
  { id: "fr", flag: "🇫🇷", label: "France" },
  { id: "be", flag: "🇧🇪", label: "Belgique" },
  { id: "ch", flag: "🇨🇭", label: "Suisse" },
  { id: "lu", flag: "🇱🇺", label: "Luxembourg" },
  { id: "mc", flag: "🇲🇨", label: "Monaco" },
  // ═══ AMÉRIQUES ═══
  { id: "ca", flag: "🇨🇦", label: "Canada" },
  { id: "us", flag: "🇺🇸", label: "États-Unis" },
  // ═══ MAGHREB ═══
  { id: "ma", flag: "🇲🇦", label: "Maroc" },
  { id: "tn", flag: "🇹🇳", label: "Tunisie" },
  { id: "dz", flag: "🇩🇿", label: "Algérie" },
];

const WHATSAPP_COUNTRIES = [
  // ═══ AFRIQUE DE L'OUEST ═══
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+221", flag: "🇸🇳", name: "Sénégal" },
  { code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },
  { code: "+227", flag: "🇳🇪", name: "Niger" },
  { code: "+229", flag: "🇧🇯", name: "Bénin" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+224", flag: "🇬🇳", name: "Guinée" },
  // ═══ AFRIQUE CENTRALE ═══
  { code: "+237", flag: "🇨🇲", name: "Cameroun" },
  { code: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "+242", flag: "🇨🇩", name: "Congo (RDC)" },
  { code: "+235", flag: "🇹🇩", name: "Tchad" },
  { code: "+236", flag: "🇨🇫", name: "République Centrafricaine" },
  { code: "+240", flag: "🇬🇶", name: "Guinée Équatoriale" },
  // ═══ EUROPE FRANCOPHONE ═══
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+32", flag: "🇧🇪", name: "Belgique" },
  { code: "+41", flag: "🇨🇭", name: "Suisse" },
  { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+377", flag: "🇲🇨", name: "Monaco" },
  // ═══ AMÉRIQUES ═══
  { code: "+1", flag: "🇨🇦", name: "Canada (QC)" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  // ═══ AUTRES ═══
  { code: "+212", flag: "🇲🇦", name: "Maroc" },
  { code: "+216", flag: "🇹🇳", name: "Tunisie" },
  { code: "+213", flag: "🇩🇿", name: "Algérie" },
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
  const [agentCategory, setAgentCategory] = useState<AgentCategory | "all">("all");

  // WhatsApp phone
  const [waPhone, setWaPhone] = useState("");
  const [waCountry, setWaCountry] = useState(WHATSAPP_COUNTRIES[0]);
  const [showWaCountryPicker, setShowWaCountryPicker] = useState(false);

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
        adapterType: "opencode_local",
        adapterConfig: {
          command: "opencode",
          model: "opencode/qwen3.6-plus-free",
          dangerouslySkipPermissions: true,
          promptTemplate: selectedAgent.systemPrompt,
        },
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
          // WhatsApp number
          whatsappNumbers: waPhone.trim().length >= 6
            ? [{ code: waCountry.code, number: waPhone.trim(), verified: false }]
            : undefined,
        },
      });

      await queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(company.id) });

      pushToast({
        tone: "success",
        title: `${t("Tout est prêt !")} 🚀`,
        body: waPhone.trim().length >= 6
          ? `${selectedAgent.name} ${t("est prêt. WhatsApp connecté :")} ${waCountry.code} ${waPhone.trim()}`
          : `${selectedAgent.name} ${t("est prêt à travailler pour")} ${finalCompanyName}`,
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{t("Choisis ton premier assistant")}</h1>
              <p className="text-sm text-muted-foreground mt-2">
                {t("20 experts IA prêts à travailler pour toi")}
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              <button
                onClick={() => setAgentCategory("all")}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  agentCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {t("Tous")} ({BAARALY_AGENTS.length})
              </button>
              {AGENT_CATEGORIES.map((cat) => {
                const count = BAARALY_AGENTS.filter((a) => a.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setAgentCategory(cat.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      agentCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {cat.emoji} {cat.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Agents grouped by category */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {(agentCategory === "all"
                ? AGENT_CATEGORIES
                : AGENT_CATEGORIES.filter((c) => c.id === agentCategory)
              ).map((cat) => {
                const agents = BAARALY_AGENTS.filter((a) => a.category === cat.id);
                if (agents.length === 0) return null;
                return (
                  <div key={cat.id}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      {cat.label}
                    </h3>
                    <div className="grid gap-3">
                      {agents.map((agent) => (
                        <button
                          key={agent.name}
                          onClick={() => {
                            setSelectedAgent(agent);
                            setStep(5);
                          }}
                          className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all hover:shadow-lg active:scale-[0.98] ${
                            selectedAgent?.name === agent.name
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground/30"
                          }`}
                        >
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
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
                            </div>
                            <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                              {agent.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
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

              {/* WhatsApp number */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("WhatsApp")} <span className="text-xs text-muted-foreground">({t("optionnel")})</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowWaCountryPicker(!showWaCountryPicker)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted px-2.5 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <span>{waCountry.flag}</span>
                      <span>{waCountry.code}</span>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showWaCountryPicker && (
                      <div className="absolute top-full left-0 mt-1 z-50 w-56 max-h-52 overflow-y-auto rounded-xl border border-border bg-popover shadow-lg">
                        {WHATSAPP_COUNTRIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => { setWaCountry(c); setShowWaCountryPicker(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                              waCountry.code === c.code ? "bg-accent font-medium" : ""
                            }`}
                          >
                            <span className="text-base">{c.flag}</span>
                            <span className="flex-1">{c.name}</span>
                            <span className="text-muted-foreground">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="70 00 00 00"
                    className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                {waPhone.trim().length >= 6 && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    ✔ {waCountry.code} {waPhone.trim()}
                  </p>
                )}
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
