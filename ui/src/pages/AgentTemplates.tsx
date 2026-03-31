import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useLanguage } from "../context/LanguageContext";
import { useEffect } from "react";
import { TemplateGallery } from "../components/TemplateGallery";

export function AgentTemplates() {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { t } = useLanguage();

  useEffect(() => {
    setBreadcrumbs([{ label: t("Agents"), href: "/agents" }, { label: t("Templates") }]);
  }, [setBreadcrumbs, t]);

  return (
    <div className="mx-auto max-w-4xl py-6 px-4">
      <TemplateGallery />
    </div>
  );
}
