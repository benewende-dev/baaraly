import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { agentTemplatesApi } from "../api/agent-templates";
import { BAARALI_AGENTS, AGENT_CATEGORIES } from "@paperclipai/shared/baarali-agents";
import { queryKeys } from "../lib/queryKeys";
import { agentsApi } from "../api/agents";

type CategoryId = "all" | string;

export function SimpleTemplates() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [hiringId, setHiringId] = useState<string | null>(null);

  // Fetch DB templates (public list)
  const dbTemplatesQuery = useQuery({
    queryKey: ["agent-templates-public"],
    queryFn: agentTemplatesApi.list,
  });

  // Fetch already hired agents to show which are active
  const agentsQuery = useQuery({
    queryKey: selectedCompany ? queryKeys.agents.list(selectedCompany.id) : ["agents-none"],
    queryFn: () => agentsApi.list(selectedCompany!.id),
    enabled: !!selectedCompany,
  });

  const hireFromDb = useMutation({
    mutationFn: (templateId: string) =>
      agentTemplatesApi.hireFromTemplate(selectedCompany!.id, templateId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(selectedCompany!.id) });
      const agent = data.agent as { urlKey?: string; id?: string } | null;
      const key = agent?.urlKey ?? agent?.id;
      if (key) navigate(`/simple/agents/${key}`);
      else navigate("/simple/agents");
    },
    onError: () => {
      pushToast({ title: t("Erreur lors du recrutement"), tone: "error" });
      setHiringId(null);
    },
  });

  const dbTemplates = dbTemplatesQuery.data?.templates ?? [];
  const existingNames = new Set((agentsQuery.data ?? []).map((a) => a.name.toLowerCase()));

  // If DB has templates, use them. Otherwise fall back to BAARALI_AGENTS static list.
  const useStaticFallback = dbTemplates.length === 0;

  const categories = [
    { id: "all", label: t("Tous"), emoji: "✨" },
    ...AGENT_CATEGORIES.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji })),
  ];

  const filteredDb = activeCategory === "all"
    ? dbTemplates
    : dbTemplates.filter((t) => t.category === activeCategory);

  const filteredStatic = activeCategory === "all"
    ? BAARALI_AGENTS
    : BAARALI_AGENTS.filter((a) => a.category === activeCategory);

  function handleHireDb(templateId: string, name: string) {
    if (!selectedCompany) return;
    setHiringId(templateId);
    hireFromDb.mutate(templateId);
    pushToast({ title: `${t("Recrutement de")} ${name}...` });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold">{t("Templates d'agents")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Choisis un agent pré-configuré et démarre en 1 clic")}
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      {useStaticFallback ? (
        /* Static BAARALI_AGENTS list (no DB templates yet) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStatic.map((agent) => {
            const alreadyHired = existingNames.has(agent.name.toLowerCase());
            return (
              <div
                key={agent.name}
                className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{agent.emoji}</span>
                  {alreadyHired && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                      {t("Actif")}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold">{agent.name}</p>
                  <p className="text-xs text-[#0071E3] font-medium">{agent.role}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{agent.description}</p>
                </div>
                <div className="mt-auto">
                  {alreadyHired ? (
                    <button
                      type="button"
                      onClick={() => navigate("/simple/agents")}
                      className="w-full rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      {t("Voir mes agents")}
                    </button>
                  ) : (
                    <p className="text-center text-[10px] text-muted-foreground italic">
                      {t("Disponible bientôt via templates")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Real DB templates */
        filteredDb.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {t("Aucun template dans cette catégorie")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDb.map((tmpl) => {
              const alreadyHired = existingNames.has(tmpl.name.toLowerCase());
              const isHiring = hiringId === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{tmpl.emoji || "🤖"}</span>
                    {alreadyHired && (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                        {t("Actif")}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold">{tmpl.name}</p>
                    <p className="text-xs text-[#0071E3] font-medium">{tmpl.role}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{tmpl.description}</p>
                  </div>
                  <div className="mt-auto">
                    {alreadyHired ? (
                      <button
                        type="button"
                        onClick={() => navigate("/simple/agents")}
                        className="w-full rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        {t("Voir mes agents")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isHiring || !selectedCompany}
                        onClick={() => handleHireDb(tmpl.id, tmpl.name)}
                        className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {isHiring ? t("Recrutement...") : `+ ${t("Recruter")} ${tmpl.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
