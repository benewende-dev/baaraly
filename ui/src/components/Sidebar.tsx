import {
  Inbox,
  CircleDot,
  Target,
  LayoutDashboard,
  DollarSign,
  History,
  Search,
  SquarePen,
  Network,
  Boxes,
  Repeat,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SidebarSection } from "./SidebarSection";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarProjects } from "./SidebarProjects";
import { SidebarAgents } from "./SidebarAgents";
import { useDialog } from "../context/DialogContext";
import { useCompany } from "../context/CompanyContext";
import { useSidebar } from "../context/SidebarContext";
import { heartbeatsApi } from "../api/heartbeats";
import { queryKeys } from "../lib/queryKeys";
import { useInboxBadge } from "../hooks/useInboxBadge";
import { Button } from "@/components/ui/button";
import { PluginSlotOutlet } from "@/plugins/slots";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "../lib/utils";

export function Sidebar() {
  const { openNewIssue } = useDialog();
  const { selectedCompanyId, selectedCompany } = useCompany();
  const { sidebarCollapsed, toggleSidebarCollapsed, isMobile } = useSidebar();
  const inboxBadge = useInboxBadge(selectedCompanyId);
  const { data: liveRuns } = useQuery({
    queryKey: queryKeys.liveRuns(selectedCompanyId!),
    queryFn: () => heartbeatsApi.liveRunsForCompany(selectedCompanyId!),
    enabled: !!selectedCompanyId,
    refetchInterval: 10_000,
  });
  const liveRunCount = liveRuns?.length ?? 0;

  // Sur mobile, jamais rétracté
  const collapsed = !isMobile && sidebarCollapsed;

  function openSearch() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  const pluginContext = {
    companyId: selectedCompanyId,
    companyPrefix: selectedCompany?.issuePrefix ?? null,
  };

  return (
    <aside
      className={cn(
        "h-full min-h-0 border-r border-border bg-background flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
      style={{ transition: "width 300ms cubic-bezier(0.4,0,0.2,1)" }}
    >
      {/* Top bar */}
      <div className={cn("flex items-center gap-1 px-3 h-12 shrink-0", collapsed && "justify-center px-0")}>
        {!collapsed && (
          <>
            {selectedCompany?.brandColor && (
              <div
                className="w-4 h-4 rounded-sm shrink-0 ml-1"
                style={{ backgroundColor: selectedCompany.brandColor }}
              />
            )}
            <span className="flex-1 text-sm font-bold text-foreground truncate pl-1">
              {selectedCompany?.name ?? "Select company"}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground shrink-0"
              onClick={openSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </>
        )}
        {/* Bouton toggle — toujours visible sur desktop */}
        {!isMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground shrink-0"
                onClick={toggleSidebarCollapsed}
                aria-label={collapsed ? "Étendre la barre latérale" : "Réduire la barre latérale"}
              >
                {collapsed
                  ? <PanelLeftOpen className="h-4 w-4" />
                  : <PanelLeftClose className="h-4 w-4" />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Étendre" : "Réduire"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <nav className={cn(
        "flex-1 min-h-0 overflow-y-auto scrollbar-auto-hide flex flex-col gap-4 py-2",
        collapsed ? "px-1" : "px-3"
      )}>
        <div className="flex flex-col gap-0.5">
          {/* Nouvelle tâche */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => openNewIssue()}
                  className="flex items-center justify-center p-2 text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors rounded-md w-full"
                >
                  <SquarePen className="h-4 w-4 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Nouvelle tâche</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => openNewIssue()}
              className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
            >
              <SquarePen className="h-4 w-4 shrink-0" />
              <span className="truncate">Nouvelle tâche</span>
            </button>
          )}
          <CollapsibleNavItem collapsed={collapsed} to="/dashboard" label="Tableau de bord" icon={LayoutDashboard} liveCount={liveRunCount} />
          <CollapsibleNavItem
            collapsed={collapsed}
            to="/inbox"
            label="Inbox"
            icon={Inbox}
            badge={inboxBadge.inbox}
            badgeTone={inboxBadge.failedRuns > 0 ? "danger" : "default"}
            alert={inboxBadge.failedRuns > 0}
          />
          {!collapsed && (
            <PluginSlotOutlet
              slotTypes={["sidebar"]}
              context={pluginContext}
              className="flex flex-col gap-0.5"
              itemClassName="text-[13px] font-medium"
              missingBehavior="placeholder"
            />
          )}
        </div>

        {collapsed ? (
          /* Mode rétracté : icônes seulement, groupées */
          <div className="flex flex-col gap-0.5">
            {[
              { to: "/issues", label: "Tâches", icon: CircleDot },
              { to: "/routines", label: "Routines", icon: Repeat },
              { to: "/goals", label: "Objectifs", icon: Target },
              { to: "/org", label: "Org", icon: Network },
              { to: "/skills", label: "Compétences", icon: Boxes },
              { to: "/costs", label: "Coûts", icon: DollarSign },
              { to: "/activity", label: "Activité", icon: History },
              { to: "/company/settings", label: "Paramètres", icon: Settings },
            ].map(({ to, label, icon: Icon }) => (
              <Tooltip key={to}>
                <TooltipTrigger asChild>
                  <SidebarNavItem to={to} label="" icon={Icon} collapsed />
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        ) : (
          <>
            <SidebarSection label="Travail">
              <SidebarNavItem to="/issues" label="Tâches" icon={CircleDot} />
              <SidebarNavItem to="/routines" label="Routines" icon={Repeat} textBadge="Beta" textBadgeTone="amber" />
              <SidebarNavItem to="/goals" label="Objectifs" icon={Target} />
            </SidebarSection>

            <SidebarProjects />

            <SidebarAgents />

            <SidebarSection label="Organisation">
              <SidebarNavItem to="/org" label="Org" icon={Network} />
              <SidebarNavItem to="/skills" label="Compétences" icon={Boxes} />
              <SidebarNavItem to="/costs" label="Coûts" icon={DollarSign} />
              <SidebarNavItem to="/activity" label="Activité" icon={History} />
              <SidebarNavItem to="/company/settings" label="Paramètres" icon={Settings} />
            </SidebarSection>

            <PluginSlotOutlet
              slotTypes={["sidebarPanel"]}
              context={pluginContext}
              className="flex flex-col gap-3"
              itemClassName="rounded-lg border border-border p-3"
              missingBehavior="placeholder"
            />
          </>
        )}
      </nav>
    </aside>
  );
}

/* Élément de navigation adapté au mode rétracté */
function CollapsibleNavItem({
  collapsed,
  to,
  label,
  icon,
  liveCount,
  badge,
  badgeTone,
  alert,
}: {
  collapsed: boolean;
  to: string;
  label: string;
  icon: LucideIcon;
  liveCount?: number;
  badge?: number;
  badgeTone?: "default" | "danger";
  alert?: boolean;
}) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarNavItem to={to} label="" icon={icon} liveCount={liveCount} badge={badge} badgeTone={badgeTone} alert={alert} collapsed />
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <SidebarNavItem to={to} label={label} icon={icon} liveCount={liveCount} badge={badge} badgeTone={badgeTone} alert={alert} />
  );
}
