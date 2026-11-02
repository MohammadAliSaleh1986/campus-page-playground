export const courseStages = ["unenrolled", "requesting-approval", "enrolled", "completed"] as const;
export type CourseStage = typeof courseStages[number];
export const stageLabels: Record<CourseStage, string> = {
  unenrolled: "Unenrolled", "requesting-approval": "Requesting approval", enrolled: "Enrolled", completed: "Completed",
};
type Enrollment = { course_slug: string; status: string; completed_at?: string | null };
export function courseStage(slug: string, enrollments: readonly Enrollment[]): CourseStage {
  const rows = enrollments.filter(e => e.course_slug === slug);
  const approved = rows.filter(e => e.status === "approved");
  if (approved.some(e => e.completed_at)) return "completed";
  if (approved.length) return "enrolled";
  if (rows.some(e => e.status === "pending")) return "requesting-approval";
  return "unenrolled";
}
export const canWatchCourse = (stage: CourseStage) => stage === "enrolled" || stage === "completed";
export const canRequestEnrollment = (stage: CourseStage) => stage === "unenrolled";