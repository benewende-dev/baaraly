import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

interface ThemeLangToggleProps {
  /** Compact mode: smaller buttons, no labels */
  compact?: boolean;
}

export function ThemeLangToggle({ compact = false }: ThemeLangToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {/* Language toggle */}
        <div className="flex items-center rounded-full bg-muted p-0.5">
          <button
            type="button"
            onClick={() => setLanguage("fr")}
            className={`px-2 py-1 rounded-full text-[11px] font-semibold transition-all ${
              language === "fr"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-2 py-1 rounded-full text-[11px] font-semibold transition-all ${
              language === "en"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            EN
          </button>
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Language toggle */}
      <div className="flex items-center rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => setLanguage("fr")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            language === "fr"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🇫🇷 FR
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            language === "en"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🇬🇧 EN
        </button>
      </div>

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </div>
  );
}
