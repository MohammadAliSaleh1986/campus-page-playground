import { describe, expect, it } from "vitest";
import { assessmentProgress } from "./student-progress";
const quizzes = [{ id: "a", course_slug: "coding", title: "One", required: true, pass_percent: 70 }, { id: "b", course_slug: "coding", title: "Two", required: true, pass_percent: 70 }, { id: "c", course_slug: "coding", title: "Extra", required: false, pass_percent: 70 }];
const attempt = (quiz_id: string, passed: boolean) => ({ quiz_id, passed, score: passed ? 100 : 50, created_at: "2026-11-04" });
describe("student certificate eligibility", () => {
  it("requires passing every required quiz", () => { expect(assessmentProgress("coding", true, quizzes, [attempt("a", true)])).toEqual({ required: 2, passed: 1, percent: 50, certificateEligible: false }); });
  it("unlocks after all required quizzes without optional quizzes", () => { expect(assessmentProgress("coding", true, quizzes, [attempt("a", true), attempt("b", true)]).certificateEligible).toBe(true); });
  it("does not unlock with no required quizzes", () => { expect(assessmentProgress("coding", true, [], []).certificateEligible).toBe(false); });
  it("requires approved enrollment even after passing", () => { expect(assessmentProgress("coding", false, quizzes, [attempt("a", true), attempt("b", true)]).certificateEligible).toBe(false); });
  it("retains an earned pass after an unsuccessful retake", () => { expect(assessmentProgress("coding", true, quizzes, [attempt("a", true), attempt("a", false), attempt("b", true)]).certificateEligible).toBe(true); });
});