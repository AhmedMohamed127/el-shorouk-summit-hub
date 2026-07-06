import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, Users, Mic, Image as ImageIcon, Calendar, Briefcase,
  Building2, LogOut, Download, Plus, Trash2, Save, Settings, Trophy,
  MessageCircleQuestion, Star, ChevronLeft, ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم — BIS Admin" }] }),
  component: AdminPage,
});

type Tab = "dashboard" | "registrations" | "questions" | "reviews" | "sessions" | "speakers" | "achievements" | "gallery" | "sponsors" | "careers" | "settings";

function AdminPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
      else setUserId(session.user.id);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setUserId(data.session.user.id);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (checking || !userId) {
    return <div className="min-h-dvh bg-navy-deep text-white flex items-center justify-center">...</div>;
  }

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const items: { id: Tab; label: string; Icon: any }[] = [
    { id: "dashboard", label: t("الرئيسية", "Dashboard"), Icon: LayoutDashboard },
    { id: "registrations", label: t("التسجيلات", "Registrations"), Icon: Users },
    { id: "questions", label: t("الأسئلة", "Questions"), Icon: MessageCircleQuestion },
    { id: "reviews", label: t("التقييمات", "Reviews"), Icon: Star },
    { id: "sessions", label: t("الجدول", "Sessions"), Icon: Calendar },
    { id: "speakers", label: t("المتحدثون", "Speakers"), Icon: Mic },
    { id: "achievements", label: t("الإنجازات", "Achievements"), Icon: Trophy },
    { id: "gallery", label: t("معرض الصور", "Gallery"), Icon: ImageIcon },
    { id: "sponsors", label: t("الرعاة", "Sponsors"), Icon: Building2 },
    { id: "careers", label: t("الوظائف", "Careers"), Icon: Briefcase },
    { id: "settings", label: t("الإعدادات", "Settings"), Icon: Settings },
  ];

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 flex">
      <aside className="w-60 bg-navy-deep text-white p-4 flex flex-col">
        <div className="text-lg font-black mb-6 px-2">BIS Admin</div>
        <nav className="flex-1 space-y-1">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                tab === it.id ? "bg-gold text-navy-deep font-bold" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <it.Icon className="h-4 w-4" />
              {it.label}
            </button>
          ))}
        </nav>
        <Link to="/" className="text-xs text-white/50 hover:text-white px-3 py-2">
          ← {t("معاينة الموقع", "View site")}
        </Link>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-white/70 hover:text-white px-3 py-2">
          <LogOut className="h-4 w-4" /> {t("تسجيل الخروج", "Logout")}
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {tab === "dashboard" && <Dashboard />}
        {tab === "registrations" && <Registrations />}
        {tab === "questions" && <QuestionsAdmin />}
        {tab === "reviews" && <ReviewsAdmin />}
        {tab === "sessions" && <SessionsAdmin />}
        {tab === "speakers" && <SpeakersAdmin />}
        {tab === "achievements" && <AchievementsAdmin />}
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "sponsors" && <SponsorsAdmin />}
        {tab === "careers" && <CareersAdmin />}
        {tab === "settings" && <SettingsAdmin />}
      </main>
    </div>
  );
}

