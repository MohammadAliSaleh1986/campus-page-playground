export type QuizReportAttempt = {
  id: string;
  user_id: string;
  student_name: string;
  course_slug: string;
  quiz_id: string;
  quiz_title: string;
  score: number;
  passed: boolean;
  created_at: string;
};

export function groupQuizAttempts(attempts: QuizReportAttempt[]) {
  const groups = new Map<string, {
    userId: string;
    studentName: string;
    courseSlug: string;
    attempts: (QuizReportAttempt & { attemptNumber: number })[];
  }>();
  const counts = new Map<string, number>();
  for (const attempt of [...attempts].sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id))) {
    const key = `${attempt.course_slug}:${attempt.user_id}`;
    const quizKey = `${key}:${attempt.quiz_id}`;
    const attemptNumber = (counts.get(quizKey) ?? 0) + 1;
    counts.set(quizKey, attemptNumber);
    let group = groups.get(key);
    if (!group) {
      group = { userId: attempt.user_id, studentName: attempt.student_name, courseSlug: attempt.course_slug, attempts: [] };
      groups.set(key, group);
    }
    group.attempts.unshift({ ...attempt, attemptNumber });
  }
  return [...groups.values()].sort((a, b) => a.courseSlug.localeCompare(b.courseSlug) || a.studentName.localeCompare(b.studentName) || a.userId.localeCompare(b.userId));
}