import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LangProvider } from "../lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">الصفحة غير موجودة</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">حدث خطأ غير متوقع</h1>
        <p className="mt-2 text-sm text-muted-foreground">حاول إعادة تحميل الصفحة.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "الملتقى العملي لنظم معلومات الأعمال — أكاديمية الشروق" },
      { name: "description", content: "كيف يغير الذكاء الاصطناعي وظائف وتخصصات نظم معلومات الأعمال — ملتقى علمي بقسم BIS، أكاديمية الشروق." },
      { property: "og:title", content: "الملتقى العملي لنظم معلومات الأعمال — أكاديمية الشروق" },
      { property: "og:description", content: "كيف يغير الذكاء الاصطناعي وظائف وتخصصات نظم معلومات الأعمال — ملتقى علمي بقسم BIS، أكاديمية الشروق." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "BIS — Shorouk Academy" },
      { name: "twitter:title", content: "الملتقى العملي لنظم معلومات الأعمال — أكاديمية الشروق" },
      { name: "twitter:description", content: "كيف يغير الذكاء الاصطناعي وظائف وتخصصات نظم معلومات الأعمال — ملتقى علمي بقسم BIS، أكاديمية الشروق." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/03458248-9a80-4786-86ab-0449b2733d0f/id-preview-9d7194bd--34b92e73-ba3b-47ad-9377-1644ca173825.lovable.app-1781285869930.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/03458248-9a80-4786-86ab-0449b2733d0f/id-preview-9d7194bd--34b92e73-ba3b-47ad-9377-1644ca173825.lovable.app-1781285869930.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Cairo:wght@500;700;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <main>
          <Outlet />
        </main>
        <Toaster position="top-center" richColors />
      </LangProvider>
    </QueryClientProvider>
  );
}
