import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: pageMeta("Set a new password", "Securely reset your student account password.") }),
  component: ResetPassword,
});
function ResetPassword() {
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get("type") !== "recovery") { setError("Open the password reset link from your email."); return; }
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) setValid(true);
      else setError("This reset link is invalid or expired. Request a new link.");
    });
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true); setError("");
    const { error: failure } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (failure) setError(failure.message); else setDone(true);
  }
  return <section className="container-page max-w-md py-14">
    <h1 className="text-3xl font-bold text-primary">Set a new password</h1>
    {done ? <div className="mt-6"><p role="status">Your password has been updated.</p><Button asChild className="mt-4"><Link to="/account">Go to account</Link></Button></div> : <form className="mt-8 space-y-5" onSubmit={submit}>
      <div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={!valid || busy}>{busy ? "Saving…" : "Update password"}</Button>
      <Button asChild variant="link"><Link to="/auth">Back to sign in</Link></Button>
    </form>}
  </section>;
}