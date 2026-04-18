import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

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
  return (
    <>
      <SEO
        title="SERP 최적화 가이드 — 제목·설명 길이와 키워드 배치"
        description="네이버·구글 검색결과에서 잘리지 않는 제목 길이, 클릭률을 높이는 설명 문구, 키워드 앞자리 배치 규칙을 정리."
        path="/guide"
        jsonLd={jsonLd}
      />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">SERP 최적화 가이드</h1>
      <p className="mt-2 text-sm text-slate-600">검색결과에서 잘리지 않는 제목·설명 작성 요령.</p>

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

        <h2>6. 참고 자료</h2>
        <ul>
          <li>Google Search Central — Snippets.</li>
          <li>네이버 검색 가이드 (웹마스터 도구).</li>
        </ul>
      </article>

      <p className="mt-8 text-sm text-slate-500">
        <Link to="/" className="underline">미리보기로 돌아가기</Link>.
      </p>
    </>
  );
}
