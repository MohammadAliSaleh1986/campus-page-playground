import { CheckCircle2, Clock, GraduationCap, Lock } from "lucide-react";
import { stageLabels, type CourseStage } from "@/lib/course-stage";
const icons = { unenrolled: Lock, "requesting-approval": Clock, enrolled: CheckCircle2, completed: GraduationCap };
export function CourseStageBadge({ stage }: { stage: CourseStage }) {
  const Icon = icons[stage];
  return <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-card"><Icon className="size-3.5 shrink-0" aria-hidden />{stageLabels[stage]}</span>;
}