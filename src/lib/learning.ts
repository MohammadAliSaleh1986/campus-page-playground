// Signed-in data (enrollments, videos, admin lists) read through the browser client; RLS decides what each user sees.
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type EnrollmentStatus = "pending" | "approved" | "rejected";

function fail(error: { message: string } | null, what: string) {
  if (error) throw new Error(`${what} could not be loaded.`);
}

export const isAdminQuery = queryOptions({
  queryKey: ["is-admin"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return false;
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin");
    return (data?.length ?? 0) > 0;
  },
});

export const myEnrollmentsQuery = queryOptions({
  queryKey: ["my-enrollments"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("enrollments").select("*").eq("user_id", u.user?.id ?? "").order("created_at", { ascending: false });
    fail(error, "Your enrollments");
    return data ?? [];
  },
});

export const adminEnrollmentsQuery = queryOptions({
  queryKey: ["admin-enrollments"],
  queryFn: async () => {
    const { data, error } = await supabase.from("enrollments").select("*").order("created_at", { ascending: false });
    fail(error, "Payment requests");
    const ids = [...new Set((data ?? []).map((e) => e.user_id))];
    const { data: profiles } = ids.length ? await supabase.from("profiles").select("id, display_name").in("id", ids) : { data: [] };
    const names = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
    return (data ?? []).map((e) => ({ ...e, student_name: names.get(e.user_id) || "Student" }));
  },
});

export const adminCoursesQuery = queryOptions({
  queryKey: ["admin-courses"],
  queryFn: async () => {
    const { data, error } = await supabase.from("courses").select("slug, content, published").order("slug");
    fail(error, "Courses");
    return data ?? [];
  },
});

export const courseVideosQuery = (slug: string) => queryOptions({
  queryKey: ["course-videos", slug],
  queryFn: async () => {
    const { data, error } = await supabase.from("course_videos").select("*").eq("course_slug", slug).order("position").order("created_at");
    fail(error, "Videos");
    return data ?? [];
  },
});

export const courseQuizzesQuery = (slug: string) => queryOptions({
  queryKey: ["course-quizzes", slug],
  queryFn: async () => {
    const { data, error } = await supabase.from("course_quizzes")
      .select("id, title, pass_percent, required, position, quiz_questions(id, prompt, options, position)")
      .eq("course_slug", slug).order("position").order("created_at");
    fail(error, "Quizzes");
    return (data ?? []).map((q) => ({ ...q, quiz_questions: [...(q.quiz_questions ?? [])].sort((a, b) => a.position - b.position) }));
  },
});

export const myQuizAttemptsQuery = queryOptions({
  queryKey: ["my-quiz-attempts"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("quiz_attempts").select("quiz_id, score, passed, created_at").eq("user_id", u.user?.id ?? "").order("created_at", { ascending: false });
    fail(error, "Quiz results");
    return data ?? [];
  },
});
