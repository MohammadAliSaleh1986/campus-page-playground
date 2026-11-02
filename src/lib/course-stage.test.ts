import { describe, expect, it } from "vitest";
import { courseStage, canWatchCourse, canRequestEnrollment } from "./course-stage";
const row = (status: string, completed_at: string | null = null) => ({ course_slug: "coding", status, completed_at });
describe("student course stages", () => {
  it("classifies a course without enrollment as unenrolled", () => expect(courseStage("coding", [])).toBe("unenrolled"));
  it("classifies a pending payment as requesting approval", () => expect(courseStage("coding", [row("pending")])).toBe("requesting-approval"));
  it("blocks pending course access", () => expect(canWatchCourse("requesting-approval")).toBe(false));
  it("blocks repeat pending enrollment", () => expect(canRequestEnrollment("requesting-approval")).toBe(false));
  it("classifies approved payment as enrolled", () => expect(courseStage("coding", [row("approved")])).toBe("enrolled"));
  it("unlocks approved course watching", () => expect(canWatchCourse("enrolled")).toBe(true));
  it("requires verified assessment completion for completed", () => expect(courseStage("coding", [row("approved", "2026-11-02T00:00:00Z")])).toBe("completed"));
  it("ignores completion after approval is revoked", () => expect(courseStage("coding", [row("rejected", "2026-11-02T00:00:00Z")])).toBe("unenrolled"));
  it("preserves existing access when a duplicate historical request is rejected", () => expect(courseStage("coding", [row("rejected"), row("approved")])).toBe("enrolled"));
  it("does not leak another course's enrollment stage", () => expect(courseStage("robotics", [row("approved")])).toBe("unenrolled"));
});