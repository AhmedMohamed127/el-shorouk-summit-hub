import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — لوحة التحكم" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/admin`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success(t("تم إنشاء الحساب", "Account created"));
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("تم تسجيل الدخول", "Signed in"));
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-dvh bg-navy-deep flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-black text-center mb-1">
          {t("لوحة تحكم BIS", "BIS Admin")}
        </h1>
        <p className="text-center text-white/60 text-sm mb-6">
          {mode === "signin" ? t("تسجيل الدخول", "Sign in") : t("إنشاء حساب", "Create account")}
        </p>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder={t("الاسم الكامل", "Full name")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold"
              required
            />
          )}
          <input
            type="email"
            placeholder={t("البريد الإلكتروني", "Email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold"
            required
          />
          <input
            type="password"
            placeholder={t("كلمة المرور", "Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold"
            minLength={6}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold text-navy-deep font-bold py-3 hover:bg-gold/90 disabled:opacity-50 transition"
          >
            {loading ? "..." : mode === "signin" ? t("دخول", "Sign in") : t("إنشاء", "Create")}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-white/40 text-xs">
          <div className="h-px flex-1 bg-white/20" />
          {t("أو", "OR")}
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <button
          onClick={google}
          className="w-full rounded-lg bg-white/10 border border-white/20 text-white py-3 hover:bg-white/15 transition"
        >
          {t("الدخول بحساب Google", "Continue with Google")}
        </button>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-sm text-white/60 hover:text-white mt-4"
        >
          {mode === "signin"
            ? t("ليس لديك حساب؟ إنشاء حساب", "No account? Sign up")
            : t("لديك حساب؟ تسجيل الدخول", "Have an account? Sign in")}
        </button>

        <Link to="/" className="block text-center text-xs text-white/40 hover:text-white/70 mt-6">
          {t("العودة للموقع", "Back to site")}
        </Link>
      </div>
    </div>
  );
}
