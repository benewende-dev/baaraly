import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router";
import { agentsApi } from "../api/agents";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";
import { BAARALY_AGENTS } from "@paperclipai/shared/baaraly-agents";
import type { BaaralyAgentDefinition } from "@paperclipai/shared/baaraly-agents";
import { queryKeys } from "../lib/queryKeys";

export function TemplateGallery() {
  const { selectedCompanyId } = useCompany();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [recruitingAgent, setRecruitingAgent] = useState<string | null>(null);

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
    onSuccess: (data) => {
      if (selectedCompanyId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.agents.list(selectedCompanyId) });
      }
      const agentId = data.agent.urlKey ?? data.agent.id;
      navigate(`/agents/${agentId}`);
    },
    onSettled: () => {
      setRecruitingAgent(null);
    },
  });

  function handleRecruit(agent: BaaralyAgentDefinition) {
    setRecruitingAgent(agent.name);
    hireMutation.mutate(agent);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{t("Choose your first agent")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("Each agent is specialized for your activity.")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BAARALY_AGENTS.map((agent) => {
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
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50 hover:opacity-90"
                style={{ backgroundColor: agent.color }}
                title={`${t("Recruit")} ${agent.name}`}
              >
                {isRecruiting
                  ? t("Recruiting...")
                  : `${t("Recruit")} ${agent.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {hireMutation.isError && (
        <p className="text-sm text-red-500 text-center">
          {t("Failed to recruit agent. Please try again.")}
        </p>
      )}
    </div>
  );
}
