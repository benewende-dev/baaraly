import { AgentRoutePrefixCtx, AgentDetail } from "./AgentDetail";

/**
 * Simple-mode wrapper for AgentDetail.
 * Provides "/simple/agents" as the route prefix so all internal navigation
 * stays within the simple-mode namespace — no companyPrefix dependency.
 */
export function SimpleAgentDetail() {
  return (
    <AgentRoutePrefixCtx.Provider value="/simple/agents">
      <AgentDetail />
    </AgentRoutePrefixCtx.Provider>
  );
}
