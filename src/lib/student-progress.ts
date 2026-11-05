export type ProgressQuiz = { id: string; course_slug: string; title: string; required: boolean; pass_percent: number };
export type ProgressAttempt = { quiz_id: string; score: number; passed: boolean; created_at: string };
export function assessmentProgress(slug: string, approved: boolean, quizzes: readonly ProgressQuiz[], attempts: readonly ProgressAttempt[]) {
  const required = quizzes.filter(q => q.course_slug === slug && q.required);
  const passed = required.filter(q => attempts.some(a => a.quiz_id === q.id && a.passed)).length;
  return { required: required.length, passed, percent: required.length ? Math.round(passed / required.length * 100) : 0, certificateEligible: approved && required.length > 0 && passed === required.length };
}