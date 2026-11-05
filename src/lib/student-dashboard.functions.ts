import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { assessmentProgress } from "./student-progress";

export const getStudentDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const [profile, enrollments, attempts] = await Promise.all([
    context.supabase.from("profiles").select("display_name").eq("id", context.userId).single(),
    context.supabase.from("enrollments").select("id, course_slug, status, completed_at, created_at").eq("user_id", context.userId).order("created_at", { ascending: false }),
    context.supabase.from("quiz_attempts").select("quiz_id, score, passed, created_at").eq("user_id", context.userId).order("created_at", { ascending: false }),
  ]);
  if (profile.error || enrollments.error || attempts.error) throw new Error("Your progress could not be loaded.");
  const slugs = [...new Set(enrollments.data.map(e => e.course_slug))];
  const quizzes = slugs.length ? await context.supabase.from("course_quizzes").select("id, course_slug, title, required, pass_percent").in("course_slug", slugs).order("position") : { data: [], error: null };
  if (quizzes.error) throw new Error("Assessments could not be loaded.");
  return { name: profile.data.display_name, enrollments: enrollments.data, attempts: attempts.data, quizzes: quizzes.data ?? [] };
});

export const getCourseCertificate = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data, context }) => {
    const [enrollment, quizzes, profile, course] = await Promise.all([
      context.supabase.from("enrollments").select("id, completed_at").eq("user_id", context.userId).eq("course_slug", data.slug).eq("status", "approved").order("created_at").limit(1).maybeSingle(),
      context.supabase.from("course_quizzes").select("id, course_slug, title, required, pass_percent").eq("course_slug", data.slug),
      context.supabase.from("profiles").select("display_name").eq("id", context.userId).single(),
      context.supabase.from("courses").select("content").eq("slug", data.slug).maybeSingle(),
    ]);
    if (enrollment.error || quizzes.error || profile.error || course.error) throw new Error("Certificate unavailable. Please try again.");
    const ids = (quizzes.data ?? []).map(q => q.id);
    const attempts = ids.length ? await context.supabase.from("quiz_attempts").select("quiz_id, score, passed, created_at").eq("user_id", context.userId).in("quiz_id", ids) : { data: [], error: null };
    if (attempts.error || !enrollment.data || !assessmentProgress(data.slug, true, quizzes.data ?? [], attempts.data ?? []).certificateEligible) throw new Error("Pass every required quiz to earn this certificate.");
    const name = profile.data?.display_name.trim();
    if (!name) throw new Error("Save the student's name in My account before downloading a certificate.");
    const content = course.data?.content;
    const title = content && typeof content === "object" && !Array.isArray(content) && typeof content["title"] === "string" ? content["title"] : data.slug;
    const requiredIds = (quizzes.data ?? []).filter(q => q.required).map(q => q.id);
    const firstPasses = requiredIds.map(id => (attempts.data ?? []).filter(a => a.quiz_id === id && a.passed).map(a => a.created_at).sort()[0]).filter((date): date is string => Boolean(date));
    const completed = firstPasses.sort().at(-1) ?? enrollment.data.completed_at;
    const { createCertificatePdf } = await import("./certificate-pdf.server");
    return { base64: await createCertificatePdf({ name, title, completed: completed ?? "", reference: enrollment.data.id }), filename: `MAS-Academy-${data.slug}-certificate.pdf` };
  });