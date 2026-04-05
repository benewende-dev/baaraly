import { Link, Outlet, useLocation } from "@/lib/router";
import { ModeSwitch } from "./ModeSwitch";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useCompany } from "../context/CompanyContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToastViewport } from "./ToastViewport";
import { cn } from "../lib/utils";

export function SimpleLayout() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const { selectedCompany } = useCompany();
  const location = useLocation();
  const nextThemeLabel = theme === "dark" ? t("Switch to light mode") : t("Switch to dark mode");

  const prefix = selectedCompany?.issuePrefix ?? "";

  const navLinks = [
    { label: t("Accueil"), to: prefix ? `/${prefix}/dashboard` : "/simple/dashboard" },
    { label: t("Agents"), to: prefix ? `/${prefix}/agents/all` : "/simple/dashboard" },
    { label: t("Templates"), to: "/simple/templates" },
  ];

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          {/* Logo + nav */}
          <div className="flex items-center gap-6">
            <Link to={prefix ? `/${prefix}/dashboard` : "/simple/dashboard"} className="flex items-center gap-2 shrink-0">
              <img src="/baarali-logo.svg" alt="Baarali" className="h-8 w-8" />
              <span className="text-base font-extrabold tracking-tight hidden sm:inline">Baarali</span>
            </Link>

            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.to ||
                  (link.to.includes("/agents") && location.pathname.includes("/agents"));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ModeSwitch />

            <div className="flex items-center rounded-full bg-muted p-0.5">
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                  language === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                  language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                EN
              </button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              onClick={toggleTheme}
              aria-label={nextThemeLabel}
              title={nextThemeLabel}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <ToastViewport />
    </div>
  );
}
