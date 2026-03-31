import { useState } from "react";
import { NavLink, useLocation } from "@/lib/router";
import { Home, Bot, MessageCircle, ClipboardList, Settings } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface MobileBottomNavProps {
  visible: boolean;
}

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  matchPrefix?: string;
}

export function MobileBottomNav({ visible }: MobileBottomNavProps) {
  const location = useLocation();
  const { t } = useLanguage();

  const items: NavItem[] = [
    { to: "/dashboard", label: t("Home"), icon: Home },
    { to: "/agents/all", label: t("Agents"), icon: Bot, matchPrefix: "/agents" },
    { to: "/inbox", label: t("Messages"), icon: MessageCircle, matchPrefix: "/inbox" },
    { to: "/issues", label: t("Tasks"), icon: ClipboardList, matchPrefix: "/issues" },
    { to: "/company/settings", label: t("Settings"), icon: Settings, matchPrefix: "/company" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "#0A0A0A",
        borderTop: "1px solid #1C1C1E",
        height: 64,
        paddingBottom: "env(safe-area-inset-bottom)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 200ms ease",
      }}
      className="md:hidden"
      aria-label={t("Mobile navigation")}
    >
      {items.map((item) => {
        const isActive = item.matchPrefix
          ? location.pathname.includes(item.matchPrefix)
          : location.pathname.endsWith(item.to) || location.pathname.includes(item.to + "/");
        const Icon = item.icon;

        return (
          <MobileNavTab
            key={item.to}
            to={item.to}
            label={item.label}
            icon={Icon}
            isActive={isActive}
          />
        );
      })}
    </nav>
  );
}

function MobileNavTab({
  to,
  label,
  icon: Icon,
  isActive,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  isActive: boolean;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <NavLink
      to={to}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        flex: 1,
        height: "100%",
        border: "none",
        background: "none",
        cursor: "pointer",
        transform: pressed ? "scale(0.9)" : "scale(1)",
        transition: "transform 150ms ease",
        textDecoration: "none",
      }}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {() => (
        <>
          <Icon
            style={{
              width: 22,
              height: 22,
              color: isActive ? "#0071E3" : "rgba(255,255,255,0.4)",
              transition: "color 200ms ease",
            }}
            strokeWidth={isActive ? 2.2 : 1.8}
          />
          {isActive && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#0071E3",
                lineHeight: 1,
              }}
            >
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
