import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { useAccount } from "@/hooks/use-account";
import { pageMeta } from "@/lib/page-meta";

type AuthSearch = { redirect?: string | undefined; mode?: "signup" | "signin" | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): AuthSearch => ({
    redirect: typeof s["redirect"] === "string" && s["redirect"].startsWith("/") && !s["redirect"].startsWith("//") ? s["redirect"] : undefined,
    mode: s["mode"] === "signup" ? "signup" : undefined,
  }),
  head: () => ({ meta: pageMeta("Student sign-in", "Sign in or create your student account.") }),
  component: AuthPage,
});

function AuthPage() {
  const raw = Route.useSearch();
  const search = { redirect: raw.redirect ?? "/account", mode: raw.mode ?? "signin" };
  const [mode, setMode] = useState<"signup" | "signin" | "forgot">(search.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user, ready } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && user) void navigate({ to: search.redirect, replace: true });
  }, [ready, user, navigate, search.redirect]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      if (mode === "forgot") {
        const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (result.error) throw result.error;
        setMessage("If an account exists for this email, a password reset link is on its way.");
      } else if (mode === "signup") {
        const result = await supabase.auth.signUp({ email, password, options: { data: { display_name: name.trim() }, emailRedirectTo: `${window.location.origin}/auth?redirect=${encodeURIComponent(search.redirect)}` } });
        if (result.error) throw result.error;
        if (!result.data.session) setMessage("Check your email to confirm your account before signing in.");
      } else {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to continue. Please try again."); }
    finally { setBusy(false); }
  }

  async function social(provider: "google" | "lovable") {
    setBusy(true); setError("");
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth?redirect=${encodeURIComponent(search.redirect)}` });
      if (result.error) setError(result.error.message);
    } catch { setError("Sign-in could not be completed. Please try again."); }
    finally { setBusy(false); }
  }

  return <section className="container-page max-w-md py-14">
    <p className="eyebrow">Student account</p>
    <h1 className="mt-2 text-3xl font-bold text-primary">{mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Welcome back"}</h1>
    <form className="mt-8 space-y-5" onSubmit={submit}>
      {mode === "signup" && <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" autoComplete="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} /></div>}
      <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      {mode !== "forgot" && <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></div>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {message && <p role="status" className="text-sm text-accent">{message}</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}</Button>
    </form>
    {mode !== "forgot" && <div className="mt-6 space-y-3 border-t pt-6">
      <Button variant="outline" className="w-full" disabled={busy} onClick={() => social("google")}>Continue with Google</Button>
      <Button className="lovable-auth-button w-full" disabled={busy} onClick={() => social("lovable")}>Continue with Lovable</Button>
    </div>}
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      <Button variant="link" size="sm" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setMessage(""); }}>{mode === "signup" ? "Already have an account? Sign in" : "Create an account"}</Button>
      <Button variant="link" size="sm" onClick={() => { setMode(mode === "forgot" ? "signin" : "forgot"); setError(""); setMessage(""); }}>{mode === "forgot" ? "Back to sign in" : "Forgot password?"}</Button>
    </div>
    <p className="mt-5 text-center text-xs text-muted-foreground"><Link to="/terms" className="underline">Terms</Link> · <Link to="/privacy" className="underline">Privacy</Link></p>
  </section>;
}