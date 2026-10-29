import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfile, saveProfile } from "@/lib/profile.functions";
import { subjects } from "@/data/catalog";
import { pageMeta } from "@/lib/page-meta";
import { useAccount } from "@/hooks/use-account";

const profileQuery = queryOptions({ queryKey: ["profile"], queryFn: () => getProfile() });
export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: pageMeta("Your student account", "Manage your name and learning preferences.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: AccountPage,
});
function AccountPage() {
  const { data } = useSuspenseQuery(profileQuery);
  const { user } = useAccount();
  const [name, setName] = useState(data.display_name);
  const [subject, setSubject] = useState(data.preferred_subject);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const save = useServerFn(saveProfile);
  const queryClient = useQueryClient();
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMessage(""); setError("");
    try {
      await save({ data: { display_name: name, preferred_subject: subject } });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      setMessage("Your profile has been saved.");
    } catch { setError("Your profile could not be saved. Please try again."); }
    finally { setBusy(false); }
  }
  return <section className="container-page max-w-xl py-14">
    <p className="eyebrow">Student account</p><h1 className="mt-2 text-3xl font-bold text-primary">Your profile</h1>
    <p className="mt-3 break-words text-sm text-muted-foreground">{user?.email}</p>
    <form className="mt-8 space-y-5" onSubmit={submit}>
      <div className="space-y-2"><Label htmlFor="display-name">Name</Label><Input id="display-name" required maxLength={100} autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="preferred-subject">Preferred subject</Label><select id="preferred-subject" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={subject} onChange={e => setSubject(e.target.value)}><option value="">No preference</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
      {message && <p role="status" className="text-sm text-accent">{message}</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</Button>
    </form>
  </section>;
}