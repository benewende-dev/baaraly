import { useQuery } from "@tanstack/react-query";
import { creditsApi } from "../api/credits";
import { useLanguage } from "../context/LanguageContext";

interface ActionsRemainingProps {
  companyId: string;
  costPerAction?: number;
}

export function ActionsRemaining({ companyId, costPerAction = 1 }: ActionsRemainingProps) {
  const { t } = useLanguage();

  const { data: creditData } = useQuery({
    queryKey: ["credits", companyId],
    queryFn: () => creditsApi.getBalance(companyId),
    enabled: !!companyId,
  });

  const balance = creditData?.balance ?? 0;
  const actionsLeft = Math.floor(balance / costPerAction);
  const isLow = actionsLeft > 0 && actionsLeft <= 10;
  const isEmpty = actionsLeft === 0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
        isEmpty
          ? "bg-red-500/10 text-red-500"
          : isLow
            ? "bg-orange-500/10 text-orange-500"
            : "bg-muted text-muted-foreground"
      }`}
    >
      <span>
        {isEmpty
          ? t("Plus d'actions disponibles")
          : `${t("Il te reste")} ${actionsLeft} ${actionsLeft === 1 ? t("action") : t("actions")}`}
      </span>
    </div>
  );
}
