import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { useLang, detectLangFromPath, withLangPrefix } from '../lib/i18n';
import { AuthorByline } from '../components/seo-kit';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'SERP 스니펫 가이드 — 제목·설명 최적화',
  inLanguage: 'ko-KR',
  author: { '@type': 'Organization', name: 'serp.bal.pe.kr' },
  publisher: { '@type': 'Organization', name: 'serp.bal.pe.kr' },
  mainEntityOfPage: 'https://serp.bal.pe.kr/guide',
};

export default function Guide() {
  const { lang } = useLang();
  const location = useLocation();
  const currentLang = detectLangFromPath(location.pathname);
  const p = (path: string) => withLangPrefix(path, currentLang);

  const title = lang === 'ko'
    ? 'SERP 최적화 가이드 — 제목·설명 길이와 키워드 배치'
    : 'SERP Optimization Guide — Title & Description Length and Keyword Placement';
  const desc = lang === 'ko'
    ? '네이버·구글 검색결과에서 잘리지 않는 제목 길이, 클릭률을 높이는 설명 문구, 키워드 앞자리 배치 규칙을 정리.'
    : 'How to write titles and descriptions that don\'t get cut off in Naver and Google, with keyword placement rules to maximize click-through rate.';

  return (
    <>
      <SEO title={title} description={desc} path="/guide" jsonLd={jsonLd} />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{lang === 'ko' ? 'SERP 최적화 가이드' : 'SERP Optimization Guide'}</h1>
      <p className="mt-2 text-sm text-slate-600">{lang === 'ko' ? '검색결과에서 잘리지 않는 제목·설명 작성 요령과 CTR을 끌어올리는 실전 패턴.' : 'How to write titles and descriptions that display perfectly in search results, plus real-world CTR patterns.'}</p>

      <div className="mt-6">
        <AuthorByline
          authorName={lang === 'ko' ? '김지광 (운영자)' : 'Operator (Jikwang Kim)'}
          reviewerName={lang === 'ko' ? 'Google Search Central·네이버 웹마스터 가이드 교차 검증' : 'Cross-checked with Google Search Central and Naver Webmaster Guide'}
          lastUpdated="2026-05-16"
          datePublished="2026-04-19"
          organizationName="bal.pe.kr 마이크로 SaaS"
          organizationUrl="https://bal.pe.kr/about"
          mainEntityType="Article"
          language={lang === 'ko' ? 'ko' : 'en'}
        />
      </div>

      {lang === 'ko' ? <GuideKo /> : <GuideEn />}

      <p className="mt-8 text-sm text-slate-500">
        <Link to={p('/')} className="underline">{lang === 'ko' ? '미리보기로 돌아가기' : 'Back to the tool'}</Link>.
      </p>
    </>
  );
}

