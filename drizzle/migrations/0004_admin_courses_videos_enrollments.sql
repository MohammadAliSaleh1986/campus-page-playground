GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
CREATE POLICY "Admins read all courses" ON public.courses FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update courses" ON public.courses FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete courses" ON public.courses FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TYPE public.enrollment_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  course_slug text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  whish_reference text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  receipt_path text,
  status public.enrollment_status NOT NULL DEFAULT 'pending',
  admin_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students read own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Students request enrollment" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending' AND reviewed_at IS NULL AND admin_note = '');
CREATE POLICY "Admins read enrollments" ON public.enrollments FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update enrollments" ON public.enrollments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete enrollments" ON public.enrollments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.course_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL,
  title text NOT NULL,
  drive_file_id text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_preview boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_videos TO authenticated;
GRANT ALL ON public.course_videos TO service_role;
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved students and previews read videos" ON public.course_videos FOR SELECT TO authenticated USING (
  is_preview OR public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.enrollments e WHERE e.user_id = auth.uid() AND e.course_slug = course_videos.course_slug AND e.status = 'approved'));
CREATE POLICY "Admins insert videos" ON public.course_videos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update videos" ON public.course_videos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete videos" ON public.course_videos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students upload own receipts" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Students read own receipts" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Admins read receipts" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'receipts' AND public.has_role(auth.uid(), 'admin'));