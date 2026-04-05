import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router";
import { agentsApi } from "../api/agents";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { BAARALI_AGENTS } from "@paperclipai/shared/baarali-agents";
import type { BaaraliAgentDefinition } from "@paperclipai/shared/baarali-agents";
import { queryKeys } from "../lib/queryKeys";

export function TemplateGallery() {
  const { selectedCompanyId } = useCompany();
  const { t } = useLanguage();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [recruitingAgent, setRecruitingAgent] = useState<string | null>(null);

  const hireMutation = useMutation({
    mutationFn: async (agent: BaaraliAgentDefinition) => {
      if (!selectedCompanyId) throw new Error("No company selected");
      return agentsApi.hire(selectedCompanyId, {
        name: agent.name,
        role: "general",
        title: agent.role,
        adapterType: "opencode_local",
        adapterConfig: {
          command: "opencode",
          model: "opencode/qwen3.6-plus-free",
          dangerouslySkipPermissions: true,
          promptTemplate: agent.systemPrompt,
        },
        metadata: {
          emoji: agent.emoji,
          color: agent.color,
          description: agent.description,
          tools: agent.tools,
          superpowers: agent.superpowers,
          baaraliTemplate: true,
        },
      });
    },
    onSuccess: (_data, agent) => {
      if (selectedCompanyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(selectedCompanyId) });
      }
      pushToast({
        tone: "success",
        title: `${agent.name} ${t("a été ajouté à ton équipe")}`,
        body: t("On s'occupe du reste 👍"),
      });
      navigate("/dashboard");
    },
    onSettled: () => {
      setRecruitingAgent(null);
    },
  });

  function handleRecruit(agent: BaaraliAgentDefinition) {
    setRecruitingAgent(agent.name);
    hireMutation.mutate(agent);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{t("Choisis ton premier assistant")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("Ils travaillent pour toi automatiquement")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BAARALI_AGENTS.map((agent) => {
          const isRecruiting = recruitingAgent === agent.name;
          return (
            <div
              key={agent.name}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col transition-all hover:border-muted-foreground/30 hover:shadow-md"
            >
              {/* Emoji icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{
                  backgroundColor: `${agent.color}20`,
                  border: `1px solid ${agent.color}40`,
                }}
              >
                {agent.emoji}
              </div>

              {/* Badges */}
              {agent.name === "Aminata" && (
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 mb-2">
                  {t("Recommandé")}
                </span>
              )}
              {agent.name === "Ibrahim" && (
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 mb-2">
                  Business
                </span>
              )}

              {/* Name */}
              <p className="text-lg font-bold mb-1">{agent.name}</p>

              {/* Role */}
              <p
                className="text-xs font-medium mb-3"
                style={{ color: agent.color }}
              >
                {agent.role}
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                {agent.description}
              </p>

              {/* Superpowers */}
              <div className="space-y-2 mb-5">
                {agent.superpowers.map((power) => (
                  <div key={power} className="flex items-center gap-2">
                    <span style={{ color: agent.color }}>✓</span>
                    <span className="text-xs text-muted-foreground">{power}</span>
                  </div>
                ))}
              </div>

              {/* Recruit button */}
              <button
                onClick={() => handleRecruit(agent)}
                disabled={isRecruiting || hireMutation.isPending}
                className="w-full min-h-[48px] py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50 hover:opacity-90"
                style={{ backgroundColor: agent.color }}
                title={`${t("Ajouter")} ${agent.name}`}
              >
                {isRecruiting
                  ? t("Recrutement...")
                  : `${t("Ajouter")} ${agent.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {hireMutation.isError && (
        <p className="text-sm text-red-500 text-center">
          {t("Échec du recrutement. Réessaie.")}
        </p>
      )}
    </div>
  );
}
