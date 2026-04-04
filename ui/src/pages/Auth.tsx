import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "@/lib/router";
import { authApi } from "../api/auth";
import { queryKeys } from "../lib/queryKeys";
import { useLanguage } from "../context/LanguageContext";

type AuthMode = "sign_in" | "sign_up";

export function AuthPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

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
    (mode === "sign_in" || (name.trim().length > 0 && password.trim().length >= 8));

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
        <div className="w-full max-w-md mx-auto my-auto px-6 sm:px-8 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <img src="/baaraly-logo.svg" alt="Baaraly" className="w-10 h-10" />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#1A1A2E]">
                Baaraly <span className="text-gradient">AI</span>
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
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (mutation.isPending) return;
              if (!canSubmit) {
                setError(t("Please fill in all required fields."));
                return;
              }
              mutation.mutate();
            }}
          >
            {/* Name (sign up only) */}
            {mode === "sign_up" && (
              <div>
                <label htmlFor="name" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                  {t("Prénom et Nom")}
                </label>
                <input
                  id="name"
                  className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3.5 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
                  placeholder="Ex: Aminata Diallo"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  autoFocus
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                {t("Adresse email")}
              </label>
              <input
                id="email"
                className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3.5 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
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
                    onClick={() => {/* TODO: password reset */}}
                  >
                    {t("Mot de passe oublié ?")}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3.5 pr-12 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
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
              className="w-full rounded-xl bg-[#0071E3] py-4 text-sm font-semibold text-white transition-all hover:bg-[#0062CC] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <div className="mt-6 text-sm text-[#666666] text-center">
            {mode === "sign_in" ? t("Pas encore de compte ?") : t("Déjà un compte ?")}{" "}
            <button
              type="button"
              className="font-semibold text-[#0071E3] hover:underline"
              onClick={() => {
                setError(null);
                setMode(mode === "sign_in" ? "sign_up" : "sign_in");
              }}
            >
              {mode === "sign_in" ? t("Créer un compte") : t("Se connecter")}
            </button>
          </div>

          {/* Terms */}
          {mode === "sign_up" && (
            <p className="mt-4 text-[11px] text-[#999999] text-center">
              {t("En créant un compte tu acceptes nos")}{" "}
              <button type="button" className="text-[#0071E3] hover:underline">
                {t("conditions d'utilisation")}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Right half — Baaraly branding (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#0071E3] to-[#0056B3] flex-col justify-center px-12 text-white">
        <div className="max-w-sm">
          <img src="/baaraly-logo.svg" alt="Baaraly" className="w-16 h-16 mb-8 opacity-90" />
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
