import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompany } from "../context/CompanyContext";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import { agentTemplatesApi } from "../api/agent-templates";
import { queryKeys } from "../lib/queryKeys";
import type { AgentTemplate, CreateTemplateInput, UpdateTemplateInput } from "../api/agent-templates";
import { AGENT_CATEGORIES } from "@paperclipai/shared/baarali-agents";

export function AgentTemplates() {
  const { t } = useLanguage();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AgentTemplate | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: templatesData, isLoading } = useQuery({
    queryKey: queryKeys.agentTemplates.admin,
    queryFn: agentTemplatesApi.listAdmin,
  });

  const templates = templatesData?.templates ?? [];

  const filtered = filterCategory === "all"
    ? templates
    : templates.filter((t) => t.category === filterCategory);

  const createMutation = useMutation({
    mutationFn: (data: CreateTemplateInput) => agentTemplatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agentTemplates.admin });
      pushToast({ tone: "success", title: t("Template créé"), body: t("Le template a été ajouté avec succès") });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTemplateInput }) =>
      agentTemplatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agentTemplates.admin });
      pushToast({ tone: "success", title: t("Template mis à jour"), body: t("Les modifications ont été sauvegardées") });
      setEditingTemplate(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => agentTemplatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.agentTemplates.admin });
      pushToast({ tone: "success", title: t("Template supprimé"), body: t("Le template a été supprimé") });
    },
  });

  const { selectedCompany } = useCompany();

  const hireMutation = useMutation({
    mutationFn: ({ templateId }: { templateId: string }) =>
      agentTemplatesApi.hireFromTemplate(selectedCompany!.id, templateId, {
        model: "opencode/qwen3.6-plus-free",
        command: "opencode",
      }),
    onSuccess: (_data, vars) => {
      const tpl = templates.find((t) => t.id === vars.templateId);
      pushToast({ tone: "success", title: t("Agent recruté"), body: `${tpl?.name ?? "Agent"} ${t("a été ajouté à votre company")}` });
    },
  });

  const hireAllMutation = useMutation({
    mutationFn: () =>
      agentTemplatesApi.hireAll(selectedCompany!.id, {
        model: "opencode/qwen3.6-plus-free",
        command: "opencode",
      }),
    onSuccess: (data) => {
      pushToast({
        tone: "success",
        title: t("Agents recrutés"),
        body: `${data.hired.length} ${t("ajoutés")}${data.skipped.length > 0 ? `, ${data.skipped.length} ${t("déjà existants")}` : ""}`,
      });
    },
  });

  function handleCreate(data: CreateTemplateInput | UpdateTemplateInput) {
    createMutation.mutate(data as CreateTemplateInput);
  }

  function handleUpdate(id: string, data: UpdateTemplateInput) {
    updateMutation.mutate({ id, data });
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`${t("Supprimer")} "${name}" ?`)) {
      deleteMutation.mutate(id);
    }
  }

  function handleHire(templateId: string) {
    hireMutation.mutate({ templateId });
  }

  function handleHireAll() {
    if (confirm(`${t("Recruter les")} ${templates.length} ${t("agents dans votre company")} ?`)) {
      hireAllMutation.mutate();
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">{t("Chargement...")}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("Templates d'agents")}</h1>
          <p className="text-sm text-muted-foreground">{t("Gère les 30 agents préconfigurés")} ({templates.length})</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
            onClick={handleHireAll}
            disabled={hireAllMutation.isPending}
          >
            {hireAllMutation.isPending ? t("Recrutement...") : t("Recruter tout")}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            onClick={() => setShowForm(true)}
          >
            {t("Nouveau template")}
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            filterCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border"
          }`}
          onClick={() => setFilterCategory("all")}
        >
          {t("Tous")}
        </button>
        {AGENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              filterCategory === cat.id ? "bg-primary text-primary-foreground border-primary" : "border-border"
            }`}
            onClick={() => setFilterCategory(cat.id)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {showForm && (
        <TemplateForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isSubmitting={createMutation.isPending}
        />
      )}

      {editingTemplate && (
        <TemplateForm
          template={editingTemplate}
          onSubmit={(data) => handleUpdate(editingTemplate.id, data)}
          onCancel={() => setEditingTemplate(null)}
          isSubmitting={updateMutation.isPending}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="rounded-xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${template.color}20`, border: `1px solid ${template.color}40` }}
                >
                  {template.emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">{template.role}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                template.tier === 3 ? "bg-purple-500/10 text-purple-500" :
                template.tier === 2 ? "bg-blue-500/10 text-blue-500" :
                "bg-green-500/10 text-green-500"
              }`}>
                Tier {template.tier}
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>

            {template.capabilities && (
              <div className="text-[11px] text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground mb-1">{t("Capacités")}</p>
                <p className="line-clamp-3">{template.capabilities}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className={`px-1.5 py-0.5 rounded ${template.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                {template.isActive ? t("Actif") : t("Inactif")}
              </span>
              {template.isPremium && (
                <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500">{t("Premium")}</span>
              )}
              {template.price > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500">{template.price} FCFA</span>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent"
                onClick={() => setEditingTemplate(template)}
              >
                {t("Modifier")}
              </button>
              <button
                type="button"
                className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium"
                onClick={() => handleHire(template.id)}
                disabled={hireMutation.isPending}
              >
                {t("Recruter")}
              </button>
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10"
                onClick={() => handleDelete(template.id, template.name)}
                disabled={deleteMutation.isPending}
              >
                {t("Supprimer")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>{t("Aucun template trouvé")}</p>
        </div>
      )}
    </div>
  );
}

function TemplateForm({
  template,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  template?: AgentTemplate;
  onSubmit: (data: CreateTemplateInput | UpdateTemplateInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const { t } = useLanguage();
  const [name, setName] = useState(template?.name ?? "");
  const [role, setRole] = useState(template?.role ?? "");
  const [emoji, setEmoji] = useState(template?.emoji ?? "🤖");
  const [color, setColor] = useState(template?.color ?? "#0071E3");
  const [category, setCategory] = useState(template?.category ?? "tech");
  const [tier, setTier] = useState(template?.tier ?? 1);
  const [description, setDescription] = useState(template?.description ?? "");
  const [systemPrompt, setSystemPrompt] = useState(template?.systemPrompt ?? "");
  const [price, setPrice] = useState(template?.price ?? 0);
  const [isPremium, setIsPremium] = useState(template?.isPremium ?? false);
  const [isActive, setIsActive] = useState(template?.isActive ?? true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, role, emoji, color, category, tier, description, systemPrompt, price, isPremium, isActive });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4">
      <h3 className="font-semibold">
        {template ? t("Modifier le template") : t("Nouveau template")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tpl-name" className="block text-xs font-medium mb-1">{t("Nom")}</label>
          <input id="tpl-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
        </div>
        <div>
          <label htmlFor="tpl-role" className="block text-xs font-medium mb-1">{t("Rôle")}</label>
          <input id="tpl-role" type="text" value={role} onChange={(e) => setRole(e.target.value)} required
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
        </div>
        <div>
          <label htmlFor="tpl-emoji" className="block text-xs font-medium mb-1">{t("Emoji")}</label>
          <input id="tpl-emoji" type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
        </div>
        <div>
          <label htmlFor="tpl-color" className="block text-xs font-medium mb-1">{t("Couleur")}</label>
          <input id="tpl-color" type="color" value={color} onChange={(e) => setColor(e.target.value)}
            className="w-full h-9 rounded-lg border border-border bg-background" />
        </div>
        <div>
          <label htmlFor="tpl-category" className="block text-xs font-medium mb-1">{t("Catégorie")}</label>
          <select id="tpl-category" value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
            {AGENT_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tpl-tier" className="block text-xs font-medium mb-1">{t("Tier")}</label>
          <select id="tpl-tier" value={tier} onChange={(e) => setTier(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
            <option value={1}>{t("Standard")}</option>
            <option value={2}>{t("Avancé")}</option>
            <option value={3}>{t("Expert")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="tpl-price" className="block text-xs font-medium mb-1">{t("Prix (FCFA)")}</label>
          <input id="tpl-price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} min={0}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
        </div>
        <div className="flex items-center gap-4 pt-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
            {t("Premium")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            {t("Actif")}
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="tpl-desc" className="block text-xs font-medium mb-1">{t("Description")}</label>
        <textarea id="tpl-desc" value={description} onChange={(e) => setDescription(e.target.value)} required rows={2}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
      </div>

      <div>
        <label htmlFor="tpl-prompt" className="block text-xs font-medium mb-1">{t("System Prompt")}</label>
        <textarea id="tpl-prompt" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} required rows={6}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono" />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-border text-sm">
          {t("Annuler")}
        </button>
        <button type="submit" disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
          {isSubmitting ? t("Sauvegarde...") : (template ? t("Mettre à jour") : t("Créer"))}
        </button>
      </div>
    </form>
  );
}
