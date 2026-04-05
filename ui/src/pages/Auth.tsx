import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "@/lib/router";
import { authApi } from "../api/auth";
import { queryKeys } from "../lib/queryKeys";
import { useLanguage } from "../context/LanguageContext";

type AuthMode = "sign_in" | "sign_up";

const COUNTRIES = [
  { id: "bf", label: "Burkina Faso", code: "+226" },
  { id: "ci", label: "Côte d'Ivoire", code: "+225" },
  { id: "sn", label: "Sénégal", code: "+221" },
  { id: "ml", label: "Mali", code: "+223" },
  { id: "ne", label: "Niger", code: "+227" },
  { id: "bj", label: "Bénin", code: "+229" },
  { id: "tg", label: "Togo", code: "+228" },
  { id: "cm", label: "Cameroun", code: "+237" },
  { id: "ga", label: "Gabon", code: "+241" },
  { id: "gh", label: "Ghana", code: "+233" },
  { id: "ng", label: "Nigeria", code: "+234" },
  { id: "fr", label: "France", code: "+33" },
];

const SECTORS = [
  { id: "commerce", label: "Commerce" },
  { id: "agriculture", label: "Agriculture" },
  { id: "services", label: "Services" },
  { id: "transport", label: "Transport" },
  { id: "restauration", label: "Restauration" },
  { id: "artisanat", label: "Artisanat" },
  { id: "tech", label: "Tech & Digital" },
  { id: "autre", label: "Autre" },
];

