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
import { ActionsRemaining } from "../components/ActionsRemaining";
import { WhatsAppConnectButton } from "../components/WhatsAppConnect";

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
    { emoji: "🛍️", label: t("Gérer ma boutique"), sub: "Aminata", agent: findAgent("Aminata") },
    { emoji: "📱", label: t("Trouver des clients"), sub: "Mariama", agent: findAgent("Mariama") },
    { emoji: "📊", label: t("Voir mes finances"), sub: "Ibrahim", agent: findAgent("Ibrahim") },
  ];

  return (
    <div className="space-y-8 pb-28 max-w-2xl mx-auto">
      {/* Header : Bonjour + CreditBalance + Lancer un agent */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("Bonjour")} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">{selectedCompany?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <CreditBalance companyId={selectedCompanyId} compact />
          <button
            onClick={() => navigate("/agents/templates")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] whitespace-nowrap"
          >
            + {t("Lancer un agent")}
          </button>
        </div>
      </div>

      {/* Paywall — Actions restantes + WhatsApp */}
      <div className="flex items-center gap-3 flex-wrap">
        <ActionsRemaining companyId={selectedCompanyId} />
        <WhatsAppConnectButton />
      </div>

      {/* First Success Moment */}
      {agents && agents.length > 0 && (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{"🔥"}</span>
            <h2 className="text-base font-bold">{t("Ton agent a d\u00e9j\u00e0 travaill\u00e9 pour toi")}</h2>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <ActivityFeedItem icon="🔍" text={t("Recherche de clients...")} done />
            <ActivityFeedItem icon="🎯" text={t("3 prospects trouvés")} done />
            <ActivityFeedItem icon="📨" text={t("Messages envoyés")} done />
            <ActivityFeedItem icon="✅" text={t("Rapport prêt")} done />
          </div>
          <p className="text-xs text-green-600 font-medium mt-3">
            {t("Ton assistant est opérationnel")} {"🚀"}
          </p>
        </div>
      )}

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

    </div>
  );
}

function ActivityFeedItem({ icon, text, done }: { icon: string; text: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0">{icon}</span>
      <span className={done ? "line-through opacity-70" : ""}>{text}</span>
      {done && <span className="ml-auto text-green-500 text-xs">{"✔"}</span>}
    </div>
  );
}

function DashboardAgentCard({ agent }: { agent: Agent }) {
  const { t } = useLanguage();
  const meta = (agent.metadata ?? {}) as Record<string, unknown>;
  const emoji = (meta.emoji as string) ?? "🤖";

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
