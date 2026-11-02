ALTER TABLE public.enrollments ADD COLUMN completed_at timestamptz;
COMMENT ON COLUMN public.enrollments.completed_at IS 'Reserved for verified course assessment completion; no student write or manual completion UI.';
CREATE OR REPLACE FUNCTION public.guard_enrollment_request() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 IF TG_OP = 'INSERT' THEN
  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id::text || ':' || NEW.course_slug, 0));
  IF EXISTS (SELECT 1 FROM public.enrollments WHERE user_id=NEW.user_id AND course_slug=NEW.course_slug AND status IN ('pending','approved')) THEN
   RAISE EXCEPTION 'An enrollment or payment request already exists for this course.';
  END IF;
  IF NEW.completed_at IS NOT NULL THEN RAISE EXCEPTION 'Completion requires verified assessments.'; END IF;
 END IF;
 IF NEW.status <> 'approved' THEN NEW.completed_at := NULL; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER guard_enrollment_request BEFORE INSERT OR UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.guard_enrollment_request();
DROP POLICY "Approved students and previews read videos" ON public.course_videos;
CREATE POLICY "Approved students and previews read videos" ON public.course_videos FOR SELECT TO authenticated USING (
 public.has_role(auth.uid(), 'admin'::public.app_role)
 OR EXISTS (SELECT 1 FROM public.enrollments e WHERE e.user_id=auth.uid() AND e.course_slug=course_videos.course_slug AND e.status='approved')
 OR (is_preview AND NOT EXISTS (SELECT 1 FROM public.enrollments e WHERE e.user_id=auth.uid() AND e.course_slug=course_videos.course_slug AND e.status='pending'))
);