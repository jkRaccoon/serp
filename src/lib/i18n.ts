import { useLocation } from 'react-router-dom';

export type Lang = 'ko' | 'en';

export function detectLangFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ko';
}

export function withLangPrefix(pathname: string, lang: Lang): string {
  const stripped = stripLangPrefix(pathname);
  if (lang === 'ko') return stripped;
  return stripped === '/' ? '/en' : `/en${stripped}`;
}

export function stripLangPrefix(pathname: string): string {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/';
  return pathname;
}

export function detectLang(): Lang { return 'ko'; }
export function persistLang(_lang: Lang): void {}

export interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export function useLang(): LangContextValue {
  const location = useLocation();
  const lang = detectLangFromPath(location.pathname);
  return { lang, setLang: () => {} };
}

export type Bi = { ko: string; en: string };

export function t(lang: Lang, bi: Bi): string {
  return bi[lang];
}
