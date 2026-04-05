import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router";
import { useLanguage } from "../context/LanguageContext";
import { useMode } from "../context/ModeContext";
import { ThemeLangToggle } from "../components/ThemeLangToggle";
import { BAARALI_AGENTS, getBillingPlan } from "@paperclipai/shared/baarali-agents";

export function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setMode } = useMode();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [chatStep, setChatStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const trialPlan = getBillingPlan("trial");
  const trialDays = trialPlan.trialDays ?? 7;
  const trialProspects = trialPlan.maxProspectsPerDay;

  const featuredAgents = BAARALI_AGENTS.filter((a) =>
    ["Aminata", "Sékou", "Ibrahim", "Mariama", "Aïcha"].includes(a.name),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 },
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
    <div className="bg-[#F5F5F7] dark:bg-[#000] text-foreground overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-5xl mx-auto backdrop-blur-sm sticky top-0 z-50 bg-[#F5F5F7]/80 dark:bg-[#000]/80">
        <div className="flex items-center gap-3">
          <img src="/baarali-logo.svg" alt="Baarali" className="w-10 h-10" />
          <img src="/baarali-wordmark-full.svg" alt="Baarali AI" className="h-9 dark:hidden" />
          <span className="text-xl font-extrabold tracking-tight hidden dark:inline">
            Baarali <span className="text-gradient">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeLangToggle compact />
          <button
            onClick={() => navigate("/welcome")}
            className="rounded-full bg-[#0071E3] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#0071E3]/25 active:scale-[0.97]"
          >
            {t("Connexion")}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="px-5 pt-16 pb-20 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse" />
              {trialDays} {t("jours gratuits")} 🎁
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {t("Ton entreprise tourne")}
              <br />
              <span className="text-gradient">{t("même quand tu dors")}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t("Baarali met à ta disposition des agents IA spécialisés qui gèrent tes clients, ton stock et tes finances — 24h/24, en français et en langues locales.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => { setMode("simple"); navigate("/welcome"); }}
                className="rounded-2xl px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[#0071E3]/20 transition-all hover:shadow-2xl hover:shadow-[#0071E3]/30 hover:-translate-y-1 active:scale-[0.98] bg-gradient-to-r from-[#0071E3] to-[#5E5CE6]"
              >
                ⚡ {t("Mode Simple")} — {t("Solo / TPE")} →
              </button>
              <button
                onClick={() => { setMode("pro"); navigate("/welcome"); }}
                className="rounded-2xl px-7 py-4 text-sm font-bold border-2 border-[#5E5CE6] text-[#5E5CE6] transition-all hover:bg-[#5E5CE6]/5 hover:-translate-y-1 active:scale-[0.98]"
              >
                🚀 {t("Mode Pro")} — {t("PME complète")} →
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {trialDays} {t("jours gratuits")} · {trialProspects} {t("prospects/jour")} · {t("Sans carte bancaire")}
            </p>
          </div>

          {/* WhatsApp Mockup */}
          <div className="hidden lg:block">
            <div className="relative mx-auto w-80">
              <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1e] shadow-2xl overflow-hidden">
                <div className="bg-[#0071E3]/10 px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0071E3] to-[#5E5CE6] flex items-center justify-center text-white font-bold text-sm">A</div>
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
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0071E3]/20 to-[#5E5CE6]/20 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLÈME ── */}
      <section id="problem" data-animate className="px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("problem") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-red-500 uppercase tracking-wider">{t("Le problème")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Tu en as assez de tout faire tout seul ?")} 😤
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { emoji: "📱", title: t("Répondre aux clients WhatsApp à toute heure"), desc: t("Tu passes tes nuits à répondre aux messages au lieu de dormir") },
            { emoji: "📊", title: t("Tenir ta comptabilité et gérer ton stock"), desc: t("Tu ne sais plus qui a payé, ce qui manque, ni où va l'argent") },
            { emoji: "📣", title: t("Trouver de nouveaux clients chaque semaine"), desc: t("Sans prospection, ton chiffre d'affaires stagne") },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1e] p-6 transition-all duration-700 hover:-translate-y-1 ${
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
        <p className="text-center text-lg font-semibold mt-10 text-[#0071E3]">
          {t("Baarali s'occupe de tout ça pour toi.")} 🤖
        </p>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section id="how-it-works" data-animate className="px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible("how-it-works") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-[#0071E3] uppercase tracking-wider">{t("Processus")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Simple comme bonjour")} ⚡
          </h2>
        </div>
        <div className="relative">
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0071E3] via-[#5E5CE6] to-[#0071E3] opacity-30" />
          <div className="space-y-8 sm:space-y-12">
            {[
              { n: 1, title: t("Tu décris ton activité"), desc: t("Boutique, agriculture, services... Dis-nous ce que tu fais") },
              { n: 2, title: t("Tu choisis tes agents"), desc: t("Des assistants spécialisés dans ton domaine") },
              { n: 3, title: t("Ils travaillent, tu encaisses"), desc: t("Ton équipe digitale est opérationnelle 24h/24") },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 sm:gap-6 transition-all duration-700 ${
                  isVisible("how-it-works") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#0071E3] to-[#5E5CE6] flex items-center justify-center shrink-0 shadow-lg shadow-[#0071E3]/20">
                  <span className="text-xs sm:text-sm font-bold text-white">{item.n}</span>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENTS VEDettes ── */}
      <section id="agents" data-animate className="px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("agents") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-[#5E5CE6] uppercase tracking-wider">{t("Tes agents")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Tes nouveaux employés digitaux")} 🎯
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredAgents.map((a, i) => (
            <div
              key={a.name}
              className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1e] p-5 text-center transition-all duration-700 hover:-translate-y-1 ${
                isVisible("agents") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="text-3xl block mb-2">{a.emoji}</span>
              <p className="font-bold text-sm">{a.name}</p>
              <p className="text-[10px] text-[#0071E3] font-medium">{a.role}</p>
              <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2">{a.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          {t("Et bien d'autres agents spécialisés pour tous les secteurs d'activité.")}
        </p>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/welcome")}
            className="rounded-xl px-6 py-3 text-sm font-semibold border-2 border-[#0071E3]/30 text-[#0071E3] transition-all hover:bg-[#0071E3]/5"
          >
            {t("Découvrir tous les agents")} →
          </button>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="testimonials" data-animate className="px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("testimonials") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-[#0071E3] uppercase tracking-wider">{t("Témoignages")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Ce qu'ils disent")} 💬
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              name: "Fatima",
              location: "Commerçante, Ouagadougou",
              text: t("Aminata répond à mes clients WhatsApp même la nuit. J'ai gagné 3 heures par jour."),
              initials: "F",
            },
            {
              name: "Kofi",
              location: "Agriculteur, Côte d'Ivoire",
              text: t("Sékou me donne les prix du marché chaque matin. Je vends mieux qu'avant."),
              initials: "K",
            },
            {
              name: "Moussa",
              location: "Gérant PME, Sénégal",
              text: t("Ibrahim gère ma comptabilité OHADA. Mon comptable est moins stressé."),
              initials: "M",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1e] p-6 transition-all duration-700 hover:-translate-y-1 ${
                isVisible("testimonials") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* TODO: Remplacer par vrais témoignages */}
              <p className="text-sm italic mb-4 leading-relaxed">"{item.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0071E3] to-[#5E5CE6] flex items-center justify-center text-xs font-bold text-white">
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

      {/* ── PRICING RÉSUMÉ ── */}
      <section id="pricing-summary" data-animate className="px-5 py-24 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("pricing-summary") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-[#0071E3] uppercase tracking-wider">{t("Tarifs")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Un prix juste pour chaque étape")} 💰
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { name: "Essai Gratuit", price: "0 FCFA", sub: "7 jours", color: "#30D158", features: ["1 agent Standard", "WhatsApp inclus", "Dashboard basique"], cta: t("Commencer gratuitement") },
            { name: "Pro", price: "30 000 FCFA", sub: "/mois · ~1 000 FCFA/jour", color: "#0071E3", popular: true, features: ["10 agents (Standard + Avancé)", "Multi WhatsApp", "Rapports avancés"], cta: t("Choisir Pro") },
            { name: "Max", price: "95 000 FCFA", sub: "/mois · Pour les entreprises", color: "#BF5AF2", features: ["Tous les agents", "API access", "Support dédié"], cta: t("Choisir Max") },
          ].map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-[20px] p-6 transition-all duration-700 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-gradient-to-b from-[#0071E3] to-[#0071E3]/80 text-white shadow-xl shadow-[#0071E3]/20 scale-[1.02]"
                  : "bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-gray-800"
              } ${isVisible("pricing-summary") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.popular && (
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
                  ⭐ {t("Populaire")}
                </span>
              )}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className={`text-sm ml-1 ${plan.popular ? "text-white/70" : "text-muted-foreground"}`}>{plan.sub}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <span className={`shrink-0 ${plan.popular ? "text-white" : "text-green-500"}`}>✔</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/welcome")}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                  plan.popular ? "bg-white text-[#0071E3] hover:bg-white/90" : "bg-[#0071E3] text-white hover:bg-[#0071E3]/90"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/pricing")}
            className="text-sm font-semibold text-[#0071E3] underline underline-offset-4 hover:opacity-80"
          >
            {t("Voir tous les détails")} →
          </button>
        </div>
      </section>

      {/* ── WHATSAPP CTA ── */}
      <section className="px-5 py-24">
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-[#0071E3] to-[#5E5CE6] p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{t("Connecte WhatsApp en 2 minutes")}</h2>
          <p className="text-base sm:text-lg text-white/80 max-w-md mx-auto mb-8">
            {t("Tes agents répondent à tes clients directement sur WhatsApp. Pas d'app à installer. Pas de formation.")}
          </p>
          <button
            onClick={() => navigate("/welcome")}
            className="rounded-2xl px-10 py-4 text-base font-bold bg-white text-[#0071E3] shadow-xl transition-all hover:-translate-y-1 active:scale-[0.98]"
          >
            {t("Commencer maintenant")} →
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" data-animate className="px-5 py-24 max-w-3xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("faq") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-[#0071E3] uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Questions fréquentes")} ❓
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { q: t("C'est quoi Baarali exactement ?"), a: t("Baarali est une plateforme d'agents IA spécialisés qui travaillent pour ton entreprise 24h/24. Chaque agent a un rôle précis : gestion de boutique, comptabilité, prospection, support client...") },
            { q: t("Comment fonctionne l'essai gratuit ?"), a: `${t("Tu as accès à")} ${trialDays} ${t("jours gratuits avec")} ${trialProspects} ${t("prospects/jour")}. ${t("Aucune carte bancaire n'est requise.")}` },
            { q: t("Est-ce que c'est vraiment automatique ?"), a: t("Oui. Une fois configuré, ton agent travaille 24h/24 sans intervention de ta part. Tu reçois les résultats sur WhatsApp et dans ton dashboard.") },
            { q: t("Comment je paie ?"), a: t("Tu recharges ton compte. Pas d'abonnement obligatoire. Paiement via Orange Money, Wave, MTN, Moov, M-Pesa, Stripe, PayPal ou Crypto.") },
            { q: t("Est-ce que ça marche dans mon pays ?"), a: t("Baarali fonctionne dans toute l'Afrique de l'Ouest et Centrale : Burkina Faso, Mali, Sénégal, Côte d'Ivoire, Niger, Bénin, Togo, Ghana, Cameroun, Gabon, et plus encore.") },
            { q: t("Puis-je essayer gratuitement ?"), a: `${t("Oui !")} ${trialDays} ${t("jours gratuits sans carte bancaire pour tester Baarali")}.` },
          ].map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1c1c1e] overflow-hidden transition-all duration-700 ${
                isVisible("faq") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
              >
                <span className="font-semibold text-sm pr-4">{faq.q}</span>
                <span className={`text-lg transition-transform duration-300 shrink-0 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              <div className={`transition-all duration-300 ease-out ${openFaq === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-5 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t("Prêt à faire grandir ton business ?")} 🔥
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t("Rejoins les entrepreneurs qui utilisent l'IA pour grandir")}
          </p>
          <button
            onClick={() => navigate("/welcome")}
            className="rounded-2xl px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#0071E3]/20 transition-all hover:shadow-2xl hover:shadow-[#0071E3]/30 hover:-translate-y-1 active:scale-[0.98] bg-gradient-to-r from-[#0071E3] to-[#5E5CE6]"
          >
            {t("Essayer maintenant")} →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-5 py-8 text-center border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/baarali-logo.svg" alt="Baarali" className="w-8 h-8" />
            <img src="/baarali-wordmark-full.svg" alt="Baarali AI" className="h-7 dark:hidden" />
            <p className="text-lg font-extrabold hidden dark:inline">
              Baarali <span className="text-gradient">AI</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            {t("L'IA qui fait prospérer ton entreprise")}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
            <button onClick={() => navigate("/")} className="hover:text-foreground">{t("Accueil")}</button>
            <span>·</span>
            <button onClick={() => navigate("/pricing")} className="hover:text-foreground">{t("Tarifs")}</button>
            <span>·</span>
            <button onClick={() => navigate("/")} className="hover:text-foreground">{t("Contact")}</button>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Baarali — Benewende Group SARL
          </p>
        </div>
      </footer>
    </div>
  );
}

function ChatMessage({ text, time, sent, visible }: { text: string; time: string; sent: boolean; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
        sent ? "bg-[#0071E3] text-white rounded-br-sm" : "bg-gray-100 dark:bg-[#2c2c2e] text-foreground rounded-bl-sm"
      }`}>
        <p>{text}</p>
        <p className={`text-[9px] mt-1 ${sent ? "text-white/60" : "text-muted-foreground"}`}>{time}</p>
      </div>
    </div>
  );
}
