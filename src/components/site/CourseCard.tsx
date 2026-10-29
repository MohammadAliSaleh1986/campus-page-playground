import { Link } from "@tanstack/react-router";
import { Clock, BarChart3, Users } from "lucide-react";
import { type Course, courseMinutes, formatDuration, subjects } from "@/data/catalog";
import { formatPrice } from "@/config/site";

export function CourseCard({ course }: { course: Course }) {
  const subject = subjects.find((s) => s.id === course.subject)?.label;
  return (
    <Link
      to="/courses/$slug"
      params={{ slug: course.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <img src={course.thumbnail} alt="" loading="lazy" width={1024} height={640} className="aspect-[16/10] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <span className="eyebrow">{subject}</span>
        <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-primary">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><BarChart3 className="size-3.5" aria-hidden />{course.difficulty}</span>
          <span className="flex items-center gap-1"><Clock className="size-3.5" aria-hidden />{formatDuration(courseMinutes(course))}</span>
          <span className="flex items-center gap-1"><Users className="size-3.5" aria-hidden />Ages {course.ageGroup}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="font-display text-xl font-bold text-primary">{formatPrice(course.price)}</span>
          {course.includedInSubscription && <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">In subscription</span>}
        </div>
      </div>
    </Link>
  );
}
