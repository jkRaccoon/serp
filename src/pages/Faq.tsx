import SEO from '../components/SEO';

const QAS = [
  { q: '내가 설정한 제목과 실제 검색결과 제목이 다른 이유는?', a: '구글은 title 태그를 기본으로 사용하지만, 쿼리 매칭이 약하면 본문 h1·첫 문단에서 자동으로 재작성하기도 합니다. 네이버는 훨씬 엄격하게 title 을 그대로 사용합니다.' },
  { q: '제목 길이는 글자 수인가요 픽셀인가요?', a: '구글은 픽셀 단위로 판단하며 대략 600px. 한글은 문자당 약 14px 이라 30~35자 정도가 한계. 영문은 한 문자당 8~10px 이라 60자까지 가능.' },
  { q: '설명이 길면 SEO 순위가 오르나요?', a: '아니요. 설명은 순위 신호가 아니며 CTR에만 영향을 줍니다. 160자 이내로 클릭 유도에 집중하세요.' },
  { q: '네이버 검색은 왜 구글과 다르게 나오나요?', a: '네이버는 자체 알고리즘(C-rank·D.I.A)과 한국어 형태소 분석기를 사용해 글자 수·키워드 매칭·블로그 신뢰도 가중치를 다르게 둡니다.' },
  { q: '썸네일 이미지는 어떻게 지정하나요?', a: '구글은 og:image, 네이버는 og:image 또는 본문 첫 이미지. 1200×630 권장. 본 도구는 텍스트 부분만 다루며, 이미지 미리보기는 cheongcheo.bal.pe.kr 같은 OG 도구를 활용.' },
  { q: '모바일 검색 결과가 더 잘리는 이유?', a: '화면 폭이 좁아 제목 2줄로 표시되지만 1줄 노출 시 글자가 더 많이 잘립니다. 모바일에서는 32자 이내 제목 권장.' },
  { q: '리치 스니펫(별점·가격)도 지원되나요?', a: '본 MVP는 일반 스니펫만 지원합니다. 리치 스니펫은 구조화된 데이터(JSON-LD)를 HTML에 삽입해야 하며, 별도 테스트 도구(구글 서치 콘솔)를 사용하세요.' },
  { q: '내 페이지가 제대로 indexed 됐는지 어떻게 확인?', a: '구글: "site:yourdomain.com" 검색. 네이버: 웹마스터 도구 > 웹페이지 수집. 둘 다 로그인 필요.' },
  { q: '영문 사이트도 이 도구로 미리볼 수 있나요?', a: '네. 한글·영문 모두 지원하며, 영문일수록 글자당 픽셀이 작아 제목 여유가 더 많습니다.' },
  { q: '검색엔진이 설명을 무시하고 본문에서 자동 발췌하는 이유는?', a: '사용자의 검색 쿼리와 더 연관된 본문 구간이 발견되면 검색엔진이 자동으로 발췌(snippet)를 교체합니다. 이를 방지하려면 <meta name="robots" content="nosnippet">을 쓰지만, 보통은 CTR이 더 떨어지니 권장하지 않습니다.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: QAS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') },
  })),
};

export default function Faq() {
  return (
    <>
      <SEO
        title="SERP 스니펫 FAQ — 제목 재작성·글자 수·리치 스니펫"
        description="왜 설정한 제목과 실제 검색결과가 다른지, 픽셀 vs 글자 수, 네이버·구글 차이, 모바일 잘림, 리치 스니펫 지원 등 10선."
        path="/faq"
        jsonLd={jsonLd}
      />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">자주 묻는 질문</h1>
      <p className="mt-2 text-sm text-slate-600">SERP 미리보기 관련 10개 질문.</p>

      <dl className="mt-8 space-y-6">
        {QAS.map(({ q, a }, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <dt className="text-sm font-semibold text-slate-900">Q{i + 1}. {q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: a }} />
          </div>
        ))}
      </dl>
    </>
  );
}
