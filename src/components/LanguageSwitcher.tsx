import { Link, useLocation } from 'react-router-dom';
import { detectLangFromPath, withLangPrefix } from '../lib/i18n';

export default function LanguageSwitcher() {
  const location = useLocation();
  const current = detectLangFromPath(location.pathname);
  const other = current === 'ko' ? 'en' : 'ko';
  const toPath = withLangPrefix(location.pathname, other);
  const label = other === 'en' ? 'English' : '한국어';

  return (
    <Link
      to={toPath}
      hrefLang={other}
      className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-400"
      aria-label={`Switch language to ${other}`}
    >
      {label}
    </Link>
  );
}
