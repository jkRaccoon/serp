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
const PUBLISHER_NAME = 'bal.pe.kr';
const PUBLISHER_URL = 'https://bal.pe.kr';

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

  const homeUrl = `${SITE}${lang === 'ko' ? '/' : '/en'}`;
  const breadcrumbItems: Array<{ '@type': 'ListItem'; position: number; name: string; item: string }> = [
    { '@type': 'ListItem', position: 1, name: siteName, item: homeUrl },
  ];
  if (path !== '/') {
    breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: title, item: url });
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PUBLISHER_NAME,
    url: PUBLISHER_URL,
  };

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
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
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE}/og.png`} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
