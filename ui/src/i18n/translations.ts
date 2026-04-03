// Baaraly i18n — traductions FR / EN
// Clé = texte anglais de référence, valeur = traduction

export type Language = "fr" | "en";

export const translations: Record<string, Record<Language, string>> = {
  // ── Navigation & breadcrumbs ─────────────────────────────────────────────
  "Dashboard": { fr: "Tableau de bord", en: "Dashboard" },
  "Agents": { fr: "Agents", en: "Agents" },
  "Issues": { fr: "Tâches", en: "Issues" },
  "Inbox": { fr: "Messages", en: "Inbox" },
  "Projects": { fr: "Projets", en: "Projects" },
  "Goals": { fr: "Objectifs", en: "Goals" },
  "Activity": { fr: "Activité", en: "Activity" },
  "Costs": { fr: "Coûts", en: "Costs" },
  "Routines": { fr: "Routines", en: "Routines" },
  "Settings": { fr: "Paramètres", en: "Settings" },
  "Not Found": { fr: "Page introuvable", en: "Not Found" },
  "Company": { fr: "Entreprise", en: "Company" },
  "My Issues": { fr: "Mes tâches", en: "My Issues" },
  "Org Chart": { fr: "Organigramme", en: "Org Chart" },
  "New Agent": { fr: "Nouvel agent", en: "New Agent" },
  "Approvals": { fr: "Approbations", en: "Approvals" },

  // ── Auth ─────────────────────────────────────────────────────────────────
  "Sign in to Baaraly": { fr: "Connexion à Baaraly", en: "Sign in to Baaraly" },
  "Create your Baaraly account": { fr: "Créer votre compte Baaraly", en: "Create your Baaraly account" },
  "Use your email and password to access this instance.": {
    fr: "Utilisez votre email et mot de passe pour accéder à cette instance.",
    en: "Use your email and password to access this instance."
  },
  "Create an account for this instance. Email confirmation is not required in v1.": {
    fr: "Créez un compte pour cette instance. La confirmation par email n'est pas requise en v1.",
    en: "Create an account for this instance. Email confirmation is not required in v1."
  },
  "Name": { fr: "Nom", en: "Name" },
  "Email": { fr: "Adresse email", en: "Email" },
  "Password": { fr: "Mot de passe", en: "Password" },
  "Loading…": { fr: "Chargement…", en: "Loading…" },
  "Loading...": { fr: "Chargement...", en: "Loading..." },
  "Please fill in all required fields.": { fr: "Veuillez remplir tous les champs obligatoires.", en: "Please fill in all required fields." },
  "Working…": { fr: "En cours…", en: "Working…" },
  "Sign In": { fr: "Se connecter", en: "Sign In" },
  "Create Account": { fr: "Créer un compte", en: "Create Account" },
  "Need an account?": { fr: "Pas encore de compte ?", en: "Need an account?" },
  "Already have an account?": { fr: "Déjà un compte ?", en: "Already have an account?" },
  "Create one": { fr: "En créer un", en: "Create one" },
  "Sign in": { fr: "Se connecter", en: "Sign in" },
  "Authentication failed": { fr: "Échec de l'authentification", en: "Authentication failed" },

  // ── Dashboard ────────────────────────────────────────────────────────────
  "Welcome to Baaraly. Set up your first company and agent to get started.": {
    fr: "Bienvenue sur Baaraly. Créez votre première entreprise et votre premier agent pour commencer.",
    en: "Welcome to Baaraly. Set up your first company and agent to get started."
  },
  "Create or select a company to view the dashboard.": {
    fr: "Créez ou sélectionnez une entreprise pour afficher le tableau de bord.",
    en: "Create or select a company to view the dashboard."
  },
  "Get Started": { fr: "Commencer", en: "Get Started" },
  "You have no agents.": { fr: "Vous n'avez aucun agent.", en: "You have no agents." },
  "Create one here": { fr: "En créer un ici", en: "Create one here" },
  "Open budgets": { fr: "Voir les budgets", en: "Open budgets" },
  "Agents Enabled": { fr: "Agents actifs", en: "Agents Enabled" },
  "Tasks In Progress": { fr: "Tâches en cours", en: "Tasks In Progress" },
  "Month Spend": { fr: "Dépenses du mois", en: "Month Spend" },
  "Pending Approvals": { fr: "Approbations en attente", en: "Pending Approvals" },
  "Run Activity": { fr: "Activité des exécutions", en: "Run Activity" },
  "Last 14 days": { fr: "14 derniers jours", en: "Last 14 days" },
  "Issues by Priority": { fr: "Tâches par priorité", en: "Issues by Priority" },
  "Issues by Status": { fr: "Tâches par statut", en: "Issues by Status" },
  "Success Rate": { fr: "Taux de réussite", en: "Success Rate" },
  "Recent Activity": { fr: "Activité récente", en: "Recent Activity" },
  "Recent Tasks": { fr: "Tâches récentes", en: "Recent Tasks" },
  "No tasks yet.": { fr: "Aucune tâche pour l'instant.", en: "No tasks yet." },
  "running": { fr: "en cours", en: "running" },
  "paused": { fr: "en pause", en: "paused" },
  "errors": { fr: "erreurs", en: "errors" },
  "Unlimited budget": { fr: "Budget illimité", en: "Unlimited budget" },
  "Awaiting board review": { fr: "En attente de validation", en: "Awaiting board review" },
  "budget overrides awaiting board review": {
    fr: "dérogations de budget en attente de validation",
    en: "budget overrides awaiting board review"
  },

  // ── Agents ───────────────────────────────────────────────────────────────
  "Select a company to view agents.": {
    fr: "Sélectionnez une entreprise pour voir les agents.",
    en: "Select a company to view agents."
  },
  "All": { fr: "Tous", en: "All" },
  "Active": { fr: "Actifs", en: "Active" },
  "En pause": { fr: "En pause", en: "Paused" },
  "Error": { fr: "Erreur", en: "Error" },
  "Filters": { fr: "Filtres", en: "Filters" },
  "Show terminated": { fr: "Afficher les terminés", en: "Show terminated" },
  "Create your first agent to get started.": {
    fr: "Créez votre premier agent pour commencer.",
    en: "Create your first agent to get started."
  },
  "No agents match the selected filter.": {
    fr: "Aucun agent ne correspond au filtre sélectionné.",
    en: "No agents match the selected filter."
  },
  "No organizational hierarchy defined.": {
    fr: "Aucune hiérarchie organisationnelle définie.",
    en: "No organizational hierarchy defined."
  },
  "Live": { fr: "En direct", en: "Live" },

  // ── NotFound ─────────────────────────────────────────────────────────────
  "Company not found": { fr: "Entreprise introuvable", en: "Company not found" },
  "Page not found": { fr: "Page introuvable", en: "Page not found" },
  "This route does not exist.": { fr: "Cette page n'existe pas.", en: "This route does not exist." },
  "Requested path:": { fr: "Chemin demandé :", en: "Requested path:" },
  "Open dashboard": { fr: "Aller au tableau de bord", en: "Open dashboard" },
  "Go home": { fr: "Accueil", en: "Go home" },

  // ── Issues ───────────────────────────────────────────────────────────────
  "Select a company to view issues.": {
    fr: "Sélectionnez une entreprise pour voir les tâches.",
    en: "Select a company to view issues."
  },
  "No issues assigned to you.": {
    fr: "Aucune tâche assignée à vous.",
    en: "No issues assigned to you."
  },

  // ── Inbox ────────────────────────────────────────────────────────────────
  "Select a company to view inbox.": {
    fr: "Sélectionnez une entreprise pour voir vos messages.",
    en: "Select a company to view inbox."
  },
  "Run exited with an error.": {
    fr: "L'exécution s'est terminée avec une erreur.",
    en: "Run exited with an error."
  },

  // ── Costs ────────────────────────────────────────────────────────────────
  "Select a company to view costs.": {
    fr: "Sélectionnez une entreprise pour voir les coûts.",
    en: "Select a company to view costs."
  },

  // ── Routines ─────────────────────────────────────────────────────────────
  "Select a company to view routines.": {
    fr: "Sélectionnez une entreprise pour voir les routines.",
    en: "Select a company to view routines."
  },
  "No routines yet. Use Create routine to define the first recurring workflow.": {
    fr: "Aucune routine pour l'instant. Créez une routine pour définir le premier flux de travail récurrent.",
    en: "No routines yet. Use Create routine to define the first recurring workflow."
  },
  "Routine title": { fr: "Titre de la routine", en: "Routine title" },
  "Assignee": { fr: "Responsable", en: "Assignee" },
  "Project": { fr: "Projet", en: "Project" },
  "Add instructions...": { fr: "Ajouter des instructions...", en: "Add instructions..." },
  "Never": { fr: "Jamais", en: "Never" },
  "Create routine": { fr: "Créer une routine", en: "Create routine" },
  "Create Routine": { fr: "Créer une routine", en: "Create Routine" },
  "Advanced": { fr: "Avancé", en: "Advanced" },
  "Concurrency policy": { fr: "Politique de concurrence", en: "Concurrency policy" },
  "Catch-up policy": { fr: "Politique de rattrapage", en: "Catch-up policy" },
  "Cancel": { fr: "Annuler", en: "Cancel" },
  "Save": { fr: "Sauvegarder", en: "Save" },
  "Saving...": { fr: "Sauvegarde...", en: "Saving..." },

  // ── Projects ─────────────────────────────────────────────────────────────
  "Select a company to view projects.": {
    fr: "Sélectionnez une entreprise pour voir les projets.",
    en: "Select a company to view projects."
  },
  "No projects yet.": { fr: "Aucun projet pour l'instant.", en: "No projects yet." },

  // ── Goals ────────────────────────────────────────────────────────────────
  "Select a company to view goals.": {
    fr: "Sélectionnez une entreprise pour voir les objectifs.",
    en: "Select a company to view goals."
  },
  "No goals yet.": { fr: "Aucun objectif pour l'instant.", en: "No goals yet." },
  "New Goal": { fr: "Nouvel objectif", en: "New Goal" },

  // ── Activity ─────────────────────────────────────────────────────────────
  "Select a company to view activity.": {
    fr: "Sélectionnez une entreprise pour voir l'activité.",
    en: "Select a company to view activity."
  },
  "No activity yet.": { fr: "Aucune activité pour l'instant.", en: "No activity yet." },

  // ── MyIssues ─────────────────────────────────────────────────────────────
  "Select a company to view your issues.": {
    fr: "Sélectionnez une entreprise pour voir vos tâches.",
    en: "Select a company to view your issues."
  },

  // ── Org ──────────────────────────────────────────────────────────────────
  "Select a company to view org chart.": {
    fr: "Sélectionnez une entreprise pour voir l'organigramme.",
    en: "Select a company to view org chart."
  },
  "Select a company to view the org chart.": {
    fr: "Sélectionnez une entreprise pour voir l'organigramme.",
    en: "Select a company to view the org chart."
  },
  "No agents in the organization. Create agents to build your org chart.": {
    fr: "Aucun agent dans l'organisation. Créez des agents pour construire votre organigramme.",
    en: "No agents in the organization. Create agents to build your org chart."
  },

  // ── CompanySettings ──────────────────────────────────────────────────────
  "No company selected. Select a company from the switcher above.": {
    fr: "Aucune entreprise sélectionnée. Choisissez une entreprise dans le sélecteur ci-dessus.",
    en: "No company selected. Select a company from the switcher above."
  },
  "Company Settings": { fr: "Paramètres de l'entreprise", en: "Company Settings" },
  "General": { fr: "Général", en: "General" },
  "Appearance": { fr: "Apparence", en: "Appearance" },
  "Hiring": { fr: "Recrutement", en: "Hiring" },
  "Invites": { fr: "Invitations", en: "Invites" },
  "Company Packages": { fr: "Paquets d'entreprise", en: "Company Packages" },
  "Danger Zone": { fr: "Zone dangereuse", en: "Danger Zone" },
  "The display name for your company.": {
    fr: "Le nom affiché pour votre entreprise.",
    en: "The display name for your company."
  },
  "Optional description shown in the company profile.": {
    fr: "Description optionnelle affichée dans le profil de l'entreprise.",
    en: "Optional description shown in the company profile."
  },
  "Optional company description": {
    fr: "Description optionnelle de l'entreprise",
    en: "Optional company description"
  },
  "Logo": { fr: "Logo", en: "Logo" },
  "Upload a PNG, JPEG, WEBP, GIF, or SVG logo image.": {
    fr: "Importez un logo PNG, JPEG, WEBP, GIF ou SVG.",
    en: "Upload a PNG, JPEG, WEBP, GIF, or SVG logo image."
  },
  "Removing...": { fr: "Suppression...", en: "Removing..." },
  "Remove logo": { fr: "Supprimer le logo", en: "Remove logo" },
  "Logo upload failed": { fr: "Échec du téléchargement du logo", en: "Logo upload failed" },
  "Uploading logo...": { fr: "Téléchargement du logo...", en: "Uploading logo..." },
  "Brand color": { fr: "Couleur de marque", en: "Brand color" },
  "Sets the hue for the company icon. Leave empty for auto-generated color.": {
    fr: "Définit la teinte de l'icône de l'entreprise. Laissez vide pour une couleur automatique.",
    en: "Sets the hue for the company icon. Leave empty for auto-generated color."
  },
  "Auto": { fr: "Auto", en: "Auto" },
  "Clear": { fr: "Effacer", en: "Clear" },
  "Saved": { fr: "Sauvegardé", en: "Saved" },
  "Failed to save": { fr: "Échec de la sauvegarde", en: "Failed to save" },
  "Require board approval for new hires": {
    fr: "Approbation du conseil requise pour les nouveaux recrutements",
    en: "Require board approval for new hires"
  },
  "New agent hires stay pending until approved by board.": {
    fr: "Les nouveaux agents restent en attente jusqu'à l'approbation du conseil.",
    en: "New agent hires stay pending until approved by board."
  },
  "Generate an OpenClaw agent invite snippet.": {
    fr: "Générer un snippet d'invitation pour un agent OpenClaw.",
    en: "Generate an OpenClaw agent invite snippet."
  },
  "Generating...": { fr: "Génération...", en: "Generating..." },
  "Generate OpenClaw Invite Prompt": {
    fr: "Générer le prompt d'invitation OpenClaw",
    en: "Generate OpenClaw Invite Prompt"
  },
  "Failed to create invite": { fr: "Échec de la création de l'invitation", en: "Failed to create invite" },
  "OpenClaw Invite Prompt": { fr: "Prompt d'invitation OpenClaw", en: "OpenClaw Invite Prompt" },
  "Copied": { fr: "Copié", en: "Copied" },
  "Copied snippet": { fr: "Snippet copié", en: "Copied snippet" },
  "Copy snippet": { fr: "Copier le snippet", en: "Copy snippet" },
  "Import and export have moved to dedicated pages accessible from the": {
    fr: "L'import et l'export ont été déplacés vers des pages dédiées accessibles depuis le",
    en: "Import and export have moved to dedicated pages accessible from the"
  },
  "header.": { fr: "en-tête.", en: "header." },
  "Export": { fr: "Exporter", en: "Export" },
  "Import": { fr: "Importer", en: "Import" },
  "Archive this company to hide it from the sidebar. This persists in the database.": {
    fr: "Archivez cette entreprise pour la masquer dans la barre latérale. Cette action est persistante.",
    en: "Archive this company to hide it from the sidebar. This persists in the database."
  },
  "Archiving...": { fr: "Archivage...", en: "Archiving..." },
  "Already archived": { fr: "Déjà archivée", en: "Already archived" },
  "Archive company": { fr: "Archiver l'entreprise", en: "Archive company" },
  "Failed to archive company": {
    fr: "Échec de l'archivage de l'entreprise",
    en: "Failed to archive company"
  },

  // ── App.tsx system strings ────────────────────────────────────────────────
  "Instance setup required": { fr: "Configuration requise", en: "Instance setup required" },
  "No instance admin exists yet. A bootstrap invite is already active. Check your Baaraly startup logs for the first admin invite URL, or run this command to rotate it:": {
    fr: "Aucun administrateur n'existe encore. Une invitation de bootstrap est déjà active. Consultez les logs de démarrage de Baaraly pour l'URL d'invitation du premier administrateur, ou exécutez cette commande pour la renouveler :",
    en: "No instance admin exists yet. A bootstrap invite is already active. Check your Baaraly startup logs for the first admin invite URL, or run this command to rotate it:"
  },
  "No instance admin exists yet. Run this command in your Baaraly environment to generate the first admin invite URL:": {
    fr: "Aucun administrateur n'existe encore. Exécutez cette commande dans votre environnement Baaraly pour générer l'URL d'invitation du premier administrateur :",
    en: "No instance admin exists yet. Run this command in your Baaraly environment to generate the first admin invite URL:"
  },
  "Failed to load app state": { fr: "Échec du chargement de l'application", en: "Failed to load app state" },
  "Create your first company": { fr: "Créer votre première entreprise", en: "Create your first company" },
  "Get started by creating a company.": {
    fr: "Commencez par créer une entreprise.",
    en: "Get started by creating a company."
  },
  "New Company": { fr: "Nouvelle entreprise", en: "New Company" },
  "Add another agent to": { fr: "Ajouter un autre agent à", en: "Add another agent to" },
  "Create another company": { fr: "Créer une autre entreprise", en: "Create another company" },
  "Run onboarding again to add an agent and a starter task for this company.": {
    fr: "Relancez l'onboarding pour ajouter un agent et une tâche de démarrage pour cette entreprise.",
    en: "Run onboarding again to add an agent and a starter task for this company."
  },
  "Run onboarding again to create another company and seed its first agent.": {
    fr: "Relancez l'onboarding pour créer une autre entreprise et configurer son premier agent.",
    en: "Run onboarding again to create another company and seed its first agent."
  },
  "Get started by creating a company and your first agent.": {
    fr: "Commencez par créer une entreprise et votre premier agent.",
    en: "Get started by creating a company and your first agent."
  },
  "Add Agent": { fr: "Ajouter un agent", en: "Add Agent" },
  "Start Onboarding": { fr: "Démarrer l'onboarding", en: "Start Onboarding" },

  // ── NewAgent ─────────────────────────────────────────────────────────────
  "Company skills": { fr: "Compétences de l'entreprise", en: "Company skills" },
  "This will be the CEO": { fr: "Ce sera le PDG", en: "This will be the CEO" },

  // ── InstanceSettings ─────────────────────────────────────────────────────
  "No scheduler heartbeats match the current criteria.": {
    fr: "Aucun heartbeat de planificateur ne correspond aux critères actuels.",
    en: "No scheduler heartbeats match the current criteria."
  },
  "Select a company to manage skills.": {
    fr: "Sélectionnez une entreprise pour gérer les compétences.",
    en: "Select a company to manage skills."
  },
  "Select a company to view this page.": {
    fr: "Sélectionnez une entreprise pour voir cette page.",
    en: "Select a company to view this page."
  },

  // ── Status labels ─────────────────────────────────────────────────────────
  "backlog": { fr: "À planifier", en: "Backlog" },
  "todo": { fr: "À faire", en: "Todo" },
  "in_progress": { fr: "En cours", en: "In progress" },
  "in_review": { fr: "En révision", en: "In review" },
  "blocked": { fr: "Bloqué", en: "Blocked" },
  "done": { fr: "Terminé", en: "Done" },
  "Backlog": { fr: "À planifier", en: "Backlog" },
  "Todo": { fr: "À faire", en: "Todo" },
  "In Progress": { fr: "En cours", en: "In Progress" },
  "In Review": { fr: "En révision", en: "In Review" },
  "Blocked": { fr: "Bloqué", en: "Blocked" },
  "Done": { fr: "Terminé", en: "Done" },
  "Cancelled": { fr: "Annulé", en: "Cancelled" },

  // ── Generic actions ────────────────────────────────────────────────────────
  "Close": { fr: "Fermer", en: "Close" },
  "Open": { fr: "Ouvrir", en: "Open" },
  "Add": { fr: "Ajouter", en: "Add" },
  "Remove": { fr: "Retirer", en: "Remove" },
  "Update": { fr: "Mettre à jour", en: "Update" },
  "View": { fr: "Voir", en: "View" },
  "Download": { fr: "Télécharger", en: "Download" },
  "Upload": { fr: "Importer", en: "Upload" },
  "Share": { fr: "Partager", en: "Share" },
  "Copy": { fr: "Copier", en: "Copy" },
  "Retry": { fr: "Réessayer", en: "Retry" },
  "Refresh": { fr: "Actualiser", en: "Refresh" },
  "Search...": { fr: "Rechercher...", en: "Search..." },
  "No results found": { fr: "Aucun résultat trouvé", en: "No results found" },
  "Submit": { fr: "Envoyer", en: "Submit" },
  "Delete": { fr: "Supprimer", en: "Delete" },
  "Edit": { fr: "Modifier", en: "Edit" },
  "Create": { fr: "Créer", en: "Create" },
  "Confirm": { fr: "Confirmer", en: "Confirm" },
  "Back": { fr: "Retour", en: "Back" },
  "Next": { fr: "Suivant", en: "Next" },
  "Previous": { fr: "Précédent", en: "Previous" },
  "Finish": { fr: "Terminer", en: "Finish" },
  "Skip": { fr: "Passer", en: "Skip" },

  // ── Generic status ─────────────────────────────────────────────────────────
  "Inactive": { fr: "Inactif", en: "Inactive" },
  "Disabled": { fr: "Désactivé", en: "Disabled" },
  "Pending": { fr: "En attente", en: "Pending" },
  "Draft": { fr: "Brouillon", en: "Draft" },
  "Published": { fr: "Publié", en: "Published" },

  // ── Time ──────────────────────────────────────────────────────────────────
  "Today": { fr: "Aujourd'hui", en: "Today" },
  "Yesterday": { fr: "Hier", en: "Yesterday" },
  "This week": { fr: "Cette semaine", en: "This week" },
  "This month": { fr: "Ce mois", en: "This month" },
  "All time": { fr: "Depuis toujours", en: "All time" },

  // ── Language toggle ────────────────────────────────────────────────────────
  "Langue / Language": { fr: "Langue / Language", en: "Langue / Language" },
  "Choisir la langue de l'interface": {
    fr: "Choisir la langue de l'interface",
    en: "Choose interface language"
  },

  // ── Sidebar ─────────────────────────────────────────────────────────────────
  "Select company": { fr: "Sélectionner une entreprise", en: "Select company" },
  "New task": { fr: "Nouvelle tâche", en: "New task" },
  "Work": { fr: "Travail", en: "Work" },
  "Organization": { fr: "Organisation", en: "Organization" },
  "Skills": { fr: "Compétences", en: "Skills" },
  "Expand sidebar": { fr: "Étendre la barre latérale", en: "Expand sidebar" },
  "Collapse sidebar": { fr: "Réduire la barre latérale", en: "Collapse sidebar" },
  "Expand": { fr: "Étendre", en: "Expand" },
  "Collapse": { fr: "Réduire", en: "Collapse" },

  // ── MobileBottomNav ─────────────────────────────────────────────────────────
  "Home": { fr: "Accueil", en: "Home" },
  "Messages": { fr: "Messages", en: "Messages" },
  "Tasks": { fr: "Tâches", en: "Tasks" },
  "Mobile navigation": { fr: "Navigation mobile", en: "Mobile navigation" },

  // ── Layout ──────────────────────────────────────────────────────────────────
  "Documentation": { fr: "Documentation", en: "Documentation" },
  "Skip to Main Content": { fr: "Aller au contenu principal", en: "Skip to Main Content" },
  "Instance settings": { fr: "Paramètres de l'instance", en: "Instance settings" },
  "Switch to light mode": { fr: "Passer en mode clair", en: "Switch to light mode" },
  "Switch to dark mode": { fr: "Passer en mode sombre", en: "Switch to dark mode" },
  "Close sidebar": { fr: "Fermer la barre latérale", en: "Close sidebar" },

  // ── Activity page ───────────────────────────────────────────────────────────
  "Filter by type": { fr: "Filtrer par type", en: "Filter by type" },
  "All types": { fr: "Tous les types", en: "All types" },

  // ── Agents — LiveRunIndicator ───────────────────────────────────────────────

  // ── NotFound ────────────────────────────────────────────────────────────────
  "No company matches the prefix": { fr: "Aucune entreprise ne correspond au préfixe", en: "No company matches the prefix" },
  "unknown": { fr: "inconnu", en: "unknown" },

  // ── InstanceGeneralSettings ─────────────────────────────────────────────────
  "Instance Settings": { fr: "Paramètres de l'instance", en: "Instance Settings" },
  "Configure instance-wide defaults that affect how operator-visible logs are displayed.": {
    fr: "Configurez les paramètres globaux de l'instance qui affectent l'affichage des journaux opérateur.",
    en: "Configure instance-wide defaults that affect how operator-visible logs are displayed."
  },
  "Censor username in logs": { fr: "Masquer le nom d'utilisateur dans les journaux", en: "Censor username in logs" },
  "Hide the username segment in home-directory paths and similar operator-visible log output. Standalone username mentions outside of paths are not yet masked in the live transcript view. This is off by default.": {
    fr: "Masque le segment du nom d'utilisateur dans les chemins de répertoire personnel et les journaux opérateur similaires. Les mentions isolées du nom d'utilisateur en dehors des chemins ne sont pas encore masquées dans la vue de transcription en direct. Désactivé par défaut.",
    en: "Hide the username segment in home-directory paths and similar operator-visible log output. Standalone username mentions outside of paths are not yet masked in the live transcript view. This is off by default."
  },
  "Loading general settings...": { fr: "Chargement des paramètres généraux...", en: "Loading general settings..." },
  "Failed to load general settings.": { fr: "Échec du chargement des paramètres généraux.", en: "Failed to load general settings." },
  "Failed to update general settings.": { fr: "Échec de la mise à jour des paramètres généraux.", en: "Failed to update general settings." },

  // ── Routines — hardcoded strings ────────────────────────────────────────────
  "Recurring work definitions that materialize into auditable execution tasks.": {
    fr: "Définitions de travaux récurrents qui se matérialisent en tâches d'exécution auditables.",
    en: "Recurring work definitions that materialize into auditable execution tasks."
  },
  "New routine": { fr: "Nouvelle routine", en: "New routine" },
  "Define the recurring work first. Trigger configuration comes next on the detail page.": {
    fr: "Définissez d'abord le travail récurrent. La configuration des déclencheurs vient ensuite sur la page de détail.",
    en: "Define the recurring work first. Trigger configuration comes next on the detail page."
  },
  "For": { fr: "Pour", en: "For" },
  "No assignee": { fr: "Sans responsable", en: "No assignee" },
  "Search assignee...": { fr: "Rechercher un responsable...", en: "Search assignee..." },
  "No assignee found.": { fr: "Aucun responsable trouvé.", en: "No assignee found." },
  "in project": { fr: "dans le projet", en: "in project" },
  "No project": { fr: "Sans projet", en: "No project" },
  "Search project...": { fr: "Rechercher un projet...", en: "Search project..." },
  "No project found.": { fr: "Aucun projet trouvé.", en: "No project found." },
  "Routine created": { fr: "Routine créée", en: "Routine created" },
  "Add the first trigger to turn it into a live workflow.": {
    fr: "Ajoutez le premier déclencheur pour en faire un flux de travail actif.",
    en: "Add the first trigger to turn it into a live workflow."
  },
  "Failed to update routine": { fr: "Échec de la mise à jour de la routine", en: "Failed to update routine" },
  "Routine run failed": { fr: "Échec de l'exécution de la routine", en: "Routine run failed" },
  "After creation, Baaraly takes you directly to the trigger configuration.": {
    fr: "Après création, Baaraly vous amène directement à la configuration des déclencheurs.",
    en: "After creation, Baaraly takes you directly to the trigger configuration."
  },
  "Creating...": { fr: "Création...", en: "Creating..." },
  "Failed to create routine": { fr: "Échec de la création de la routine", en: "Failed to create routine" },
  "Failed to load routines": { fr: "Échec du chargement des routines", en: "Failed to load routines" },
  "Last run": { fr: "Dernière exécution", en: "Last run" },
  "Paused": { fr: "En pause", en: "Paused" },
  "Yes": { fr: "Oui", en: "Yes" },
  "No": { fr: "Non", en: "No" },
  "Running...": { fr: "En cours...", en: "Running..." },
  "Run now": { fr: "Exécuter maintenant", en: "Run now" },
  "Pause": { fr: "Mettre en pause", en: "Pause" },
  "Activate": { fr: "Activer", en: "Activate" },
  "Advanced delivery settings": { fr: "Paramètres avancés de livraison", en: "Advanced delivery settings" },
  "Keep policy controls secondary to the work definition.": {
    fr: "Gardez les contrôles de politique secondaires par rapport à la définition du travail.",
    en: "Keep policy controls secondary to the work definition."
  },
  "Concurrency": { fr: "Concurrence", en: "Concurrency" },
  "Catch-up": { fr: "Rattrapage", en: "Catch-up" },
  "Unknown": { fr: "Inconnu", en: "Unknown" },

  // ── CompanySettings — hardcoded strings ─────────────────────────────────────
  "Company name": { fr: "Nom de l'entreprise", en: "Company name" },
  "Description": { fr: "Description", en: "Description" },
  "Saving changes...": { fr: "Sauvegarde en cours...", en: "Saving changes..." },
  "Save changes": { fr: "Sauvegarder les modifications", en: "Save changes" },
  "Import and export have moved to dedicated pages accessible from the Org Chart header.": {
    fr: "L'import et l'export ont été déplacés vers des pages dédiées accessibles depuis l'en-tête de l'organigramme.",
    en: "Import and export have moved to dedicated pages accessible from the Org Chart header."
  },

  // ── Phase 4B — Credits & Monetization ─────────────────────────────────────
  "Credits": { fr: "Crédits", en: "Credits" },
  "Credits exhausted": { fr: "Crédits épuisés", en: "Credits exhausted" },
  "Running low": { fr: "Bientôt épuisé", en: "Running low" },
  "credits remaining": { fr: "crédits restants", en: "credits remaining" },
  "Credits exhausted — Recharge to continue": {
    fr: "Crédits épuisés — Rechargez pour continuer",
    en: "Credits exhausted — Recharge to continue"
  },
  "Recharge": { fr: "Recharger", en: "Recharge" },
  "Recharge my credits": { fr: "Recharger mes crédits", en: "Recharge my credits" },
  "Choose a pack and payment method": {
    fr: "Choisissez un pack et un moyen de paiement",
    en: "Choose a pack and payment method"
  },
  "credits": { fr: "crédits", en: "credits" },
  "Payment method": { fr: "Moyen de paiement", en: "Payment method" },
  "Secure payment": { fr: "Paiement sécurisé", en: "Secure payment" },
  "Processing...": { fr: "Traitement en cours...", en: "Processing..." },
  "Confirm payment": { fr: "Confirmer le paiement", en: "Confirm payment" },
  "Payment failed. Please try again.": {
    fr: "Le paiement a échoué. Veuillez réessayer.",
    en: "Payment failed. Please try again."
  },
  "Recharge successful!": { fr: "Recharge réussie !", en: "Recharge successful!" },

  // ── Phase 4B — Template Gallery ───────────────────────────────────────────
  "Choose your first agent": { fr: "Choisissez votre premier agent", en: "Choose your first agent" },
  "Each agent is specialized for your activity.": {
    fr: "Chaque agent est spécialisé pour votre activité.",
    en: "Each agent is specialized for your activity."
  },
  "Recruit": { fr: "Recruter", en: "Recruit" },
  "Recruiting...": { fr: "Recrutement...", en: "Recruiting..." },
  "Failed to recruit agent. Please try again.": {
    fr: "Échec du recrutement. Veuillez réessayer.",
    en: "Failed to recruit agent. Please try again."
  },
  "Templates": { fr: "Modèles", en: "Templates" },

  // ── Costs page ──────────────────────────────────────────────────────────
  "Inference spend, platform fees, credits, and live quota windows.": {
    fr: "Dépenses d'inférence, frais de plateforme, crédits et quotas en temps réel.",
    en: "Inference spend, platform fees, credits, and live quota windows."
  },
  "Month to Date": { fr: "Mois en cours", en: "Month to Date" },
  "Last 7 Days": { fr: "7 derniers jours", en: "Last 7 Days" },
  "Last 30 Days": { fr: "30 derniers jours", en: "Last 30 Days" },
  "Year to Date": { fr: "Année en cours", en: "Year to Date" },
  "All Time": { fr: "Tout le temps", en: "All Time" },
  "Custom": { fr: "Personnalisé", en: "Custom" },
  "to": { fr: "au", en: "to" },
  "Inference spend": { fr: "Dépenses d'inférence", en: "Inference spend" },
  "tokens across request-scoped events": {
    fr: "tokens sur les événements de requête",
    en: "tokens across request-scoped events"
  },
  "Budget": { fr: "Budget", en: "Budget" },
  "No monthly cap configured": { fr: "Aucun plafond mensuel configuré", en: "No monthly cap configured" },
  "agents paused": { fr: "agents en pause", en: "agents paused" },
  "projects paused": { fr: "projets en pause", en: "projects paused" },
  "Finance net": { fr: "Finance net", en: "Finance net" },
  "debits": { fr: "débits", en: "debits" },
  "Finance events": { fr: "Événements financiers", en: "Finance events" },
  "estimated in range": { fr: "estimé dans la période", en: "estimated in range" },
  "Overview": { fr: "Vue d'ensemble", en: "Overview" },
  "Budgets": { fr: "Budgets", en: "Budgets" },
  "Providers": { fr: "Fournisseurs", en: "Providers" },
  "Billers": { fr: "Facturiers", en: "Billers" },
  "Finance": { fr: "Finance", en: "Finance" },
  "Select a start and end date to load data.": {
    fr: "Sélectionnez une date de début et de fin pour charger les données.",
    en: "Select a start and end date to load data."
  },
  "Finance ledger": { fr: "Grand livre financier", en: "Finance ledger" },
  "Account-level charges that do not map to a single inference request.": {
    fr: "Charges au niveau du compte qui ne correspondent pas à une seule requête d'inférence.",
    en: "Account-level charges that do not map to a single inference request."
  },
  "Debits": { fr: "Débits", en: "Debits" },
  "Refunds, offsets, and credit returns": {
    fr: "Remboursements, compensations et retours de crédits",
    en: "Refunds, offsets, and credit returns"
  },
  "Net": { fr: "Net", en: "Net" },
  "Debit minus credit for the selected period": {
    fr: "Débit moins crédit pour la période sélectionnée",
    en: "Debit minus credit for the selected period"
  },
  "Estimated": { fr: "Estimé", en: "Estimated" },
  "Estimated debits that are not yet invoice-authoritative": {
    fr: "Débits estimés non encore validés par facture",
    en: "Estimated debits that are not yet invoice-authoritative"
  },
  "Inference ledger": { fr: "Grand livre d'inférence", en: "Inference ledger" },
  "Request-scoped inference spend for the selected period.": {
    fr: "Dépenses d'inférence par requête pour la période sélectionnée.",
    en: "Request-scoped inference spend for the selected period."
  },
  "usage": { fr: "utilisation", en: "usage" },
  "% of monthly budget consumed in this range.": {
    fr: "% du budget mensuel consommé sur cette période.",
    en: "% of monthly budget consumed in this range."
  },
  "By agent": { fr: "Par agent", en: "By agent" },
  "What each agent consumed in the selected period.": {
    fr: "Ce que chaque agent a consommé sur la période sélectionnée.",
    en: "What each agent consumed in the selected period."
  },
  "No cost events yet.": { fr: "Aucun événement de coût pour l'instant.", en: "No cost events yet." },
  "By project": { fr: "Par projet", en: "By project" },
  "Run costs attributed through project-linked issues.": {
    fr: "Coûts d'exécution attribués via les tâches liées aux projets.",
    en: "Run costs attributed through project-linked issues."
  },
  "No project-attributed run costs yet.": {
    fr: "Aucun coût d'exécution attribué à un projet pour l'instant.",
    en: "No project-attributed run costs yet."
  },
  "Unattributed": { fr: "Non attribué", en: "Unattributed" },
  "No finance events yet. Add account-level charges once biller invoices or credits land.": {
    fr: "Aucun événement financier. Ajoutez des charges au niveau du compte lorsque les factures ou crédits arrivent.",
    en: "No finance events yet. Add account-level charges once biller invoices or credits land."
  },
  "Budget control plane": { fr: "Plan de contrôle budgétaire", en: "Budget control plane" },
  "Hard-stop spend limits for agents and projects. Provider subscription quota stays separate and appears under Providers.": {
    fr: "Limites de dépenses strictes pour les agents et projets. Les quotas d'abonnement fournisseur restent séparés et apparaissent sous Fournisseurs.",
    en: "Hard-stop spend limits for agents and projects. Provider subscription quota stays separate and appears under Providers."
  },
  "Active incidents": { fr: "Incidents actifs", en: "Active incidents" },
  "Open soft or hard threshold crossings": {
    fr: "Dépassements de seuils souples ou stricts en cours",
    en: "Open soft or hard threshold crossings"
  },
  "Pending approvals": { fr: "Approbations en attente", en: "Pending approvals" },
  "Budget override approvals awaiting board action": {
    fr: "Approbations de dérogation de budget en attente d'action du conseil",
    en: "Budget override approvals awaiting board action"
  },
  "Paused agents": { fr: "Agents en pause", en: "Paused agents" },
  "Agent heartbeats blocked by budget": {
    fr: "Heartbeats d'agents bloqués par le budget",
    en: "Agent heartbeats blocked by budget"
  },
  "Paused projects": { fr: "Projets en pause", en: "Paused projects" },
  "Project execution blocked by budget": {
    fr: "Exécution de projet bloquée par le budget",
    en: "Project execution blocked by budget"
  },
  "Resolve hard stops here by raising the budget or explicitly keeping the scope paused.": {
    fr: "Résolvez les arrêts ici en augmentant le budget ou en gardant explicitement la portée en pause.",
    en: "Resolve hard stops here by raising the budget or explicitly keeping the scope paused."
  },
  "company budgets": { fr: "Budgets entreprise", en: "company budgets" },
  "agent budgets": { fr: "Budgets agents", en: "agent budgets" },
  "project budgets": { fr: "Budgets projets", en: "project budgets" },
  "Company-wide monthly policy.": { fr: "Politique mensuelle à l'échelle de l'entreprise.", en: "Company-wide monthly policy." },
  "Recurring monthly spend policies for individual agents.": {
    fr: "Politiques de dépenses mensuelles récurrentes pour les agents individuels.",
    en: "Recurring monthly spend policies for individual agents."
  },
  "Lifetime spend policies for execution-bound projects.": {
    fr: "Politiques de dépenses à vie pour les projets liés à l'exécution.",
    en: "Lifetime spend policies for execution-bound projects."
  },
  "No budget policies yet. Set agent and project budgets from their detail pages, or use the existing company monthly budget control.": {
    fr: "Aucune politique budgétaire. Définissez les budgets agents et projets depuis leurs pages de détail, ou utilisez le contrôle budgétaire mensuel de l'entreprise.",
    en: "No budget policies yet. Set agent and project budgets from their detail pages, or use the existing company monthly budget control."
  },
  "No cost events in this period.": { fr: "Aucun événement de coût sur cette période.", en: "No cost events in this period." },
  "No billable events in this period.": { fr: "Aucun événement facturable sur cette période.", en: "No billable events in this period." },
  "All providers": { fr: "Tous les fournisseurs", en: "All providers" },
  "All billers": { fr: "Tous les facturiers", en: "All billers" },
  "By biller": { fr: "Par facturier", en: "By biller" },
  "Account-level financial events grouped by who charged or credited them.": {
    fr: "Événements financiers au niveau du compte regroupés par facturier.",
    en: "Account-level financial events grouped by who charged or credited them."
  },
  "No finance events yet.": { fr: "Aucun événement financier pour l'instant.", en: "No finance events yet." },
  "total event": { fr: "événement total", en: "total event" },
  "total events": { fr: "événements totaux", en: "total events" },
  "in range": { fr: "dans la période", en: "in range" },
  "in": { fr: "ent.", en: "in" },
  "out": { fr: "sort.", en: "out" },
  "api": { fr: "api", en: "api" },
  "subscription": { fr: "abonnement", en: "subscription" },
  "tok": { fr: "tok", en: "tok" },
  "of": { fr: "de", en: "of" },

  // ── Inbox page ──────────────────────────────────────────────────────────
  "Mine": { fr: "Les miennes", en: "Mine" },
  "Recent": { fr: "Récent", en: "Recent" },
  "Unread": { fr: "Non lu", en: "Unread" },
  "Mark all as read": { fr: "Tout marquer comme lu", en: "Mark all as read" },
  "Marking…": { fr: "Marquage…", en: "Marking…" },
  "All categories": { fr: "Toutes les catégories", en: "All categories" },
  "My recent issues": { fr: "Mes tâches récentes", en: "My recent issues" },
  "Join requests": { fr: "Demandes d'adhésion", en: "Join requests" },
  "Failed runs": { fr: "Exécutions échouées", en: "Failed runs" },
  "All approval statuses": { fr: "Tous les statuts d'approbation", en: "All approval statuses" },
  "Needs action": { fr: "Action requise", en: "Needs action" },
  "Resolved": { fr: "Résolu", en: "Resolved" },
  "Inbox zero.": { fr: "Boîte de réception vide.", en: "Inbox zero." },
  "No new inbox items.": { fr: "Aucun nouvel élément.", en: "No new inbox items." },
  "No recent inbox items.": { fr: "Aucun élément récent.", en: "No recent inbox items." },
  "No inbox items match these filters.": {
    fr: "Aucun élément ne correspond à ces filtres.",
    en: "No inbox items match these filters."
  },
  "Alerts": { fr: "Alertes", en: "Alerts" },
  "Approve": { fr: "Approuver", en: "Approve" },
  "Reject": { fr: "Rejeter", en: "Reject" },
  "Retrying…": { fr: "Nouvelle tentative…", en: "Retrying…" },
  "Failed run": { fr: "Exécution échouée", en: "Failed run" },
  "requested by": { fr: "demandé par", en: "requested by" },
  "updated": { fr: "mis à jour", en: "updated" },
  "commented": { fr: "commenté", en: "commented" },
  "Human join request": { fr: "Demande d'adhésion humaine", en: "Human join request" },
  "Agent join request": { fr: "Demande d'adhésion d'agent", en: "Agent join request" },
  "requested": { fr: "demandé", en: "requested" },
  "from IP": { fr: "depuis IP", en: "from IP" },
  "adapter:": { fr: "adaptateur :", en: "adapter:" },
  "agent has errors": { fr: "agent a des erreurs", en: "agent has errors" },
  "agents have errors": { fr: "agents ont des erreurs", en: "agents have errors" },
  "Budget at": { fr: "Budget à", en: "Budget at" },
  "utilization this month": { fr: "d'utilisation ce mois-ci", en: "utilization this month" },

  // ── OrgChart page ─────────────────────────────────────────────────────
  "Import company": { fr: "Importer l'entreprise", en: "Import company" },
  "Export company": { fr: "Exporter l'entreprise", en: "Export company" },
  "Fit": { fr: "Ajuster", en: "Fit" },

  // ── CompanySkills page ────────────────────────────────────────────────
  "available": { fr: "disponible(s)", en: "available" },
  "Scan project workspaces for skills": {
    fr: "Scanner les espaces de travail pour les compétences",
    en: "Scan project workspaces for skills"
  },
  "Filter skills": { fr: "Filtrer les compétences", en: "Filter skills" },
  "Paste path, GitHub URL, or skills.sh command": {
    fr: "Collez un chemin, URL GitHub, ou commande skills.sh",
    en: "Paste path, GitHub URL, or skills.sh command"
  },
  "Skill name": { fr: "Nom de la compétence", en: "Skill name" },
  "optional-shortname": { fr: "alias-optionnel", en: "optional-shortname" },
  "Short description": { fr: "Description courte", en: "Short description" },
  "Create skill": { fr: "Créer une compétence", en: "Create skill" },
  "Select a skill to inspect its files.": {
    fr: "Sélectionnez une compétence pour inspecter ses fichiers.",
    en: "Select a skill to inspect its files."
  },
  "Source": { fr: "Source", en: "Source" },
  "Pin": { fr: "Épingle", en: "Pin" },
  "untracked": { fr: "non suivi", en: "untracked" },
  "tracking": { fr: "suivi de", en: "tracking" },
  "Check for updates": { fr: "Vérifier les mises à jour", en: "Check for updates" },
  "Install update": { fr: "Installer la mise à jour", en: "Install update" },
  "Up to date": { fr: "À jour", en: "Up to date" },
  "Key": { fr: "Clé", en: "Key" },
  "Mode": { fr: "Mode", en: "Mode" },
  "Editable": { fr: "Modifiable", en: "Editable" },
  "Read only": { fr: "Lecture seule", en: "Read only" },
  "Used by": { fr: "Utilisé par", en: "Used by" },
  "No agents attached": { fr: "Aucun agent attaché", en: "No agents attached" },
  "Code": { fr: "Code", en: "Code" },
  "Select a file to inspect.": { fr: "Sélectionnez un fichier à inspecter.", en: "Select a file to inspect." },
  "No skills match this filter.": { fr: "Aucune compétence ne correspond à ce filtre.", en: "No skills match this filter." },
  "Add a skill source": { fr: "Ajouter une source de compétence", en: "Add a skill source" },
  "Paste a local path, GitHub URL, or skills.sh command into the field first.": {
    fr: "Collez d'abord un chemin local, URL GitHub ou commande skills.sh dans le champ.",
    en: "Paste a local path, GitHub URL, or skills.sh command into the field first."
  },
  "Browse skills.sh": { fr: "Parcourir skills.sh", en: "Browse skills.sh" },
  "Find install commands and paste one here.": {
    fr: "Trouvez les commandes d'installation et collez-en une ici.",
    en: "Find install commands and paste one here."
  },
  "Search GitHub": { fr: "Rechercher sur GitHub", en: "Search GitHub" },
  "Look for repositories with SKILL.md, then paste the repo URL here.": {
    fr: "Cherchez des dépôts avec SKILL.md, puis collez l'URL du dépôt ici.",
    en: "Look for repositories with SKILL.md, then paste the repo URL here."
  },
  "Stop editing": { fr: "Arrêter l'édition", en: "Stop editing" },
  "Copied path to workspace": { fr: "Chemin copié dans le presse-papiers", en: "Copied path to workspace" },
  "Detail": { fr: "Détail", en: "Detail" },
  "found": { fr: "trouvé(s)", en: "found" },
  "imported": { fr: "importé(s)", en: "imported" },
  "conflicts": { fr: "conflits", en: "conflicts" },
  "skipped": { fr: "ignoré(s)", en: "skipped" },
  "Enabled": { fr: "Activé", en: "Enabled" },
  "Archived": { fr: "Archivé", en: "Archived" },
  "Agent": { fr: "Agent", en: "Agent" },

  // ── Missing keys from CompanySkills toasts ─────────────────────────────
  "Skills imported": { fr: "Compétences importées", en: "Skills imported" },
  "Import warnings": { fr: "Avertissements d'import", en: "Import warnings" },
  "Skill import failed": { fr: "Échec de l'import de compétence", en: "Skill import failed" },
  "Failed to import skill source.": { fr: "Échec de l'import de la source de compétence.", en: "Failed to import skill source." },
  "Skill created": { fr: "Compétence créée", en: "Skill created" },
  "is now editable in the Baaraly workspace.": {
    fr: "est maintenant modifiable dans l'espace de travail Baaraly.",
    en: "is now editable in the Baaraly workspace."
  },
  "Skill creation failed": { fr: "Échec de la création de compétence", en: "Skill creation failed" },
  "Failed to create skill.": { fr: "Échec de la création de la compétence.", en: "Failed to create skill." },
  "Scanning project workspaces for skills...": {
    fr: "Analyse des espaces de travail pour les compétences...",
    en: "Scanning project workspaces for skills..."
  },
  "Refreshing skills list...": { fr: "Actualisation de la liste des compétences...", en: "Refreshing skills list..." },
  "Project skill scan complete": { fr: "Analyse des compétences terminée", en: "Project skill scan complete" },
  "Skill conflicts found": { fr: "Conflits de compétences détectés", en: "Skill conflicts found" },
  "Scan warnings": { fr: "Avertissements d'analyse", en: "Scan warnings" },
  "Project skill scan failed": { fr: "Échec de l'analyse des compétences", en: "Project skill scan failed" },
  "Failed to scan project workspaces.": { fr: "Échec de l'analyse des espaces de travail.", en: "Failed to scan project workspaces." },
  "Skill saved": { fr: "Compétence sauvegardée", en: "Skill saved" },
  "Save failed": { fr: "Échec de la sauvegarde", en: "Save failed" },
  "Failed to save skill file.": { fr: "Échec de la sauvegarde du fichier de compétence.", en: "Failed to save skill file." },
  "Skill updated": { fr: "Compétence mise à jour", en: "Skill updated" },
  "Update failed": { fr: "Échec de la mise à jour", en: "Update failed" },
  "Failed to install skill update.": { fr: "Échec de l'installation de la mise à jour.", en: "Failed to install skill update." },

  // ── Phase 4C — Dashboard simplifié ─────────────────────────────────────
  "Bonjour": { fr: "Bonjour", en: "Hello" },
  "Que veux-tu faire aujourd'hui ?": {
    fr: "Que veux-tu faire aujourd'hui ?",
    en: "What do you want to do today?"
  },
  "Gérer ma boutique": { fr: "Gérer ma boutique", en: "Manage my shop" },
  "Trouver des clients": { fr: "Trouver des clients", en: "Find customers" },
  "Voir mes finances": { fr: "Voir mes finances", en: "View my finances" },
  "Tes agents": { fr: "Tes agents", en: "Your agents" },
  "Tu n'as pas encore d'agent": {
    fr: "Tu n'as pas encore d'agent",
    en: "You don't have any agent yet"
  },
  "Choisir un agent": { fr: "Choisir un agent", en: "Choose an agent" },
  "Ouvrir": { fr: "Ouvrir", en: "Open" },
  "Lancer un agent": { fr: "Lancer un agent", en: "Launch an agent" },
  "Bienvenue sur Baaraly ! Configure ton premier assistant.": {
    fr: "Bienvenue sur Baaraly ! Configure ton premier assistant.",
    en: "Welcome to Baaraly! Set up your first assistant."
  },
  "Commencer": { fr: "Commencer", en: "Get Started" },
  "Sélectionne une entreprise pour commencer.": {
    fr: "Sélectionne une entreprise pour commencer.",
    en: "Select a company to get started."
  },

  // ── Phase 4C — Agents page ─────────────────────────────────────────────
  "Ils travaillent pendant que tu dors 💡": {
    fr: "Ils travaillent pendant que tu dors 💡",
    en: "They work while you sleep 💡"
  },
  "Créer mon premier agent": { fr: "Créer mon premier agent", en: "Create my first agent" },

  // ── Phase 4C — Template Gallery ────────────────────────────────────────
  "Choisis ton premier assistant": {
    fr: "Choisis ton premier assistant",
    en: "Choose your first assistant"
  },
  "Ils travaillent pour toi automatiquement": {
    fr: "Ils travaillent pour toi automatiquement",
    en: "They work for you automatically"
  },
  "Recommandé": { fr: "Recommandé", en: "Recommended" },
  "Ajouter": { fr: "Ajouter", en: "Add" },
  "Recrutement...": { fr: "Recrutement...", en: "Recruiting..." },
  "a été ajouté à ton équipe": {
    fr: "a été ajouté à ton équipe",
    en: "has been added to your team"
  },
  "On s'occupe du reste 👍": {
    fr: "On s'occupe du reste 👍",
    en: "We'll take care of the rest 👍"
  },
  "Échec du recrutement. Réessaie.": {
    fr: "Échec du recrutement. Réessaie.",
    en: "Recruitment failed. Try again."
  },

  // ── Phase 4C — Onboarding 3 étapes ─────────────────────────────────────
  "Quel est ton activité ?": { fr: "Quel est ton activité ?", en: "What's your business?" },
  "On adapte tout pour toi": { fr: "On adapte tout pour toi", en: "We'll adapt everything for you" },
  "Où es-tu basé ?": { fr: "Où es-tu basé ?", en: "Where are you based?" },
  "Pour adapter les prix et les services": {
    fr: "Pour adapter les prix et les services",
    en: "To adapt prices and services"
  },
  "Retour": { fr: "Retour", en: "Back" },
  "Ton assistant est prêt": { fr: "Ton assistant est prêt", en: "Your assistant is ready" },
  "Erreur": { fr: "Erreur", en: "Error" },
  "Une erreur est survenue": { fr: "Une erreur est survenue", en: "An error occurred" },

  // ── Agent Detail — traduction complète ─────────────────────────────────────
  "Assigner une tâche": { fr: "Assigner une tâche", en: "Assign Task" },
  "Lancer": { fr: "Lancer", en: "Run" },
  "Reprendre": { fr: "Reprendre", en: "Resume" },
  "Compétences": { fr: "Compétences", en: "Skills" },
  "Exécutions": { fr: "Exécutions", en: "Runs" },
  "Exécution": { fr: "Exécution", en: "Run" },
  "Tableau de bord": { fr: "Tableau de bord", en: "Dashboard" },
  "Cet agent est en attente d'approbation et ne peut pas encore être utilisé.": {
    fr: "Cet agent est en attente d'approbation et ne peut pas encore être utilisé.",
    en: "This agent is pending board approval and cannot be invoked yet."
  },
  "Copier l'ID agent": { fr: "Copier l'ID agent", en: "Copy Agent ID" },
  "Réinitialiser les sessions": { fr: "Réinitialiser les sessions", en: "Reset Sessions" },
  "Annuler": { fr: "Annuler", en: "Cancel" },
  "Sauvegarde…": { fr: "Sauvegarde…", en: "Saving…" },
  "Sauvegarder": { fr: "Sauvegarder", en: "Save" },
  "En cours": { fr: "En cours", en: "Live Run" },
  "Dernière exécution": { fr: "Dernière exécution", en: "Latest Run" },
  "Voir détails": { fr: "Voir détails", en: "View details" },
  "Activité": { fr: "Activité", en: "Run Activity" },
  "14 derniers jours": { fr: "14 derniers jours", en: "Last 14 days" },
  "Tâches par priorité": { fr: "Tâches par priorité", en: "Issues by Priority" },
  "Tâches par statut": { fr: "Tâches par statut", en: "Issues by Status" },
  "Taux de réussite": { fr: "Taux de réussite", en: "Success Rate" },
  "Tâches récentes": { fr: "Tâches récentes", en: "Recent Issues" },
  "Voir tout": { fr: "Voir tout", en: "See All" },
  "Aucune tâche récente.": { fr: "Aucune tâche récente.", en: "No recent issues." },
  "autres tâches": { fr: "autres tâches", en: "more issues" },
  "Coûts": { fr: "Coûts", en: "Costs" },
  "Tokens entrée": { fr: "Tokens entrée", en: "Input tokens" },
  "Tokens sortie": { fr: "Tokens sortie", en: "Output tokens" },
  "Tokens cache": { fr: "Tokens cache", en: "Cached tokens" },
  "Coût total": { fr: "Coût total", en: "Total cost" },
  "Date": { fr: "Date", en: "Date" },
  "Entrée": { fr: "Entrée", en: "Input" },
  "Sortie": { fr: "Sortie", en: "Output" },
  "Coût": { fr: "Coût", en: "Cost" },
  "Clés API": { fr: "Clés API", en: "API Keys" },
  "Historique de configuration": { fr: "Historique de configuration", en: "Configuration Revisions" },
  "Aucun historique de configuration.": { fr: "Aucun historique de configuration.", en: "No configuration revisions yet." },
  "Restaurer": { fr: "Restaurer", en: "Restore" },
  "Modifié :": { fr: "Modifié :", en: "Changed:" },
  "aucune modification": { fr: "aucune modification", en: "no tracked changes" },
  "Permissions": { fr: "Permissions", en: "Permissions" },
  "Peut créer de nouveaux agents": { fr: "Peut créer de nouveaux agents", en: "Can create new agents" },
  "Permet à cet agent de créer ou recruter des agents et d'assigner des tâches.": {
    fr: "Permet à cet agent de créer ou recruter des agents et d'assigner des tâches.",
    en: "Lets this agent create or hire agents and implicitly assign tasks."
  },
  "Peut assigner des tâches": { fr: "Peut assigner des tâches", en: "Can assign tasks" },
  "Échec de la sauvegarde": { fr: "Échec de la sauvegarde", en: "Save failed" },
  "Impossible de sauvegarder l'agent": { fr: "Impossible de sauvegarder l'agent", en: "Could not save agent" },
  "Supprimer": { fr: "Supprimer", en: "Delete" },

  // ── Baaraly Dashboard ─────────────────────────────────────────────────
  "Essai gratuit": { fr: "Essai gratuit", en: "Free Trial" },
  "Il reste": { fr: "Il reste", en: "You have" },
  "jours": { fr: "jours", en: "days left" },
  "Limite": { fr: "Limite", en: "Limit" },
  "prospects/jour": { fr: "prospects/jour", en: "prospects/day" },
  "Passer à Pro": { fr: "Passer à Pro", en: "Go Pro" },
  "agent actif": { fr: "agent actif", en: "active agent" },
  "agents actifs": { fr: "agents actifs", en: "active agents" },
  "Tes assistants travaillent pour toi. Résultats livrés sur WhatsApp.": {
    fr: "Tes assistants travaillent pour toi. Résultats livrés sur WhatsApp.",
    en: "Your assistants work for you. Results delivered on WhatsApp."
  },
  "Catalogue d'agents": { fr: "Catalogue d'agents", en: "Agent Catalog" },
  "agents disponibles": { fr: "agents disponibles", en: "agents available" },
  "Populaire": { fr: "Populaire", en: "Popular" },
  "Installer": { fr: "Installer", en: "Install" },
  "a rejoint ton équipe": { fr: "a rejoint ton équipe", en: "joined your team" },
  "Il est prêt à travailler pour toi": {
    fr: "Il est prêt à travailler pour toi",
    en: "Ready to work for you"
  },
  "Tu ne trouves pas ton agent ?": {
    fr: "Tu ne trouves pas ton agent ?",
    en: "Can't find your agent?"
  },
  "Propose-nous un nouvel agent et on le construira pour toi": {
    fr: "Propose-nous un nouvel agent et on le construira pour toi",
    en: "Suggest a new agent and we'll build it for you"
  },
  "Suggérer un agent": { fr: "Suggérer un agent", en: "Suggest an agent" },
  "Nom de l'agent (ex: Agent RH)": {
    fr: "Nom de l'agent (ex: Agent RH)",
    en: "Agent name (e.g. HR Agent)"
  },
  "Que devrait faire cet agent ?": {
    fr: "Que devrait faire cet agent ?",
    en: "What should this agent do?"
  },
  "Suggestion envoyée !": { fr: "Suggestion envoyée !", en: "Suggestion sent!" },
  "Merci pour ta proposition": { fr: "Merci pour ta proposition", en: "Thanks for your suggestion" },

  // ── Baaraly Onboarding ────────────────────────────────────────────────
  "Connecter WhatsApp": { fr: "Connecter WhatsApp", en: "Connect WhatsApp" },
  "Numéro WhatsApp": { fr: "Numéro WhatsApp", en: "WhatsApp Number" },
  "Confirmer le numéro": { fr: "Confirmer le numéro", en: "Confirm number" },
  "Ton numéro est connecté !": {
    fr: "Ton numéro est connecté !",
    en: "Your number is connected!"
  },
  "Reçois les notifications de tes agents sur WhatsApp": {
    fr: "Reçois les notifications de tes agents sur WhatsApp",
    en: "Receive agent notifications on WhatsApp"
  },

  // ── Baaraly Company Settings ──────────────────────────────────────────
  "Zone de danger": { fr: "Zone de danger", en: "Danger Zone" },
  "Archiver l'entreprise": { fr: "Archiver l'entreprise", en: "Archive company" },
  "Cache l'entreprise de la barre latérale. Les données sont conservées.": {
    fr: "Cache l'entreprise de la barre latérale. Les données sont conservées.",
    en: "Hides the company from the sidebar. Data is preserved."
  },
  "Échec de l'archivage": { fr: "Échec de l'archivage", en: "Failed to archive" },
  "Supprimer définitivement": { fr: "Supprimer définitivement", en: "Delete permanently" },
  "Supprime l'entreprise, tous les agents, et toutes les données associées. Cette action est irréversible.": {
    fr: "Supprime l'entreprise, tous les agents, et toutes les données associées. Cette action est irréversible.",
    en: "Deletes the company, all agents, and all associated data. This action is irreversible."
  },
  "Suppression...": { fr: "Suppression...", en: "Deleting..." },
  "Pour confirmer, tapez le nom de l'entreprise": {
    fr: "Pour confirmer, tapez le nom de l'entreprise",
    en: "To confirm, type the company name"
  },
  "Nom incorrect": { fr: "Nom incorrect", en: "Incorrect name" },
  "La suppression a été annulée": {
    fr: "La suppression a été annulée",
    en: "Deletion was cancelled"
  },
  "Entreprise supprimée": { fr: "Entreprise supprimée", en: "Company deleted" },
  "L'entreprise a été supprimée définitivement": {
    fr: "L'entreprise a été supprimée définitivement",
    en: "The company has been permanently deleted"
  },
  "Échec de la suppression": { fr: "Échec de la suppression", en: "Failed to delete" },

  // ── Baaraly Credits ───────────────────────────────────────────────────
  "Solde": { fr: "Solde", en: "Balance" },
  "Solde épuisé": { fr: "Solde épuisé", en: "Balance exhausted" },
  "Solde bas": { fr: "Solde bas", en: "Low balance" },
  "crédits restants": { fr: "crédits restants", en: "credits remaining" },
  "Rechargez pour continuer": {
    fr: "Rechargez pour continuer",
    en: "Recharge to continue"
  },
  "Recharger": { fr: "Recharger", en: "Recharge" },

  // ── Landing Page ──────────────────────────────────────────────────────
  "30 agents IA pour tous vos besoins": { fr: "30 agents IA pour tous vos besoins", en: "30 AI agents for all your needs" },
  "8 catégories · 3 niveaux · Votre arme secrète": { fr: "8 catégories · 3 niveaux · Votre arme secrète", en: "8 categories · 3 tiers · Your secret weapon" },
  "Nos agents": { fr: "Nos agents", en: "Our agents" },
  "Tech": { fr: "Tech", en: "Tech" },
  "Marketing": { fr: "Marketing", en: "Marketing" },
  "Trading": { fr: "Trading", en: "Trading" },
  "Crypto": { fr: "Crypto", en: "Crypto" },
  "Divertissement": { fr: "Divertissement", en: "Entertainment" },
  "Commerce": { fr: "Commerce", en: "Commerce" },
  "Juridique": { fr: "Juridique", en: "Legal" },
  "agents": { fr: "agents", en: "agents" },
  "Voir tous les agents": { fr: "Voir tous les agents", en: "View all agents" },
  "3 forfaits selon vos besoins": { fr: "3 forfaits selon vos besoins", en: "3 plans for your needs" },
  "Devise auto-detectée · Paiement local · Sans engagement": { fr: "Devise auto-detectée · Paiement local · Sans engagement", en: "Auto-detected currency · Local payment · No commitment" },
  "Trial": { fr: "Trial", en: "Trial" },
  "Pro": { fr: "Pro", en: "Pro" },
  "Max": { fr: "Max", en: "Max" },
  "Pour découvrir": { fr: "Pour découvrir", en: "To discover" },
  "Pour commencer": { fr: "Pour commencer", en: "To get started" },
  "Pour scale": { fr: "Pour scale", en: "To scale" },
  "Choisir": { fr: "Choisir", en: "Choose" },
  "Paiement local : Orange Money, Wave, MTN, Moov, M-Pesa, Stripe, PayPal, Crypto": {
    fr: "Paiement local : Orange Money, Wave, MTN, Moov, M-Pesa, Stripe, PayPal, Crypto",
    en: "Local payment: Orange Money, Wave, MTN, Moov, M-Pesa, Stripe, PayPal, Crypto"
  },
  "1 agent": { fr: "1 agent", en: "1 agent" },
  "5 prospects/jour": { fr: "5 prospects/jour", en: "5 prospects/day" },
  "WhatsApp inclus": { fr: "WhatsApp inclus", en: "WhatsApp included" },
  "Support email": { fr: "Support email", en: "Email support" },
  "10 agents": { fr: "10 agents", en: "10 agents" },
  "50 prospects/jour": { fr: "50 prospects/jour", en: "50 prospects/day" },
  "Multi WhatsApp": { fr: "Multi WhatsApp", en: "Multi WhatsApp" },
  "Rapports avancés": { fr: "Rapports avancés", en: "Advanced reports" },
  "Prioritaire": { fr: "Prioritaire", en: "Priority" },
  "API access": { fr: "API access", en: "API access" },
  "Multi-entreprise": { fr: "Multi-entreprise", en: "Multi-company" },
  "Support dédié": { fr: "Support dédié", en: "Dedicated support" },
  "Sans carte bancaire": { fr: "Sans carte bancaire", en: "No credit card" },
  "jours gratuits": { fr: "jours gratuits", en: "free days" },
  "agent": { fr: "agent", en: "agent" },

  // ═══ Agent API Keys ═══
  "Créer une clé API": { fr: "Créer une clé API", en: "Create API key" },
  "Les clés API permettent à cet agent de s'authentifier auprès du serveur Baaraly.": {
    fr: "Les clés API permettent à cet agent de s'authentifier auprès du serveur Baaraly.",
    en: "API keys allow this agent to authenticate with the Baaraly server."
  },
  "Nom de la clé (ex. production)": { fr: "Nom de la clé (ex. production)", en: "Key name (e.g. production)" },
  "Chargement des clés...": { fr: "Chargement des clés...", en: "Loading keys..." },
  "Aucune clé API active.": { fr: "Aucune clé API active.", en: "No active API key." },
  "Clés actives": { fr: "Clés actives", en: "Active keys" },
  "Créée le": { fr: "Créée le", en: "Created on" },
  "Révoquer": { fr: "Révoquer", en: "Revoke" },
  "Clés révoquées": { fr: "Clés révoquées", en: "Revoked keys" },
  "Révoquée le": { fr: "Révoquée le", en: "Revoked on" },
  "Clé API créée — copie-la maintenant, elle ne sera plus affichée.": {
    fr: "Clé API créée — copie-la maintenant, elle ne sera plus affichée.",
    en: "API key created — copy it now, it won't be shown again."
  },
  "Masquer": { fr: "Masquer", en: "Hide" },
  "Afficher": { fr: "Afficher", en: "Show" },
  "Copier": { fr: "Copier", en: "Copy" },
  "Copié !": { fr: "Copié !", en: "Copied!" },
  "Fermer": { fr: "Fermer", en: "Close" },

  // ═══ Agent Config Form ═══
  "Identity": { fr: "Identité", en: "Identity" },
  "Title": { fr: "Titre", en: "Title" },
  "Reports to": { fr: "Rend compte à", en: "Reports to" },
  "Capabilities": { fr: "Capacités", en: "Capabilities" },
  "Adapter": { fr: "Adaptateur", en: "Adapter" },
  "Adapter type": { fr: "Type d'adaptateur", en: "Adapter type" },
  "Test environment": { fr: "Tester l'environnement", en: "Test environment" },
  "Testing...": { fr: "Test en cours...", en: "Testing..." },
  "Process": { fr: "Processus", en: "Process" },
  "Command": { fr: "Commande", en: "Command" },
  "Args (comma-separated)": { fr: "Arguments (séparés par virgule)", en: "Args (comma-separated)" },
  "Extra args (comma-separated)": { fr: "Extra args (séparés par virgule)", en: "Extra args (comma-separated)" },
  "Environment variables": { fr: "Variables d'environnement", en: "Environment variables" },
  "Timeout (sec)": { fr: "Délai (sec)", en: "Timeout (sec)" },
  "Interrupt grace period (sec)": { fr: "Période de grâce (sec)", en: "Interrupt grace period (sec)" },
  "Run Policy": { fr: "Politique d'exécution", en: "Run Policy" },
  "Heartbeat on interval": { fr: "Heartbeat sur intervalle", en: "Heartbeat on interval" },
  "Run heartbeat every": { fr: "Exécuter heartbeat chaque", en: "Run heartbeat every" },
  "Advanced Run Policy": { fr: "Politique d'exécution avancée", en: "Advanced Run Policy" },
  "Wake on demand": { fr: "Réveil à la demande", en: "Wake on demand" },
  "Cooldown (sec)": { fr: "Cooldown (sec)", en: "Cooldown (sec)" },
  "sec": { fr: "sec", en: "sec" },
  "Choose manager…": { fr: "Choisir le manager…", en: "Choose manager…" },
  "Agent name": { fr: "Nom de l'agent", en: "Agent name" },
  "e.g. VP of Engineering": { fr: "ex. VP Engineering", en: "e.g. VP of Engineering" },
  "e.g. --verbose, --foo=bar": { fr: "ex. --verbose, --foo=bar", en: "e.g. --verbose, --foo=bar" },
  "Describe what this agent can do...": { fr: "Décrivez ce que cet agent peut faire...", en: "Describe what this agent can do..." },
  "Prompt Template": { fr: "Modèle de prompt", en: "Prompt Template" },
  "You are agent {{ agent.name }}. Your role is {{ agent.role }}...": { 
    fr: "Vous êtes l'agent {{ agent.name }}. Votre rôle est {{ agent.role }}...", 
    en: "You are agent {{ agent.name }}. Your role is {{ agent.role }}..." 
  },

  // ═══ Agent Status ═══
  "Pending approval": { fr: "En attente d'approbation", en: "Pending approval" },

  // ═══ Experimental Settings ═══
  "Loading experimental settings...": { fr: "Chargement des paramètres...", en: "Loading experimental settings..." },
  "Failed to load experimental settings.": { fr: "Échec du chargement des paramètres.", en: "Failed to load experimental settings." },
  "Failed to update experimental settings.": { fr: "Échec de la mise à jour.", en: "Failed to update experimental settings." },
  "Opt into features that are still being evaluated before they become default behavior.": {
    fr: "Activez les fonctionnalités en cours d'évaluation avant qu'elles ne deviennent le comportement par défaut.",
    en: "Opt into features that are still being evaluated before they become default behavior."
  },
  "Enable Isolated Workspaces": { fr: "Activer les espaces de travail isolés", en: "Enable Isolated Workspaces" },
  "Show execution workspace controls in project configuration and allow isolated workspace behavior for new and existing issue runs.": {
    fr: "Afficher les contrôles d'espace d'exécution dans la configuration du projet et permettre un comportement d'espace de travail isolé pour les nouvelles et les existantes.",
    en: "Show execution workspace controls in project configuration and allow isolated workspace behavior for new and existing issue runs."
  },
  "Auto-Restart Dev Server When Idle": { fr: "Redémarrer automatiquement le serveur en attente", en: "Auto-Restart Dev Server When Idle" },
  "In pnpm dev:once, wait for all queued and running local agent runs to finish, then restart the server automatically when backend changes or migrations make the current boot stale.": {
    fr: "Dans `pnpm dev:once`, attendez que toutes les exécutions d'agents locales en attente et en cours se terminent, puis redémarrez automatiquement le serveur lorsque les modifications du backend ou les migrations rendent le démarrage actuel obsolète.",
    en: "In pnpm dev:once, wait for all queued and running local agent runs to finish, then restart the server automatically when backend changes or migrations make the current boot stale."
  },

  // ═══ Plugins ═══
  "Plugin Manager": { fr: "Gestionnaire de plugins", en: "Plugin Manager" },
  "Install Plugin": { fr: "Installer un plugin", en: "Install Plugin" },
  "Enter the npm package name of the plugin you wish to install.": { 
    fr: "Entrez le nom du package npm du plugin que vous souhaitez installer.", 
    en: "Enter the npm package name of the plugin you wish to install." 
  },
  "npm Package Name": { fr: "Nom du package npm", en: "npm Package Name" },
  "Plugins are alpha": { fr: "Les plugins sont en alpha", en: "Plugins are alpha" },
  "The plugin runtime and API surface are still changing. Expect breaking changes while this feature settles.": {
    fr: "Le runtime des plugins et l'API sont encore en cours de modification. Attendez-vous à des changements majeurs pendant que cette fonctionnalité se stabilise.",
    en: "The plugin runtime and API surface are still changing. Expect breaking changes while this feature settles."
  },
  "Available Plugins": { fr: "Plugins disponibles", en: "Available Plugins" },
  "Installed Plugins": { fr: "Plugins installés", en: "Installed Plugins" },
  "Examples": { fr: "Exemples", en: "Examples" },
  "Example": { fr: "Exemple", en: "Example" },
  "Not installed": { fr: "Non installé", en: "Not installed" },
  "Install": { fr: "Installer", en: "Install" },
  "Installing...": { fr: "Installation en cours...", en: "Installing..." },
  "Install Example": { fr: "Installer l'exemple", en: "Install Example" },
  "Enable": { fr: "Activer", en: "Enable" },
  "No plugins installed yet": { fr: "Aucun plugin installé", en: "No plugins installed yet" },
  "No bundled example plugins were found in this checkout.": { fr: "Aucun plugin d'exemple trouvé.", en: "No bundled example plugins were found in this checkout." },
  "Install a plugin to extend functionality.": { fr: "Installez un plugin pour étendre les fonctionnalités.", en: "Install a plugin to extend functionality." },
};

/** Renvoie la traduction pour la clé donnée dans la langue choisie.
 *  Si la clé n'existe pas, retourne la clé elle-même (fallback). */
export function translate(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}
