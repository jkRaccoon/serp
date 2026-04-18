import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { track } from '../lib/track';
import { LIMITS, breadcrumb, charWidthPx, hostname, truncateByChar, type SerpInput } from '../lib/serp';

const STORAGE = 'serp-input';

const DEFAULT: SerpInput = {
  url: 'https://example.com/article-title',
  title: '한국어 SEO 최적화 가이드 — 타이틀과 설명 작성 요령',
  description: '제목 38자, 설명 80자 이내가 네이버 검색결과에 온전히 노출됩니다. 구글은 길이보다 픽셀 단위가 중요합니다.',
  date: new Date().toLocaleDateString('ko-KR'),
};

function load(): SerpInput {
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

export default function Home() {
  const [form, setForm] = useState<SerpInput>(load);
  const persist = useCallback((next: SerpInput) => {
    setForm(next);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE, JSON.stringify(next));
  }, []);

  const googleTitlePx = useMemo(() => charWidthPx(form.title), [form.title]);
  const googleOverflow = googleTitlePx > LIMITS.google.titlePx;
  const naverTitleTrunc = truncateByChar(form.title, LIMITS.naver.titleChars);
  const naverDescTrunc = truncateByChar(form.description, LIMITS.naver.descriptionChars);
  const googleDescTrunc = truncateByChar(form.description, LIMITS.google.descriptionChars);
  const mobileTitleTrunc = truncateByChar(form.title, LIMITS.mobile.titleChars);

  useMemo(() => track('serp_preview'), []);

  return (
    <>
      <SEO
        title="SERP 스니펫 미리보기 — 네이버·구글 검색결과 시뮬레이션"
        description="제목·설명·URL을 입력하면 네이버·구글·모바일 검색결과에서 어떻게 노출되는지 실시간 미리보기. 글자 수·픽셀 한계 자동 감지."
        path="/"
        jsonLd={jsonLd}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">SERP 스니펫 미리보기</h1>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-medium text-blue-700">네이버·구글·모바일</span> 검색결과에서 제목·설명이 어떻게 잘리는지 실시간 확인.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">입력</h2>
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
              <span className="text-sm font-medium text-slate-800">제목 (title)</span>
              <textarea
                rows={2}
                value={form.title}
                onChange={(e) => persist({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <span className="mt-1 flex justify-between text-xs text-slate-500">
                <span>{form.title.length} 자 · 약 {googleTitlePx}px</span>
                <span className={googleOverflow ? 'text-rose-700' : 'text-emerald-700'}>{googleOverflow ? '⚠️ 구글 600px 초과' : '✓ 구글 600px 이내'}</span>
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">설명 (description)</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => persist({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <span className="mt-1 block text-xs text-slate-500">{form.description.length} 자</span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-800">게시일 (선택)</span>
              <input
                value={form.date}
                onChange={(e) => persist({ ...form, date: e.target.value })}
                placeholder="2026. 4. 19."
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
        </section>

        <section className="space-y-5 lg:col-span-3">
          {/* Google Desktop */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-700">Google (desktop)</p>
            <div className="max-w-[600px]">
              <p className="text-[13px] text-slate-700">{breadcrumb(form.url)}</p>
              <a href={form.url} className="text-xl text-[#1a0dab] hover:underline" target="_blank" rel="noreferrer">
                {form.title}
              </a>
              <p className="mt-0.5 text-[13px] text-slate-800">
                {form.date && <span className="text-slate-500">{form.date} — </span>}
                {googleDescTrunc}
              </p>
            </div>
          </article>

          {/* Naver Desktop */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-green-700">Naver</p>
            <div className="max-w-[600px]">
              <a href={form.url} className="text-lg font-semibold text-[#004de2] hover:underline" target="_blank" rel="noreferrer">
                {naverTitleTrunc}
              </a>
              <p className="mt-1 text-[13px] text-slate-700">{naverDescTrunc}</p>
              <p className="mt-1 text-[12px] text-slate-500">
                {hostname(form.url)}{form.date && <> · {form.date}</>}
              </p>
            </div>
          </article>

          {/* Mobile */}
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Mobile (Google / 통합)</p>
            <div className="max-w-[380px] rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <p className="text-xs text-slate-500">{hostname(form.url)}</p>
              <p className="mt-1 text-[17px] font-semibold leading-tight text-[#1a0dab]">{mobileTitleTrunc}</p>
              <p className="mt-1 text-[13px] leading-snug text-slate-700">
                {truncateByChar(form.description, LIMITS.mobile.descriptionChars)}
              </p>
            </div>
          </article>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">검색엔진별 권장 글자 수</h2>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          <li>• <strong>구글</strong>: 제목 ~600px (약 한글 30~35자 / 영문 60자), 설명 150~160자</li>
          <li>• <strong>네이버</strong>: 제목 약 <strong>38자</strong>, 설명 약 <strong>80자</strong>까지 완전 표시</li>
          <li>• <strong>모바일</strong>: 제목 32자 내외, 설명 120자 내외 권장</li>
        </ul>
      </section>

      <section className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>
          SEO 작성 팁은{' '}
          <Link to="/guide" className="underline">
            가이드
          </Link>
          , FAQ 는{' '}
          <Link to="/faq" className="underline">
            FAQ
          </Link>
          .
        </p>
      </section>
    </>
  );
}
