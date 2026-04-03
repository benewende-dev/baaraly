import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router";
import { useLanguage } from "../context/LanguageContext";
import { ThemeLangToggle } from "../components/ThemeLangToggle";
import { BAARALY_BILLING_PLANS, formatPriceFromEur, AGENT_CATEGORIES, BAARALY_AGENTS, getBillingPlan, getAgentsByTier } from "@paperclipai/shared/baaraly-agents";

export function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [chatStep, setChatStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const trialPlan = getBillingPlan("trial");
  const trialDays = trialPlan.trialDays ?? 7;
  const trialProspects = trialPlan.maxProspectsPerDay;
  const trialAgents = trialPlan.maxAgents;

  const agentsByTier = getAgentsByTier();
  const tier1Count = agentsByTier[1].length;
  const tier2Count = agentsByTier[2].length;
  const tier3Count = agentsByTier[3].length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChatStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* ── ANIMATED BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-gradient-slow" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float-slower" />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-10 flex items-center justify-between px-5 py-4 max-w-5xl mx-auto backdrop-blur-sm">
        <span className="text-xl font-extrabold tracking-tight">
          Baaraly <span className="text-gradient">AI</span>
        </span>
        <div className="flex items-center gap-3">
          <ThemeLangToggle compact />
          <button
            onClick={() => navigate("/welcome")}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
          >
            {t("Connexion")}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 px-5 pt-16 pb-20 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-primary/10 text-primary mb-6 animate-pulse-glow">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {trialDays} {t("jours gratuits")} · {tier1Count} {t("agents Standard")} 🎁
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gradient">{t("30 agents IA")}</span>
              <br />
              {t("pour faire grandir ton business")}
              <span className="block text-primary mt-2">{t("automatiquement")}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t("Tech, Marketing, Finance, Trading, Crypto, Commerce, Juridique, Divertissement — Baaraly travaille pour toi 24h/24. Tu dors, il prospecte. Tu te réveilles, t'as des résultats.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/welcome")}
                className="rounded-2xl px-8 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.98] bg-gradient-to-r from-primary to-secondary"
              >
                {t("Tester gratuitement")} →
              </button>
              <button
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-2xl px-8 py-4 text-base font-semibold border-2 border-border transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                {t("Voir les tarifs")}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {trialDays} {t("jours gratuits")} · {trialProspects} {t("prospects/jour")} · {trialAgents} {t("agent Standard")} · {t("Sans carte bancaire")}
            </p>
          </div>

          {/* WhatsApp Mockup */}
          <div className="hidden lg:block">
            <div className="relative mx-auto w-80 animate-float">
              <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
                <div className="bg-primary/10 px-4 py-3 flex items-center gap-3 border-b border-border/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Aminata</p>
                    <p className="text-[10px] text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {t("En ligne")}
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3 min-h-[280px]">
                  <ChatMessage text={t("J'ai trouvé 5 nouveaux prospects aujourd'hui !")} time="09:30" sent={false} visible={chatStep >= 1} />
                  <ChatMessage text={t("3 ont répondu positivement")} time="09:31" sent={false} visible={chatStep >= 2} />
                  <ChatMessage text={t("Super ! Envoie-moi le rapport")} time="09:32" sent={true} visible={chatStep >= 3} />
                  <ChatMessage text={t("Voilà, c'est fait ! 📊")} time="09:33" sent={false} visible={chatStep >= 4} />
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLÈME ── */}
      <section id="problem" data-animate className="relative z-10 px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("problem") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-destructive uppercase tracking-wider">{t("Le problème")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Tu perds du temps et de l'argent")} 😤
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { emoji: "⏰", title: t("Tu passes des heures sur WhatsApp"), desc: t("À envoyer des messages un par un, sans système ni suivi") },
            { emoji: "📉", title: t("Pas de visibilité"), desc: t("Tu ne sais pas qui relancer, quand, ni comment optimiser") },
            { emoji: "💸", title: t("Tu perds des opportunités"), desc: t("Chaque jour sans prospection, c'est du chiffre d'affaires perdu") },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all duration-700 hover-lift ${
                isVisible("problem") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-4xl block mb-4">{item.emoji}</span>
              <p className="font-semibold text-sm mb-2">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section id="solution" data-animate className="relative z-10 px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("solution") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("La solution")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("30 agents IA à ton service")} 🤖
          </h2>
          <p className="text-muted-foreground mt-3">{t("Automatiquement. 24h/24. 7j/7. Dans 8 domaines.")}</p>
        </div>
        <div className="grid sm:grid-cols-4 gap-4">
          {AGENT_CATEGORIES.map((cat, i) => {
            const count = BAARALY_AGENTS.filter((a) => a.category === cat.id).length;
            return (
              <div
                key={cat.id}
                className={`glass-panel rounded-2xl p-5 text-center transition-all duration-700 hover-lift ${
                  isVisible("solution") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <p className="font-bold text-sm">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{count} {t("agents")}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section id="how-it-works" data-animate className="relative z-10 px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible("how-it-works") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">{t("Processus")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Comment ça marche")} ⚡
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary opacity-30" />
          <div className="space-y-8 sm:space-y-12">
            {[
              { n: 1, text: t("Crée ton compte et choisis tes agents parmi 30 profils") },
              { n: 2, text: t("Configure ton agent : rôle, capacités, modèle IA") },
              { n: 3, text: t("L'agent travaille automatiquement 24h/24") },
              { n: 4, text: t("Reçois tes résultats sur WhatsApp et dans ton dashboard") },
              { n: 5, text: t("Scale en ajoutant d'autres agents selon tes besoins") },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 sm:gap-6 transition-all duration-700 ${
                  isVisible("how-it-works") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <span className="text-xs sm:text-sm font-bold text-white">{item.n}</span>
                </div>
                <p className="text-sm sm:text-base font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LES AGENTS PAR TIER ── */}
      <section id="agent-details" data-animate className="relative z-10 px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("agent-details") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("Nos agents")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("30 agents IA spécialisés")} 🎯
          </h2>
          <p className="text-muted-foreground mt-3">{t("3 niveaux de compétence · 8 catégories · Configurables à volonté")}</p>
        </div>

        {/* Tier 1 */}
        <div className={`mb-10 transition-all duration-700 ${isVisible("agent-details") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold">{t("Standard")} · {tier1Count} {t("agents")}</span>
            <span className="text-xs text-muted-foreground">{t("Inclus dans l'essai gratuit")}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {agentsByTier[1].map((a) => (
              <div key={a.name} className="rounded-xl border border-border bg-card/60 p-4 text-center hover-lift">
                <span className="text-2xl block mb-1">{a.emoji}</span>
                <p className="font-semibold text-xs">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{a.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div className={`mb-10 transition-all duration-700 ${isVisible("agent-details") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">{t("Avancé")} · {tier2Count} {t("agents")}</span>
            <span className="text-xs text-muted-foreground">{t("Disponible à partir du plan Pro")}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {agentsByTier[2].map((a) => (
              <div key={a.name} className="rounded-xl border border-border bg-card/60 p-4 text-center hover-lift">
                <span className="text-2xl block mb-1">{a.emoji}</span>
                <p className="font-semibold text-xs">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{a.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3 */}
        <div className={`transition-all duration-700 ${isVisible("agent-details") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "300ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold">{t("Expert")} · {tier3Count} {t("agents")}</span>
            <span className="text-xs text-muted-foreground">{t("Disponible avec le plan Max")}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {agentsByTier[3].map((a) => (
              <div key={a.name} className="rounded-xl border border-border bg-card/60 p-4 text-center hover-lift">
                <span className="text-2xl block mb-1">{a.emoji}</span>
                <p className="font-semibold text-xs">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{a.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFRE ── */}
      <section id="offer" data-animate className="relative z-10 px-5 py-24 max-w-4xl mx-auto">
        <div className={`rounded-3xl bg-gradient-to-r from-primary to-secondary p-1 transition-all duration-700 ${isVisible("offer") ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="rounded-[22px] bg-background p-8 sm:p-12 text-center">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("Essai gratuit")}</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mt-4 mb-2">
              {trialDays} <span className="text-gradient">{t("jours gratuits")}</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {trialAgents} {t("agent Standard")} · {trialProspects} {t("prospects/jour")} · WhatsApp inclus · {t("Sans carte bancaire")}
            </p>
            <button
              onClick={() => navigate("/welcome")}
              className="rounded-2xl px-10 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.98] bg-gradient-to-r from-primary to-secondary"
            >
              {t("Commencer maintenant")} 🚀
            </button>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="testimonials" data-animate className="relative z-10 px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("testimonials") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("Témoignages")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Ils utilisent Baaraly")} 💬
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: "Fatou D.", location: "Ouagadougou", text: t("J'ai eu 3 nouveaux clients en 2 jours grâce à Aminata"), initials: "FD" },
            { name: "Moussa K.", location: "Bamako", text: t("Mon agent Ibrahim gère toute ma compta SYSCOHADA. Magique"), initials: "MK" },
            { name: "Aïssata B.", location: "Dakar", text: t("Marcus m'aide à suivre le Forex et les matières premières chaque jour"), initials: "AB" },
          ].map((item, i) => (
            <div
              key={i}
              className={`glass-panel rounded-2xl p-6 transition-all duration-700 hover-lift ${
                isVisible("testimonials") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="text-sm italic mb-4 leading-relaxed">"{item.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                  {item.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section id="pricing" data-animate className="relative z-10 px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("pricing") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("Tarifs")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("3 forfaits selon vos besoins")} 💰
          </h2>
          <p className="text-muted-foreground mt-3">{t("Devise auto-detectée · Paiement local · Sans engagement")}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {BAARALY_BILLING_PLANS.map((plan) => {
            const isPro = plan.id === "pro";
            const isMax = plan.id === "max";
            const isTrial = plan.id === "trial";
            const price = formatPriceFromEur(plan.priceEur, undefined);
            const tierLabels = plan.allowedTiers?.includes(1) && plan.allowedTiers?.includes(2) && plan.allowedTiers?.includes(3)
              ? `${tier1Count} Standard + ${tier2Count} Avancé + ${tier3Count} Expert`
              : plan.allowedTiers?.includes(1) && plan.allowedTiers?.includes(2)
                ? `${tier1Count} Standard + ${tier2Count} Avancé`
                : `${tier1Count} Standard`;

            const features = isTrial
              ? [
                  `${plan.maxAgents} ${t("agent Standard")}`,
                  `${plan.maxProspectsPerDay} ${t("prospects/jour")}`,
                  t("WhatsApp inclus"),
                  t("Support email"),
                  t("Dashboard basique"),
                ]
              : isPro
                ? [
                    `${plan.maxAgents} ${t("agents (Standard + Avancé)")}`,
                    `${plan.maxProspectsPerDay} ${t("prospects/jour")}`,
                    t("Multi WhatsApp"),
                    t("Rapports avancés"),
                    t("Support prioritaire"),
                    t("Agents Finance, Commerce, Juridique"),
                  ]
                : [
                    `${plan.maxAgents} ${t("agents (tous niveaux)")}`,
                    `${plan.maxProspectsPerDay} ${t("prospects/jour")}`,
                    t("API access"),
                    t("Multi-entreprise"),
                    t("Support dédié"),
                    t("Trading, Crypto, Divertissement"),
                  ];

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 transition-all duration-700 hover-lift ${
                  isPro
                    ? "bg-gradient-to-b from-primary to-secondary text-primary-foreground shadow-xl shadow-primary/20 border-2 border-primary"
                    : "glass-panel border-border/50"
                } ${isVisible("pricing") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${["trial", "pro", "max"].indexOf(plan.id) * 100}ms` }}
              >
                {isPro && (
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
                    {t("Populaire")}
                  </span>
                )}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className={`text-xs mt-1 ${isPro ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{plan.description}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold">{price}</span>
                  <span className={`text-sm ml-1 ${isPro ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {isTrial ? `· ${plan.trialDays ?? 7} ${t("jours")}` : "/mois"}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <span className={`shrink-0 ${isPro ? "text-white" : "text-green-500"}`}>✔</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className={`text-[10px] mb-4 p-2 rounded-lg ${isPro ? "bg-white/10" : "bg-muted/50"}`}>
                  <span className={isPro ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {tierLabels}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/welcome")}
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                    isPro
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {t("Choisir")} {plan.name}
                </button>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            💳 {t("Paiement local : Orange Money, Wave, MTN, Moov, M-Pesa, Stripe, PayPal, Crypto")}
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" data-animate className="relative z-10 px-5 py-24 max-w-3xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("faq") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Questions fréquentes")} ❓
          </h2>
        </div>
        <div className="space-y-4">
          {[
            {
              q: t("C'est quoi Baaraly exactement ?"),
              a: t("Baaraly est une plateforme de 30 agents IA spécialisés dans 8 domaines : Tech, Marketing, Finance, Trading, Crypto, Commerce, Juridique et Divertissement. Chaque agent travaille automatiquement pour toi 24h/24."),
            },
            {
              q: t("Comment fonctionne l'essai gratuit ?"),
              a: `${t("Tu as accès à")} ${trialDays} ${t("jours gratuits avec")} ${trialAgents} ${t("agent Standard et")} ${trialProspects} ${t("prospects/jour")}. ${t("Aucune carte bancaire n'est requise. Tu peux passer au plan Pro ou Max à tout moment.")}`,
            },
            {
              q: t("Quelle différence entre les plans ?"),
              a: `${t("Essai :")} ${tier1Count} ${t("agents Standard,")} ${trialProspects} ${t("prospects/jour")}. ${t("Pro :")} ${tier1Count + tier2Count} ${t("agents Standard + Avancé,")} 50 ${t("prospects/jour")}. ${t("Max : tous les")} 30 ${t("agents (Standard + Avancé + Expert),")} 200 ${t("prospects/jour")}.`,
            },
            {
              q: t("Est-ce que c'est vraiment automatique ?"),
              a: t("Oui. Une fois configuré, ton agent travaille 24h/24 sans intervention de ta part. Tu reçois les résultats sur WhatsApp et dans ton dashboard."),
            },
            {
              q: t("Comment je paie ?"),
              a: t("Tu recharges ton compte. Pas d'abonnement obligatoire, pas d'engagement. Paiement via Orange Money, Wave, MTN, Moov, M-Pesa, Stripe, PayPal ou Crypto."),
            },
            {
              q: t("Est-ce que ça marche dans mon pays ?"),
              a: t("Baaraly fonctionne dans toute l'Afrique de l'Ouest et Centrale : Burkina Faso, Mali, Sénégal, Côte d'Ivoire, Niger, Bénin, Togo, Ghana, Cameroun, Gabon, et plus encore. Aussi disponible en Europe."),
            },
            {
              q: t("Puis-je personnaliser mes agents ?"),
              a: t("Oui. Chaque agent est configurable : tu peux modifier ses capacités, son prompt système, ses outils et ses super-pouvoirs. Tu gardes le contrôle total."),
            },
            {
              q: t("Est-ce que mes données sont en sécurité ?"),
              a: t("Oui. Tes données sont chiffrées et ne sont jamais partagées avec des tiers. Tu gardes le contrôle total de tes agents et de tes informations."),
            },
          ].map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-700 ${
                isVisible("faq") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-accent/50 transition-colors"
              >
                <span className="font-semibold text-sm pr-4">{faq.q}</span>
                <span className={`text-lg transition-transform duration-300 shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className={`transition-all duration-300 ease-out ${openFaq === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative z-10 px-5 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t("Prêt à faire grandir ton business ?")} 🔥
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t("Rejoins les entrepreneurs qui utilisent les 30 agents IA de Baaraly pour prospecter, trader, gérer et créer")}
          </p>
          <button
            onClick={() => navigate("/welcome")}
            className="rounded-2xl px-10 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.98] bg-gradient-to-r from-primary to-secondary"
          >
            {t("Essayer maintenant")} →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 px-5 py-8 text-center border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Baaraly AI — {t("Fait avec")} ❤️ {t("en Afrique de l'Ouest")}
        </p>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function ChatMessage({ text, time, sent, visible }: { text: string; time: string; sent: boolean; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
        sent
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : "bg-muted text-foreground rounded-bl-sm"
      }`}>
        <p>{text}</p>
        <p className={`text-[9px] mt-1 ${sent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{time}</p>
      </div>
    </div>
  );
}
