import { useNavigate } from "@/lib/router";
import { useLanguage } from "../context/LanguageContext";

const HERO_GRADIENT = "linear-gradient(135deg, #0071E3 0%, #00C853 100%)";

export function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-4xl mx-auto">
        <span className="text-xl font-extrabold tracking-tight">
          Baaraly <span className="text-primary">AI</span>
        </span>
        <button
          onClick={() => navigate("/welcome")}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.97]"
        >
          {t("Connexion")}
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="px-5 pt-12 pb-16 text-center max-w-2xl mx-auto">
        <div
          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-white mb-6"
          style={{ background: HERO_GRADIENT }}
        >
          {t("1 000 FCFA offerts à l'inscription")} 🎁
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5">
          {t("Un agent IA qui trouve des clients pour toi")}
          <span className="block text-primary mt-1">{t("sur WhatsApp")}</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-8">
          {t("Baaraly travaille pour toi automatiquement. Tu dors, il prospecte. Tu te réveilles, t'as des clients.")}
        </p>
        <button
          onClick={() => navigate("/welcome")}
          className="rounded-2xl px-8 py-4 text-base font-bold text-white shadow-xl transition hover:opacity-90 active:scale-[0.97]"
          style={{ background: HERO_GRADIENT }}
        >
          {t("Tester gratuitement")} →
        </button>
        <p className="text-xs text-muted-foreground mt-3">
          {t("Pas de carte bancaire. 1 000 FCFA offerts.")}
        </p>
      </section>

      {/* ── PROBLÈME ── */}
      <section className="px-5 py-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("Tu perds du temps à chercher des clients")} 😤
        </h2>
        <div className="space-y-4">
          <ProblemCard
            emoji="⏰"
            title={t("Tu passes des heures sur WhatsApp")}
            desc={t("À envoyer des messages un par un, sans résultat")}
          />
          <ProblemCard
            emoji="📉"
            title={t("Pas de système")}
            desc={t("Tu ne sais pas qui relancer, quand, ni comment")}
          />
          <ProblemCard
            emoji="💸"
            title={t("Tu perds de l'argent")}
            desc={t("Chaque jour sans client, c'est du chiffre d'affaires perdu")}
          />
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="px-5 py-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">
          {t("Baaraly travaille pour toi")} 🤖
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          {t("Automatiquement. 24h/24.")}
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <SolutionCard
            emoji="🔍"
            title={t("Trouve des prospects")}
            desc={t("L'IA identifie tes clients potentiels")}
          />
          <SolutionCard
            emoji="📨"
            title={t("Envoie des messages")}
            desc={t("Messages personnalisés automatiques")}
          />
          <SolutionCard
            emoji="📊"
            title={t("Te fait un rapport")}
            desc={t("Tu vois tout dans ton dashboard")}
          />
        </div>
      </section>

      {/* ── DÉMO / SOCIAL PROOF ── */}
      <section className="px-5 py-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">
          {t("Comment ça marche")} ⚡
        </h2>
        <div className="space-y-6 text-left max-w-md mx-auto">
          <StepItem n={1} text={t("Tu choisis ton agent (Aminata, Mariama, Ibrahim...)")} />
          <StepItem n={2} text={t("Il commence à travailler immédiatement")} />
          <StepItem n={3} text={t("Tu reçois les résultats sur WhatsApp")} />
          <StepItem n={4} text={t("Tu gagnes des clients sans effort")} />
        </div>
      </section>

      {/* ── OFFRE ── */}
      <section className="px-5 py-16 max-w-lg mx-auto">
        <div
          className="rounded-3xl p-8 text-center text-white"
          style={{ background: HERO_GRADIENT }}
        >
          <p className="text-sm font-semibold opacity-90 mb-2">{t("Offre de lancement")}</p>
          <h2 className="text-3xl font-extrabold mb-2">1 000 FCFA {t("offerts")}</h2>
          <p className="text-sm opacity-90 mb-6">
            {t("Ensuite, recharge à partir de 1 000 FCFA")}
          </p>
          <button
            onClick={() => navigate("/welcome")}
            className="rounded-2xl bg-white px-8 py-3.5 text-base font-bold shadow-lg transition hover:opacity-90 active:scale-[0.97]"
            style={{ color: "#0071E3" }}
          >
            {t("Commencer maintenant")} 🚀
          </button>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="px-5 py-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t("Ils utilisent Baaraly")} 💬
        </h2>
        <div className="space-y-4">
          <TestimonialCard
            name="Fatou D."
            location="Ouagadougou"
            text={t("J'ai eu 3 nouveaux clients en 2 jours, sans rien faire")}
          />
          <TestimonialCard
            name="Moussa K."
            location="Bamako"
            text={t("Mon agent m'envoie un rapport chaque matin. C'est magique")}
          />
          <TestimonialCard
            name="Aïssata B."
            location="Dakar"
            text={t("Je recommande à tous les commerçants")}
          />
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-5 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
          {t("Prêt à trouver des clients ?")} 🔥
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t("Rejoins les entrepreneurs qui utilisent l'IA pour grandir")}
        </p>
        <button
          onClick={() => navigate("/welcome")}
          className="rounded-2xl px-8 py-4 text-base font-bold text-white shadow-xl transition hover:opacity-90 active:scale-[0.97]"
          style={{ background: HERO_GRADIENT }}
        >
          {t("Essayer maintenant")} →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-5 py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Baaraly AI — {t("Fait avec")} ❤️ {t("en Afrique de l'Ouest")}
        </p>
      </footer>
    </div>
  );
}

/* ── Sub-components ── */

function ProblemCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <span className="text-2xl shrink-0">{emoji}</span>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
}

function SolutionCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-center">
      <span className="text-3xl block mb-3">{emoji}</span>
      <p className="font-semibold text-sm mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function StepItem({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-primary">{n}</span>
      </div>
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}

function TestimonialCard({ name, location, text }: { name: string; location: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm italic mb-3">"{text}"</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
          {name[0]}
        </div>
        <div>
          <p className="text-xs font-semibold">{name}</p>
          <p className="text-[10px] text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  );
}
