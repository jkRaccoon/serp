import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Analytics from '../components/Analytics';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useLang, withLangPrefix, detectLangFromPath } from '../lib/i18n';

const NAV_LABEL = {
  home: { ko: '미리보기', en: 'Preview' },
  guide: { ko: '가이드', en: 'Guide' },
  faq: { ko: 'FAQ', en: 'FAQ' },
};

const BRAND = { ko: 'SERP 스니펫 미리보기', en: 'SERP Snippet Preview' };

const FOOTER = {
  ko: '© 2026 serp.bal.pe.kr · 검색 결과 UI는 참고용 시뮬레이션입니다 (실제 렌더링은 검색엔진 알고리즘을 따름).',
  en: '© 2026 serp.bal.pe.kr · Search result UI is a simulation for reference (actual rendering follows each search engine\'s algorithm).',
};

const PRIVACY = { ko: '개인정보처리방침', en: 'Privacy' };
const TERMS = { ko: '이용약관', en: 'Terms' };
const CONTACT = { ko: '문의', en: 'Contact' };

export default function RootLayout() {
  const { lang } = useLang();
  const location = useLocation();
  const currentLang = detectLangFromPath(location.pathname);
  const p = (path: string) => withLangPrefix(path, currentLang);
  const items: { to: string; label: string; end?: boolean }[] = [
    { to: p('/'), label: NAV_LABEL.home[lang], end: true },
    { to: p('/guide'), label: NAV_LABEL.guide[lang] },
    { to: p('/faq'), label: NAV_LABEL.faq[lang] },
  ];
  return (
    <div className="min-h-screen bg-slate-50">
      <Analytics />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <Link to={p('/')} className="flex items-center gap-2">
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-green-500 text-white">
              🔍
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">{BRAND[lang]}</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `font-medium transition ${
                    isActive ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-slate-500">
          <p>{FOOTER[lang]}</p>
          <nav className="mt-2 flex flex-wrap gap-3">
            <a className="underline hover:text-slate-700" href="https://bal.pe.kr">bal.pe.kr</a>
            <a className="underline hover:text-slate-700" href="https://bal.pe.kr/privacy.html">{PRIVACY[lang]}</a>
            <a className="underline hover:text-slate-700" href="https://bal.pe.kr/terms.html">{TERMS[lang]}</a>
            <a className="underline hover:text-slate-700" href="mailto:comsamo84@gmail.com">{CONTACT[lang]}</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
