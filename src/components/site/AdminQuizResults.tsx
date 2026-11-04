import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCoursesQuery, adminQuizAttemptsQuery } from "@/lib/learning";
import { groupQuizAttempts } from "@/lib/quiz-report";

export function AdminQuizResults() {
  const { data: attempts } = useSuspenseQuery(adminQuizAttemptsQuery);
  const { data: courses } = useSuspenseQuery(adminCoursesQuery);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("all");
  const title = (slug: string) => (courses.find((c) => c.slug === slug)?.content as { title?: string } | undefined)?.title || slug;
  const query = search.trim().toLowerCase();
  const groups = groupQuizAttempts(attempts).filter((g) =>
    (course === "all" || g.courseSlug === course) &&
    (!query || [g.studentName, g.userId, title(g.courseSlug), ...g.attempts.map((a) => a.quiz_title)].some((v) => v.toLowerCase().includes(query))),
  );
  return <div className="mt-6">
    <h2 className="text-2xl font-bold text-primary">Student quiz results</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_16rem]">
      <div className="space-y-2"><Label htmlFor="quiz-results-search">Search</Label><Input id="quiz-results-search" placeholder="Student, course or quiz" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="quiz-results-course">Course</Label><select id="quiz-results-course" value={course} onChange={(e) => setCourse(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
        <option value="all">All courses</option>
        {[...new Set(attempts.map((a) => a.course_slug))].sort((a, b) => title(a).localeCompare(title(b))).map((slug) => <option key={slug} value={slug}>{title(slug)}</option>)}
      </select></div>
    </div>
    {!attempts.length ? <p role="status" className="py-8 text-muted-foreground">No student quiz attempts yet.</p> : !groups.length ? <p role="status" className="py-8 text-muted-foreground">No quiz results match your search.</p> :
      groups.map((g) => <section key={`${g.courseSlug}:${g.userId}`} className="mt-8 min-w-0 border-t pt-5">
        <p className="text-sm font-semibold text-accent">{title(g.courseSlug)}</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="break-words text-lg font-semibold">{g.studentName}</h3>
          <span className="text-sm text-muted-foreground">{g.attempts.length} {g.attempts.length === 1 ? "attempt" : "attempts"}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Student ID: {g.userId.slice(0, 8)}</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">{g.studentName} — {title(g.courseSlug)} quiz attempts</caption>
            <thead className="border-b bg-secondary text-muted-foreground"><tr>
              {["Quiz", "Attempt", "Score", "Status", "Submitted"].map((label) => <th key={label} scope="col" className="px-3 py-2 font-medium">{label}</th>)}
            </tr></thead>
            <tbody>{g.attempts.map((a) => <tr key={a.id} className="border-b">
              <td className="max-w-64 break-words px-3 py-3 font-medium">{a.quiz_title}</td>
              <td className="px-3 py-3 tabular-nums">{a.attemptNumber}</td>
              <td className="px-3 py-3 font-semibold tabular-nums">{a.score}%</td>
              <td className="px-3 py-3"><span className={`whitespace-nowrap rounded px-2 py-1 text-xs font-semibold ${a.passed ? "bg-accent-soft text-accent" : "bg-destructive/10 text-destructive"}`}>{a.passed ? "Passed" : "Not passed"}</span></td>
              <td className="whitespace-nowrap px-3 py-3 text-muted-foreground"><time dateTime={a.created_at}>{new Date(a.created_at).toLocaleString()}</time></td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>)}
  </div>;
}