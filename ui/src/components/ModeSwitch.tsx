import { useMode } from "../context/ModeContext";
import { useLanguage } from "../context/LanguageContext";

export function ModeSwitch() {
  const { mode, setMode } = useMode();
  const { t } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-border bg-muted/50 p-0.5">
      <button
        onClick={() => setMode("simple")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          mode === "simple"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {t("Simple")}
      </button>
      <button
        onClick={() => setMode("pro")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          mode === "pro"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Pro
      </button>
    </div>
  );
}
