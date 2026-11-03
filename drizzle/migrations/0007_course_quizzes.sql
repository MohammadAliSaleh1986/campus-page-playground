CREATE TABLE public.course_quizzes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 course_slug text NOT NULL,
 title text NOT NULL,
 pass_percent integer NOT NULL DEFAULT 70 CHECK (pass_percent BETWEEN 0 AND 100),
 required boolean NOT NULL DEFAULT true,
 position integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.quiz_questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 quiz_id uuid NOT NULL REFERENCES public.course_quizzes(id) ON DELETE CASCADE,
 prompt text NOT NULL,
 options text[] NOT NULL,
 correct_index integer NOT NULL DEFAULT 0,
 position integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.quiz_attempts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL,
 quiz_id uuid NOT NULL REFERENCES public.course_quizzes(id) ON DELETE CASCADE,
 score integer NOT NULL,
 passed boolean NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_quizzes TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT SELECT (id, quiz_id, prompt, options, position, created_at) ON public.quiz_questions TO authenticated;
GRANT SELECT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.course_quizzes, public.quiz_questions, public.quiz_attempts TO service_role;
ALTER TABLE public.course_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage quizzes" ON public.course_quizzes FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Enrolled students read quizzes" ON public.course_quizzes FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.enrollments e WHERE e.user_id=auth.uid() AND e.course_slug=course_quizzes.course_slug AND e.status='approved'));
CREATE POLICY "Admins manage questions" ON public.quiz_questions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Enrolled students read questions" ON public.quiz_questions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.course_quizzes q JOIN public.enrollments e ON e.course_slug=q.course_slug WHERE q.id=quiz_questions.quiz_id AND e.user_id=auth.uid() AND e.status='approved'));
CREATE POLICY "Read own attempts" ON public.quiz_attempts FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.quiz_answer_key(_quiz_id uuid) RETURNS TABLE(id uuid, correct_index integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
 RETURN QUERY SELECT q.id, q.correct_index FROM public.quiz_questions q WHERE q.quiz_id=_quiz_id;
END $$;

CREATE OR REPLACE FUNCTION public.submit_quiz(_quiz_id uuid, _answers jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
 _uid uuid := auth.uid(); _slug text; _pass int; _total int; _right int; _score int; _passed boolean; _done boolean := false;
BEGIN
 IF _uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 SELECT course_slug, pass_percent INTO _slug, _pass FROM public.course_quizzes WHERE id=_quiz_id;
 IF _slug IS NULL THEN RAISE EXCEPTION 'Quiz not found'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.enrollments WHERE user_id=_uid AND course_slug=_slug AND status='approved') THEN RAISE EXCEPTION 'Enrollment required'; END IF;
 SELECT count(*), count(*) FILTER (WHERE (_answers ->> q.id::text)::int = q.correct_index) INTO _total, _right FROM public.quiz_questions q WHERE q.quiz_id=_quiz_id;
 IF _total = 0 THEN RAISE EXCEPTION 'Quiz has no questions'; END IF;
 _score := round(100.0 * _right / _total);
 _passed := _score >= _pass;
 INSERT INTO public.quiz_attempts(user_id, quiz_id, score, passed) VALUES (_uid, _quiz_id, _score, _passed);
 IF EXISTS (SELECT 1 FROM public.course_quizzes WHERE course_slug=_slug AND required)
   AND NOT EXISTS (SELECT 1 FROM public.course_quizzes cq WHERE cq.course_slug=_slug AND cq.required
     AND NOT EXISTS (SELECT 1 FROM public.quiz_attempts a WHERE a.quiz_id=cq.id AND a.user_id=_uid AND a.passed)) THEN
   UPDATE public.enrollments SET completed_at=now() WHERE user_id=_uid AND course_slug=_slug AND status='approved' AND completed_at IS NULL;
   _done := true;
 END IF;
 RETURN jsonb_build_object('score',_score,'passed',_passed,'correct',_right,'total',_total,'completed',_done);
END $$;
REVOKE ALL ON FUNCTION public.submit_quiz(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz(uuid, jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public.quiz_answer_key(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.quiz_answer_key(uuid) TO authenticated;