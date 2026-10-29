import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { catalogQuery } from "@/lib/catalog-query";
import { myEnrollmentsQuery } from "@/lib/learning";
import { formatPrice, site } from "@/config/site";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/_authenticated/enroll/$slug")({
  head: () => ({ meta: pageMeta("Enroll in a course", "Pay with Whish and send your receipt to get access.") }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(catalogQuery), context.queryClient.ensureQueryData(myEnrollmentsQuery)]),
  component: Enroll,
});

function Enroll() {
  const { slug } = Route.useParams();
  const { data: courses } = useSuspenseQuery(catalogQuery);
  const { data: mine } = useSuspenseQuery(myEnrollmentsQuery);
  const qc = useQueryClient();
  const course = courses.find((c) => c.slug === slug);
  const latest = mine.find((e) => e.course_slug === slug);
  const [ref, setRef] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!course) return <section className="container-page py-24 text-center"><p>Course not found.</p></section>;

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error();
      let receipt_path: string | null = null;
      if (file) {
        receipt_path = `${u.user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const up = await supabase.storage.from("receipts").upload(receipt_path, file);
        if (up.error) throw new Error();
      }
      const { error } = await supabase.from("enrollments").insert({ user_id: u.user.id, course_slug: slug, amount: course!.price, whish_reference: ref, note, receipt_path });
      if (error) throw new Error();
      await qc.invalidateQueries({ queryKey: ["my-enrollments"] });
    } catch { setError("Your request could not be sent. Please try again."); }
    finally { setBusy(false); }
  }

  return <section className="container-page max-w-xl py-14">
    <p className="eyebrow">Enroll</p>
    <h1 className="mt-2 text-3xl font-bold text-primary">{course.title}</h1>
    {latest?.status === "approved" ? <div className="mt-6 rounded-xl bg-accent-soft p-5"><p className="font-semibold">Your payment is approved.</p><Button asChild className="mt-3"><Link to="/learn/$slug" params={{ slug }}>Start watching</Link></Button></div>
    : latest?.status === "pending" ? <div className="mt-6 rounded-xl border p-5"><p className="font-semibold">Payment received — waiting for approval.</p><p className="mt-1 text-sm text-muted-foreground">You’ll get access as soon as {site.instructor.name} confirms your Whish payment.</p></div>
    : <>
      {latest?.status === "rejected" && <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">Your last request was not approved. Please check the payment and send it again, or contact us.</p>}
      <ol className="mt-6 list-decimal space-y-2 rounded-xl border p-5 pl-9 text-sm">
        <li>Send <strong>{formatPrice(course.price)}</strong> with Whish Money to <strong>{site.contact.phone}</strong> ({site.instructor.name}).</li>
        <li>Enter the Whish transaction number and upload a screenshot of the receipt below.</li>
        <li>Once approved, the course videos open here on the site.</li>
      </ol>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="space-y-2"><Label htmlFor="ref">Whish transaction number</Label><Input id="ref" required maxLength={100} value={ref} onChange={(e) => setRef(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="rc">Receipt screenshot</Label><Input id="rc" type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
        <div className="space-y-2"><Label htmlFor="n">Note (optional)</Label><Textarea id="n" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Send payment for approval"}</Button>
      </form>
    </>}
  </section>;
}
