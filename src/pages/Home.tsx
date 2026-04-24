import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { track } from '../lib/track';
import { LIMITS, breadcrumb, charWidthPx, hostname, truncateByChar, type SerpInput } from '../lib/serp';
import { useLang, detectLangFromPath, withLangPrefix } from '../lib/i18n';

const STORAGE = 'serp-input';

const DEFAULT_KO: SerpInput = {
  url: 'https://example.com/article-title',
  title: '한국어 SEO 최적화 가이드 — 타이틀과 설명 작성 요령',
  description: '제목 38자, 설명 80자 이내가 네이버 검색결과에 온전히 노출됩니다. 구글은 길이보다 픽셀 단위가 중요합니다.',
  date: new Date().toLocaleDateString('ko-KR'),
};

const DEFAULT_EN: SerpInput = {
  url: 'https://example.com/article-title',
  title: 'Korean SEO Optimization Guide — Title and Description Tips',
  description: 'Keep your title under 600px (≈60 chars) for Google, under 38 chars for Naver. Meta description: 150–160 chars for Google, 80 chars for Naver.',
  date: new Date().toLocaleDateString('en-US'),
};

function load(lang: 'ko' | 'en'): SerpInput {
  const DEFAULT = lang === 'en' ? DEFAULT_EN : DEFAULT_KO;
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE);
    return raw ? { ...DEFAULT, ...(JSON.parse(raw) as Partial<SerpInput>) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SERP Snippet Preview',
  url: 'https://serp.bal.pe.kr/',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  inLanguage: 'ko-KR',
  description:
    '네이버·구글·모바일 검색결과에서 title·description 이 어떻게 잘리는지 실시간 미리보기. SEO 글 작성에 필수.',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
};

type PreviewTab = 'google-desktop' | 'google-mobile' | 'naver' | 'og-twitter';

interface LengthBadgeProps {
  current: number;
  warn: number;
  limit: number;
  unit: string;
  lang: 'ko' | 'en';
}

function LengthBadge({ current, warn, limit, unit, lang }: LengthBadgeProps) {
  const over = current > limit;
  const near = !over && current >= warn;
  const color = over
    ? 'bg-rose-100 text-rose-700 border-rose-300'
    : near
    ? 'bg-amber-100 text-amber-700 border-amber-300'
    : 'bg-emerald-50 text-emerald-700 border-emerald-300';
  const icon = over ? '⚠' : near ? '~' : '✓';
  const label = over
    ? lang === 'ko' ? `${current}${unit} 초과` : `${current}${unit} over`
    : lang === 'ko' ? `${current} / ${limit}${unit}` : `${current} / ${limit}${unit}`;
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium ${color}`}>
      {icon} {label}
    </span>
  );
}

function PxBadge({ px, limit, lang }: { px: number; limit: number; lang: 'ko' | 'en' }) {
  const over = px > limit;
  const near = !over && px >= limit * 0.9;
  const color = over
    ? 'bg-rose-100 text-rose-700 border-rose-300'
    : near
    ? 'bg-amber-100 text-amber-700 border-amber-300'
    : 'bg-emerald-50 text-emerald-700 border-emerald-300';
  const icon = over ? '⚠' : near ? '~' : '✓';
  const label = over
    ? lang === 'ko' ? `${px}px 초과` : `${px}px over`
    : `${px} / ${limit}px`;
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-medium ${color}`}>
      {icon} {label}
    </span>
  );
}

