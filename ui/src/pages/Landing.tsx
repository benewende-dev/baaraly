import { useEffect, useState, useRef } from "react";
import { useNavigate } from "@/lib/router";
import { useLanguage } from "../context/LanguageContext";

export function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [chatStep, setChatStep] = useState(0);

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
        <button
          onClick={() => navigate("/welcome")}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]"
        >
          {t("Connexion")}
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 px-5 pt-16 pb-20 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-primary/10 text-primary mb-6 animate-pulse-glow">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t("1 000 FCFA offerts à l'inscription")} 🎁
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="text-gradient">{t("Un agent IA")}</span>
              <br />
              {t("qui trouve des clients pour toi")}
              <span className="block text-primary mt-2">{t("sur WhatsApp")}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t("Baaraly travaille pour toi automatiquement. Tu dors, il prospecte. Tu te réveilles, t'as des clients.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/welcome")}
                className="rounded-2xl px-8 py-4 text-base font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.98] bg-gradient-to-r from-primary to-secondary"
              >
                {t("Tester gratuitement")} →
              </button>
              <button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-2xl px-8 py-4 text-base font-semibold border-2 border-border transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                {t("Comment ça marche ?")}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {t("Pas de carte bancaire. 1 000 FCFA offerts.")}
            </p>
          </div>

          {/* WhatsApp Mockup */}
          <div className="hidden lg:block">
            <div className="relative mx-auto w-80 animate-float">
              <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
                {/* Chat header */}
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
                {/* Chat messages */}
                <div className="p-4 space-y-3 min-h-[280px]">
                  <ChatMessage
                    text={t("J'ai trouvé 5 nouveaux prospects aujourd'hui !")}
                    time="09:30"
                    sent={false}
                    visible={chatStep >= 1}
                  />
                  <ChatMessage
                    text={t("3 ont répondu positivement")}
                    time="09:31"
                    sent={false}
                    visible={chatStep >= 2}
                  />
                  <ChatMessage
                    text={t("Super ! Envoie-moi le rapport")}
                    time="09:32"
                    sent={true}
                    visible={chatStep >= 3}
                  />
                  <ChatMessage
                    text={t("Voilà, c'est fait ! 📊")}
                    time="09:33"
                    sent={false}
                    visible={chatStep >= 4}
                  />
                </div>
              </div>
              {/* Glow behind mockup */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLÈME ── */}
      <section
        id="problem"
        data-animate
        className="relative z-10 px-5 py-24 max-w-4xl mx-auto"
      >
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("problem") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-destructive uppercase tracking-wider">{t("Le problème")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Tu perds du temps à chercher des clients")} 😤
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { emoji: "⏰", title: t("Tu passes des heures sur WhatsApp"), desc: t("À envoyer des messages un par un, sans résultat"), delay: 0 },
            { emoji: "📉", title: t("Pas de système"), desc: t("Tu ne sais pas qui relancer, quand, ni comment"), delay: 100 },
            { emoji: "💸", title: t("Tu perds de l'argent"), desc: t("Chaque jour sans client, c'est du chiffre d'affaires perdu"), delay: 200 },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all duration-700 hover-lift ${
                isVisible("problem") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <span className="text-4xl block mb-4">{item.emoji}</span>
              <p className="font-semibold text-sm mb-2">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section
        id="solution"
        data-animate
        className="relative z-10 px-5 py-24 max-w-4xl mx-auto"
      >
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("solution") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("La solution")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Baaraly travaille pour toi")} 🤖
          </h2>
          <p className="text-muted-foreground mt-3">{t("Automatiquement. 24h/24. 7j/7.")}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { emoji: "🔍", title: t("Trouve des prospects"), desc: t("L'IA identifie tes clients potentiels"), delay: 0 },
            { emoji: "📨", title: t("Envoie des messages"), desc: t("Messages personnalisés automatiques"), delay: 100 },
            { emoji: "📊", title: t("Te fait un rapport"), desc: t("Tu vois tout dans ton dashboard"), delay: 200 },
          ].map((item, i) => (
            <div
              key={i}
              className={`glass-panel rounded-2xl p-6 text-center transition-all duration-700 hover-lift ${
                isVisible("solution") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <span className="text-4xl block mb-4 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>{item.emoji}</span>
              <p className="font-semibold text-sm mb-2">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section
        id="how-it-works"
        data-animate
        className="relative z-10 px-5 py-24 max-w-4xl mx-auto"
      >
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible("how-it-works") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">{t("Processus")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Comment ça marche")} ⚡
          </h2>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary opacity-30" />
          <div className="space-y-12">
            {[
              { n: 1, text: t("Tu choisis ton agent (Aminata, Mariama, Ibrahim...)"), delay: 0 },
              { n: 2, text: t("Il commence à travailler immédiatement"), delay: 150 },
              { n: 3, text: t("Tu reçois les résultats sur WhatsApp"), delay: 300 },
              { n: 4, text: t("Tu gagnes des clients sans effort"), delay: 450 },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-6 transition-all duration-700 ${
                  isVisible("how-it-works") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <span className="text-sm font-bold text-white">{item.n}</span>
                </div>
                <p className="text-base font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFRE ── */}
      <section
        id="offer"
        data-animate
        className="relative z-10 px-5 py-24 max-w-4xl mx-auto"
      >
        <div className={`rounded-3xl bg-gradient-to-r from-primary to-secondary p-1 transition-all duration-700 ${isVisible("offer") ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="rounded-[22px] bg-background p-8 sm:p-12 text-center">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("Offre de lancement")}</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mt-4 mb-2">
              1 000 FCFA <span className="text-gradient">{t("offerts")}</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t("Ensuite, recharge à partir de 1 000 FCFA. Pas d'engagement.")}
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
      <section
        id="testimonials"
        data-animate
        className="relative z-10 px-5 py-24 max-w-4xl mx-auto"
      >
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible("testimonials") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("Témoignages")}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
            {t("Ils utilisent Baaraly")} 💬
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: "Fatou D.", location: "Ouagadougou", text: t("J'ai eu 3 nouveaux clients en 2 jours, sans rien faire"), initials: "FD" },
            { name: "Moussa K.", location: "Bamako", text: t("Mon agent m'envoie un rapport chaque matin. C'est magique"), initials: "MK" },
            { name: "Aïssata B.", location: "Dakar", text: t("Je recommande à tous les commerçants"), initials: "AB" },
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

      {/* ── CTA FINAL ── */}
      <section className="relative z-10 px-5 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {t("Prêt à trouver des clients ?")} 🔥
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t("Rejoins les entrepreneurs qui utilisent l'IA pour grandir")}
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
