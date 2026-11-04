import { describe, expect, it } from "vitest";
import { groupQuizAttempts, type QuizReportAttempt } from "./quiz-report";

const attempt = (overrides: Partial<QuizReportAttempt> = {}): QuizReportAttempt => ({
  id: "a1", user_id: "student-1", student_name: "Ali", course_slug: "coding",
  quiz_id: "quiz-1", quiz_title: "Basics", score: 60, passed: false,
  created_at: "2026-11-01T10:00:00Z", ...overrides,
});

describe("admin quiz reporting", () => {
  it("keeps students and courses separate", () => {
    const groups = groupQuizAttempts([attempt(), attempt({ id: "a2", user_id: "student-2" }), attempt({ id: "a3", course_slug: "robotics" })]);
    expect(groups).toHaveLength(3);
    expect(groups.every((g) => g.attempts.length === 1)).toBe(true);
  });
  it("preserves each recorded score and pass status including failed retakes", () => {
    const [group] = groupQuizAttempts([attempt({ id: "a2", score: 50, passed: false, created_at: "2026-11-02T10:00:00Z" }), attempt({ score: 90, passed: true })]);
    expect(group?.attempts.map((a) => [a.score, a.passed, a.attemptNumber])).toEqual([[50, false, 2], [90, true, 1]]);
  });
  it("numbers attempts separately for each quiz", () => {
    const [group] = groupQuizAttempts([attempt(), attempt({ id: "a2", quiz_id: "quiz-2" })]);
    expect(group?.attempts.map((a) => a.attemptNumber)).toEqual([1, 1]);
  });
});