/* ---------- Shared ---------- */
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>{children}</div>;
}
function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-2xl font-black mb-6">{children}</h1>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-navy-deep ${props.className ?? ""}`} />;
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-navy-deep ${props.className ?? ""}`} />;
}
function Btn({ children, variant = "primary", ...p }: any) {
  const styles =
    variant === "primary"
      ? "bg-navy-deep text-white hover:bg-navy-deep/90"
      : variant === "danger"
      ? "bg-red-50 text-red-700 hover:bg-red-100"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200";
  return (
    <button {...p} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${styles} ${p.className ?? ""}`}>
      {children}
    </button>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard() {
  const { t } = useLang();
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [r, s, sp, g] = await Promise.all([
        supabase.from("registrations").select("id", { count: "exact", head: true }),
        supabase.from("sessions").select("id", { count: "exact", head: true }),
        supabase.from("speakers").select("id", { count: "exact", head: true }),
        supabase.from("gallery_images").select("id", { count: "exact", head: true }),
      ]);
      return {
        registrations: r.count ?? 0,
        sessions: s.count ?? 0,
        speakers: sp.count ?? 0,
        gallery: g.count ?? 0,
      };
    },
  });
  const { data: recent } = useQuery({
    queryKey: ["recent-regs"],
    queryFn: async () => {
      const { data } = await supabase.from("registrations").select("*").order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const cards = [
    { label: t("التسجيلات", "Registrations"), v: stats?.registrations ?? 0, color: "from-emerald-500 to-emerald-600" },
    { label: t("الجلسات", "Sessions"), v: stats?.sessions ?? 0, color: "from-blue-500 to-blue-600" },
    { label: t("المتحدثون", "Speakers"), v: stats?.speakers ?? 0, color: "from-purple-500 to-purple-600" },
    { label: t("الصور", "Gallery"), v: stats?.gallery ?? 0, color: "from-amber-500 to-amber-600" },
  ];

  return (
    <>
      <H1>{t("نظرة عامة", "Overview")}</H1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className={`inline-block bg-gradient-to-br ${c.color} text-white text-xs font-bold px-2 py-1 rounded`}>
              {c.label}
            </div>
            <div className="mt-3 text-4xl font-black">{c.v}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="font-bold mb-4">{t("أحدث التسجيلات", "Recent Registrations")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 border-b">
              <tr>
                <th className="py-2">{t("الاسم", "Name")}</th>
                <th>{t("البريد", "Email")}</th>
                <th>{t("القسم", "Department")}</th>
                <th>{t("التاريخ", "Date")}</th>
              </tr>
            </thead>
            <tbody>
              {(recent ?? []).map((r: any) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{r.full_name}</td>
                  <td>{r.email}</td>
                  <td>{r.department ?? "—"}</td>
                  <td className="text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!recent?.length && (
                <tr><td colSpan={4} className="py-4 text-center text-slate-400">{t("لا توجد بيانات", "No data")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ---------- Registrations ---------- */
function Registrations() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const { data } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const exportCsv = () => {
    if (!rows?.length) return;
    const headers = ["full_name", "email", "phone", "department", "academic_year", "created_at"];
    const csv = [
      headers.join(","),
      ...rows.map((r: any) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const remove = async (id: string) => {
    if (!confirm(t("حذف هذا التسجيل؟", "Delete this registration?"))) return;
    const { error } = await supabase.from("registrations").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(t("تم الحذف", "Deleted"));
      qc.invalidateQueries({ queryKey: ["registrations"] });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <H1>{t("التسجيلات", "Registrations")} ({rows?.length ?? 0})</H1>
        <Btn onClick={exportCsv}><Download className="h-4 w-4" /> {t("تصدير CSV", "Export CSV")}</Btn>
      </div>
      <Card className="p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b">
            <tr>
              <th className="py-2">{t("الاسم", "Name")}</th>
              <th>{t("البريد", "Email")}</th>
              <th>{t("الهاتف", "Phone")}</th>
              <th>{t("القسم", "Department")}</th>
              <th>{t("السنة", "Year")}</th>
              <th>{t("التاريخ", "Date")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r: any) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2 font-medium">{r.full_name}</td>
                <td>{r.email}</td>
                <td>{r.phone ?? "—"}</td>
                <td>{r.department ?? "—"}</td>
                <td>{r.academic_year ?? "—"}</td>
                <td className="text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => remove(r.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ---------- Generic CRUD helper ---------- */
function useCrud(table: string) {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data } = await supabase.from(table as any).select("*").order("order_index", { ascending: true });
      return (data as any[]) ?? [];
    },
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: [table] });
  const save = async (row: any) => {
    const { id, ...rest } = row;
    const op = id
      ? await supabase.from(table as any).update(rest).eq("id", id)
      : await supabase.from(table as any).insert(rest);
    if (op.error) toast.error(op.error.message);
    else { toast.success("Saved"); invalidate(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); invalidate(); }
  };
  return { rows: rows ?? [], save, remove };
}

/* ---------- Sessions ---------- */
function SessionsAdmin() {
  const { t } = useLang();
  const { rows, save, remove } = useCrud("sessions");
  const [draft, setDraft] = useState<any>({ time_label: "", title_ar: "", title_en: "", description_ar: "", description_en: "", speaker: "", order_index: 0 });

  return (
    <>
      <H1>{t("جدول الجلسات", "Sessions Timeline")}</H1>
      <Card className="p-5 mb-6">
        <h2 className="font-bold mb-3">{t("إضافة / تعديل", "Add / Edit")}</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Time (e.g. 10:00 — 10:30)" value={draft.time_label} onChange={(e) => setDraft({ ...draft, time_label: e.target.value })} />
          <Input placeholder="Speaker" value={draft.speaker} onChange={(e) => setDraft({ ...draft, speaker: e.target.value })} />
          <Input placeholder="عنوان عربي" value={draft.title_ar} onChange={(e) => setDraft({ ...draft, title_ar: e.target.value })} />
          <Input placeholder="Title (EN)" value={draft.title_en} onChange={(e) => setDraft({ ...draft, title_en: e.target.value })} />
          <TextArea placeholder="وصف عربي" value={draft.description_ar} onChange={(e) => setDraft({ ...draft, description_ar: e.target.value })} />
          <TextArea placeholder="Description (EN)" value={draft.description_en} onChange={(e) => setDraft({ ...draft, description_en: e.target.value })} />
          <Input type="number" placeholder="Order" value={draft.order_index} onChange={(e) => setDraft({ ...draft, order_index: +e.target.value })} />
        </div>
        <div className="mt-3 flex gap-2">
          <Btn onClick={async () => { await save(draft); setDraft({ time_label: "", title_ar: "", title_en: "", description_ar: "", description_en: "", speaker: "", order_index: 0 }); }}>
            <Save className="h-4 w-4" /> {draft.id ? t("تحديث", "Update") : t("إضافة", "Add")}
          </Btn>
          {draft.id && <Btn variant="ghost" onClick={() => setDraft({ time_label: "", title_ar: "", title_en: "", description_ar: "", description_en: "", speaker: "", order_index: 0 })}>{t("إلغاء", "Cancel")}</Btn>}
        </div>
      </Card>

      <Card className="p-5">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b"><tr><th className="py-2">Time</th><th>AR</th><th>EN</th><th>Speaker</th><th></th></tr></thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2">{r.time_label}</td>
                <td>{r.title_ar}</td>
                <td>{r.title_en}</td>
                <td>{r.speaker}</td>
                <td className="flex gap-2 py-2">
                  <button onClick={() => setDraft(r)} className="text-blue-600 text-xs font-bold">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ---------- Speakers ---------- */
function SpeakersAdmin() {
  const { t } = useLang();
  const { rows, save, remove } = useCrud("speakers");
  const blank = { name_ar: "", name_en: "", position_ar: "", position_en: "", bio_ar: "", bio_en: "", photo_url: "", order_index: 0 };
  const [draft, setDraft] = useState<any>(blank);

  return (
    <>
      <H1>{t("المتحدثون", "Speakers")}</H1>
      <Card className="p-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="اسم عربي" value={draft.name_ar} onChange={(e) => setDraft({ ...draft, name_ar: e.target.value })} />
          <Input placeholder="Name (EN)" value={draft.name_en} onChange={(e) => setDraft({ ...draft, name_en: e.target.value })} />
          <Input placeholder="منصب عربي" value={draft.position_ar} onChange={(e) => setDraft({ ...draft, position_ar: e.target.value })} />
          <Input placeholder="Position (EN)" value={draft.position_en} onChange={(e) => setDraft({ ...draft, position_en: e.target.value })} />
          <TextArea placeholder="نبذة عربي" value={draft.bio_ar} onChange={(e) => setDraft({ ...draft, bio_ar: e.target.value })} />
          <TextArea placeholder="Bio (EN)" value={draft.bio_en} onChange={(e) => setDraft({ ...draft, bio_en: e.target.value })} />
          <Input placeholder="Photo URL" value={draft.photo_url} onChange={(e) => setDraft({ ...draft, photo_url: e.target.value })} />
          <Input type="number" placeholder="Order" value={draft.order_index} onChange={(e) => setDraft({ ...draft, order_index: +e.target.value })} />
        </div>
        <div className="mt-3 flex gap-2">
          <Btn onClick={async () => { await save(draft); setDraft(blank); }}><Save className="h-4 w-4" /> {draft.id ? t("تحديث", "Update") : t("إضافة", "Add")}</Btn>
        </div>
      </Card>
      <Card className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rows.map((r: any) => (
            <div key={r.id} className="border rounded-lg p-3">
              {r.photo_url && <img src={r.photo_url} alt={r.name_ar} className="w-full h-32 object-cover rounded mb-2" />}
              <div className="font-bold text-sm">{r.name_ar}</div>
              <div className="text-xs text-slate-500">{r.position_ar}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setDraft(r)} className="text-blue-600 text-xs font-bold">Edit</button>
                <button onClick={() => remove(r.id)} className="text-red-600 text-xs"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ---------- Gallery ---------- */
function GalleryAdmin() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { rows, remove } = useCrud("gallery_images");
  const [uploading, setUploading] = useState(false);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (error) throw error;
      // Bucket is private — create a long-lived signed URL (10 years)
      const { data: signed, error: signErr } = await supabase.storage
        .from("media")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signErr) throw signErr;
      const { error: e2 } = await supabase.from("gallery_images").insert({ url: signed.signedUrl, order_index: rows.length });
      if (e2) throw e2;
      toast.success(t("تم الرفع", "Uploaded"));
      qc.invalidateQueries({ queryKey: ["gallery_images"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <H1>{t("معرض الصور", "Gallery")}</H1>
      <Card className="p-5 mb-6">
        <label className="inline-flex items-center gap-2 cursor-pointer bg-navy-deep text-white rounded-lg px-4 py-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> {uploading ? "..." : t("رفع صورة", "Upload Image")}
          <input type="file" accept="image/*,.heic,.heif,.svg,.webp,.avif,.gif" onChange={upload} className="hidden" disabled={uploading} />
        </label>
      </Card>

      <Card className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rows.map((r: any) => (
            <div key={r.id} className="relative group">
              <img src={r.url} alt="" className="w-full h-40 object-cover rounded-lg" />
              <button onClick={() => remove(r.id)} className="absolute top-2 right-2 bg-red-600 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ---------- Sponsors ---------- */
function SponsorsAdmin() {
  const { t } = useLang();
  const { rows, save, remove } = useCrud("sponsors");
  const blank = { name: "", website: "", logo_url: "", order_index: 0 };
  const [draft, setDraft] = useState<any>(blank);

  return (
    <>
      <H1>{t("الرعاة", "Sponsors")}</H1>
      <Card className="p-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <Input placeholder="Website" value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} />
          <Input placeholder="Logo URL" value={draft.logo_url} onChange={(e) => setDraft({ ...draft, logo_url: e.target.value })} />
          <Input type="number" placeholder="Order" value={draft.order_index} onChange={(e) => setDraft({ ...draft, order_index: +e.target.value })} />
        </div>
        <div className="mt-3"><Btn onClick={async () => { await save(draft); setDraft(blank); }}><Save className="h-4 w-4" /> {draft.id ? t("تحديث", "Update") : t("إضافة", "Add")}</Btn></div>
      </Card>
      <Card className="p-5">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b"><tr><th className="py-2">Logo</th><th>Name</th><th>Website</th><th></th></tr></thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2">{r.logo_url && <img src={r.logo_url} alt={r.name} className="h-10" />}</td>
                <td>{r.name}</td>
                <td className="text-blue-600">{r.website}</td>
                <td className="flex gap-2 py-2">
                  <button onClick={() => setDraft(r)} className="text-blue-600 text-xs font-bold">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ---------- Careers ---------- */
function CareersAdmin() {
  const { t } = useLang();
  const { rows, save, remove } = useCrud("careers");
  const blank = { name_ar: "", name_en: "", before_ai_ar: "", before_ai_en: "", after_ai_ar: "", after_ai_en: "", skills_ar: [], skills_en: [], order_index: 0 };
  const [draft, setDraft] = useState<any>(blank);

  return (
    <>
      <H1>{t("الوظائف قبل/بعد AI", "Careers Before/After AI")}</H1>
      <Card className="p-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="اسم الوظيفة" value={draft.name_ar} onChange={(e) => setDraft({ ...draft, name_ar: e.target.value })} />
          <Input placeholder="Job Name (EN)" value={draft.name_en} onChange={(e) => setDraft({ ...draft, name_en: e.target.value })} />
          <TextArea placeholder="قبل AI (عربي)" value={draft.before_ai_ar} onChange={(e) => setDraft({ ...draft, before_ai_ar: e.target.value })} />
          <TextArea placeholder="Before AI (EN)" value={draft.before_ai_en} onChange={(e) => setDraft({ ...draft, before_ai_en: e.target.value })} />
          <TextArea placeholder="بعد AI (عربي)" value={draft.after_ai_ar} onChange={(e) => setDraft({ ...draft, after_ai_ar: e.target.value })} />
          <TextArea placeholder="After AI (EN)" value={draft.after_ai_en} onChange={(e) => setDraft({ ...draft, after_ai_en: e.target.value })} />
          <Input placeholder="مهارات (مفصولة بفاصلة)" value={(draft.skills_ar ?? []).join(",")} onChange={(e) => setDraft({ ...draft, skills_ar: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
          <Input placeholder="Skills (comma sep)" value={(draft.skills_en ?? []).join(",")} onChange={(e) => setDraft({ ...draft, skills_en: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
          <Input type="number" placeholder="Order" value={draft.order_index} onChange={(e) => setDraft({ ...draft, order_index: +e.target.value })} />
        </div>
        <div className="mt-3"><Btn onClick={async () => { await save(draft); setDraft(blank); }}><Save className="h-4 w-4" /> {draft.id ? t("تحديث", "Update") : t("إضافة", "Add")}</Btn></div>
      </Card>
      <Card className="p-5">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b"><tr><th className="py-2">Name</th><th>Before</th><th>After</th><th></th></tr></thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2 font-semibold">{r.name_ar}</td>
                <td className="text-xs text-slate-600 max-w-xs truncate">{r.before_ai_ar}</td>
                <td className="text-xs text-slate-600 max-w-xs truncate">{r.after_ai_ar}</td>
                <td className="flex gap-2 py-2">
                  <button onClick={() => setDraft(r)} className="text-blue-600 text-xs font-bold">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ---------- Settings ---------- */
function SettingsAdmin() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      return (data?.content as any) ?? {};
    },
  });
  const [draft, setDraft] = useState<any>(null);
  useEffect(() => { if (settings && !draft) setDraft(settings); }, [settings, draft]);

  const save = async () => {
    const { error } = await supabase.from("site_settings").upsert({ id: 1, content: draft });
    if (error) toast.error(error.message);
    else { toast.success(t("تم الحفظ", "Saved")); qc.invalidateQueries({ queryKey: ["site_settings"] }); }
  };

  if (!draft) return <div>...</div>;

  return (
    <>
      <H1>{t("إعدادات الموقع", "Site Settings")}</H1>
      <Card className="p-5 max-w-3xl">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-500">{t("تاريخ الفعالية", "Event Date")}</label>
            <Input value={draft.event_date ?? ""} onChange={(e) => setDraft({ ...draft, event_date: e.target.value })} placeholder="2026-03-15" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500">{t("الموقع (عربي)", "Venue (AR)")}</label>
            <Input value={draft.venue_ar ?? ""} onChange={(e) => setDraft({ ...draft, venue_ar: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500">{t("الموقع (إنجليزي)", "Venue (EN)")}</label>
            <Input value={draft.venue_en ?? ""} onChange={(e) => setDraft({ ...draft, venue_en: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500">{t("البريد الإلكتروني", "Contact Email")}</label>
            <Input value={draft.contact_email ?? ""} onChange={(e) => setDraft({ ...draft, contact_email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500">{t("الهاتف", "Phone")}</label>
            <Input value={draft.contact_phone ?? ""} onChange={(e) => setDraft({ ...draft, contact_phone: e.target.value })} />
          </div>
          <Btn onClick={save}><Save className="h-4 w-4" /> {t("حفظ", "Save")}</Btn>
        </div>
      </Card>
    </>
  );
}

/* ---------- Achievements ---------- */
function AchievementsAdmin() {
  const { t } = useLang();
  const { rows, save, remove } = useCrud("achievements");
  const blank = { label_ar: "", label_en: "", value: "", icon: "Trophy", order_index: 0 };
  const [draft, setDraft] = useState<any>(blank);

  return (
    <>
      <H1>{t("الإنجازات", "Achievements")}</H1>
      <Card className="p-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="القيمة (مثل 31+)" value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })} />
          <Input placeholder="Icon (Trophy, GraduationCap, Award, Briefcase, TrendingUp, Building2, Users, Sparkles)" value={draft.icon ?? ""} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} />
          <Input placeholder="الوصف عربي" value={draft.label_ar} onChange={(e) => setDraft({ ...draft, label_ar: e.target.value })} />
          <Input placeholder="Label (EN)" value={draft.label_en} onChange={(e) => setDraft({ ...draft, label_en: e.target.value })} />
          <Input type="number" placeholder="Order" value={draft.order_index} onChange={(e) => setDraft({ ...draft, order_index: +e.target.value })} />
        </div>
        <div className="mt-3 flex gap-2">
          <Btn onClick={async () => { await save(draft); setDraft(blank); }}><Save className="h-4 w-4" /> {draft.id ? t("تحديث", "Update") : t("إضافة", "Add")}</Btn>
          {draft.id && <Btn variant="ghost" onClick={() => setDraft(blank)}>{t("إلغاء", "Cancel")}</Btn>}
        </div>
      </Card>
      <Card className="p-5">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b"><tr><th className="py-2">Value</th><th>AR</th><th>EN</th><th>Icon</th><th></th></tr></thead>
          <tbody>
            {rows.map((r: any) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2 font-bold">{r.value}</td>
                <td>{r.label_ar}</td>
                <td>{r.label_en}</td>
                <td className="text-xs text-slate-500">{r.icon}</td>
                <td className="flex gap-2 py-2">
                  <button onClick={() => setDraft(r)} className="text-blue-600 text-xs font-bold">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ---------- Questions (creative carousel) ---------- */
function QuestionsAdmin() {
  const { t } = useLang();
  const qc = useQueryClient();
  const [idx, setIdx] = useState(0);
  const { data: rows = [] } = useQuery({
    queryKey: ["event_questions"],
    queryFn: async () => {
      const { data } = await supabase.from("event_questions" as any).select("*").order("created_at", { ascending: false });
      return (data as any[]) ?? [];
    },
  });
  const remove = async (id: string) => {
    if (!confirm(t("حذف السؤال؟", "Delete question?"))) return;
    const { error } = await supabase.from("event_questions" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(t("تم الحذف", "Deleted")); qc.invalidateQueries({ queryKey: ["event_questions"] }); }
  };

  const gradients = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-sky-500 via-blue-500 to-indigo-500",
    "from-fuchsia-500 via-pink-500 to-rose-500",
  ];

  const current = rows[idx];
  const next = () => setIdx((i) => (rows.length ? (i + 1) % rows.length : 0));
  const prev = () => setIdx((i) => (rows.length ? (i - 1 + rows.length) % rows.length : 0));

  return (
    <>
      <H1>{t("أسئلة الحضور", "Audience Questions")} ({rows.length})</H1>
      {!rows.length ? (
        <Card className="p-10 text-center text-slate-400">{t("لا توجد أسئلة بعد", "No questions yet")}</Card>
      ) : (
        <>
          <div className="relative mb-8">
            <div className="relative mx-auto max-w-2xl">
              <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
                {rows.slice(0, 3).map((_, i) => (
                  <div key={i} className="absolute h-72 w-full rounded-3xl bg-slate-200"
                    style={{ transform: `translate(${(i + 1) * 12}px, ${(i + 1) * 8}px)`, opacity: 0.4 - i * 0.1 }} />
                ))}
              </div>
              <div className={`relative rounded-3xl bg-gradient-to-br ${gradients[idx % gradients.length]} p-8 text-white shadow-2xl min-h-72`}>
                <div className="flex items-center justify-between text-xs font-semibold opacity-90">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur">
                    <MessageCircleQuestion className="h-3.5 w-3.5" /> {idx + 1} / {rows.length}
                  </span>
                  <span>{new Date(current.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-6 text-2xl font-black leading-snug">"{current.question}"</p>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest opacity-70">{t("من", "From")}</div>
                    <div className="text-lg font-bold">{current.name}</div>
                    {current.target_speaker ? (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-sm font-semibold backdrop-blur">
                        <span className="opacity-80">{t("موجه إلى", "For")}:</span> {current.target_speaker}
                      </div>
                    ) : null}
                  </div>
                  <button onClick={() => remove(current.id)} className="rounded-lg bg-white/20 px-3 py-2 text-xs font-bold hover:bg-white/30 backdrop-blur">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button onClick={prev} className="rounded-full bg-white p-3 shadow hover:shadow-lg transition"><ChevronLeft className="h-5 w-5" /></button>
                <div className="flex gap-1.5">
                  {rows.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                      className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-navy-deep" : "w-2 bg-slate-300"}`} />
                  ))}
                </div>
                <button onClick={next} className="rounded-full bg-white p-3 shadow hover:shadow-lg transition"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
          <Card className="p-5">
            <h2 className="font-bold mb-3">{t("جميع الأسئلة", "All Questions")}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {rows.map((r: any, i: number) => (
                <button key={r.id} onClick={() => setIdx(i)}
                  className={`text-start rounded-xl border p-3 transition ${i === idx ? "border-navy-deep bg-slate-50" : "border-slate-200 hover:border-slate-400"}`}>
                  <p className="text-sm line-clamp-2">{r.question}</p>
                  <p className="mt-1 text-xs text-slate-500">— {r.name}{r.target_speaker ? ` → ${r.target_speaker}` : ""}</p>
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </>
  );
}

/* ---------- Reviews ---------- */
const REVIEW_ROLE_LABELS: Record<string, { ar: string; en: string }> = {
  student: { ar: "طالب", en: "Student" },
  doctor: { ar: "دكتور", en: "Doctor" },
  teaching_assistant: { ar: "معيد", en: "Teaching Assistant" },
  visitor: { ar: "زائر", en: "Visitor" },
};

function ReviewsAdmin() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["event_reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("event_reviews" as any).select("*").order("created_at", { ascending: false });
      return (data as any[]) ?? [];
    },
  });
  const remove = async (id: string) => {
    if (!confirm(t("حذف التقييم؟", "Delete review?"))) return;
    const { error } = await supabase.from("event_reviews" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(t("تم الحذف", "Deleted")); qc.invalidateQueries({ queryKey: ["event_reviews"] }); }
  };
  const avg = rows.length ? (rows.reduce((s: number, r: any) => s + r.rating, 0) / rows.length) : 0;

  return (
    <>
      <H1>{t("تقييمات الملتقى", "Event Reviews")} ({rows.length})</H1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="text-xs font-bold text-slate-500 uppercase">{t("المتوسط", "Average")}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-4xl font-black">{avg.toFixed(1)}</div>
            <div className="text-slate-400">/ 5</div>
          </div>
          <div className="mt-2 flex gap-0.5">
            {[1,2,3,4,5].map(n => (
              <Star key={n} className={`h-4 w-4 ${n <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-bold text-slate-500 uppercase">{t("عدد التقييمات", "Total")}</div>
          <div className="mt-2 text-4xl font-black">{rows.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-bold text-slate-500 uppercase">{t("توصيات", "Suggestions")}</div>
          <div className="mt-2 text-4xl font-black">{rows.filter((r: any) => r.recommendation?.trim()).length}</div>
        </Card>
      </div>
      <Card className="p-5">
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((r: any) => {
            const role = REVIEW_ROLE_LABELS[r.role];
            return (
              <div key={r.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold">{r.name}</div>
                    <div className="text-xs text-slate-500">{role ? t(role.ar, role.en) : r.role}</div>
                  </div>
                  <button onClick={() => remove(r.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-2 flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
                {r.recommendation && <p className="mt-2 text-sm text-slate-600">{r.recommendation}</p>}
                <div className="mt-2 text-xs text-slate-400">{new Date(r.created_at).toLocaleString()}</div>
              </div>
            );
          })}
          {!rows.length && <div className="col-span-2 text-center text-slate-400 py-6">{t("لا توجد تقييمات بعد", "No reviews yet")}</div>}
        </div>
      </Card>
    </>
  );
}