function GuideKo() {
  return (
    <article className="prose prose-slate mt-8 max-w-none text-[15px]">
      <h2>1. 제목(title) 작성 원칙</h2>
      <ul>
        <li><strong>앞 30자 안에 핵심 키워드</strong>를 배치. 모바일은 30자 뒤가 잘립니다.</li>
        <li>파이프(|) · 하이픈(-)으로 <strong>메인 키워드</strong> + <strong>보조</strong> 구조.</li>
        <li>이모지는 1~2개 허용 (브랜드 차별화). 과다 사용은 스팸 신호.</li>
        <li>대문자·숫자·괄호 활용 → 시인성 ↑.</li>
      </ul>

      <h2>2. 설명(meta description) 원칙</h2>
      <ul>
        <li>네이버: <strong>80자</strong> 이내가 완전 노출. 초과분 "…" 처리.</li>
        <li>구글: <strong>150~160자</strong> 권장. 모바일은 120자.</li>
        <li><strong>행동 유도</strong> 문구(확인하세요·비교해보세요·무료) 포함 시 CTR ↑.</li>
        <li>키워드를 자연스럽게 2회 이내 포함 (중복은 역효과).</li>
      </ul>

      <h2>3. URL 구조</h2>
      <ul>
        <li>짧고 의미 있는 slug: <code>/seo-guide</code> &gt; <code>/article?id=12345</code>.</li>
        <li>한글 URL 가능하나 길어져 가독성 저하. 영문 slug 권장.</li>
        <li>카테고리 계층 3단계 이내: <code>/blog/seo/snippet-preview</code>.</li>
      </ul>

      <h2>4. CTR 높이는 테크닉</h2>
      <ul>
        <li>숫자 포함: "5가지 방법", "2026 버전".</li>
        <li>질문형 제목: "~할 때 주의할 점?".</li>
        <li>대괄호 [ ] 로 태그 강조: "[리뷰] ...".</li>
        <li>최신성 시그널: "2026년", "최신", "업데이트".</li>
      </ul>

      <h2>5. 피해야 할 것</h2>
      <ul>
        <li>제목 중복 (사이트 내 동일 키워드 많으면 구글이 자동 재작성).</li>
        <li>낚시성 제목 + 내용 불일치 → 이탈률 증가 → 순위 하락.</li>
        <li>한 줄에 키워드 몰아넣기 ("SEO 블로그 제목 최적화 가이드 방법 2026 ...").</li>
      </ul>

      <h2>6. 네이버 vs 구글 — 한국 시장의 듀얼 옵티마이즈</h2>
      <p>
        한국 검색 시장은 네이버 60%, 구글 30%, 다음·기타 10% 수준으로
        분포가 양분되어 있으며 두 플랫폼은 스니펫 표시 규칙이 서로
        다릅니다. 네이버는 모바일 기준 제목 약 28자, 설명 80자에서 잘리며
        통합검색 결과의 View·블로그·웹사이트 탭 모두 동일 규칙을 따릅니다.
        구글은 픽셀 폭(약 580px) 기준이라 한글은 글자 수보다 한자 폭 합으로
        잘리는 위치가 결정됩니다. 본 도구의 미리보기는 두 플랫폼을
        각각 보여주므로 한 화면에서 듀얼 옵티마이즈가 가능합니다.
      </p>

      <h2>7. 검색 의도(intent)별 제목 패턴</h2>
      <ul>
        <li>
          <strong>정보형(Informational)</strong>: "~방법", "~란?", "~vs~ 비교".
          가이드·튜토리얼·정의 페이지에 적합.
        </li>
        <li>
          <strong>탐색형(Navigational)</strong>: 브랜드·제품명을 앞에 두고
          기능을 뒤에 배치. "쿠팡 로켓배송 환불 방법"처럼.
        </li>
        <li>
          <strong>거래형(Transactional)</strong>: "할인", "쿠폰", "프로모션",
          "최저가" 같은 액션 키워드를 30자 이내 배치.
        </li>
        <li>
          <strong>상업조사형(Commercial)</strong>: "리뷰", "추천", "TOP 5",
          "베스트" 등 비교형 단어로 결정 직전 검색자를 잡는다.
        </li>
      </ul>

      <h2>8. 자주 빠지는 함정</h2>
      <ul>
        <li>
          <strong>title과 H1 불일치</strong>. 검색 스니펫은 title 태그를 쓰지만
          페이지 로드 후 H1과 다르면 사용자가 잘못 클릭했다고 느껴 이탈률이
          올라갑니다. 둘은 의미상 같아야 합니다.
        </li>
        <li>
          <strong>meta description 미설정</strong>. 비워두면 구글이 본문에서
          자동 추출하는데, 한국어 본문은 줄바꿈·이모지 처리가 들쑥날쑥해
          이상하게 잘립니다. 페이지별 명시적 작성이 안전.
        </li>
        <li>
          <strong>모바일 미리보기 무시</strong>. 한국 검색 70%+는 모바일에서
          이루어집니다. 데스크톱에서만 확인하지 말고 본 도구의 모바일 폭
          토글로 반드시 검증.
        </li>
      </ul>

      <h2>9. 모바일 픽셀 폭 — 데스크톱과 다른 잘림 규칙</h2>
      <p>
        한국 검색 트래픽의 70% 이상이 모바일에서 발생합니다. 데스크톱 크롬·사파리에서 잘 보이는 제목이
        삼성 갤럭시 기본 브라우저·아이폰 사파리·네이버 앱·구글 앱에서는 다르게 잘리는 일이 흔합니다.
        구글은 데스크톱 약 600 픽셀, 모바일 약 460 픽셀에서 제목을 자르며, 한글은 한 글자당 평균
        16~18 픽셀이라 모바일은 28자, 데스크톱은 35자 전후에서 잘립니다. 본 도구의 모바일/데스크톱
        토글로 두 화면을 모두 검증해야 합니다. 특히 영문 약어가 섞인 경우(SEO, GPT, API 등) 픽셀
        폭이 더 좁아져 잘림 위치가 한자 앞당겨질 수 있으니 핵심 키워드는 반드시 첫 20자 안에 두세요.
      </p>

      <h2>10. 키워드 카니발리제이션 — 같은 사이트끼리 경쟁</h2>
      <p>
        같은 키워드를 노린 페이지가 한 사이트에 여럿 있으면 구글이 어떤 페이지를 노출할지 헷갈려
        모두 순위가 하락하는 현상을 "카니발리제이션"이라고 합니다. 예를 들어 블로그에 "전세 계약
        주의사항", "전세 계약 시 체크리스트", "전세 계약서 작성법" 같은 글이 동시에 존재하면 셋 다
        2페이지 밖으로 밀려나는 일이 자주 발생합니다. 해결 방법은 (1) 가장 강한 1편으로 통합 후
        나머지는 301 리다이렉트 (2) 각 페이지가 노리는 의도(검색 인텐트)를 명확히 구분
        (3) 내부 링크로 메인 페이지에 권위를 몰아주기입니다. 본 도구의 미리보기에서 제목·설명이
        지나치게 유사하면 카니발리제이션 위험 신호입니다.
      </p>

      <h2>11. 스니펫 영역 확장 — 별점·FAQ·이미지로 점유</h2>
      <p>
        검색 결과 한 페이지에 10개 자리가 있지만 광고·지식그래프·이미지팩·동영상까지 합치면
        실제 유기 검색 결과는 6~7개로 줄어듭니다. 그래서 한 결과가 차지하는 면적이 클수록 클릭률이
        높아집니다. 별점(Review schema), FAQ schema, 이미지 미리보기, 사이트링크 등으로 스니펫
        면적을 늘리는 전략을 권장합니다. 단, 2024년부터 구글은 무분별한 HowTo·FAQ 마크업을 제재
        하므로 실제 페이지에 해당 콘텐츠가 있을 때만 schema 를 추가하세요. 본 도구는 schema 미리보기
        를 함께 제공해 어떤 형태로 검색 결과에 노출될지 시각적으로 확인할 수 있습니다.
      </p>

      <h2>12. 시즌·이벤트 키워드 캘린더</h2>
      <p>
        한국 검색 트래픽은 명절·세무·교육 일정에 강하게 묶여 있습니다. 1월 연말정산, 3월 신학기,
        5월 가정의 달, 7~8월 휴가·에어컨, 9월 추석, 11월 김장·블랙프라이데이, 12월 크리스마스·송년
        키워드는 매년 동일한 시점에 검색량이 폭증합니다. 시즌 키워드는 그 시점 2~4주 전에 글을
        발행해야 색인·랭킹이 잡힐 시간을 확보할 수 있습니다. 본 도구로 시즌 제목 후보(예: "연말정산
        간소화 2026 모바일")를 미리 검증해두면 시점에 맞춰 발행할 때 클릭률을 안정적으로 끌어올릴
        수 있습니다.
      </p>

      <h2>13. AI 검색(SGE·Copilot) 시대의 스니펫 전략</h2>
      <p>
        구글 SGE(Search Generative Experience)·Bing Copilot·네이버 큐브 같은 AI 검색이 보편화되면서
        결과 상단에 LLM 요약이 먼저 표시되고 그 아래 기존 스니펫이 따라옵니다. 이 환경에서 클릭을
        받으려면 (1) 명확한 단답 한 문장 (2) 단답을 뒷받침하는 표·리스트 (3) E-E-A-T 시그널(전문가
        프로필·업데이트 일자·출처 인용)이 함께 있어야 합니다. AI 요약에 인용되면 별도 출처 칩으로
        브랜드 노출이 증가하고, 인용되지 못해도 풍부한 스니펫은 그대로 노출됩니다. 본 도구는 제목·
        설명뿐 아니라 첫 단답 문장을 검증할 수 있는 미리보기를 권장합니다.
      </p>

      <h2>14. CTR을 결정하는 비기술 요소 5가지</h2>
      <ul>
        <li><strong>브랜드 신뢰</strong>: 신뢰 도메인은 동일 키워드에서도 CTR 2배 이상 차이.</li>
        <li><strong>발행 일자</strong>: 1년 이내 글이 최신성 시그널로 클릭률 향상.</li>
        <li><strong>썸네일 이미지</strong>: 네이버 통합검색은 첫 이미지가 결과 옆에 노출, 인물·실물 사진이 일러스트보다 클릭률 ↑.</li>
        <li><strong>리뷰 별점</strong>: 4.5점 이상 별점이 표시되면 CTR 평균 35% 상승.</li>
        <li><strong>긴급성 문구</strong>: "마감 임박", "오늘까지" 같은 표현은 CTR ↑ 그러나 본문 불일치 시 이탈률도 ↑.</li>
      </ul>

      <h2>15. 참고 자료</h2>
      <ul>
        <li>Google Search Central — Snippets · Title Best Practices.</li>
        <li>네이버 검색 가이드 (웹마스터 도구).</li>
        <li>Naver Search Advisor — Title/Description Length Recommendations.</li>
        <li>Google Search Quality Evaluator Guidelines (2024) — E-E-A-T 평가 기준.</li>
        <li>Search Engine Land · Moz · Backlinko — CTR 곡선 데이터.</li>
      </ul>
    </article>
  );
}

function GuideEn() {
  return (
    <article className="prose prose-slate mt-8 max-w-none text-[15px]">
      <h2>1. Title tag principles</h2>
      <ul>
        <li>Place your <strong>primary keyword within the first 30 characters</strong> — mobile truncates after that.</li>
        <li>Use pipe (|) or hyphen (-) to structure <strong>main keyword + secondary</strong>.</li>
        <li>1–2 emojis are fine for brand differentiation; overuse is a spam signal.</li>
        <li>Capitalization, numbers and brackets improve scannability.</li>
      </ul>

      <h2>2. Meta description principles</h2>
      <ul>
        <li>Naver: stay under <strong>80 characters</strong> for full display; excess is truncated with "…".</li>
        <li>Google: <strong>150–160 characters</strong> recommended; mobile is ~120 characters.</li>
        <li>Include <strong>calls to action</strong> (Check it out, Compare, Free) to boost CTR.</li>
        <li>Include your keyword naturally, at most twice — repetition backfires.</li>
      </ul>

      <h2>3. URL structure</h2>
      <ul>
        <li>Short, descriptive slugs: <code>/seo-guide</code> beats <code>/article?id=12345</code>.</li>
        <li>English slugs are preferred — Korean URLs encode long and hurt readability.</li>
        <li>Keep hierarchy to 3 levels: <code>/blog/seo/snippet-preview</code>.</li>
      </ul>

      <h2>4. CTR-boosting techniques</h2>
      <ul>
        <li>Use numbers: "5 Ways to …", "2026 Edition".</li>
        <li>Question titles: "What to Watch Out for When …?"</li>
        <li>Brackets for tags: "[Review] …"</li>
        <li>Freshness signals: "2026", "Latest", "Updated".</li>
      </ul>

      <h2>5. Things to avoid</h2>
      <ul>
        <li>Duplicate titles across pages — Google rewrites them automatically if keywords repeat too much.</li>
        <li>Clickbait + mismatched content → high bounce rate → ranking drop.</li>
        <li>Keyword stuffing in a single line ("SEO Blog Title Optimization Guide Method 2026 …").</li>
      </ul>

      <h2>6. Naver vs Google — dual-optimize for the Korean market</h2>
      <p>
        Korea's search market splits roughly 60% Naver, 30% Google, 10% Daum
        and others — and the two engines truncate snippets differently. Naver
        cuts mobile titles around 28 characters and descriptions at 80; Google
        uses pixel width (around 580px), so Korean characters get cut based on
        accumulated glyph width rather than character count. This tool shows
        both previews side by side so you can optimize for both on the same
        screen.
      </p>

      <h2>7. Title patterns by search intent</h2>
      <ul>
        <li>
          <strong>Informational</strong>: "How to", "What is", "X vs Y" —
          guides, tutorials, definitions.
        </li>
        <li>
          <strong>Navigational</strong>: brand or product name first, feature
          second — "Coupang Rocket Delivery refund process".
        </li>
        <li>
          <strong>Transactional</strong>: action keywords like "discount",
          "coupon", "promo", "best price" in the first 30 characters.
        </li>
        <li>
          <strong>Commercial investigation</strong>: comparison words like
          "review", "best", "top 5" to catch users near a decision point.
        </li>
      </ul>

      <h2>8. Common pitfalls</h2>
      <ul>
        <li>
          <strong>Title/H1 mismatch</strong>. The snippet uses the title tag,
          but if H1 differs after load, users feel they misclicked and bounce.
          Keep them semantically identical.
        </li>
        <li>
          <strong>Missing meta description</strong>. Google auto-extracts from
          body text, which produces awkward truncation. Write descriptions
          per page to stay in control.
        </li>
        <li>
          <strong>Ignoring mobile preview</strong>. Over 70% of Korean searches
          happen on mobile. Always toggle this tool's mobile-width preview
          before publishing.
        </li>
      </ul>

      <h2>9. References</h2>
      <ul>
        <li>Google Search Central — Snippets &amp; Title Best Practices.</li>
        <li>Naver Search Guide (Webmaster Tools).</li>
        <li>Naver Search Advisor — Title/Description Length Recommendations.</li>
      </ul>
    </article>
  );
}
