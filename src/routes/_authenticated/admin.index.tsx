import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { adminCoursesQuery, adminEnrollmentsQuery, isAdminQuery } from "@/lib/learning";
import { formatPrice } from "@/config/site";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: pageMeta("Admin area", "Approve student payments and manage courses, videos and prices.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(isAdminQuery),
  component: AdminPage,
});

export function NotAdmin() {
  return <section className="container-page py-24 text-center"><h1 className="text-2xl font-bold text-primary">Admins only</h1><p className="mt-2 text-muted-foreground">This area is for the academy admin.</p></section>;
}

function AdminPage() {
  const { data: isAdmin } = useSuspenseQuery(isAdminQuery);
  if (!isAdmin) return <NotAdmin />;
  return <section className="container-page py-12">
    <p className="eyebrow">Admin area</p>
    <h1 className="mt-2 text-3xl font-bold text-primary">Manage your academy</h1>
    <Tabs defaultValue="payments" className="mt-8">
      <TabsList><TabsTrigger value="payments">Payments</TabsTrigger><TabsTrigger value="courses">Courses, videos & prices</TabsTrigger></TabsList>
      <TabsContent value="payments"><Payments /></TabsContent>
      <TabsContent value="courses"><Courses /></TabsContent>
    </Tabs>
  </section>;
}

function Payments() {
  const { data } = useSuspenseQuery(adminEnrollmentsQuery);
  const { data: courses } = useSuspenseQuery(adminCoursesQuery);
  const qc = useQueryClient();
  const [busy, setBusy] = useState("");
  const title = (slug: string) => (courses.find((c) => c.slug === slug)?.content as { title?: string } | undefined)?.title ?? slug;
  async function setStatus(id: string, status: "approved" | "rejected") {
    setBusy(id);
    await supabase.from("enrollments").update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    await qc.invalidateQueries({ queryKey: ["admin-enrollments"] });
    setBusy("");
  }
  async function openReceipt(path: string) {
    const { data } = await supabase.storage.from("receipts").createSignedUrl(path, 300);
    if (data) window.open(data.signedUrl, "_blank", "noopener");
  }
  if (!data.length) return <p className="py-8 text-muted-foreground">No payment requests yet.</p>;
  return <div className="mt-4 space-y-3">
    {data.map((e) => <div key={e.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
      <div className="min-w-0 text-sm">
        <p className="font-semibold">{e.student_name} · {title(e.course_slug)}</p>
        <p className="text-muted-foreground">{formatPrice(Number(e.amount))} · Whish ref: {e.whish_reference || "—"} · {new Date(e.created_at).toLocaleDateString()}</p>
        {e.note && <p className="mt-1">“{e.note}”</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={e.status} />
        {e.receipt_path && <Button variant="outline" size="sm" onClick={() => openReceipt(e.receipt_path!)}>View receipt</Button>}
        {e.status !== "approved" && <Button size="sm" disabled={busy === e.id} onClick={() => setStatus(e.id, "approved")}>Approve</Button>}
        {e.status !== "rejected" && <Button size="sm" variant="outline" disabled={busy === e.id} onClick={() => setStatus(e.id, "rejected")}>{e.status === "approved" ? "Revoke" : "Reject"}</Button>}
      </div>
    </div>)}
  </div>;
}

export function StatusBadge({ status }: { status: string }) {
  const cls = status === "approved" ? "bg-accent-soft text-accent" : status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground";
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold capitalize ${cls}`}>{status}</span>;
}

function Courses() {
  const { data } = useSuspenseQuery(adminCoursesQuery);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  async function create(e: FormEvent) {
    e.preventDefault(); setError("");
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) return;
    const content = { title, subtitle: "", description: "", subject: "coding", difficulty: "Beginner", ageGroup: "10-12", format: "Video", price: 0, featured: false, publishedAt: new Date().toISOString().slice(0, 10), includedInSubscription: false, objectives: [], prerequisites: [], requirements: [], curriculum: [], faqs: [] };
    const { error } = await supabase.from("courses").insert({ slug, content, published: false });
    if (error) return setError("That course could not be created — the name may already be used.");
    navigate({ to: "/admin/courses/$slug", params: { slug } });
  }
  return <div className="mt-4 space-y-3">
    <form onSubmit={create} className="flex flex-wrap items-end gap-3 rounded-xl border p-4">
      <div className="min-w-60 flex-1 space-y-2"><Label htmlFor="new-title">New course name</Label><Input id="new-title" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <Button type="submit">Add course</Button>
      {error && <p role="alert" className="w-full text-sm text-destructive">{error}</p>}
    </form>
    {data.map((c) => {
      const content = c.content as { title?: string; price?: number };
      return <Link key={c.slug} to="/admin/courses/$slug" params={{ slug: c.slug }} className="flex items-center justify-between gap-3 rounded-xl border p-4 hover:bg-secondary">
        <span className="font-semibold">{content.title ?? c.slug}</span>
        <span className="text-sm text-muted-foreground">{formatPrice(Number(content.price ?? 0))} · {c.published ? "Published" : "Hidden"}</span>
      </Link>;
    })}
  </div>;
}
