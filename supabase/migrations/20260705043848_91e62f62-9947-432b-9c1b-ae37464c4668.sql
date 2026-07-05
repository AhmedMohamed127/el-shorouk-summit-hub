
-- Questions table (audience questions to speakers)
CREATE TABLE public.event_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  question TEXT NOT NULL,
  target_speaker TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.event_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_questions TO authenticated;
GRANT ALL ON public.event_questions TO service_role;
ALTER TABLE public.event_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert questions" ON public.event_questions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read questions" ON public.event_questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins can delete questions" ON public.event_questions FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Reviews table
CREATE TABLE public.event_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.event_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_reviews TO authenticated;
GRANT ALL ON public.event_reviews TO service_role;
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert reviews" ON public.event_reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can read reviews" ON public.event_reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins can delete reviews" ON public.event_reviews FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
