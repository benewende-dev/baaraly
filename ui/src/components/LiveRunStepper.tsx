import { useState } from "react";
import type { TranscriptEntry } from "../adapters";

/* ─── Mapping noms d'outils → étapes françaises ─── */

interface FrenchStep {
  emoji: string;
  label: string;
  status: "running" | "done" | "error" | "waiting";
}

const KEYWORD_MAP: Array<{ patterns: RegExp[]; emoji: string; label: string }> = [
  { patterns: [/web_search/i, /searching/i, /search/i], emoji: "🔍", label: "Recherche en cours..." },
  { patterns: [/deep_research/i], emoji: "🔍", label: "Recherche approfondie..." },
  { patterns: [/analyz/i, /analyse/i], emoji: "🧠", label: "Analyse en cours..." },
  { patterns: [/writ|generat|rédact/i], emoji: "✍️", label: "Rédaction en cours..." },
  { patterns: [/send.*email|email.*send/i], emoji: "📧", label: "Envoi de l'email..." },
  { patterns: [/generat.*image|image.*generat/i], emoji: "🎨", label: "Création de l'image..." },
  { patterns: [/save_file|saving/i], emoji: "💾", label: "Sauvegarde..." },
  { patterns: [/planning|planif/i], emoji: "📋", label: "Planification..." },
  { patterns: [/think|llm_think/i], emoji: "💭", label: "Réflexion en cours..." },
  { patterns: [/schedul/i], emoji: "📅", label: "Planification du post..." },
  { patterns: [/read_file|read file/i], emoji: "📖", label: "Lecture du fichier..." },
  { patterns: [/write_file|write file/i], emoji: "📝", label: "Écriture du fichier..." },
  { patterns: [/bash|terminal|command/i], emoji: "⚡", label: "Exécution de commande..." },
];

function matchKeyword(text: string): { emoji: string; label: string } | null {
  for (const entry of KEYWORD_MAP) {
    if (entry.patterns.some((p) => p.test(text))) {
      return { emoji: entry.emoji, label: entry.label };
    }
  }
  return null;
}

function entryToStep(entry: TranscriptEntry): FrenchStep | null {
  if (entry.kind === "tool_call") {
    const match = matchKeyword(entry.name);
    return {
      emoji: match?.emoji ?? "⚙️",
      label: match?.label ?? `Action : ${entry.name}`,
      status: "running",
    };
  }
  if (entry.kind === "tool_result") {
    const name = entry.toolName ?? "";
    const match = matchKeyword(name);
    return {
      emoji: entry.isError ? "❌" : (match?.emoji ?? "✅"),
      label: entry.isError
        ? "Une erreur est survenue"
        : (match ? match.label.replace("en cours...", "terminé") : "Action terminée"),
      status: entry.isError ? "error" : "done",
    };
  }
  if (entry.kind === "result") {
    return {
      emoji: entry.isError ? "❌" : "✅",
      label: entry.isError ? "Une erreur est survenue" : "Terminé avec succès",
      status: entry.isError ? "error" : "done",
    };
  }
  return null;
}

/* ─── Composant principal ─── */

interface LiveRunStepperProps {
  entries: TranscriptEntry[];
  streaming?: boolean;
}

export function LiveRunStepper({ entries, streaming = false }: LiveRunStepperProps) {
  const [showRaw, setShowRaw] = useState(false);

  const steps = entries.reduce<FrenchStep[]>((acc, entry) => {
    const step = entryToStep(entry);
    if (!step) return acc;
    // Dédupliquer les étapes identiques consécutives en cours
    const last = acc[acc.length - 1];
    if (last && last.label === step.label && last.status === "running") return acc;
    acc.push(step);
    return acc;
  }, []);

  if (steps.length === 0) {
    return (
      <div style={{ padding: "12px 0" }}>
        <StepRow emoji="💭" label="En attente du démarrage..." status={streaming ? "running" : "waiting"} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const effectiveStatus = isLast && streaming && step.status === "running" ? "running" : step.status;
          return <StepRow key={i} emoji={step.emoji} label={step.label} status={effectiveStatus} />;
        })}
        {streaming && steps[steps.length - 1]?.status !== "running" && (
          <StepRow emoji="💭" label="En cours..." status="running" />
        )}
      </div>

      {/* Bouton détails techniques */}
      <button
        onClick={() => setShowRaw((v) => !v)}
        style={{
          marginTop: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          color: "rgba(255,255,255,0.3)",
          padding: "4px 0",
          display: "block",
        }}
      >
        {showRaw ? "▲ Masquer les détails" : "▼ Détails techniques"}
      </button>

      {showRaw && (
        <pre
          style={{
            background: "#0A0A0A",
            border: "1px solid #1C1C1E",
            borderRadius: 8,
            padding: 12,
            fontSize: 11,
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.5)",
            overflowY: "auto",
            maxHeight: 200,
            marginTop: 4,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {JSON.stringify(entries, null, 2)}
        </pre>
      )}
    </div>
  );
}

function StepRow({ emoji, label, status }: { emoji: string; label: string; status: FrenchStep["status"] }) {
  const dotColor =
    status === "running" ? "#0071E3"
    : status === "done"  ? "#30D158"
    : status === "error" ? "#FF453A"
    : "#1C1C1E";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: dotColor,
          flexShrink: 0,
          boxShadow: status === "running" ? `0 0 0 3px ${dotColor}44` : undefined,
        }}
      />
      <span style={{ fontSize: 14 }}>{emoji}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: status === "running" ? 500 : 400,
          color: status === "waiting" ? "rgba(255,255,255,0.3)"
            : status === "done" ? "rgba(255,255,255,0.7)"
            : "#fff",
        }}
      >
        {label}
      </span>
    </div>
  );
}