export function AuthPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState("bf");
  const [sector, setSector] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const selectedCountry = COUNTRIES.find((c) => c.id === country) ?? COUNTRIES[0];

  const nextPath = useMemo(() => searchParams.get("next") || "/", [searchParams]);
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authApi.getSession(),
    retry: false,
  });

  useEffect(() => {
    if (session) {
      navigate(nextPath, { replace: true });
    }
  }, [session, navigate, nextPath]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "sign_in") {
        await authApi.signInEmail({ email: email.trim(), password });
        return;
      }
      await authApi.signUpEmail({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      // Store PME info for onboarding
      try {
        sessionStorage.setItem("baarali.signup.meta", JSON.stringify({
          country,
          sector,
          whatsapp: whatsapp.trim(),
          phoneCode: selectedCountry.code,
        }));
      } catch {
        // ignore
      }
    },
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      await queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      navigate(nextPath, { replace: true });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : t("Authentication failed"));
    },
  });

  const canSubmit =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    (mode === "sign_in" || (
      name.trim().length > 0 &&
      password.trim().length >= 8 &&
      password === confirmPassword
    ));

  if (isSessionLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F5F5F7]">
        <p className="text-sm text-muted-foreground">{t("Loading…")}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-[#F5F5F7]">
      {/* Left half — form */}
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto">
        <div className="w-full max-w-md mx-auto my-auto px-6 sm:px-8 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/baarali-logo.svg" alt="Baarali" className="w-10 h-10" />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#1A1A2E]">
                Baarali <span className="text-gradient">AI</span>
              </span>
              <p className="text-[11px] text-[#666666] -mt-0.5">
                {t("L'IA qui fait prospérer ton entreprise")}
              </p>
            </div>
          </div>

          {/* Sign In */}
          {mode === "sign_in" && (
            <>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">
                {t("Bon retour parmi nous")}
              </h1>
              <p className="mt-2 text-[15px] text-[#666666]">
                {t("Connecte-toi pour accéder à ton tableau de bord")}
              </p>
            </>
          )}

          {/* Sign Up */}
          {mode === "sign_up" && (
            <>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">
                {t("Crée ton compte gratuitement")}
              </h1>
              <p className="mt-2 text-[15px] text-[#666666]">
                {t("7 jours d'essai. Sans carte bancaire.")}
              </p>
            </>
          )}

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (mutation.isPending) return;
              if (!canSubmit) {
                if (mode === "sign_up" && password !== confirmPassword) {
                  setError(t("Les mots de passe ne correspondent pas"));
                } else {
                  setError(t("Please fill in all required fields."));
                }
                return;
              }
              mutation.mutate();
            }}
          >
            {/* Sign Up: PME Info */}
            {mode === "sign_up" && (
              <>
                {/* Nom complet */}
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                    {t("Prénom et Nom")}
                  </label>
                  <input
                    id="name"
                    className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
                    placeholder="Ex: Aminata Diallo"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    autoFocus
                  />
                </div>

                {/* Secteur + Pays */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="sector" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                      {t("Secteur d'activité")}
                    </label>
                    <select
                      id="sector"
                      className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 appearance-none"
                      value={sector}
                      onChange={(event) => setSector(event.target.value)}
                    >
                      <option value="">{t("Sélectionner")}</option>
                      {SECTORS.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="country" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                      {t("Pays")}
                    </label>
                    <select
                      id="country"
                      className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 appearance-none"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="whatsapp" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                    {t("Numéro WhatsApp")} <span className="text-[#999999] font-normal">({t("optionnel")})</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-xl border border-[#E0E0E5] bg-[#F5F5F7] px-3 py-3 text-sm text-[#666666] font-mono">
                      {selectedCountry.code}
                    </span>
                    <input
                      id="whatsapp"
                      className="flex-1 rounded-xl border border-[#E0E0E5] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
                      placeholder="XX XX XX XX"
                      value={whatsapp}
                      onChange={(event) => setWhatsapp(event.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                {t("Adresse email")}
              </label>
              <input
                id="email"
                className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                autoFocus={mode === "sign_in"}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-[#1A1A2E]">
                  {t("Mot de passe")}
                </label>
                {mode === "sign_in" && (
                  <button
                    type="button"
                    className="text-xs text-[#0071E3] hover:underline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    {t("Mot de passe oublié ?")}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3 pr-12 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="m14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {mode === "sign_up" && password.length > 0 && password.length < 8 && (
                <p className="text-xs text-[#FF453A] mt-1.5">{t("Minimum 8 caractères")}</p>
              )}
            </div>

            {/* Confirm Password (sign up only) */}
            {mode === "sign_up" && (
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                  {t("Confirmer le mot de passe")}
                </label>
                <input
                  id="confirmPassword"
                  className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs text-[#FF453A] mt-1.5">{t("Les mots de passe ne correspondent pas")}</p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 px-4 py-3 text-sm text-[#FF453A]">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit || mutation.isPending}
              className="w-full rounded-xl bg-[#0071E3] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#0062CC] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  {t("Chargement…")}
                </>
              ) : mode === "sign_in" ? (
                t("Se connecter")
              ) : (
                t("Créer mon compte")
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-5 text-sm text-[#666666] text-center">
            {mode === "sign_in" ? t("Pas encore de compte ?") : t("Déjà un compte ?")}{" "}
            <button
              type="button"
              className="font-semibold text-[#0071E3] hover:underline"
              onClick={() => {
                setError(null);
                setName("");
                setCountry("bf");
                setSector("");
                setWhatsapp("");
                setPassword("");
                setConfirmPassword("");
                setMode(mode === "sign_in" ? "sign_up" : "sign_in");
              }}
            >
              {mode === "sign_in" ? t("Créer un compte") : t("Se connecter")}
            </button>
          </div>

          {/* Terms */}
          {mode === "sign_up" && (
            <p className="mt-3 text-[11px] text-[#999999] text-center">
              {t("En créant un compte tu acceptes nos")}{" "}
              <button type="button" className="text-[#0071E3] hover:underline">
                {t("conditions d'utilisation")}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Right half — Baarali branding (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0071E3] to-[#0056B3] flex-col justify-center px-12 text-white">
        <div className="max-w-sm">
          <img src="/baarali-logo.svg" alt="Baarali" className="w-16 h-16 mb-8 opacity-90" />
          <h2 className="text-3xl font-extrabold mb-6 leading-tight">
            {t("Ton entreprise tourne même quand tu dors")}
          </h2>
          <div className="space-y-4 mb-10">
            {[
              t("Des agents IA qui travaillent pour toi 24h/24"),
              t("WhatsApp connecté en quelques minutes"),
              t("En français et langues locales"),
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#30D158] font-bold mt-0.5">✓</span>
                <span className="text-white/90 text-[15px]">{item}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/10">
            <p className="text-sm text-white/90 italic leading-relaxed">
              "{t("Aminata répond à mes clients même la nuit. J'ai gagné 3 heures par jour.")}"
            </p>
            <p className="text-xs text-white/60 mt-3">
              — {t("Fatima, commerçante à Ouagadougou")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
