import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { adminCoursesQuery, courseVideosQuery, isAdminQuery } from "@/lib/learning";
import { driveEmbedUrl, driveFileId } from "@/lib/drive";
import { subjects } from "@/data/catalog";
import { pageMeta } from "@/lib/page-meta";
import { NotAdmin } from "./admin.index";

export const Route = createFileRoute("/_authenticated/admin/courses/$slug")({
  head: () => ({ meta: pageMeta("Edit course", "Edit course details, price and Google Drive videos.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(isAdminQuery),
  component: EditCourse,
});

const select = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

function EditCourse() {
  const { data: isAdmin } = useSuspenseQuery(isAdminQuery);
  if (!isAdmin) return <NotAdmin />;
  return <CourseForm />;
}

function CourseForm() {
  const { slug } = Route.useParams();
  const { data: courses } = useSuspenseQuery(adminCoursesQuery);
  const row = courses.find((c) => c.slug === slug);
  const qc = useQueryClient();
  const content = (row?.content ?? {}) as Record<string, unknown>;
  const [form, setForm] = useState({
    title: String(content["title"] ?? ""), subtitle: String(content["subtitle"] ?? ""), description: String(content["description"] ?? ""),
    subject: String(content["subject"] ?? "coding"), difficulty: String(content["difficulty"] ?? "Beginner"), ageGroup: String(content["ageGroup"] ?? "10-12"),
    price: String(content["price"] ?? 0), objectives: ((content["objectives"] as string[]) ?? []).join("\n"),
  });
  const [published, setPublished] = useState(row?.published ?? false);
  const [msg, setMsg] = useState("");
  if (!row) return <section className="container-page py-24 text-center"><p>Course not found.</p><Link to="/admin" className="text-accent">Back to admin</Link></section>;
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  async function save(e: FormEvent) {
    e.preventDefault(); setMsg("");
    const price = Math.max(0, Number(form.price) || 0);
    const next = { ...content, ...form, price, objectives: form.objectives.split("\n").map((s) => s.trim()).filter(Boolean) };
    const { error } = await supabase.from("courses").update({ content: next, published }).eq("slug", slug);
    setMsg(error ? "Could not save. Please try again." : "Saved.");
    await qc.invalidateQueries({ queryKey: ["admin-courses"] });
    await qc.invalidateQueries({ queryKey: ["courses"] });
  }
  return <section className="container-page max-w-3xl py-12">
    <Link to="/admin" className="text-sm font-semibold text-accent">← Admin area</Link>
    <h1 className="mt-2 text-3xl font-bold text-primary">{form.title || slug}</h1>
    <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="t">Title</Label><Input id="t" required value={form.title} onChange={set("title")} /></div>
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="st">Subtitle</Label><Input id="st" value={form.subtitle} onChange={set("subtitle")} /></div>
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="d">Description</Label><Textarea id="d" rows={4} value={form.description} onChange={set("description")} /></div>
      <div className="space-y-2"><Label htmlFor="p">Price (USD)</Label><Input id="p" type="number" min={0} step="0.01" value={form.price} onChange={set("price")} /></div>
      <div className="space-y-2"><Label htmlFor="s">Subject</Label><select id="s" className={select} value={form.subject} onChange={set("subject")}>{subjects.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
      <div className="space-y-2"><Label htmlFor="l">Level</Label><select id="l" className={select} value={form.difficulty} onChange={set("difficulty")}>{["Beginner", "Intermediate", "Advanced"].map((v) => <option key={v}>{v}</option>)}</select></div>
      <div className="space-y-2"><Label htmlFor="a">Ages</Label><Input id="a" value={form.ageGroup} onChange={set("ageGroup")} /></div>
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="o">What students will learn (one per line)</Label><Textarea id="o" rows={4} value={form.objectives} onChange={set("objectives")} /></div>
      <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Show this course on the website</label>
      <div className="flex items-center gap-3 sm:col-span-2"><Button type="submit">Save course</Button>{msg && <span role="status" className="text-sm text-muted-foreground">{msg}</span>}</div>
    </form>
    <Videos slug={slug} />
  </section>;
}

function Videos({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(courseVideosQuery(slug));
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const refresh = () => qc.invalidateQueries({ queryKey: ["course-videos", slug] });
  async function add(e: FormEvent) {
    e.preventDefault(); setError("");
    const id = driveFileId(link);
    if (!id) return setError("Paste a Google Drive file link, e.g. https://drive.google.com/file/d/…/view");
    const { error } = await supabase.from("course_videos").insert({ course_slug: slug, title, drive_file_id: id, is_preview: preview, position: data.length });
    if (error) return setError("The video could not be added.");
    setTitle(""); setLink(""); setPreview(false); await refresh();
  }
  async function remove(id: string) { await supabase.from("course_videos").delete().eq("id", id); await refresh(); }
  return <div className="mt-12">
    <h2 className="text-2xl font-bold text-primary">Videos</h2>
    <p className="mt-1 text-sm text-muted-foreground">Upload the video to your Google Drive, set sharing to “Anyone with the link”, then paste the link here. Only approved students (or anyone signed in, for preview videos) can watch.</p>
    <form onSubmit={add} className="mt-4 grid gap-3 rounded-xl border p-4">
      <div className="space-y-2"><Label htmlFor="vt">Lesson title</Label><Input id="vt" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="vl">Google Drive link</Label><Input id="vl" required value={link} onChange={(e) => setLink(e.target.value)} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} /> Free preview</label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="justify-self-start">Add video</Button>
    </form>
    <ol className="mt-4 space-y-3">
      {data.map((v, i) => <li key={v.id} className="rounded-xl border p-4">
        <div className="flex items-center justify-between gap-3"><p className="font-semibold">{i + 1}. {v.title}{v.is_preview && " · Preview"}</p><Button size="sm" variant="outline" onClick={() => remove(v.id)}>Remove</Button></div>
        <iframe src={driveEmbedUrl(v.drive_file_id)} title={v.title} allow="autoplay" allowFullScreen className="mt-3 aspect-video w-full rounded-lg border" />
      </li>)}
    </ol>
  </div>;
}
