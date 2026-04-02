import { useEffect } from "react";
import { Link, useLocation } from "@/lib/router";
import { Compass, ArrowLeft } from "lucide-react";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";

type NotFoundScope = "board" | "invalid_company_prefix" | "global";

interface NotFoundPageProps {
  scope?: NotFoundScope;
  requestedPrefix?: string;
}

export function NotFoundPage({ scope = "global", requestedPrefix }: NotFoundPageProps) {
  const location = useLocation();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { companies, selectedCompany } = useCompany();
  const { t } = useLanguage();

  useEffect(() => {
    setBreadcrumbs([{ label: t("Not Found") }]);
  }, [setBreadcrumbs, t]);

  const fallbackCompany = selectedCompany ?? companies[0] ?? null;
  const dashboardHref = fallbackCompany ? `/${fallbackCompany.issuePrefix}/dashboard` : "/";
  const currentPath = `${location.pathname}${location.search}${location.hash}`;
  const normalizedPrefix = requestedPrefix?.toUpperCase();

  const title = scope === "invalid_company_prefix" ? t("Company not found") : t("Page not found");
  const description =
    scope === "invalid_company_prefix"
      ? `${t("No company matches the prefix")} "${normalizedPrefix ?? t("unknown")}".`
      : t("This route does not exist.");

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-float-slower" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Large 404 */}
        <div className="mb-8">
          <span className="text-[10rem] font-extrabold leading-none text-gradient select-none">
            404
          </span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Compass className="h-10 w-10 text-primary" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-muted-foreground mb-2">{description}</p>
        <p className="text-xs text-muted-foreground/60 font-mono mb-8">{currentPath}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={dashboardHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {t("Open dashboard")}
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-sm font-semibold transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Go home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
