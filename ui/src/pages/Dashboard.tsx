import { useEffect } from "react";
import { Link, useNavigate } from "@/lib/router";
import { useQuery } from "@tanstack/react-query";
import { agentsApi } from "../api/agents";
import { useCompany } from "../context/CompanyContext";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useLanguage } from "../context/LanguageContext";
import { queryKeys } from "../lib/queryKeys";
import { EmptyState } from "../components/EmptyState";
import { CreditBalance } from "../components/CreditBalance";
import { StatusBadge } from "../components/StatusBadge";
import { PageSkeleton } from "../components/PageSkeleton";
import { LayoutDashboard } from "lucide-react";
import { agentUrl } from "../lib/utils";
import type { Agent } from "@paperclipai/shared";

export function Dashboard() {
  const { selectedCompanyId, companies, selectedCompany } = useCompany();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: agents, isLoading } = useQuery({
    queryKey: queryKeys.agents.list(selectedCompanyId!),
    queryFn: () => agentsApi.list(selectedCompanyId!),
    enabled: !!selectedCompanyId,
  });

  useEffect(() => {
    setBreadcrumbs([{ label: t("Dashboard") }]);
  }, [setBreadcrumbs, t]);

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

  const findAgent = (name: string) => agents?.find((a) => a.name === name);

  const quickActions = [
    { emoji: "\uD83D\uDECD\uFE0F", label: t("Gérer ma boutique"), sub: "Aminata", agent: findAgent("Aminata") },
    { emoji: "\uD83D\uDCF1", label: t("Trouver des clients"), sub: "Mariama", agent: findAgent("Mariama") },
    { emoji: "\uD83D\uDCCA", label: t("Voir mes finances"), sub: "Ibrahim", agent: findAgent("Ibrahim") },
  ];

  return (
    <div className="space-y-8 pb-28 max-w-2xl mx-auto">
      {/* Header : Bonjour + CreditBalance */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("Bonjour")} \uD83D\uDC4B</h1>
          <p className="text-sm text-muted-foreground mt-1">{selectedCompany?.name}</p>
        </div>
        <CreditBalance companyId={selectedCompanyId} compact />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {t("Que veux-tu faire aujourd'hui ?")}
        </h2>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <button
              key={action.sub}
              onClick={() =>
                action.agent
                  ? navigate(agentUrl(action.agent))
                  : navigate("/agents/templates")
              }
              className="w-full flex items-center gap-4 min-h-[64px] rounded-2xl border border-border bg-card px-5 py-3 text-left transition-all hover:shadow-md hover:border-muted-foreground/30 active:scale-[0.98]"
            >
              <span className="text-2xl shrink-0">{action.emoji}</span>
              <div className="min-w-0">
                <span className="font-semibold text-sm block">{action.label}</span>
                <span className="text-xs text-muted-foreground">{action.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tes agents */}
      <div>
        <h2 className="text-lg font-semibold mb-4">{t("Tes agents")}</h2>
        {!agents || agents.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t("Tu n'as pas encore d'agent")}
            </p>
            <button
              onClick={() => navigate("/agents/templates")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 min-h-[48px] text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {t("Choisir un agent")}
            </button>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {agents.map((agent) => (
              <DashboardAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none px-4">
        <button
          onClick={() => navigate("/agents/templates")}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-2xl bg-primary px-6 min-h-[52px] text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.97]"
        >
          + {t("Lancer un agent")}
        </button>
      </div>
    </div>
  );
}

function DashboardAgentCard({ agent }: { agent: Agent }) {
  const { t } = useLanguage();
  const meta = (agent.metadata ?? {}) as Record<string, unknown>;
  const emoji = (meta.emoji as string) ?? "\uD83E\uDD16";

  return (
    <Link
      to={agentUrl(agent)}
      className="flex-shrink-0 w-[200px] snap-start rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-muted-foreground/30 no-underline text-inherit"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{emoji}</span>
        <p className="font-semibold text-sm truncate min-w-0">{agent.name}</p>
      </div>
      <StatusBadge status={agent.status} />
      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          {t("Ouvrir")}
        </span>
      </div>
    </Link>
  );
}
