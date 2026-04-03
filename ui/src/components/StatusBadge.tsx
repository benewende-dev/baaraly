import { cn } from "../lib/utils";
import { statusBadge, statusBadgeDefault } from "../lib/status-colors";
import { useLanguage } from "../context/LanguageContext";

const STATUS_LABELS: Record<string, { fr: string; en: string }> = {
  running: { fr: "En cours", en: "Running" },
  active: { fr: "Actif", en: "Active" },
  idle: { fr: "Disponible", en: "Available" },
  paused: { fr: "En pause", en: "Paused" },
  error: { fr: "Erreur", en: "Error" },
  terminated: { fr: "Arrêté", en: "Stopped" },
  queued: { fr: "En attente", en: "Queued" },
  pending_approval: { fr: "En attente d'approbation", en: "Pending approval" },
};

function getStatusLabel(status: string, lang: "fr" | "en"): string {
  return STATUS_LABELS[status]?.[lang] ?? status.replace(/_/g, " ");
}

export function StatusBadge({ status }: { status: string }) {
  const { language } = useLanguage();
  const label = getStatusLabel(status, language);
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shrink-0",
        statusBadge[status] ?? statusBadgeDefault
      )}
    >
      {label}
    </span>
  );
}
