import { useLanguage } from "../context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { BaaraliAgentDefinition, AgentTier } from "@paperclipai/shared/baarali-agents";
import type { Agent } from "@paperclipai/shared";

interface AgentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: BaaraliAgentDefinition | null;
  installed?: Agent;
  isLocked: boolean;
  canInstall: boolean;
  isRecruiting: boolean;
  isHiring: boolean;
  onRecruit: () => void;
  onOpen: () => void;
  onUpgrade: () => void;
}

export function AgentDetailModal({
  open,
  onOpenChange,
  agent,
  installed,
  isLocked,
  canInstall,
  isRecruiting,
  isHiring,
  onRecruit,
  onOpen,
  onUpgrade,
}: AgentDetailModalProps) {
  const { t } = useLanguage();
  if (!agent) return null;

  const isInstalled = !!installed;
  const isActive = installed?.status === "active";
  const isPaused = installed?.status === "paused";

  const tierLabel = agent.tier === 3 ? "Expert" : agent.tier === 2 ? "Avancé" : "Standard";
  const tierBadge = agent.tier === 3 ? "🏆" : agent.tier === 2 ? "⭐" : "✅";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header with emoji and gradient */}
        <div
          className="relative -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${agent.color}15, ${agent.color}05)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg"
              style={{
                backgroundColor: `${agent.color}20`,
                border: `2px solid ${agent.color}30`,
              }}
            >
              {agent.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{agent.name}</h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${agent.color}15`,
                    color: agent.color,
                    border: `1px solid ${agent.color}25`,
                  }}
                >
                  {tierBadge} {tierLabel}
                </span>
              </div>
              <p className="text-sm font-medium mt-0.5" style={{ color: agent.color }}>
                {agent.role}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-5 mt-4">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
              {t("Description")}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/90">
              {agent.description}
            </p>
          </div>

          {/* Superpowers */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
              💪 {t("Superpouvoirs")}
            </h3>
            <div className="space-y-2">
              {agent.superpowers.map((sp, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm">{sp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
              🔧 {t("Outils")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {agent.tools.map((tool, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-muted/30"
                >
                  {tool.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities preview */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
              🤖 {t("Ce qu'il sait faire")}
            </h3>
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-8">
                {agent.systemPrompt.split("\n").slice(0, 12).join("\n")}...
              </p>
            </div>
          </div>

          {/* Status if installed */}
          {isInstalled && (
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {isActive ? "✅ " + t("Actif") : isPaused ? "⏸️ " + t("En pause") : "⏳ " + t("En attente")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("Installé le")} {new Date(installed.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <button
                  onClick={() => { onOpen(); onOpenChange(false); }}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-muted/50 transition-all"
                >
                  {t("Ouvrir")}
                </button>
              </div>
            </div>
          )}

          {/* Locked */}
          {isLocked && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-center">
              <p className="text-sm font-medium text-amber-600">
                🔒 {agent.tier === 2 ? t("Forfait Pro requis") : t("Forfait Max requis")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("Cliquez sur le bouton ci-dessous pour débloquer cet agent")}
              </p>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="mt-5 pt-4 border-t border-border">
          {isInstalled ? (
            <button
              onClick={() => { onOpen(); onOpenChange(false); }}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all border border-border hover:bg-muted/50"
            >
              {t("Ouvrir")} {agent.name}
            </button>
          ) : isLocked ? (
            <button
              onClick={() => { onUpgrade(); onOpenChange(false); }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${agent.tier === 2 ? "#0071E3" : "#BF5AF2"}, ${agent.tier === 2 ? "#5E5CE6" : "#FF375F"})`,
              }}
            >
              🔒 {t("Passer à")} {agent.tier === 2 ? "Pro" : "Max"} {t("pour débloquer")}
            </button>
          ) : (
            <button
              onClick={onRecruit}
              disabled={isRecruiting || isHiring || !canInstall}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 hover:opacity-90"
              style={{ backgroundColor: agent.color }}
            >
              {isRecruiting
                ? t("Recrutement...")
                : !canInstall
                  ? t("Limite d'agents atteinte")
                  : `+ ${t("Installer")} ${agent.name}`}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
