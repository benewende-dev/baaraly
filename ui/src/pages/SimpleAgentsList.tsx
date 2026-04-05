import { useNavigate } from "@/lib/router";
import { useQuery } from "@tanstack/react-query";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";
import { queryKeys } from "../lib/queryKeys";
import { agentsApi } from "../api/agents";
import { StatusBadge } from "../components/StatusBadge";
import { CreditBalance } from "../components/CreditBalance";
import type { Agent } from "@paperclipai/shared";

type Tab = "all" | "active" | "paused" | "error";

const TABS: { id: Tab; labelKey: string }[] = [
  { id: "all",    labelKey: "Tous" },
  { id: "active", labelKey: "Actifs" },
  { id: "paused", labelKey: "En pause" },
  { id: "error",  labelKey: "Erreur" },
];

function filterAgents(agents: Agent[], tab: Tab): Agent[] {
  if (tab === "all")    return agents;
  if (tab === "active") return agents.filter((a) => a.status === "active" || a.status === "running");
  if (tab === "paused") return agents.filter((a) => a.status === "paused" || a.status === "idle");
  if (tab === "error")  return agents.filter((a) => a.status === "error");
  return agents;
}

export function SimpleAgentsList() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();

  const agentsQuery = useQuery({
    queryKey: selectedCompany ? queryKeys.agents.list(selectedCompany.id) : ["agents-none"],
    queryFn: () => agentsApi.list(selectedCompany!.id),
    enabled: !!selectedCompany,
  });

  const allAgents: Agent[] = agentsQuery.data ?? [];

  // Read tab from URL hash for simplicity
  const hash = (typeof window !== "undefined" ? window.location.hash.replace("#", "") : "") as Tab;
  const tab: Tab = TABS.some((t) => t.id === hash) ? (hash as Tab) : "all";
  const agents = filterAgents(allAgents, tab);

  function goToAgent(agent: Agent) {
    navigate(`/simple/agents/${agent.urlKey ?? agent.id}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-extrabold">{t("Mes agents")}</h1>
        <div className="flex items-center gap-3">
          {selectedCompany && <CreditBalance companyId={selectedCompany.id} compact />}
          <button
            type="button"
            onClick={() => navigate("/simple/templates")}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            + {t("Ajouter un agent")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            onClick={() => { window.location.hash = id === "all" ? "" : id; }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(labelKey)}
            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
              {filterAgents(allAgents, id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {agentsQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <span className="text-5xl mb-4">🤖</span>
          <p className="text-base font-semibold mb-1">{t("Aucun agent pour le moment")}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {t("Démarre avec un template pré-configuré pour ton activité")}
          </p>
          <button
            type="button"
            onClick={() => navigate("/simple/templates")}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            {t("Voir les templates")} →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => goToAgent(agent)}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                {agent.icon ?? "🤖"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{agent.name}</p>
                <p className="truncate text-xs text-muted-foreground">{agent.title ?? agent.role}</p>
              </div>
              <StatusBadge status={agent.status} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
