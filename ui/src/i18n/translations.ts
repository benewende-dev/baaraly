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
  "Org Chart": { fr: "Organigramme", en: "Org Chart" },
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
  "Active": { fr: "Actif", en: "Active" },
  "Inactive": { fr: "Inactif", en: "Inactive" },
  "Enabled": { fr: "Activé", en: "Enabled" },
  "Disabled": { fr: "Désactivé", en: "Disabled" },
  "Pending": { fr: "En attente", en: "Pending" },
  "Archived": { fr: "Archivé", en: "Archived" },
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
  "Live": { fr: "En direct", en: "Live" },

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
  "Create routine": { fr: "Créer une routine", en: "Create routine" },
  "Failed to create routine": { fr: "Échec de la création de la routine", en: "Failed to create routine" },
  "Failed to load routines": { fr: "Échec du chargement des routines", en: "Failed to load routines" },
  "Name": { fr: "Nom", en: "Name" },
  "Agent": { fr: "Agent", en: "Agent" },
  "Last run": { fr: "Dernière exécution", en: "Last run" },
  "Enabled": { fr: "Activé", en: "Enabled" },
  "Archived": { fr: "Archivée", en: "Archived" },
  "Paused": { fr: "En pause", en: "Paused" },
  "Yes": { fr: "Oui", en: "Yes" },
  "No": { fr: "Non", en: "No" },
  "Running...": { fr: "En cours...", en: "Running..." },
  "Run now": { fr: "Exécuter maintenant", en: "Run now" },
  "Pause": { fr: "Mettre en pause", en: "Pause" },
  "Activate": { fr: "Activer", en: "Activate" },
  "Never": { fr: "Jamais", en: "Never" },
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
};

/** Renvoie la traduction pour la clé donnée dans la langue choisie.
 *  Si la clé n'existe pas, retourne la clé elle-même (fallback). */
export function translate(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}
