import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar, Clock, MapPin, Sparkles, Brain, Briefcase, TrendingUp, Code2,
  Users, Trophy, GraduationCap, Award, MessageSquareQuote, ChevronLeft, ChevronRight,
  Linkedin, Twitter, Mail, Phone, Facebook, Instagram, Globe, Languages,
  Building2, MessageCircleQuestion, Star,
} from "lucide-react";

import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import bisLogo from "@/assets/bis-logo-v3.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الملتقى العلمي لنظم معلومات الأعمال — أكاديمية الشروق" },
      { name: "description", content: "ملتقى علمي بقسم BIS بأكاديمية الشروق — مستقبل وظائف نظم معلومات الأعمال في عصر الذكاء الاصطناعي." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const ICONS: Record<string, any> = { Trophy, GraduationCap, Award, Sparkles, Briefcase, TrendingUp, Building2, Users };

function useRealtime(table: string) {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel(`public-${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        qc.invalidateQueries({ queryKey: [table] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [table, qc]);
}

function useTable<T = any>(table: string) {
  useRealtime(table);
  const { data } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data } = await supabase.from(table as any).select("*").order("order_index", { ascending: true });
      return (data as T[]) ?? [];
    },
  });
  return data ?? [];
}

function getMediaPath(url: string) {
  const marker = "/storage/v1/object/public/media/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return null;
  return decodeURIComponent(url.slice(markerIndex + marker.length).split("?")[0]);
}

function isLikelyImageUrl(url?: string | null) {
  if (!url) return false;
  return /^(https?:|data:image\/|blob:|\/)/i.test(url.trim());
}

async function resolveMediaUrl(url?: string | null) {
  if (!url) return "";
  const path = getMediaPath(url);
  if (!path) return url;
  const { data: signed } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365);
  return signed?.signedUrl ?? url;
}

function useTableWithMedia<T = any>(table: string, mediaFields: string[]) {
  useRealtime(table);
  const { data } = useQuery({
    queryKey: [table, "media"],
    queryFn: async () => {
      const { data } = await supabase.from(table as any).select("*").order("order_index", { ascending: true });
      const rows = ((data as T[]) ?? []) as any[];
      return Promise.all(rows.map(async (row) => {
        const resolved = { ...row };
        await Promise.all(mediaFields.map(async (field) => {
          resolved[field] = await resolveMediaUrl(row[field]);
        }));
        return resolved;
      })) as Promise<T[]>;
    },
  });
  return data ?? [];
}

function useGalleryImages() {
  return useTableWithMedia("gallery_images", ["url"]);
}

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
      <div className="mx-auto max-w-7xl px-6 text-center">{children}</div>
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
          src={bisLogo.url}
          alt="BIS — أكاديمية الشروق"
          className="mb-8 h-36 w-auto md:h-44 drop-shadow-2xl"
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


        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm md:text-base"
        >
          {[
            { Icon: Calendar, label: t("الاثنين 6 يوليو", "Monday, July 6") },
            { Icon: Clock, label: t("11:00 ص — 3:00 م", "11:00 AM — 3:00 PM") },
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
        title={t("ملتقى علمي يربط بين التعليم الأكاديمي وسوق العمل", "A scientific forum bridging academic education and industry")}
        subtitle={t(
          "ليس مجرد محاضرة، بل لقاء تفاعلي يجمع عرض الإنجازات ومحتوى مهني عن AI × BIS ومناظرات طلابية مع المتحدثين",
          "More than a lecture — an interactive gathering combining achievements, AI × BIS career content, and student debates with the speakers",
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
  const sessions = useTable("sessions");
  return (
    <Section id="timeline" className="bg-background">
      <SectionHeader eyebrow={t("الجدول الزمني", "Schedule")} title={t("خطة اليوم بالدقائق", "Minute-by-minute agenda")} />
      <div className="relative mx-auto max-w-4xl">
        <div className="absolute bottom-0 top-0 start-6 w-px bg-gradient-to-b from-gold via-gold/30 to-transparent md:start-1/2 md:-ms-px" />
        {sessions.map((s: any, i: number) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`relative mb-10 md:w-1/2 ${i % 2 === 0 ? "md:pe-12" : "md:ms-auto md:ps-12"}`}
          >
            <div className="absolute top-6 start-6 -ms-2 h-4 w-4 rounded-full bg-gold ring-4 ring-background md:start-auto md:end-0 md:-me-2" />
            <div className="ms-12 rounded-2xl border bg-card p-6 shadow-elevated md:ms-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-navy-deep px-3 py-1 text-xs font-bold text-gold">
                <Clock className="h-3 w-3" /> {s.time_label}
              </div>
              <h3 className="text-lg font-bold text-navy-deep">{t(s.title_ar, s.title_en)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(s.description_ar, s.description_en)}</p>
              {s.speaker && <p className="mt-3 text-xs font-semibold text-gold">— {s.speaker}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Achievements() {
  const { t } = useLang();
  const stats = useTable("achievements");
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
          <h2 className="mt-5 text-3xl font-black md:text-5xl">{t("إنجازات أكاديمية الشروق منذ 2008", "Shorouk Academy achievements since 2008")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60 md:text-base">{t("معدلات موثوقة تعكس مسيرة القسم والأكاديمية في تخريج كفاءات سوق العمل.", "Reliable rates reflecting the department and academy's track record in producing market-ready talent.")}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s: any, i: number) => {
            const Icon = ICONS[s.icon] ?? Trophy;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl glass-card p-6 text-center"
              >
                <Icon className="mx-auto mb-3 h-8 w-8 text-gold" />
                <div className="text-3xl font-black text-gradient-gold md:text-4xl">{s.value}</div>
                <div className="mt-2 text-xs text-white/70 md:text-sm">{t(s.label_ar, s.label_en)}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Careers() {
  const { t, lang } = useLang();
  const careers = useTable("careers");
  return (
    <Section id="careers" className="bg-background">
      <SectionHeader eyebrow={t("AI × BIS", "AI × BIS")} title={t("الوظائف قبل وبعد الذكاء الاصطناعي", "Careers before and after AI")} />
      <div className="grid gap-6 md:grid-cols-3">
        {careers.map((c: any, i: number) => {
          const skills = (lang === "ar" ? c.skills_ar : c.skills_en) ?? [];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl border bg-card shadow-elevated"
            >
              <div className="bg-navy-deep p-6 text-white">
                <Briefcase className="mb-3 h-8 w-8 text-gold" />
                <h3 className="text-xl font-bold">{t(c.name_ar, c.name_en)}</h3>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("قبل AI", "Before AI")}</div>
                  <p className="text-sm">{t(c.before_ai_ar, c.before_ai_en)}</p>
                </div>
                <div className="rounded-xl bg-gold/10 p-4">
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-gold">{t("بعد AI", "After AI")}</div>
                  <p className="text-sm font-medium">{t(c.after_ai_ar, c.after_ai_en)}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s: string) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-navy-deep">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

function Debate() {
  const { t } = useLang();
  return (
    <Section id="debate" className="bg-secondary/40">
      <SectionHeader
        eyebrow={t("مناظرات الطلاب ", "Student Debate")}
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
  const speakers = useTableWithMedia("speakers", ["photo_url"]);
  return (
    <Section id="speakers" className="bg-secondary/40">
      <SectionHeader eyebrow={t("المتحدثون", "Speakers")} title={t("نخبة من الخبراء", "A panel of experts")} />
      <div className="grid gap-6 md:grid-cols-3">
        {speakers.map((s: any, i: number) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group overflow-hidden rounded-2xl border bg-card shadow-elevated"
          >
            <div className="relative aspect-square bg-gradient-to-br from-navy-deep to-navy">
              <div className="absolute inset-0 flex items-center justify-center text-7xl font-black text-gold/30">
                {(s.name_en || s.name_ar || "?").charAt(0)}
              </div>
              {isLikelyImageUrl(s.photo_url) && (
                <img
                  src={s.photo_url}
                  alt={s.name_ar}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-navy-deep">{t(s.name_ar, s.name_en)}</h3>
              <p className="text-sm font-medium text-gold">{t(s.position_ar, s.position_en)}</p>
              <p className="mt-3 text-sm text-muted-foreground">{t(s.bio_ar, s.bio_en)}</p>
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
            <option>{t("غير طالب", "Non-student")}</option>
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
  const images = useGalleryImages();
  return (
    <Section id="gallery" className="bg-secondary/40">
      <SectionHeader eyebrow={t("المعرض", "Gallery")} title={t("لحظات من فعالياتنا", "Moments from our events")} />
      {images.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">{t("سيتم تحميل صور الفعالية من لوحة الإدارة.", "Event photos will be uploaded from the admin dashboard.")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img: any, i: number) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group aspect-square overflow-hidden rounded-xl shadow-elevated"
            >
              <img src={img.url} alt={img.caption_ar ?? ""} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}

function Sponsors() {
  const { t } = useLang();
  const sponsors = useTable("sponsors");
  return (
    <Section id="sponsors" className="bg-background">
      <SectionHeader eyebrow={t("الشركاء", "Partners")} title={t("شركاؤنا في النجاح", "Our partners in success")} />
      {sponsors.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">{t("سيتم إضافة الرعاة قريبًا.", "Sponsors will be added soon.")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
          {sponsors.map((s: any) => (
            <a key={s.id} href={s.website ?? "#"} target="_blank" rel="noopener noreferrer" className="flex h-24 items-center justify-center rounded-xl border bg-card p-3 shadow-elevated hover:border-gold transition">
              {s.logo_url ? <img src={s.logo_url} alt={s.name} className="max-h-full max-w-full object-contain" /> : <span className="text-sm font-semibold">{s.name}</span>}
            </a>
          ))}
        </div>
      )}
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
          <img src={bisLogo.url} alt="BIS" className="h-20 w-auto" />
          <p className="mt-4 text-sm">{t("قسم نظم معلومات الأعمال — أكاديمية الشروق", "Business Information Systems — Shorouk Academy")}</p>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">{t("تواصل معنا", "Contact")}</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> ahm.mohamed@sha.edu.eg</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +20 1000782130</li>
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

function AskQuestion() {
  const { t } = useLang();
  const qc = useQueryClient();
  useRealtime("event_questions");
  const [form, setForm] = useState({ name: "", question: "", target_speaker: "" });
  const [loading, setLoading] = useState(false);
  const { data: questions = [] } = useQuery({
    queryKey: ["event_questions"],
    queryFn: async () => {
      const { data } = await supabase.from("event_questions").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const speakers = useTable("speakers");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.question.trim()) {
      toast.error(t("الاسم والسؤال مطلوبان", "Name and question are required"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("event_questions").insert(form);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("تم إرسال سؤالك!", "Your question has been sent!"));
    setForm({ name: "", question: "", target_speaker: "" });
    qc.invalidateQueries({ queryKey: ["event_questions"] });
  };

  const field = "w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

  return (
    <Section id="ask" className="bg-secondary/40">
      <SectionHeader
        eyebrow={t("اسأل الحضور", "Ask the Panel")}
        title={t("اطرح سؤالك على المتحدثين", "Ask the speakers a question")}
        subtitle={t("سيتم عرض الأسئلة على المتحدثين خلال الملتقى.", "Questions will be shared with speakers during the event.")}
      />
      <motion.form
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        onSubmit={submit}
        className="mx-auto max-w-2xl space-y-4 rounded-2xl border bg-card p-8 shadow-elevated"
      >
        <input className={field} placeholder={t("اسمك *", "Your name *")} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <select className={field} value={form.target_speaker} onChange={e => setForm({ ...form, target_speaker: e.target.value })}>
          <option value="">{t("للجميع", "To everyone")}</option>
          {speakers.map((s: any) => (
            <option key={s.id} value={s.name_ar || s.name_en}>{t(s.name_ar, s.name_en)}</option>
          ))}
        </select>
        <textarea rows={4} className={field} placeholder={t("سؤالك *", "Your question *")} value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} />
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-soft py-3.5 text-base font-bold text-navy-deep shadow-elevated transition hover:scale-[1.01] disabled:opacity-60">
          {loading ? t("جاري الإرسال…", "Sending…") : t("أرسل السؤال", "Send Question")}
        </button>
      </motion.form>
      {questions.length > 0 && (
        <div className="mx-auto mt-10 max-w-3xl">
          <p className="mb-4 text-sm font-bold text-navy-deep">{t(`أحدث الأسئلة (${questions.length})`, `Latest Questions (${questions.length})`)}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {questions.slice(0, 6).map((q: any) => (
              <div key={q.id} className="rounded-xl border bg-card p-4 text-start shadow-elevated">
                <div className="flex items-start gap-2">
                  <MessageCircleQuestion className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{q.question}</p>
                    <p className="mt-2 text-xs text-muted-foreground">— {q.name}{q.target_speaker ? ` → ${q.target_speaker}` : ""}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

const REVIEW_ROLES: { value: string; ar: string; en: string }[] = [
  { value: "student", ar: "طالب", en: "Student" },
  { value: "doctor", ar: "دكتور", en: "Doctor" },
  { value: "teaching_assistant", ar: "معيد", en: "Teaching Assistant" },
  { value: "visitor", ar: "زائر", en: "Visitor" },
];

function Reviews() {
  const { t } = useLang();
  const qc = useQueryClient();
  useRealtime("event_reviews");
  const [form, setForm] = useState({ name: "", role: "", rating: 5, recommendation: "" });
  const [loading, setLoading] = useState(false);
  const { data: reviews = [] } = useQuery({
    queryKey: ["event_reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("event_reviews").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role) {
      toast.error(t("الاسم والدور مطلوبان", "Name and role are required"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("event_reviews").insert(form);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(t("شكرًا لتقييمك!", "Thank you for your review!"));
    setForm({ name: "", role: "", rating: 5, recommendation: "" });
    qc.invalidateQueries({ queryKey: ["event_reviews"] });
  };

  const field = "w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";
  const avg = reviews.length ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length) : 0;

  return (
    <Section id="reviews" className="bg-background">
      <SectionHeader
        eyebrow={t("التقييمات", "Reviews")}
        title={t("قيّم الملتقى واقترح تحسينات", "Rate the event and suggest improvements")}
        subtitle={reviews.length ? t(`متوسط التقييم ${avg.toFixed(1)} / 5 من ${reviews.length} مشاركة`, `Average rating ${avg.toFixed(1)} / 5 from ${reviews.length} responses`) : undefined}
      />
      <motion.form
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        onSubmit={submit}
        className="mx-auto max-w-2xl space-y-4 rounded-2xl border bg-card p-8 shadow-elevated"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input className={field} placeholder={t("اسمك *", "Your name *")} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <select className={field} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="">{t("أنت... *", "You are... *")}</option>
            {REVIEW_ROLES.map(r => <option key={r.value} value={r.value}>{t(r.ar, r.en)}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n} type="button"
              onClick={() => setForm({ ...form, rating: n })}
              className="transition hover:scale-110"
              aria-label={`${n} stars`}
            >
              <Star className={`h-9 w-9 ${n <= form.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
        <textarea rows={3} className={field} placeholder={t("اقترح تحسينات (اختياري)", "Suggest improvements (optional)")} value={form.recommendation} onChange={e => setForm({ ...form, recommendation: e.target.value })} />
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-gold to-gold-soft py-3.5 text-base font-bold text-navy-deep shadow-elevated transition hover:scale-[1.01] disabled:opacity-60">
          {loading ? t("جاري الإرسال…", "Sending…") : t("أرسل التقييم", "Submit Review")}
        </button>
      </motion.form>
      {reviews.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {reviews.slice(0, 6).map((r: any) => {
            const role = REVIEW_ROLES.find(x => x.value === r.role);
            return (
              <div key={r.id} className="rounded-xl border bg-card p-4 text-start shadow-elevated">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-navy-deep">{r.name}</span>
                  <span className="rounded-full bg-navy-deep px-2.5 py-0.5 text-xs font-semibold text-gold">
                    {role ? t(role.ar, role.en) : r.role}
                  </span>
                </div>
                <div className="mb-2 flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                {r.recommendation && <p className="text-sm text-muted-foreground">{r.recommendation}</p>}
              </div>
            );
          })}
        </div>
      )}
    </Section>
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
      <AskQuestion />
      <Reviews />
      <Gallery />
      <Sponsors />
      <CTA />
      <Footer />
    </div>
  );
}
