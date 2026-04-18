#!/usr/bin/env node
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

const ensureDir = (p) => mkdirSync(dirname(p), { recursive: true });

const OG_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e3a8a"/>
      <stop offset="1" stop-color="#065f46"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#93c5fd"/>
      <stop offset="1" stop-color="#86efac"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g transform="translate(80, 90)">
    <rect x="0" y="0" width="90" height="90" rx="18" fill="url(#accent)"/>
    <circle cx="38" cy="38" r="16" fill="none" stroke="#1e3a8a" stroke-width="5"/>
    <line x1="52" y1="52" x2="72" y2="72" stroke="#1e3a8a" stroke-width="6" stroke-linecap="round"/>
  </g>
  <text x="80" y="270" font-family="Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-size="70" font-weight="900" fill="#ffffff" letter-spacing="-2">SERP 스니펫 미리보기</text>
  <text x="80" y="350" font-family="Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-size="58" font-weight="900" fill="url(#accent)" letter-spacing="-2">네이버 · 구글 · 모바일</text>
  <text x="80" y="430" font-family="Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-size="26" font-weight="500" fill="#bfdbfe">제목 600px · 설명 160자 실시간 한계 감지</text>
  <text x="80" y="475" font-family="Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-size="22" font-weight="500" fill="#86efac">네이버 38자 / 80자 컷 · 모바일 32자 컷</text>
  <text x="1120" y="580" text-anchor="end" font-family="Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" font-size="22" font-weight="500" fill="#93c5fd">serp.bal.pe.kr</text>
</svg>`;

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <circle cx="26" cy="26" r="12" fill="none" stroke="white" stroke-width="4"/>
  <line x1="36" y1="36" x2="52" y2="52" stroke="white" stroke-width="5" stroke-linecap="round"/>
</svg>`;

ensureDir('public/og.png');
writeFileSync('public/favicon.svg', FAVICON_SVG);
console.log('✓ public/favicon.svg');
await sharp(Buffer.from(OG_SVG)).png().toFile('public/og.png');
console.log('✓ public/og.png');
await sharp(Buffer.from(FAVICON_SVG)).resize(512, 512).png().toFile('public/favicon.png');
console.log('✓ public/favicon.png');
