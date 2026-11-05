import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Award, BookOpen, CheckCircle2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CertificateDownload } from "@/components/site/CertificateDownload";
import { CourseStageBadge } from "@/components/site/CourseStageBadge";
import { getStudentDashboard } from "@/lib/student-dashboard.functions";
import { assessmentProgress } from "@/lib/student-progress";
import { catalogQuery } from "@/lib/catalog-query";
import { courseStage, canWatchCourse } from "@/lib/course-stage";
import { pageMeta } from "@/lib/page-meta";

const dashboardQuery = queryOptions({ queryKey: ["student-dashboard"], queryFn: () => getStudentDashboard(), staleTime: 0 });
export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: pageMeta("Student progress dashboard", "View course progress, assessment scores and earned MAS Academy completion certificates.") }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(dashboardQuery), context.queryClient.ensureQueryData(catalogQuery)]),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useSuspenseQuery(dashboardQuery);
  const { data: catalog } = useSuspenseQuery(catalogQuery);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const slugs = [...new Set(data.enrollments.map(e => e.course_slug))];
  const courses = slugs.map(slug => {
    const stage = courseStage(slug, data.enrollments);
    return { slug, stage, course: catalog.find(c => c.slug === slug), progress: assessmentProgress(slug, canWatchCourse(stage), data.quizzes, data.attempts) };
  });
  const completed = courses.filter(c => c.progress.certificateEligible).length;
  const passed = data.quizzes.filter(q => data.attempts.some(a => a.quiz_id === q.id && a.passed)).length;
  async function refresh() {
    setBusy(true); setError("");
    try { await qc.fetchQuery(dashboardQuery); } catch { setError("Progress could not be refreshed. Please try again."); }
    finally { setBusy(false); }
  }
  return <section className="container-page py-10 md:py-14">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="eyebrow">Student dashboard</p><h1 className="mt-2 break-words text-3xl font-bold text-primary">{data.name ? `${data.name}’s learning progress` : "Learning progress"}</h1></div>
      <div className="flex gap-2"><Button variant="outline" size="icon" onClick={refresh} disabled={busy} aria-label="Refresh progress" title="Refresh progress"><RefreshCw className={busy ? "size-4 animate-spin motion-reduce:animate-none" : "size-4"} /></Button><Button asChild variant="outline"><Link to="/account">My account</Link></Button></div>
    </div>
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    <dl className="mt-8 grid grid-cols-3 divide-x border-y py-6">
      {[{ label: "Courses", value: courses.length, Icon: BookOpen }, { label: "Quizzes passed", value: passed, Icon: CheckCircle2 }, { label: "Certificates", value: completed, Icon: Award }].map(({ label, value, Icon }) => <div key={label} className="px-2 text-center sm:px-6"><Icon className="mx-auto mb-2 size-5 text-accent" aria-hidden /><dd className="text-3xl font-bold text-primary">{value}</dd><dt className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</dt></div>)}
    </dl>
    <div className="mt-10 flex items-center justify-between gap-3"><h2 className="text-2xl font-bold text-primary">My courses</h2><Button asChild variant="link"><Link to="/courses">Browse courses</Link></Button></div>
    {!courses.length ? <div className="py-12 text-center"><BookOpen className="mx-auto size-10 text-accent" aria-hidden /><p className="mt-4 text-muted-foreground">No course enrollments yet.</p><Button asChild className="mt-5"><Link to="/courses">Explore courses</Link></Button></div> :
    <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">{courses.map(({ slug, stage, course, progress }) => {
      const quizzes = data.quizzes.filter(q => q.course_slug === slug);
      return <article key={slug} className="overflow-hidden rounded-lg border bg-card">
        <div className="flex items-start gap-4 border-b p-5">{course && <img src={course.thumbnail} alt="" className="size-16 shrink-0 rounded-md object-cover" />}<div className="min-w-0"><h3 className="break-words text-lg font-bold text-primary">{course?.title ?? slug}</h3><div className="mt-2"><CourseStageBadge stage={stage} /></div></div></div>
        <div className="p-5">
          {canWatchCourse(stage) ? <><div className="flex justify-between gap-3 text-sm"><span className="font-semibold">Required assessments</span><span className="text-muted-foreground">{progress.passed} / {progress.required} passed</span></div><div role="progressbar" aria-label={`${course?.title ?? slug} required assessments`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent} className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${progress.percent / 100})` }} /></div>
          {!quizzes.length && <p className="mt-4 text-sm text-muted-foreground">No assessments available yet.</p>}
          <ul className="mt-4 divide-y">{quizzes.map(q => {
            const attempts = data.attempts.filter(a => a.quiz_id === q.id);
            const passed = attempts.some(a => a.passed);
            const best = attempts.length ? Math.max(...attempts.map(a => a.score)) : null;
            return <li key={q.id} className="py-3"><div className="flex flex-wrap justify-between gap-2"><span className="break-words font-medium">{q.title}</span><span className={passed ? "text-sm font-semibold text-accent" : "text-sm text-muted-foreground"}>{passed ? "Passed" : attempts.length ? "Not passed yet" : "Not started"}</span></div><p className="mt-1 text-xs text-muted-foreground">{q.required ? "Required" : "Optional"} · Pass mark {q.pass_percent}%{best !== null ? ` · Best ${best}% · ${attempts.length} attempt${attempts.length === 1 ? "" : "s"}` : ""}</p>
            {!!attempts.length && <details className="mt-2 text-sm"><summary className="cursor-pointer text-primary">Attempt history</summary><ol className="mt-2 space-y-2">{attempts.map((a, index) => <li key={`${a.created_at}-${index}`} className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{new Date(a.created_at).toLocaleDateString("en-GB")} · Attempt {attempts.length - index}</span><span>{a.score}% · {a.passed ? "Passed" : "Not passed"}</span></li>)}</ol></details>}</li>;
          })}</ul></> : <p className="text-sm text-muted-foreground">{stage === "requesting-approval" ? "Payment awaiting approval." : "Enrollment is not active."}</p>}
          <div className="mt-5 flex flex-wrap items-start gap-3 border-t pt-5"><Button asChild variant="outline" size="sm">{canWatchCourse(stage) ? <Link to="/learn/$slug" params={{ slug }}>{progress.certificateEligible ? "Review course" : "Continue learning"}</Link> : <Link to="/enroll/$slug" params={{ slug }}>Payment details</Link>}</Button>{progress.certificateEligible && <CertificateDownload slug={slug} />}</div>
        </div>
      </article>;
    })}</div>}
  </section>;
}