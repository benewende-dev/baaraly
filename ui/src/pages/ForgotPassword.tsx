import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { useLanguage } from "../context/LanguageContext";

type ForgotStep = "request" | "sent" | "reset";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState<ForgotStep>("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // TODO: Call password reset API when available
      // await authApi.forgotPassword({ email: email.trim() });
      await new Promise((r) => setTimeout(r, 1000));
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8 || password !== confirmPassword) return;
    setLoading(true);
    setError(null);
    try {
      // TODO: Call password reset API when available
      // await authApi.resetPassword({ token, password });
      await new Promise((r) => setTimeout(r, 1000));
      navigate("/auth");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F5F5F7]">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <img src="/baarali-logo.svg" alt="Baarali" className="w-10 h-10" />
          <span className="text-xl font-extrabold tracking-tight text-[#1A1A2E]">
            Baarali <span className="text-gradient">AI</span>
          </span>
        </div>

        {/* Step 1: Request */}
        {step === "request" && (
          <>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">
              {t("Mot de passe oublié ?")}
            </h1>
            <p className="mt-2 text-[15px] text-[#666666]">
              {t("Entre ton email et on t'envoie un lien pour le réinitialiser")}
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleSendLink}>
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
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              {error && (
                <div className="rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 px-4 py-3 text-sm text-[#FF453A]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full rounded-xl bg-[#0071E3] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#0062CC] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                ) : null}
                {t("Envoyer le lien")}
              </button>
            </form>
            <div className="mt-5 text-sm text-[#666666] text-center">
              <button type="button" className="font-semibold text-[#0071E3] hover:underline" onClick={() => navigate("/auth")}>
                ← {t("Retour à la connexion")}
              </button>
            </div>
          </>
        )}

        {/* Step 2: Sent */}
        {step === "sent" && (
          <>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h1 className="text-2xl font-bold text-[#1A1A2E]">
                {t("Lien envoyé !")}
              </h1>
              <p className="mt-3 text-[15px] text-[#666666]">
                {t("Un email a été envoyé à")} <span className="font-medium text-[#1A1A2E]">{email}</span>
              </p>
              <p className="mt-1 text-sm text-[#999999]">
                {t("Vérifie aussi tes spams.")}
              </p>
              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#0071E3] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#0062CC] active:scale-[0.98]"
                  onClick={() => setStep("reset")}
                >
                  {t("J'ai le lien, réinitialiser")}
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-[#E0E0E5] py-3.5 text-sm font-semibold text-[#1A1A2E] transition-all hover:bg-[#F5F5F7]"
                  onClick={() => navigate("/auth")}
                >
                  {t("Retour à la connexion")}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Reset */}
        {step === "reset" && (
          <>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">
              {t("Nouveau mot de passe")}
            </h1>
            <p className="mt-2 text-[15px] text-[#666666]">
              {t("Choisis un nouveau mot de passe pour ton compte")}
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleReset}>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-[#1A1A2E] mb-1.5 block">
                  {t("Nouveau mot de passe")}
                </label>
                <input
                  id="password"
                  className="w-full rounded-xl border border-[#E0E0E5] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/20 placeholder:text-[#999999]"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {password.length > 0 && password.length < 8 && (
                  <p className="text-xs text-[#FF453A] mt-1.5">{t("Minimum 8 caractères")}</p>
                )}
              </div>
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs text-[#FF453A] mt-1.5">{t("Les mots de passe ne correspondent pas")}</p>
                )}
              </div>
              {error && (
                <div className="rounded-xl bg-[#FF453A]/10 border border-[#FF453A]/20 px-4 py-3 text-sm text-[#FF453A]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || password.length < 8 || password !== confirmPassword}
                className="w-full rounded-xl bg-[#0071E3] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#0062CC] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                ) : null}
                {t("Réinitialiser")}
              </button>
            </form>
            <div className="mt-5 text-sm text-[#666666] text-center">
              <button type="button" className="font-semibold text-[#0071E3] hover:underline" onClick={() => navigate("/auth")}>
                ← {t("Retour à la connexion")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
