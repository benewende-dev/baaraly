import { useEffect, useMemo } from "react";
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

interface WaNumber {
  code: string;
  number: string;
  verified?: boolean;
}

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
      {/* Trial banner */}
      {trialInfo && trialInfo.active && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-center justify-between gap-4">
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

      {/* First Success Moment / Welcome */}
      {agents && agents.length > 0 && (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{"🔥"}</span>
            <h2 className="text-base font-bold">{t("Ton assistant est prêt")}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {agents.length === 1
              ? `${agents[0].name} ${t("va commencer à travailler pour toi. Tu recevras les résultats sur WhatsApp.")}`
              : `${agents.length} ${t("assistants sont configurés et prêts à travailler pour toi.")}`}
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
