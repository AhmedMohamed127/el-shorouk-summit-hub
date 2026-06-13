import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Calendar, Clock, MapPin, Sparkles, Brain, Briefcase, TrendingUp, Code2,
  Users, Trophy, GraduationCap, Award, MessageSquareQuote, ChevronLeft,
  Linkedin, Twitter, Mail, Phone, Facebook, Instagram, Globe, Languages,
} from "lucide-react";

import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import shoroukLogo from "@/assets/shorouk-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الملتقى العلمي لنظم معلومات الأعمال — أكاديمية الشروق" },
      { name: "description", content: "كيف يغير الذكاء الاصطناعي وظائف وتخصصات BIS؟ ملتقى علمي بقسم BIS بأكاديمية الشروق." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

/* -------------- Reusable bits -------------- */

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="fixed top-4 end-4 z-50 flex items-center gap-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      {lang === "ar" ? "EN" : "ع"}
    </button>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mx-auto mb-14 max-w-3xl text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold">
        <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-black leading-tight text-navy-deep md:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
    </motion.div>
  );
}

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  );
}

/* -------------- Hero -------------- */

function Hero() {
  const { t } = useLang();
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-navy-deep text-white">
      <img
        src={heroBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        width={1920}
        height={1080}
      />
      <div
        className="absolute inset-0 opacity-40 animate-grid-pan"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--gold) 25%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--gold) 25%, transparent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent" />

      <LangSwitch />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.img
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          src={shoroukLogo.url}
          alt="أكاديمية الشروق"
          className="mb-8 h-20 w-auto rounded-lg bg-white/95 p-2 shadow-elevated md:h-24"
        />

        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t("قسم نظم معلومات الأعمال — BIS", "Business Information Systems — BIS")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-6 text-4xl font-black leading-tight md:text-7xl"
        >
          {t("الملتقى العلمي لنظم", "The Practical Forum for")}{" "}
          <span className="text-gradient-gold">{t("معلومات الأعمال", "Business Information Systems")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl"
        >
          {t(
            "كيف يغير الذكاء الاصطناعي وظائف وتخصصات BIS؟",
            "How is AI reshaping the careers and disciplines of BIS?",
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm md:text-base"
        >
          {[
            { Icon: Calendar, label: t("الأسبوع الأخير من يوليو", "Last week of July") },
            { Icon: Clock, label: t("11:00 ص — 1:00 م", "11:00 AM — 1:00 PM") },
            { Icon: MapPin, label: t("مبنى د — قاعة السمنار", "Building D — Seminar Hall") },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-full glass-card px-5 py-2.5">
              <Icon className="h-4 w-4 text-gold" /> <span>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.a
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
          href="#register"
          className="group mt-12 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-soft px-8 py-4 text-base font-bold text-navy-deep shadow-elevated hover:shadow-[0_0_50px_-5px_oklch(0.78_0.14_80_/_0.6)] transition-all hover:scale-105"
        >
          {t("سجّل حضورك الآن", "Register Now")}
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
        </motion.a>
      </div>
    </section>
  );
}

/* -------------- About + Why + Achievements + ... -------------- */

function About() {
  const { t } = useLang();
  const items = [
    { ar: "تعريف الطلاب بأن BIS هو حلقة الربط بين الأعمال والتكنولوجيا والبيانات.", en: "Teach students that BIS bridges business, technology, and data." },
    { ar: "توضيح أن الذكاء الاصطناعي لن يلغي وظائف BIS بل سيعيد تشكيلها.", en: "Show that AI won't eliminate BIS roles — it will reshape them." },
    { ar: "تدريب الطلاب على الحوار والمناظرة المهنية حول مستقبل وظائفهم.", en: "Train students in professional dialogue about the future of their careers." },
    { ar: "الخروج بتوصيات واضحة: ماذا يتعلمون، وكيف يقدمون أنفسهم لسوق العمل.", en: "Leave with concrete recommendations on what to learn and how to present yourself." },
  ];
  return (
    <Section id="about" className="bg-background">
      <SectionHeader
        eyebrow={t("عن الملتقى", "About the Event")}
        title={t("ملتقى عملي يربط بين الأكاديميا وسوق العمل", "A hands-on forum bridging academia and industry")}
        subtitle={t(
          "ليس مجرد محاضرة، بل لقاء تفاعلي يجمع عرض الإنجازات ومحتوى مهني عن AI × BIS ومناظرات طلابية مع الدكتور.",
          "More than a lecture — an interactive gathering combining achievements, AI × BIS career content, and student debates with the professor.",
        )}
      />
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-4 rounded-2xl border bg-card p-6 shadow-elevated"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-soft text-navy-deep">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-base leading-relaxed text-foreground">{t(it.ar, it.en)}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function WhyMatters() {
  const { t } = useLang();
  const cards = [
    { Icon: Brain, ar_t: "مستقبل BIS", en_t: "Future of BIS", ar_d: "تحول جذري في أدوار التحليل والقرار وحوكمة التقنية.", en_d: "A radical shift in analysis, decision-making, and IT governance roles." },
    { Icon: Sparkles, ar_t: "أثر الذكاء الاصطناعي", en_t: "AI Impact", en_d: "Automation reshapes work — but elevates the analytical professional.", ar_d: "الأتمتة تعيد تشكيل العمل، وترفع سقف المهني التحليلي." },
    { Icon: TrendingUp, ar_t: "فرص السوق", en_t: "Market Opportunities", ar_d: "وظائف جديدة: AI Business Analyst، Data Governance، Automation Consultant.", en_d: "New roles: AI Business Analyst, Data Governance, Automation Consultant." },
    { Icon: Code2, ar_t: "المهارات المطلوبة", en_t: "Required Skills", ar_d: "SQL، BI، أدوات AI، أخلاقيات البيانات، إدارة المشاريع الرقمية.", en_d: "SQL, BI, AI tools, data ethics, digital project management." },
  ];
  return (
    <Section id="why" className="bg-secondary/40">
      <SectionHeader eyebrow={t("لماذا يهم؟", "Why It Matters")} title={t("لماذا هذا الملتقى مهم لك؟", "Why this event matters to you")} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border bg-card p-7 shadow-elevated transition hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_color-mix(in_oklab,var(--navy-deep)_40%,transparent)]"
          >
            <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-gold/20 to-transparent blur-2xl" />
            <c.Icon className="mb-4 h-10 w-10 text-gold" />
            <h3 className="mb-2 text-lg font-bold text-navy-deep">{t(c.ar_t, c.en_t)}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{t(c.ar_d, c.en_d)}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Timeline() {
  const { t } = useLang();
  const sessions = [
    { time: "10:30 — 10:55", ar_t: "الاستقبال وتجهيز القاعة", en_t: "Reception & hall setup", ar_d: "تسجيل الحضور وتشغيل شاشة الترحيب.", en_d: "Attendee check-in and welcome screen.", speaker: t("فريق التنظيم", "Organizing team") },
    { time: "11:00 — 11:05", ar_t: "الافتتاح والترحيب", en_t: "Opening & welcome", ar_d: "تعريف بعنوان الملتقى ومسار اليوم.", en_d: "Event introduction and agenda overview.", speaker: t("مقدم الملتقى", "Host") },
    { time: "11:10 — 11:25", ar_t: "إنجازات المعهد وقسم BIS", en_t: "Institute & BIS achievements", ar_d: "عرض موجز لأبرز إنجازات الأكاديمية والقسم.", en_d: "Highlights from the academy and department.", speaker: t("ممثل الإدارة", "Administration") },
    { time: "11:30 — 11:50", ar_t: "أثر AI على وظائف BIS", en_t: "AI's impact on BIS careers", ar_d: "شرح عملي للوظائف قبل وبعد AI والمهارات المطلوبة.", en_d: "BIS careers before/after AI and required skills.", speaker: t("الدكتور", "Lead Speaker") },
    { time: "11:55 — 12:05", ar_t: "استراحة قصيرة", en_t: "Short break", ar_d: "مشروبات وتجهيز فرق المناظرة.", en_d: "Refreshments and debate team prep.", speaker: t("الضيافة", "Hospitality") },
    { time: "12:10 — 12:35", ar_t: "مناظرات الطلاب مع الدكتور", en_t: "Student debates with the professor", ar_d: "هل يستبدل AI وظائف BIS أم يصنع فرصًا أفضل؟", en_d: "Will AI replace BIS roles or create better opportunities?", speaker: t("فريقا طلاب + الدكتور", "Two student teams + professor") },
    { time: "12:40 — 12:50", ar_t: "أسئلة مفتوحة", en_t: "Open Q&A", ar_d: "أسئلة وتدخلات من الجمهور.", en_d: "Questions and audience contributions.", speaker: t("الدكتور والمقدم", "Speaker & host") },
    { time: "12:55 — 1:00", ar_t: "التوصيات والصورة الجماعية", en_t: "Recommendations & group photo", ar_d: "تلخيص الرسائل الأساسية وشكر الحضور.", en_d: "Wrap-up, thanks, and group photo.", speaker: t("الفريق", "All") },
  ];

  return (
    <Section id="timeline" className="bg-background">
      <SectionHeader eyebrow={t("الجدول الزمني", "Schedule")} title={t("خطة اليوم بالدقائق", "Minute-by-minute agenda")} />
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute bottom-0 top-0 start-6 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent md:start-1/2 md:-ms-px" />
        {sessions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`relative mb-10 md:w-1/2 ${i % 2 === 0 ? "md:pe-12" : "md:ms-auto md:ps-12"}`}
          >
            <div className="absolute top-6 start-6 -ms-2 h-4 w-4 rounded-full bg-gold ring-4 ring-background md:start-auto md:end-0 md:-me-2"
              style={i % 2 !== 0 ? { left: "auto", insetInlineStart: "-0.5rem", insetInlineEnd: "auto" } : undefined}
            />
            <div className="ms-12 rounded-2xl border bg-card p-6 shadow-elevated md:ms-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-navy-deep px-3 py-1 text-xs font-bold text-gold">
                <Clock className="h-3 w-3" /> {s.time}
              </div>
              <h3 className="text-lg font-bold text-navy-deep">{t(s.ar_t, s.en_t)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(s.ar_d, s.en_d)}</p>
              <p className="mt-3 text-xs font-semibold text-gold">— {s.speaker}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Achievements() {
  const { t } = useLang();
  const stats = [
    { Icon: Trophy, value: "120+", ar_l: "مشروع طلابي", en_l: "Student projects" },
    { Icon: GraduationCap, value: "800+", ar_l: "طالب وطالبة", en_l: "Students" },
    { Icon: Award, value: "25+", ar_l: "برنامج تدريبي", en_l: "Training programs" },
    { Icon: Sparkles, value: "60+", ar_l: "قصة نجاح", en_l: "Success stories" },
  ];
  return (
    <section className="relative overflow-hidden bg-navy-deep py-20 text-white md:py-28">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, var(--gold) 0, transparent 40%), radial-gradient(circle at 80% 20%, var(--gold) 0, transparent 40%)"
      }} />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold">
            <Trophy className="h-3.5 w-3.5" /> {t("الإنجازات", "Achievements")}
          </span>
          <h2 className="mt-5 text-3xl font-black md:text-5xl">{t("أرقام تتحدث عن القسم", "Numbers that speak for the department")}</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl glass-card p-6 text-center"
            >
              <s.Icon className="mx-auto mb-3 h-8 w-8 text-gold" />
              <div className="text-4xl font-black text-gradient-gold md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-white/70">{t(s.ar_l, s.en_l)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Careers() {
  const { t } = useLang();
  const careers = [
    { ar_n: "محلل أعمال", en_n: "Business Analyst", ar_b: "تجميع متطلبات يدوي.", en_b: "Manual requirement gathering.", ar_a: "تحليل تنبؤي مدعوم بـ AI.", en_a: "AI-augmented predictive analysis.", skills: ["SQL", "Power BI", "ChatGPT"] },
    { ar_n: "مهندس بيانات", en_n: "Data Engineer", ar_b: "ETL تقليدي.", en_b: "Traditional ETL.", ar_a: "بناء بحيرات بيانات ذكية.", en_a: "Intelligent data-lake pipelines.", skills: ["Python", "Airflow", "dbt"] },
    { ar_n: "مدير منتج رقمي", en_n: "Digital Product Manager", ar_b: "إدارة وثائق وخرائط.", en_b: "Specs & roadmap management.", ar_a: "اتخاذ قرار مدعوم بنماذج AI.", en_a: "Decision-making backed by AI models.", skills: ["Strategy", "AI Tools", "UX"] },
  ];
  return (
    <Section id="careers" className="bg-background">
      <SectionHeader eyebrow={t("AI × BIS", "AI × BIS")} title={t("الوظائف قبل وبعد الذكاء الاصطناعي", "Careers before and after AI")} />
      <div className="grid gap-6 md:grid-cols-3">
        {careers.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="overflow-hidden rounded-2xl border bg-card shadow-elevated"
          >
            <div className="bg-navy-deep p-6 text-white">
              <Briefcase className="mb-3 h-8 w-8 text-gold" />
              <h3 className="text-xl font-bold">{t(c.ar_n, c.en_n)}</h3>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("قبل AI", "Before AI")}</div>
                <p className="text-sm">{t(c.ar_b, c.en_b)}</p>
              </div>
              <div className="rounded-xl bg-gold/10 p-4">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-gold">{t("بعد AI", "After AI")}</div>
                <p className="text-sm font-medium">{t(c.ar_a, c.en_a)}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map(s => (
                  <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-navy-deep">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Debate() {
  const { t } = useLang();
  return (
    <Section id="debate" className="bg-secondary/40">
      <SectionHeader
        eyebrow={t("مناظرة طلابية", "Student Debate")}
        title={t("هل يستبدل AI وظائف BIS أم يصنع فرصًا أفضل؟", "Will AI replace BIS jobs or create better opportunities?")}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { color: "from-emerald-500/20 to-emerald-500/5", tag: t("الفريق المؤيد", "Team A — Supports"), ar_t: "AI يضاعف قدرات BIS", en_t: "AI multiplies BIS capability",
            points: [
              { ar: "تركيز أعلى على التحليل واتخاذ القرار.", en: "Higher focus on analysis and decision-making." },
              { ar: "وظائف جديدة: AI Business Analyst، Data Governance.", en: "New jobs: AI Business Analyst, Data Governance." },
              { ar: "مهام متكررة تختفي → وقت أكبر للإبداع.", en: "Repetitive tasks disappear → more room for creativity." },
            ] },
          { color: "from-rose-500/20 to-rose-500/5", tag: t("الفريق المعارض", "Team B — Opposes"), ar_t: "مخاطر الاستبدال والاعتماد الزائد", en_t: "Replacement & over-reliance risks",
            points: [
              { ar: "أتمتة المهام الأساسية تهدد وظائف الجدد.", en: "Automation of core tasks threatens junior roles." },
              { ar: "اعتماد زائد يقلل التفكير النقدي.", en: "Over-reliance reduces critical thinking." },
              { ar: "تحديات أخلاقيات بيانات العملاء.", en: "Customer-data ethics challenges." },
            ] },
        ].map((team, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className={`rounded-2xl border bg-gradient-to-br ${team.color} p-7 shadow-elevated`}
          >
            <div className="mb-2 inline-block rounded-full bg-navy-deep px-3 py-1 text-xs font-bold text-gold">{team.tag}</div>
            <h3 className="text-2xl font-black text-navy-deep">{t(team.ar_t, team.en_t)}</h3>
            <ul className="mt-5 space-y-3">
              {team.points.map((p, j) => (
                <li key={j} className="flex gap-3">
                  <MessageSquareQuote className="h-5 w-5 shrink-0 text-gold" />
                  <span className="text-sm leading-relaxed">{t(p.ar, p.en)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function FutureSkills() {
  const { t } = useLang();
  const skills = [
    { Icon: Code2, ar: "تحليل البيانات وSQL", en: "Data analysis & SQL" },
    { Icon: Brain, ar: "أدوات الذكاء الاصطناعي", en: "AI tools mastery" },
    { Icon: TrendingUp, ar: "ذكاء الأعمال BI", en: "Business intelligence" },
    { Icon: Sparkles, ar: "أخلاقيات البيانات", en: "Data ethics" },
    { Icon: Briefcase, ar: "إدارة المنتجات الرقمية", en: "Digital product management" },
    { Icon: Users, ar: "التواصل المهني والعرض", en: "Professional communication" },
  ];
  return (
    <Section id="skills" className="bg-background">
      <SectionHeader eyebrow={t("مهارات المستقبل", "Future Skills")} title={t("ما يحتاجه خريج BIS الآن", "What today's BIS graduate needs")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-elevated transition hover:border-gold"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-deep text-gold">
              <s.Icon className="h-6 w-6" />
            </div>
            <span className="text-base font-semibold text-navy-deep">{t(s.ar, s.en)}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Speakers() {
  const { t } = useLang();
  const speakers = [
    { name_ar: "د. أحمد محمد", name_en: "Dr. Ahmed Mohamed", pos_ar: "رئيس قسم BIS", pos_en: "Head of BIS Dept.", bio_ar: "خبرة 15 عامًا في أنظمة المعلومات.", bio_en: "15 years in BIS." },
    { name_ar: "أ. سارة علي", name_en: "Eng. Sara Ali", pos_ar: "محاضر — الذكاء الاصطناعي", pos_en: "AI Lecturer", bio_ar: "متخصصة في تطبيقات AI للأعمال.", bio_en: "AI for business specialist." },
    { name_ar: "أ. كريم حسن", name_en: "Mr. Karim Hassan", pos_ar: "مستشار سوق العمل", pos_en: "Industry Mentor", bio_ar: "يربط الطلاب بفرص العمل الرقمي.", bio_en: "Bridges students with digital careers." },
  ];
  return (
    <Section id="speakers" className="bg-secondary/40">
      <SectionHeader eyebrow={t("المتحدثون", "Speakers")} title={t("نخبة من الخبراء", "A panel of experts")} />
      <div className="grid gap-6 md:grid-cols-3">
        {speakers.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group overflow-hidden rounded-2xl border bg-card shadow-elevated"
          >
            <div className="relative aspect-square bg-gradient-to-br from-navy-deep to-navy">
              <div className="absolute inset-0 flex items-center justify-center text-7xl font-black text-gold/30">
                {(s.name_en || s.name_ar).charAt(0)}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-navy-deep">{t(s.name_ar, s.name_en)}</h3>
              <p className="text-sm font-medium text-gold">{t(s.pos_ar, s.pos_en)}</p>
              <p className="mt-3 text-sm text-muted-foreground">{t(s.bio_ar, s.bio_en)}</p>
              <div className="mt-4 flex gap-3 text-muted-foreground">
                <a href="#" aria-label="LinkedIn" className="hover:text-gold"><Linkedin className="h-4 w-4" /></a>
                <a href="#" aria-label="Twitter" className="hover:text-gold"><Twitter className="h-4 w-4" /></a>
                <a href="#" aria-label="Email" className="hover:text-gold"><Mail className="h-4 w-4" /></a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function RegisterForm() {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", academic_year: "", department: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      toast.error(t("الاسم والبريد الإلكتروني مطلوبان", "Name and email are required"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("registrations").insert(form);
    setLoading(false);
    if (error) {
      toast.error(t("فشل التسجيل، حاول مرة أخرى", "Registration failed, please try again"));
      console.error(error);
      return;
    }
    toast.success(t("تم تسجيلك بنجاح! نراك في الملتقى.", "You're registered! See you at the event."));
    setForm({ full_name: "", email: "", phone: "", academic_year: "", department: "" });
  };

  const field = "w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

  return (
    <Section id="register" className="bg-background">
      <SectionHeader eyebrow={t("التسجيل", "Registration")} title={t("سجّل حضورك في الملتقى", "Reserve your spot")} subtitle={t("المقاعد محدودة — سجّل مبكرًا.", "Seats are limited — register early.")} />
      <motion.form
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        onSubmit={onSubmit}
        className="mx-auto max-w-2xl space-y-4 rounded-2xl border bg-card p-8 shadow-elevated"
      >
        <input className={field} placeholder={t("الاسم الكامل *", "Full name *")} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input type="email" className={field} placeholder={t("البريد الإلكتروني *", "Email *")} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className={field} placeholder={t("رقم الهاتف", "Phone")} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <select className={field} value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })}>
            <option value="">{t("السنة الدراسية", "Academic year")}</option>
            <option>{t("الأولى", "First")}</option>
            <option>{t("الثانية", "Second")}</option>
            <option>{t("الثالثة", "Third")}</option>
            <option>{t("الرابعة", "Fourth")}</option>
          </select>
          <input className={field} placeholder={t("القسم", "Department")} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-soft py-3.5 text-base font-bold text-navy-deep shadow-elevated transition hover:scale-[1.01] disabled:opacity-60"
        >
          {loading ? t("جاري الإرسال…", "Submitting…") : t("سجّل الآن", "Register Now")}
        </button>
      </motion.form>
    </Section>
  );
}

function Gallery() {
  const { t } = useLang();
  return (
    <Section id="gallery" className="bg-secondary/40">
      <SectionHeader eyebrow={t("المعرض", "Gallery")} title={t("لحظات من فعالياتنا", "Moments from our events")} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-navy to-navy-deep shadow-elevated"
          >
            <div className="flex h-full w-full items-center justify-center text-gold/30">
              <Sparkles className="h-10 w-10" />
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">{t("سيتم تحميل صور الفعالية من لوحة الإدارة.", "Event photos will be uploaded from the admin dashboard.")}</p>
    </Section>
  );
}

function Sponsors() {
  const { t } = useLang();
  return (
    <Section id="sponsors" className="bg-background">
      <SectionHeader eyebrow={t("الشركاء", "Partners")} title={t("شركاؤنا في النجاح", "Our partners in success")} />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex h-24 items-center justify-center rounded-xl border bg-card text-muted-foreground shadow-elevated">
            <Globe className="h-8 w-8" />
          </div>
        ))}
      </div>
    </Section>
  );
}

function CTA() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 text-center text-white">
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(ellipse at center, var(--gold) 0, transparent 60%)"
      }} />
      <div className="relative mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-black md:text-5xl">
          {t("لا تفوّت فرصة تشكيل مستقبلك المهني", "Don't miss the chance to shape your career")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70">{t("انضم إلينا في الملتقى وكن جزءًا من النقاش.", "Join us at the forum and be part of the conversation.")}</p>
        <a href="#register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-soft px-8 py-4 font-bold text-navy-deep shadow-elevated transition hover:scale-105">
          {t("احجز مقعدك الآن", "Reserve your seat")}
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-navy-deep px-6 py-12 text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <img src={shoroukLogo.url} alt="" className="h-16 w-auto rounded-md bg-white/95 p-1.5" />
          <p className="mt-4 text-sm">{t("قسم نظم معلومات الأعمال — أكاديمية الشروق", "Business Information Systems — Shorouk Academy")}</p>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">{t("تواصل معنا", "Contact")}</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> bis@sha.edu.eg</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +20 100 000 0000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {t("القاهرة، مصر", "Cairo, Egypt")}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">{t("تابعنا", "Follow Us")}</h4>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full glass-card hover:bg-gold hover:text-navy-deep transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {t("أكاديمية الشروق — كل الحقوق محفوظة", "Shorouk Academy — All rights reserved")}
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="overflow-x-hidden bg-background">
      <Hero />
      <About />
      <WhyMatters />
      <Timeline />
      <Achievements />
      <Careers />
      <Debate />
      <FutureSkills />
      <Speakers />
      <RegisterForm />
      <Gallery />
      <Sponsors />
      <CTA />
      <Footer />
    </div>
  );
}
