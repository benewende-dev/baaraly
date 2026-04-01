import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { creditsApi } from "../api/credits";

/**
 * Hook paywall — vérifie les crédits avant une action.
 * Si crédits insuffisants, ouvre le RechargeModal.
 */
export function useCreditsGuard(companyId: string | null) {
  const [showRecharge, setShowRecharge] = useState(false);

  const { data: creditData, refetch } = useQuery({
    queryKey: ["credits", companyId],
    queryFn: () => creditsApi.getBalance(companyId!),
    enabled: !!companyId,
  });

  const balance = creditData?.balance ?? 0;
  const isLow = balance > 0 && balance < 100;
  const isEmpty = balance === 0;

  const guardAction = useCallback(
    (requiredCredits: number, action: () => void) => {
      if (balance < requiredCredits) {
        setShowRecharge(true);
        return false;
      }
      action();
      return true;
    },
    [balance],
  );

  return {
    balance,
    isLow,
    isEmpty,
    showRecharge,
    setShowRecharge,
    guardAction,
    refetchCredits: refetch,
  };
}
