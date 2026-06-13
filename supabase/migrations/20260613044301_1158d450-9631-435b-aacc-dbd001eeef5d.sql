
-- 1) Achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements public read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "achievements admin write" ON public.achievements FOR ALL
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER achievements_updated_at BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2) Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.speakers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.careers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sponsors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.achievements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;

ALTER TABLE public.sessions REPLICA IDENTITY FULL;
ALTER TABLE public.speakers REPLICA IDENTITY FULL;
ALTER TABLE public.careers REPLICA IDENTITY FULL;
ALTER TABLE public.sponsors REPLICA IDENTITY FULL;
ALTER TABLE public.gallery_images REPLICA IDENTITY FULL;
ALTER TABLE public.achievements REPLICA IDENTITY FULL;

-- 3) Seed achievements (academy, rates from 2008 onwards)
INSERT INTO public.achievements (label_ar, label_en, value, icon, order_index) VALUES
  ('عام على تأسيس الأكاديمية', 'Years since founding (1993)', '31+', 'Trophy', 1),
  ('عام من التطور المستمر منذ 2008', 'Years of growth since 2008', '17+', 'TrendingUp', 2),
  ('خريج من قسم BIS', 'BIS graduates', '2,500+', 'GraduationCap', 3),
  ('معدل توظيف الخريجين', 'Graduate employment rate', '92%', 'Briefcase', 4),
  ('معدل النجاح في القسم', 'Department success rate', '95%', 'Award', 5),
  ('شركة شريكة في التدريب', 'Partner companies for training', '40+', 'Building2', 6);

-- 4) Seed sessions (timeline currently on the website)
INSERT INTO public.sessions (time_label, title_ar, title_en, description_ar, description_en, speaker, order_index) VALUES
  ('10:30 — 10:55', 'الاستقبال وتجهيز القاعة', 'Reception & hall setup', 'تسجيل الحضور وتشغيل شاشة الترحيب.', 'Attendee check-in and welcome screen.', 'فريق التنظيم', 1),
  ('11:00 — 11:05', 'الافتتاح والترحيب', 'Opening & welcome', 'تعريف بعنوان الملتقى ومسار اليوم.', 'Event introduction and agenda overview.', 'مقدم الملتقى', 2),
  ('11:10 — 11:25', 'إنجازات المعهد وقسم BIS', 'Institute & BIS achievements', 'عرض موجز لأبرز إنجازات الأكاديمية والقسم.', 'Highlights from the academy and department.', 'ممثل الإدارة', 3),
  ('11:30 — 11:50', 'أثر AI على وظائف BIS', 'AI''s impact on BIS careers', 'شرح عملي للوظائف قبل وبعد AI والمهارات المطلوبة.', 'BIS careers before/after AI and required skills.', 'الدكتور', 4),
  ('11:55 — 12:05', 'استراحة قصيرة', 'Short break', 'مشروبات وتجهيز فرق المناظرة.', 'Refreshments and debate team prep.', 'الضيافة', 5),
  ('12:10 — 12:35', 'مناظرات الطلاب مع الدكتور', 'Student debates with the professor', 'هل يستبدل AI وظائف BIS أم يصنع فرصًا أفضل؟', 'Will AI replace BIS roles or create better opportunities?', 'فريقا طلاب + الدكتور', 6),
  ('12:40 — 12:50', 'أسئلة مفتوحة', 'Open Q&A', 'أسئلة وتدخلات من الجمهور.', 'Questions and audience contributions.', 'الدكتور والمقدم', 7),
  ('12:55 — 1:00', 'التوصيات والصورة الجماعية', 'Recommendations & group photo', 'تلخيص الرسائل الأساسية وشكر الحضور.', 'Wrap-up, thanks, and group photo.', 'الفريق', 8);

-- 5) Seed speakers
INSERT INTO public.speakers (name_ar, name_en, position_ar, position_en, bio_ar, bio_en, order_index) VALUES
  ('د. أحمد محمد', 'Dr. Ahmed Mohamed', 'رئيس قسم BIS', 'Head of BIS Dept.', 'خبرة 15 عامًا في أنظمة المعلومات.', '15 years in BIS.', 1),
  ('أ. سارة علي', 'Eng. Sara Ali', 'محاضر — الذكاء الاصطناعي', 'AI Lecturer', 'متخصصة في تطبيقات AI للأعمال.', 'AI for business specialist.', 2),
  ('أ. كريم حسن', 'Mr. Karim Hassan', 'مستشار سوق العمل', 'Industry Mentor', 'يربط الطلاب بفرص العمل الرقمي.', 'Bridges students with digital careers.', 3);

-- 6) Seed careers
INSERT INTO public.careers (name_ar, name_en, before_ai_ar, before_ai_en, after_ai_ar, after_ai_en, skills_ar, skills_en, order_index) VALUES
  ('محلل أعمال', 'Business Analyst', 'تجميع متطلبات يدوي.', 'Manual requirement gathering.', 'تحليل تنبؤي مدعوم بـ AI.', 'AI-augmented predictive analysis.', ARRAY['SQL','Power BI','ChatGPT'], ARRAY['SQL','Power BI','ChatGPT'], 1),
  ('مهندس بيانات', 'Data Engineer', 'ETL تقليدي.', 'Traditional ETL.', 'بناء بحيرات بيانات ذكية.', 'Intelligent data-lake pipelines.', ARRAY['Python','Airflow','dbt'], ARRAY['Python','Airflow','dbt'], 2),
  ('مدير منتج رقمي', 'Digital Product Manager', 'إدارة وثائق وخرائط.', 'Specs & roadmap management.', 'اتخاذ قرار مدعوم بنماذج AI.', 'Decision-making backed by AI models.', ARRAY['Strategy','AI Tools','UX'], ARRAY['Strategy','AI Tools','UX'], 3);
