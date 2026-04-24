import SEO from '../components/SEO';
import { useLang } from '../lib/i18n';

interface QA {
  q: { ko: string; en: string };
  a: { ko: string; en: string };
}

const QAS: QA[] = [
  {
    q: { ko: '내가 설정한 제목과 실제 검색결과 제목이 다른 이유는?', en: 'Why does my title appear differently in search results?' },
    a: { ko: '구글은 title 태그를 기본으로 사용하지만, 쿼리 매칭이 약하면 본문 h1·첫 문단에서 자동으로 재작성하기도 합니다. 네이버는 훨씬 엄격하게 title 을 그대로 사용합니다.', en: 'Google uses the title tag by default, but if it poorly matches the search query it may auto-rewrite from the h1 or first paragraph. Naver is much stricter and uses the title tag as-is.' },
  },
  {
    q: { ko: '제목 길이는 글자 수인가요 픽셀인가요?', en: 'Is title length measured in characters or pixels?' },
    a: { ko: '구글은 픽셀 단위로 판단하며 대략 600px. 한글은 문자당 약 14px 이라 30~35자 정도가 한계. 영문은 한 문자당 8~10px 이라 60자까지 가능.', en: 'Google measures in pixels (~600px). Korean characters are ~14px each, so the limit is roughly 30–35 chars. Latin characters are 8–10px, so ~60 chars fit.' },
  },
  {
    q: { ko: '설명이 길면 SEO 순위가 오르나요?', en: 'Does a longer description improve SEO rankings?' },
    a: { ko: '아니요. 설명은 순위 신호가 아니며 CTR에만 영향을 줍니다. 160자 이내로 클릭 유도에 집중하세요.', en: 'No — descriptions are not a ranking signal, only a CTR influencer. Focus on click-inducing copy within 160 characters.' },
  },
  {
    q: { ko: '네이버 검색은 왜 구글과 다르게 나오나요?', en: 'Why do Naver results look different from Google?' },
    a: { ko: '네이버는 자체 알고리즘(C-rank·D.I.A)과 한국어 형태소 분석기를 사용해 글자 수·키워드 매칭·블로그 신뢰도 가중치를 다르게 둡니다.', en: 'Naver uses its own algorithm (C-rank · D.I.A) with a Korean morpheme analyzer, weighting character count, keyword matching, and blog trust differently.' },
  },
  {
    q: { ko: '썸네일 이미지는 어떻게 지정하나요?', en: 'How do I set a thumbnail image?' },
    a: { ko: '구글은 og:image, 네이버는 og:image 또는 본문 첫 이미지. 1200×630 권장. 본 도구는 텍스트 부분만 다루며, 이미지 미리보기는 별도 OG 도구를 활용.', en: 'Google uses og:image; Naver uses og:image or the first inline image. Recommended size: 1200×630. This tool only covers the text parts — use a dedicated OG preview tool for images.' },
  },
  {
    q: { ko: '모바일 검색 결과가 더 잘리는 이유?', en: 'Why is the mobile result more truncated?' },
    a: { ko: '화면 폭이 좁아 제목 2줄로 표시되지만 1줄 노출 시 글자가 더 많이 잘립니다. 모바일에서는 32자 이내 제목 권장.', en: 'The narrow screen shows the title in two lines but still cuts sooner on single-line displays. Keep titles under 32 characters for mobile.' },
  },
  {
    q: { ko: '리치 스니펫(별점·가격)도 지원되나요?', en: 'Are rich snippets (stars, price) supported?' },
    a: { ko: '본 MVP는 일반 스니펫만 지원합니다. 리치 스니펫은 구조화된 데이터(JSON-LD)를 HTML에 삽입해야 하며, 별도 테스트 도구(구글 서치 콘솔)를 사용하세요.', en: 'This MVP covers standard snippets only. Rich snippets require structured data (JSON-LD) in your HTML — use Google\'s Rich Results Test or Search Console to test them.' },
  },
  {
    q: { ko: '내 페이지가 제대로 indexed 됐는지 어떻게 확인?', en: 'How do I check if my page is indexed?' },
    a: { ko: '구글: "site:yourdomain.com" 검색. 네이버: 웹마스터 도구 > 웹페이지 수집. 둘 다 로그인 필요.', en: 'Google: search "site:yourdomain.com". Naver: Webmaster Tools → Web Page Collection. Both require login.' },
  },
  {
    q: { ko: '영문 사이트도 이 도구로 미리볼 수 있나요?', en: 'Can I preview an English-language site?' },
    a: { ko: '네. 한글·영문 모두 지원하며, 영문일수록 글자당 픽셀이 작아 제목 여유가 더 많습니다.', en: 'Yes — the tool handles both Korean and English. Latin characters are narrower per pixel, so you get more title characters.' },
  },
  {
    q: { ko: '검색엔진이 설명을 무시하고 본문에서 자동 발췌하는 이유는?', en: 'Why does the search engine ignore my description and pull text from the page?' },
    a: { ko: '사용자의 검색 쿼리와 더 연관된 본문 구간이 발견되면 검색엔진이 자동으로 발췌(snippet)를 교체합니다. 방지하려면 nosnippet 을 쓰지만 보통은 CTR이 더 떨어지니 권장하지 않습니다.', en: 'When the engine finds a body passage that better matches the user\'s query, it swaps in that passage. You can block it with nosnippet, but that usually hurts CTR.' },
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: QAS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q.en,
    acceptedAnswer: { '@type': 'Answer', text: a.en },
  })),
};

export default function Faq() {
  const { lang } = useLang();
  const title = lang === 'ko'
    ? 'SERP 스니펫 FAQ — 제목 재작성·글자 수·리치 스니펫'
    : 'SERP Snippet FAQ — Title rewrites, character limits, rich snippets';
  const desc = lang === 'ko'
    ? '왜 설정한 제목과 실제 검색결과가 다른지, 픽셀 vs 글자 수, 네이버·구글 차이, 모바일 잘림, 리치 스니펫 지원 등 10선.'
    : '10 answers on SERP Snippet Preview: title rewrites, pixel vs character limits, Naver vs Google differences, mobile truncation, rich snippets.';

  return (
    <>
      <SEO title={title} description={desc} path="/faq" jsonLd={jsonLd} />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{lang === 'ko' ? '자주 묻는 질문' : 'Frequently asked questions'}</h1>
      <p className="mt-2 text-sm text-slate-600">{lang === 'ko' ? 'SERP 미리보기 관련 10개 질문.' : '10 questions about SERP Snippet Preview.'}</p>

      <dl className="mt-8 space-y-6">
        {QAS.map(({ q, a }, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <dt className="text-sm font-semibold text-slate-900">Q{i + 1}. {q[lang]}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-700">{a[lang]}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
