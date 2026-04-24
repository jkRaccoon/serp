import { useLang, withLangPrefix } from '../lib/i18n';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: object;
}

const SITE = 'https://serp.bal.pe.kr';
const SUFFIX_KO = 'SERP 미리보기 · 브라우저 내 처리';
const SUFFIX_EN = 'SERP Preview · Browser-based';

export default function SEO({ title, description, path, jsonLd }: SEOProps) {
  const { lang } = useLang();
  const koPath = path;
  const enPath = withLangPrefix(path, 'en');
  const currentPath = lang === 'ko' ? koPath : enPath;
  const url = `${SITE}${currentPath}`;
  const suffix = lang === 'ko' ? SUFFIX_KO : SUFFIX_EN;
  const fullTitle = path === '/' ? title : `${title} | ${suffix}`;
  const locale = lang === 'ko' ? 'ko_KR' : 'en_US';
  const siteName = lang === 'ko' ? 'SERP 스니펫 미리보기' : 'SERP Snippet Preview';
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ko" href={`${SITE}${koPath}`} />
      <link rel="alternate" hrefLang="en" href={`${SITE}${enPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE}${koPath}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={`${SITE}/og.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE}/og.png`} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
