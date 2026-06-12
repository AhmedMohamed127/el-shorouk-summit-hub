import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "ar" | "en";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (ar: string, en: string) => string; dir: "rtl" | "ltr" };

const LangCtx = createContext<Ctx>({ lang: "ar", setLang: () => {}, t: (a) => a, dir: "rtl" });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang)) || "ar";
    setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  return (
    <LangCtx.Provider
      value={{ lang, setLang, t: (ar, en) => (lang === "ar" ? ar : en), dir: lang === "ar" ? "rtl" : "ltr" }}
    >
      {children}
    </LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);
