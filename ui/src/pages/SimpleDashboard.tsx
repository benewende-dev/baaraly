import { useNavigate } from "@/lib/router";
import { useQuery } from "@tanstack/react-query";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";
import { queryKeys } from "../lib/queryKeys";
import { agentsApi } from "../api/agents";
import { CreditBalance } from "../components/CreditBalance";
import { StatusBadge } from "../components/StatusBadge";
import { agentUrl } from "../lib/utils";
import { Zap, Users, Bot } from "lucide-react";
import type { Agent } from "@paperclipai/shared";

export function SimpleDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();

  const agentsQuery = useQuery({
    queryKey: selectedCompany ? queryKeys.agents.list(selectedCompany.id) : ["agents-none"],
    queryFn: () => agentsApi.list(selectedCompany!.id),
    enabled: !!selectedCompany,
  });

  const agents: Agent[] = agentsQuery.data ?? [];
  const activeAgents = agents.filter((a) => a.status === "active");
  const runningAgents = agents.filter((a) => a.status === "running");
  const prefix = selectedCompany?.issuePrefix ?? "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">{t("Bonjour")} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">{selectedCompany?.name ?? ""}</p>
        </div>
        {selectedCompany && <CreditBalance companyId={selectedCompany.id} compact />}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-[#0071E3]" />}
          label={t("Agents actifs")}
          value={activeAgents.length}
          bg="bg-[#0071E3]/10"
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-[#5E5CE6]" />}
          label={t("En cours")}
          value={runningAgents.length}
          bg="bg-[#5E5CE6]/10"
        />
        <StatCard
          icon={<Bot className="h-5 w-5 text-[#30D158]" />}
          label={t("Total agents")}
          value={agents.length}
          bg="bg-[#30D158]/10"
        />
      </div>

      {/* Agents grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">{t("Mes agents")}</h2>
          {prefix && (
            <button
              type="button"
              onClick={() => navigate(`/${prefix}/agents/all`)}
              className="text-xs font-medium text-[#0071E3] hover:underline"
            >
              {t("Voir tout")} →
            </button>
          )}
        </div>

        {agentsQuery.isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("Aucun agent. Crée ton premier agent.")}</p>
            {prefix && (
              <button
                type="button"
                onClick={() => navigate(`/${prefix}/agents/new`)}
                className="mt-4 rounded-xl bg-[#0071E3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0071E3]/90"
              >
                {t("Créer un agent")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {agents.slice(0, 6).map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => navigate(agentUrl(agent))}
                className="group rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-lg">
                    {agent.icon ?? "🤖"}
                  </span>
                  <StatusBadge status={agent.status} />
                </div>
                <p className="truncate text-sm font-semibold">{agent.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{agent.title ?? agent.role}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Quick chat CTA */}
      {activeAgents.length > 0 && (
        <section className="rounded-2xl bg-gradient-to-r from-[#0071E3]/10 to-[#5E5CE6]/10 p-6">
          <h2 className="mb-1 text-base font-semibold">{t("Parler à un agent")}</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {t("Lance une conversation avec l'un de tes agents actifs")}
          </p>
          <div className="flex flex-wrap gap-2">
            {activeAgents.slice(0, 4).map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => navigate(agentUrl(agent))}
                className="flex items-center gap-1.5 rounded-full border border-[#0071E3]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#0071E3] transition-all hover:bg-[#0071E3]/5 dark:bg-[#1c1c1e]"
              >
                <span>{agent.icon ?? "🤖"}</span>
                {agent.name}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className={`mb-3 inline-flex rounded-xl p-2 ${bg}`}>{icon}</div>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
