import { useNavigate } from "@/lib/router";
import { useMode } from "../context/ModeContext";
import { useLanguage } from "../context/LanguageContext";
import { useCompany } from "../context/CompanyContext";

export function ModeSwitch() {
  const { mode, setMode } = useMode();
  const { t } = useLanguage();
  const { selectedCompany } = useCompany();
  const navigate = useNavigate();

  function switchTo(next: "simple" | "pro") {
    if (next === mode) return;
    setMode(next);
    if (next === "simple") {
      navigate("/simple/dashboard");
    } else {
      const prefix = selectedCompany?.issuePrefix;
      navigate(prefix ? `/${prefix}/dashboard` : "/");
    }
  }

  return (
    <div className="flex items-center rounded-full border border-border bg-muted/50 p-0.5">
      <button
        type="button"
        onClick={() => switchTo("simple")}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          mode === "simple"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {t("Simple")}
      </button>
      <button
        type="button"
        onClick={() => switchTo("pro")}
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
