import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@/lib/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agentsApi } from "../api/agents";
import { useCompany } from "../context/CompanyContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { queryKeys } from "../lib/queryKeys";
import { EmptyState } from "../components/EmptyState";
import { CreditBalance } from "../components/CreditBalance";
import { StatusBadge } from "../components/StatusBadge";
import { PageSkeleton } from "../components/PageSkeleton";
import { LayoutDashboard, Sparkles, Send, Lightbulb } from "lucide-react";
import { agentUrl } from "../lib/utils";
import type { Agent } from "@paperclipai/shared";
import { ActionsRemaining } from "../components/ActionsRemaining";
import { WhatsAppConnectButton } from "../components/WhatsAppConnect";
import {
  BAARALY_AGENTS,
  AGENT_CATEGORIES,
  type BaaralyAgentDefinition,
  type AgentCategory,
} from "@paperclipai/shared/baaraly-agents";

/* ─── Category gradient backgrounds ─── */
const CATEGORY_GRADIENTS: Record<AgentCategory, string> = {
  tech: "from-blue-500/10 to-cyan-500/10",
  marketing: "from-purple-500/10 to-pink-500/10",
  finance: "from-emerald-500/10 to-teal-500/10",
  commerce: "from-amber-500/10 to-orange-500/10",
  juridique: "from-indigo-500/10 to-violet-500/10",
};

const CATEGORY_BORDER: Record<AgentCategory, string> = {
  tech: "border-blue-500/20 hover:border-blue-500/40",
  marketing: "border-purple-500/20 hover:border-purple-500/40",
  finance: "border-emerald-500/20 hover:border-emerald-500/40",
  commerce: "border-amber-500/20 hover:border-amber-500/40",
  juridique: "border-indigo-500/20 hover:border-indigo-500/40",
};

/* ─── Popular agents for quick actions ─── */
const POPULAR_AGENTS = ["Aminata", "Mariama", "Ibrahim", "Camille", "Sophie", "Axel"];

/* ─── Types ─── */
interface WaNumber {
  code: string;
  number: string;
  verified?: boolean;
}

interface AgentSuggestion {
  name: string;
  category: AgentCategory;
  description: string;
}

/* ═══════════════════════════════════════════
   Main Dashboard Component
   ═══════════════════════════════════════════ */