export default function Home() {
  const { lang } = useLang();
  const location = useLocation();
  const currentLang = detectLangFromPath(location.pathname);
  const p = (path: string) => withLangPrefix(path, currentLang);
  const [form, setForm] = useState<SerpInput>(() => load(lang));
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<PreviewTab>('google-desktop');

  const persist = useCallback((next: SerpInput) => {
    setForm(next);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE, JSON.stringify(next));
  }, []);

  // GA4: debounced preview_generated event
  const trackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (trackTimer.current) clearTimeout(trackTimer.current);
    trackTimer.current = setTimeout(() => {
      track('preview_generated', {
        title_length: form.title.length,
        desc_length: form.description.length,
        title_px: charWidthPx(form.title),
        dark_mode: darkMode,
        tab: activeTab,
      });
    }, 1500);
    return () => {
      if (trackTimer.current) clearTimeout(trackTimer.current);
    };
  }, [form.title, form.description, darkMode, activeTab]);

  const googleTitlePx = useMemo(() => charWidthPx(form.title), [form.title]);
  const googleOverflow = googleTitlePx > LIMITS.google.titlePx;
  const naverTitleTrunc = truncateByChar(form.title, LIMITS.naver.titleChars);
  const naverDescTrunc = truncateByChar(form.description, LIMITS.naver.descriptionChars);
  const googleDescTrunc = truncateByChar(form.description, LIMITS.google.descriptionChars);
  const mobileDescTrunc = truncateByChar(form.description, LIMITS.mobile.descriptionChars);
  const mobileTitleTrunc = truncateByChar(form.title, LIMITS.mobile.titleChars);

  const tabs: { id: PreviewTab; label: string }[] = [
    { id: 'google-desktop', label: lang === 'ko' ? '구글 데스크톱' : 'Google Desktop' },
    { id: 'google-mobile', label: lang === 'ko' ? '구글 모바일' : 'Google Mobile' },
    { id: 'naver', label: lang === 'ko' ? '네이버' : 'Naver' },
    { id: 'og-twitter', label: lang === 'ko' ? 'OG / 트위터' : 'OG / Twitter' },
  ];

  // Dark mode bg/text helpers
  const cardBg = darkMode ? 'bg-[#202124] border-[#3c4043]' : 'bg-white border-slate-200';
  const textMuted = darkMode ? 'text-[#bdc1c6]' : 'text-slate-500';
  const textBody = darkMode ? 'text-[#e8eaed]' : 'text-slate-800';

  return (
    <>
      <SEO
        title={lang === 'ko' ? 'SERP 스니펫 미리보기 — 네이버·구글 검색결과 시뮬레이션' : 'SERP Snippet Preview — Naver & Google Search Result Simulator'}
        description={lang === 'ko' ? '제목·설명·URL을 입력하면 네이버·구글·모바일 검색결과에서 어떻게 노출되는지 실시간 미리보기. 글자 수·픽셀 한계 자동 감지.' : 'Enter your title, description and URL to preview how they appear in Naver, Google and mobile search results. Detects pixel and character limits in real time.'}
        path="/"
        jsonLd={jsonLd}
      />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{lang === 'ko' ? 'SERP 스니펫 미리보기' : 'SERP Snippet Preview'}</h1>
          <p className="mt-2 text-sm text-slate-600">
            <span className="font-medium text-blue-700">{lang === 'ko' ? '네이버·구글·모바일·OG' : 'Naver · Google · Mobile · OG'}</span> {lang === 'ko' ? '검색결과에서 제목·설명이 어떻게 잘리는지 실시간 확인.' : 'See how your title and description are truncated in real time.'}
          </p>
        </div>
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            darkMode
              ? 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
              : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
          }`}
          aria-label={darkMode ? (lang === 'ko' ? '라이트 모드' : 'Light mode') : (lang === 'ko' ? '다크 모드' : 'Dark mode')}
        >
          {darkMode ? '☀' : '🌙'} {darkMode ? (lang === 'ko' ? '라이트' : 'Light') : (lang === 'ko' ? '다크' : 'Dark')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Input panel */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">{lang === 'ko' ? '입력' : 'Input'}</h2>
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-800">URL</span>
              <input
                value={form.url}
                onChange={(e) => persist({ ...form, url: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">{lang === 'ko' ? '제목 (title)' : 'Title'}</span>
              <textarea
                rows={2}
                value={form.title}
                onChange={(e) => persist({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <PxBadge px={googleTitlePx} limit={LIMITS.google.titlePx} lang={lang} />
                <LengthBadge current={form.title.length} warn={30} limit={LIMITS.naver.titleChars} unit={lang === 'ko' ? '자' : 'ch'} lang={lang} />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">{lang === 'ko' ? '설명 (description)' : 'Description'}</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => persist({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span>{lang === 'ko' ? '구글:' : 'Google:'}</span>
                <LengthBadge current={form.description.length} warn={140} limit={LIMITS.google.descriptionChars} unit={lang === 'ko' ? '자' : 'ch'} lang={lang} />
                <span>{lang === 'ko' ? '네이버:' : 'Naver:'}</span>
                <LengthBadge current={form.description.length} warn={70} limit={LIMITS.naver.descriptionChars} unit={lang === 'ko' ? '자' : 'ch'} lang={lang} />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">{lang === 'ko' ? '게시일 (선택)' : 'Date (optional)'}</span>
              <input
                value={form.date}
                onChange={(e) => persist({ ...form, date: e.target.value })}
                placeholder={lang === 'ko' ? '2026. 4. 19.' : 'Apr 19, 2026'}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
        </section>

        {/* Preview panel */}
        <section className="lg:col-span-3">
          {/* Tabs */}
          <div className="mb-3 flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Google Desktop */}
          {activeTab === 'google-desktop' && (
            <article className={`rounded-xl border p-5 shadow-sm ${cardBg}`}>
              <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-[#8ab4f8]' : 'text-blue-700'}`}>
                Google (desktop) — {googleTitlePx}px {googleOverflow ? (lang === 'ko' ? '⚠ 잘림' : '⚠ truncated') : (lang === 'ko' ? '✓ 안전' : '✓ OK')}
              </p>
              <div className="max-w-[600px]">
                <p className={`text-[13px] ${textMuted}`}>{breadcrumb(form.url)}</p>
                <p className={`mt-0.5 text-xl font-medium leading-tight ${darkMode ? 'text-[#8ab4f8]' : 'text-[#1a0dab]'}`}>
                  {form.title}
                </p>
                <p className={`mt-0.5 text-[13px] ${textBody}`}>
                  {form.date && <span className={textMuted}>{form.date} — </span>}
                  {googleDescTrunc}
                </p>
              </div>
            </article>
          )}

          {/* Google Mobile */}
          {activeTab === 'google-mobile' && (
            <article className={`rounded-xl border p-5 shadow-sm ${darkMode ? 'bg-[#202124] border-[#3c4043]' : 'bg-white border-slate-200'}`}>
              <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-[#8ab4f8]' : 'text-blue-700'}`}>
                {lang === 'ko' ? 'Google 모바일 (Android/iOS)' : 'Google Mobile (Android/iOS)'}
              </p>
              <div className={`max-w-[390px] rounded-2xl border p-4 shadow-md ${darkMode ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${darkMode ? 'bg-[#5f6368]' : 'bg-slate-300'}`} />
                  <p className={`text-[11px] ${textMuted}`}>{hostname(form.url)}</p>
                </div>
                <p className={`mt-1.5 text-[17px] font-medium leading-snug ${darkMode ? 'text-[#e8eaed]' : 'text-[#1a0dab]'}`}>
                  {mobileTitleTrunc}
                </p>
                <p className={`mt-1 text-[13px] leading-snug ${textBody}`}>
                  {form.date && <span className={textMuted}>{form.date} · </span>}
                  {mobileDescTrunc}
                </p>
              </div>
              {form.title.length > LIMITS.mobile.titleChars && (
                <p className="mt-2 text-xs text-amber-600">
                  {lang === 'ko'
                    ? `⚠ 모바일 제목 ${LIMITS.mobile.titleChars}자 초과 — 뒷부분 잘릴 수 있음`
                    : `⚠ Mobile title exceeds ${LIMITS.mobile.titleChars} chars — may be cut off`}
                </p>
              )}
            </article>
          )}

          {/* Naver */}
          {activeTab === 'naver' && (
            <article className={`rounded-xl border p-5 shadow-sm ${darkMode ? 'bg-[#1c1c1e] border-[#3a3a3c]' : 'bg-white border-slate-200'}`}>
              <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-[#6ea6ff]' : 'text-green-700'}`}>
                {lang === 'ko' ? '네이버 통합검색' : 'Naver Integrated Search'}
              </p>
              <div className="max-w-[600px]">
                <p className={`text-lg font-semibold ${darkMode ? 'text-[#6ea6ff]' : 'text-[#004de2]'}`}>
                  {naverTitleTrunc}
                </p>
                <p className={`mt-1 text-[13px] ${darkMode ? 'text-[#d0d0d5]' : 'text-slate-700'}`}>{naverDescTrunc}</p>
                <p className={`mt-1 text-[12px] ${darkMode ? 'text-[#888]' : 'text-slate-500'}`}>
                  {hostname(form.url)}{form.date && <> · {form.date}</>}
                </p>
              </div>
              {form.title !== naverTitleTrunc && (
                <p className="mt-2 text-xs text-rose-600">
                  {lang === 'ko' ? `⚠ 네이버 제목 ${LIMITS.naver.titleChars}자 초과 — "${naverTitleTrunc}"로 표시` : `⚠ Naver title exceeds ${LIMITS.naver.titleChars} chars — shown as "${naverTitleTrunc}"`}
                </p>
              )}
              {form.description !== naverDescTrunc && (
                <p className="mt-1 text-xs text-amber-600">
                  {lang === 'ko' ? `⚠ 설명 ${LIMITS.naver.descriptionChars}자 초과 — 잘려서 표시됨` : `⚠ Description exceeds ${LIMITS.naver.descriptionChars} chars — truncated`}
                </p>
              )}
            </article>
          )}

          {/* OG / Twitter Card */}
          {activeTab === 'og-twitter' && (
            <div className="space-y-4">
              {/* OG card (Facebook / KakaoTalk style) */}
              <article className={`rounded-xl border p-5 shadow-sm ${darkMode ? 'bg-[#18191a] border-[#3a3b3c]' : 'bg-white border-slate-200'}`}>
                <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-[#aaa]' : 'text-slate-500'}`}>
                  OG Card (Facebook · KakaoTalk)
                </p>
                <div className={`overflow-hidden rounded-lg border ${darkMode ? 'border-[#3a3b3c]' : 'border-slate-200'}`}>
                  <div className={`flex h-36 items-center justify-center text-4xl ${darkMode ? 'bg-[#2d2d2d]' : 'bg-slate-100'}`}>
                    🔍
                  </div>
                  <div className={`p-3 ${darkMode ? 'bg-[#242526]' : 'bg-slate-50'}`}>
                    <p className={`text-[11px] uppercase ${darkMode ? 'text-[#aaa]' : 'text-slate-500'}`}>{hostname(form.url)}</p>
                    <p className={`mt-0.5 text-[15px] font-semibold leading-tight ${darkMode ? 'text-[#e4e6eb]' : 'text-slate-900'}`}>
                      {truncateByChar(form.title, 60)}
                    </p>
                    <p className={`mt-0.5 text-[13px] leading-snug ${darkMode ? 'text-[#b0b3b8]' : 'text-slate-600'}`}>
                      {truncateByChar(form.description, 100)}
                    </p>
                  </div>
                </div>
              </article>

              {/* Twitter Card */}
              <article className={`rounded-xl border p-5 shadow-sm ${darkMode ? 'bg-[#16181c] border-[#2f3336]' : 'bg-white border-slate-200'}`}>
                <p className={`mb-3 text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-[#8ba1c1]' : 'text-sky-600'}`}>
                  Twitter / X Card
                </p>
                <div className={`overflow-hidden rounded-2xl border ${darkMode ? 'border-[#2f3336]' : 'border-slate-200'}`}>
                  <div className={`flex h-48 items-center justify-center text-5xl ${darkMode ? 'bg-[#1e2026]' : 'bg-slate-100'}`}>
                    🔍
                  </div>
                  <div className={`p-3 ${darkMode ? 'bg-[#1e2026]' : 'bg-white'}`}>
                    <p className={`text-[13px] font-bold leading-tight ${darkMode ? 'text-[#e7e9ea]' : 'text-slate-900'}`}>
                      {truncateByChar(form.title, 70)}
                    </p>
                    <p className={`mt-0.5 text-[12px] leading-snug ${darkMode ? 'text-[#71767b]' : 'text-slate-500'}`}>
                      {truncateByChar(form.description, 120)}
                    </p>
                    <p className={`mt-1 text-[11px] ${darkMode ? 'text-[#71767b]' : 'text-slate-400'}`}>{hostname(form.url)}</p>
                  </div>
                </div>
              </article>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{lang === 'ko' ? '검색엔진별 권장 글자 수' : 'Recommended limits by search engine'}</h2>
        {lang === 'ko' ? (
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            <li>• <strong>구글</strong>: 제목 ~600px (약 한글 30~35자 / 영문 60자), 설명 150~160자</li>
            <li>• <strong>네이버</strong>: 제목 약 <strong>38자</strong>, 설명 약 <strong>80자</strong>까지 완전 표시</li>
            <li>• <strong>모바일</strong>: 제목 32자 내외, 설명 120자 내외 권장</li>
            <li>• <strong>OG/SNS</strong>: Facebook·카카오 제목 60자, 설명 100자; Twitter 제목 70자, 설명 120자</li>
          </ul>
        ) : (
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            <li>• <strong>Google</strong>: title ~600px (≈30–35 Korean chars / 60 Latin chars), description 150–160 chars</li>
            <li>• <strong>Naver</strong>: title ~<strong>38 chars</strong>, description ~<strong>80 chars</strong> fully displayed</li>
            <li>• <strong>Mobile</strong>: title ~32 chars, description ~120 chars recommended</li>
            <li>• <strong>OG/SNS</strong>: Facebook/Kakao title 60 chars, desc 100 chars; Twitter title 70 chars, desc 120 chars</li>
          </ul>
        )}
      </section>

      <section className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>
          {lang === 'ko' ? 'SEO 작성 팁은' : 'SEO tips in the'}{' '}
          <Link to={p('/guide')} className="underline">
            {lang === 'ko' ? '가이드' : 'Guide'}
          </Link>
          {lang === 'ko' ? ', FAQ 는' : ', questions in'}{' '}
          <Link to={p('/faq')} className="underline">
            FAQ
          </Link>
          .
        </p>
      </section>
    </>
  );
}
