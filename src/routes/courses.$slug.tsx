import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BarChart3, CheckCircle2, Clock, Lock, PlayCircle, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/site/FaqList";
import { courseMinutes, formatDuration, lessonCount, subjects } from "@/data/catalog";
import { catalogQuery } from "@/lib/catalog-query";
import { formatPrice, site } from "@/config/site";

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ params, context }) => {
    const courses = await context.queryClient.ensureQueryData(catalogQuery);
    const course = courses.find((c) => c.slug === params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.course.title} — ${site.brandName}` },
          { name: "description", content: loaderData.course.description },
          { property: "og:title", content: loaderData.course.title },
          { property: "og:description", content: loaderData.course.description },
        ]
      : [{ title: "Course unavailable" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold text-primary">Course not found</h1>
      <Link to="/courses" className="mt-4 inline-block font-semibold text-accent">Back to catalog</Link>
    </div>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const { course: c } = Route.useLoaderData();
  const subject = subjects.find((s) => s.id === c.subject)?.label;
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Link to="/courses" search={{ subject: c.subject }} className="eyebrow">{subject}</Link>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">{c.title}</h1>
            <p className="mt-3 text-lg text-primary-foreground/80">{c.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-primary-foreground/85">
              <span className="flex items-center gap-1.5"><BarChart3 className="size-4" aria-hidden />{c.difficulty}</span>
              <span className="flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{formatDuration(courseMinutes(c))}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="size-4" aria-hidden />{lessonCount(c)} lessons</span>
              <span className="flex items-center gap-1.5"><Users className="size-4" aria-hidden />Ages {c.ageGroup}</span>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/70">Taught by {site.instructor.name}</p>
          </div>
          <aside className="rounded-xl bg-card p-5 text-card-foreground shadow-lift lg:row-span-2">
            <img src={c.thumbnail} alt="" width={1024} height={640} className="aspect-[16/10] w-full rounded-lg object-cover" />
            <p className="mt-5 font-display text-3xl font-bold text-primary">{formatPrice(c.price)}</p>
            <p className="text-sm text-muted-foreground">One-time payment · lifetime access</p>
            <Button className="mt-4 w-full" size="lg" disabled title="Checkout arrives in a later stage">Enroll now</Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Secure checkout coming soon</p>
            {c.includedInSubscription && (
              <p className="mt-4 rounded-lg bg-accent-soft p-3 text-sm">Also included in <Link to="/pricing" className="font-semibold text-accent underline">subscription plans</Link>.</p>
            )}
          </aside>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          <section><h2 className="text-2xl font-bold text-primary">About this course</h2><p className="mt-3 text-muted-foreground">{c.description}</p></section>
          <section>
            <h2 className="text-2xl font-bold text-primary">What you'll learn</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {c.objectives.map((o) => <li key={o} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />{o}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-primary">Curriculum</h2>
            <div className="mt-4 space-y-4">
              {c.curriculum.map((s, i) => (
                <div key={s.title} className="overflow-hidden rounded-xl border">
                  <p className="bg-secondary px-5 py-3 font-semibold">Section {i + 1}: {s.title}</p>
                  <ul className="divide-y">
                    {s.lessons.map((l) => (
                      <li key={l.title} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                        <span className="flex items-center gap-2">
                          {l.preview ? <PlayCircle className="size-4 text-accent" aria-hidden /> : <Lock className="size-4 text-muted-foreground" aria-hidden />}
                          {l.title}
                          {l.preview && <span className="rounded bg-accent-soft px-1.5 py-0.5 text-xs font-semibold text-accent">Preview</span>}
                        </span>
                        <span className="text-muted-foreground">{l.minutes} min</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section><h2 className="text-2xl font-bold text-primary">FAQ</h2><div className="mt-4"><FaqList items={c.faqs} /></div></section>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border p-5"><h3 className="font-semibold">Prerequisites</h3><ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">{c.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul></div>
          <div className="rounded-xl border p-5"><h3 className="font-semibold">What you need</h3><ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">{c.requirements.map((p) => <li key={p}>{p}</li>)}</ul></div>
          <div className="rounded-xl border p-5"><h3 className="font-semibold">Your instructor</h3><p className="mt-1 text-sm font-medium">{site.instructor.name}</p><p className="mt-2 text-sm text-muted-foreground">{site.instructor.bio}</p></div>
        </div>
      </div>
    </>
  );
}