export function Dashboard() {
  const { selectedCompanyId, companies, selectedCompany } = useCompany();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<AgentCategory | "all">("all");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [recruitingAgent, setRecruitingAgent] = useState<string | null>(null);

  const { data: agents, isLoading } = useQuery({
    queryKey: queryKeys.agents.list(selectedCompanyId!),
    queryFn: () => agentsApi.list(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });

  /* Hire mutation */
  const hireMutation = useMutation({
    mutationFn: async (agent: BaaralyAgentDefinition) => {
      if (!selectedCompanyId) throw new Error("No company selected");
      return agentsApi.hire(selectedCompanyId, {
        name: agent.name,
        role: "general",
        title: agent.role,
        adapterType: "process",
        adapterConfig: {
          promptTemplate: agent.systemPrompt,
        },
        metadata: {
          emoji: agent.emoji,
          color: agent.color,
          description: agent.description,
          tools: agent.tools,
          superpowers: agent.superpowers,
          baaralyTemplate: true,
        },
      });
    },
    onSuccess: (_data, agent) => {
      if (selectedCompanyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(selectedCompanyId) });
      }
      pushToast({
        tone: "success",
        title: `${agent.name} ${t("a rejoint ton équipe")} 🎉`,
        body: t("Il est prêt à travailler pour toi"),
      });
    },
    onSettled: () => {
      setRecruitingAgent(null);
    },
  });

  /* Map installed agents by name */
  const installedMap = useMemo(() => {
    const map = new Map<string, Agent>();
    if (agents) {
      for (const a of agents) {
        map.set(a.name, a);
      }
    }
    return map;
  }, [agents]);

  /* WhatsApp numbers */
  const waNumbers = useMemo<WaNumber[]>(() => {
    if (!agents) return [];
    const all: WaNumber[] = [];
    for (const agent of agents) {
      const meta = (agent.metadata ?? {}) as Record<string, unknown>;
      const nums = meta.whatsappNumbers as WaNumber[] | undefined;
      if (nums && Array.isArray(nums)) {
        for (const n of nums) {
          if (!all.find((x) => x.code === n.code && x.number === n.number)) {
            all.push(n);
          }
        }
      }
    }
    return all;
  }, [agents]);

  /* Trial info */
  const trialInfo = useMemo(() => {
    if (!selectedCompany) return null;
    const billingPlan = (selectedCompany as any).billingPlan ?? "trial";
    const trialEndsAt = (selectedCompany as any).trialEndsAt as Date | null;
    const dailyLimit = (selectedCompany as any).dailyProspectLimit ?? 5;
    if (billingPlan !== "trial" || !trialEndsAt) return null;
    const now = new Date();
    const ends = new Date(trialEndsAt);
    const daysRemaining = Math.max(0, Math.ceil((ends.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
    return { active: now < ends, daysRemaining, dailyLimit };
  }, [selectedCompany]);

  /* Filtered agents by category */
  const filteredAgents = useMemo(() => {
    if (activeCategory === "all") return BAARALY_AGENTS;
    return BAARALY_AGENTS.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  /* Group by category for "all" view */
  const agentsByCategory = useMemo(() => {
    if (activeCategory !== "all") return null;
    const groups: Record<AgentCategory, BaaralyAgentDefinition[]> = {
      tech: [],
      marketing: [],
      finance: [],
      commerce: [],
      juridique: [],
    };
    for (const agent of BAARALY_AGENTS) {
      groups[agent.category].push(agent);
    }
    return groups;
  }, [activeCategory]);

  useEffect(() => {
    setBreadcrumbs([{ label: t("Dashboard") }]);
  }, [setBreadcrumbs, t]);

  /* ─── Empty states ─── */
  if (!selectedCompanyId) {
    if (companies.length === 0) {
      return (
        <EmptyState
          icon={LayoutDashboard}
          message={t("Bienvenue sur Baaraly ! Configure ton premier assistant.")}
          action={t("Commencer")}
          onAction={() => navigate("/welcome")}
        />
      );
    }
    return (
      <EmptyState
        icon={LayoutDashboard}
        message={t("Sélectionne une entreprise pour commencer.")}
      />
    );
  }

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  const handleRecruit = (agent: BaaralyAgentDefinition) => {
    setRecruitingAgent(agent.name);
    hireMutation.mutate(agent);
  };

  /* ─── Render ─── */
  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto">
      {/* ── Trial banner ── */}
      {trialInfo && trialInfo.active && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-600">{t("Essai gratuit")} 🎁</p>
            <p className="text-xs text-muted-foreground">
              {t("Il reste")} {trialInfo.daysRemaining} {t("jours")} · {t("Limite")}: {trialInfo.dailyLimit} {t("prospects/jour")}
            </p>
          </div>
          <button className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] whitespace-nowrap">
            {t("Passer à Pro")} — 49$
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("Bonjour")} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">{selectedCompany?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <CreditBalance companyId={selectedCompanyId} compact />
        </div>
      </div>

      {/* ── Status bar (Actions + WhatsApp) ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <ActionsRemaining companyId={selectedCompanyId} />
        {waNumbers.length > 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-2.5">
            <span className="text-sm">📱</span>
            <div>
              <p className="text-xs font-semibold text-green-600">{t("WhatsApp connecté")}</p>
              <p className="text-[10px] text-muted-foreground">
                {waNumbers.map((n) => `${n.code} ${n.number}`).join(", ")}
              </p>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById("wa-connect");
                el?.click();
              }}
              className="ml-2 text-xs text-primary hover:underline"
            >
              + {t("Ajouter")}
            </button>
          </div>
        ) : (
          <WhatsAppConnectButton />
        )}
      </div>
      <div id="wa-connect" className="hidden"><WhatsAppConnectButton /></div>

      {/* ── Installed agents summary ── */}
      {agents && agents.length > 0 && (
        <div className="rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/5 to-emerald-500/5 p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔥</span>
            <h2 className="text-base font-bold">
              {agents.length} {agents.length === 1 ? t("agent actif") : t("agents actifs")}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("Tes assistants travaillent pour toi. Résultats livrés sur WhatsApp.")}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {agents.map((agent) => {
              const meta = (agent.metadata ?? {}) as Record<string, unknown>;
              return (
                <Link
                  key={agent.id}
                  to={agentUrl(agent)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-white/10 border border-border px-3 py-1.5 text-xs font-medium hover:shadow-sm transition-all no-underline text-inherit"
                >
                  <span>{(meta.emoji as string) ?? "🤖"}</span>
                  <span>{agent.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          AGENTS CATALOG — BENTO GRID
          ═══════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {t("Catalogue d'agents")}
          </h2>
          <span className="text-xs text-muted-foreground">
            {BAARALY_AGENTS.length} {t("agents disponibles")}
          </span>
        </div>

        {/* ── Category tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1 snap-x scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 snap-start rounded-full px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t("Tous")} ({BAARALY_AGENTS.length})
          </button>
          {AGENT_CATEGORIES.map((cat) => {
            const count = BAARALY_AGENTS.filter((a) => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 snap-start rounded-full px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.emoji} {cat.label.split(" ")[0]} ({count})
              </button>
            );
          })}
        </div>

        {/* ── Agents grid by category (when "all") ── */}
        {activeCategory === "all" && agentsByCategory ? (
          <div className="space-y-8">
            {AGENT_CATEGORIES.map((cat) => {
              const catAgents = agentsByCategory[cat.id];
              if (catAgents.length === 0) return null;
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{cat.emoji}</span>
                    <h3 className="text-sm font-bold">{cat.label}</h3>
                    <div className="flex-1 h-px bg-border ml-2" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {catAgents.map((agent) => (
                      <AgentBentoCard
                        key={agent.name}
                        agent={agent}
                        installed={installedMap.get(agent.name)}
                        isRecruiting={recruitingAgent === agent.name}
                        isHiring={hireMutation.isPending}
                        onRecruit={() => handleRecruit(agent)}
                        onOpen={(a) => {
                          const inst = installedMap.get(a.name);
                          if (inst) navigate(agentUrl(inst));
                        }}
                        popular={POPULAR_AGENTS.includes(agent.name)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Single category view ── */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredAgents.map((agent) => (
              <AgentBentoCard
                key={agent.name}
                agent={agent}
                installed={installedMap.get(agent.name)}
                isRecruiting={recruitingAgent === agent.name}
                isHiring={hireMutation.isPending}
                onRecruit={() => handleRecruit(agent)}
                onOpen={(a) => {
                  const inst = installedMap.get(a.name);
                  if (inst) navigate(agentUrl(inst));
                }}
                popular={POPULAR_AGENTS.includes(agent.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          SUGGESTION SECTION
          ═══════════════════════════════════════ */}
      <div className="rounded-2xl border border-dashed border-border p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold">{t("Tu ne trouves pas ton agent ?")}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {t("Propose-nous un nouvel agent et on le construira pour toi")}
        </p>
        {!showSuggestion ? (
          <button
            onClick={() => setShowSuggestion(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-muted px-5 py-2.5 text-sm font-semibold hover:bg-muted/80 transition-all"
          >
            <Lightbulb className="w-4 h-4" />
            {t("Suggérer un agent")}
          </button>
        ) : (
          <SuggestionForm onClose={() => setShowSuggestion(false)} />
        )}
      </div>

      {/* ── Hire error toast ── */}
      {hireMutation.isError && (
        <p className="text-sm text-red-500 text-center">
          {t("Échec du recrutement. Réessaie.")}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Agent Bento Card
   ═══════════════════════════════════════════ */
function AgentBentoCard({
  agent,
  installed,
  isRecruiting,
  isHiring,
  onRecruit,
  onOpen,
  popular,
}: {
  agent: BaaralyAgentDefinition;
  installed?: Agent;
  isRecruiting: boolean;
  isHiring: boolean;
  onRecruit: () => void;
  onOpen: (agent: BaaralyAgentDefinition) => void;
  popular: boolean;
}) {
  const { t } = useLanguage();
  const isActive = installed && installed.status === "active";
  const isPaused = installed && installed.status === "paused";
  const isInstalled = !!installed;

  return (
    <div
      className={`group relative rounded-2xl border bg-gradient-to-br p-4 flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${CATEGORY_GRADIENTS[agent.category]} ${CATEGORY_BORDER[agent.category]}`}
    >
      {/* Popular badge */}
      {popular && !isInstalled && (
        <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/20">
          ⭐ {t("Populaire")}
        </span>
      )}

      {/* Status badge for installed */}
      {isActive && (
        <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 border border-green-500/20">
          ✅ {t("Actif")}
        </span>
      )}
      {isPaused && (
        <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-600 border border-orange-500/20">
          ⏸️ {t("En pause")}
        </span>
      )}

      {/* Emoji icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform group-hover:scale-110"
        style={{
          backgroundColor: `${agent.color}15`,
          border: `1px solid ${agent.color}25`,
        }}
      >
        {agent.emoji}
      </div>

      {/* Name & role */}
      <p className="font-bold text-sm mb-0.5">{agent.name}</p>
      <p className="text-[11px] font-medium mb-2" style={{ color: agent.color }}>
        {agent.role}
      </p>

      {/* Description (truncated) */}
      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-3">
        {agent.description}
      </p>

      {/* Action button */}
      {isInstalled ? (
        <button
          onClick={() => onOpen(agent)}
          className="w-full min-h-[36px] rounded-lg text-xs font-semibold transition-all border border-border hover:bg-muted/50"
        >
          {t("Ouvrir")}
        </button>
      ) : (
        <button
          onClick={onRecruit}
          disabled={isRecruiting || isHiring}
          className="w-full min-h-[36px] rounded-lg text-white text-xs font-semibold transition-all disabled:opacity-50 hover:opacity-90"
          style={{ backgroundColor: agent.color }}
        >
          {isRecruiting ? t("Recrutement...") : `+ ${t("Installer")}`}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Suggestion Form
   ═══════════════════════════════════════════ */
function SuggestionForm({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const { pushToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AgentCategory>("tech");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    pushToast({
      tone: "success",
      title: t("Suggestion envoyée !"),
      body: `${t("Merci pour ta proposition")} "${name}" 🙏`,
    });
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left max-w-md mx-auto">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("Nom de l'agent (ex: Agent RH)")}
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t("Que devrait faire cet agent ?")}
        rows={3}
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        required
      />
      <div className="flex gap-2">
        {AGENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
              category === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {cat.emoji}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          <Send className="w-4 h-4" />
          {t("Envoyer")}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
        >
          {t("Annuler")}
        </button>
      </div>
    </form>
  );
}
