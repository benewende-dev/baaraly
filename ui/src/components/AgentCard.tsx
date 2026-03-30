import { Link } from "@/lib/router";
import { agentUrl } from "../lib/utils";
import type { Agent } from "@paperclipai/shared";

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  running: { bg: "rgba(48,209,88,0.15)", color: "#30D158", label: "En cours" },
  active:  { bg: "rgba(48,209,88,0.15)", color: "#30D158", label: "Actif" },
  idle:    { bg: "rgba(48,209,88,0.15)", color: "#30D158", label: "Disponible" },
  paused:  { bg: "rgba(255,159,10,0.15)", color: "#FF9F0A", label: "En pause" },
  error:   { bg: "rgba(255,69,58,0.15)", color: "#FF453A", label: "Erreur" },
  terminated: { bg: "rgba(28,28,30,0.8)", color: "rgba(255,255,255,0.3)", label: "Arrêté" },
  queued:  { bg: "rgba(0,113,227,0.15)", color: "#0071E3", label: "En attente" },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? { bg: "rgba(28,28,30,0.8)", color: "rgba(255,255,255,0.4)", label: status };
}

/** Génère un gradient déterministe à partir du nom */
function avatarGradient(name: string): string {
  const gradients = [
    "linear-gradient(135deg, #0071E3, #BF5AF2)",
    "linear-gradient(135deg, #30D158, #0071E3)",
    "linear-gradient(135deg, #FF9F0A, #FF453A)",
    "linear-gradient(135deg, #BF5AF2, #FF453A)",
    "linear-gradient(135deg, #0071E3, #30D158)",
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx]!;
}

interface AgentCardProps {
  agent: Agent;
  liveRunId?: string;
  liveCount?: number;
  lastActivity?: string | null;
}

export function AgentCard({ agent, liveCount, lastActivity }: AgentCardProps) {
  const statusCfg = getStatusConfig(agent.status);
  const initial = (agent.name?.[0] ?? "?").toUpperCase();

  return (
    <div
      style={{
        background: "#0A0A0A",
        border: "1px solid #1C1C1E",
        borderRadius: 20,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 200ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,113,227,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#1C1C1E";
      }}
    >
      {/* Ligne 1 — Avatar + Nom + Statut */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Avatar */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: avatarGradient(agent.name ?? ""),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {initial}
        </div>

        {/* Nom + Rôle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {agent.name}
          </p>
          {agent.title && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {agent.title}
            </p>
          )}
        </div>

        {/* Badge statut */}
        <span
          style={{
            background: statusCfg.bg,
            color: statusCfg.color,
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {statusCfg.label}
          {liveCount && liveCount > 0 && ` · ${liveCount}`}
        </span>
      </div>

      {/* Ligne 2 — Dernière activité */}
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
        {lastActivity
          ? `Dernière action : ${lastActivity}`
          : "Aucune activité récente"}
      </p>

      {/* Ligne 3 — Bouton action */}
      <Link
        to={agentUrl(agent)}
        style={{
          display: "block",
          width: "100%",
          padding: "12px 0",
          background: "#0071E3",
          borderRadius: 12,
          color: "#fff",
          fontWeight: 600,
          fontSize: 15,
          textAlign: "center",
          textDecoration: "none",
          transition: "opacity 200ms ease",
          boxSizing: "border-box",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
      >
        Voir l'activité
      </Link>
    </div>
  );
}
