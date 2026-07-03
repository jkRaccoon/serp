#!/usr/bin/env node
/**
 * dist/ 로 빌드된 SPA 를 puppeteer 로 렌더해 각 route 의 HTML 을 정적 파일로 저장.
 * 언어별 경로(ko: /, en: /en/*)를 모두 순회.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const DIST = 'dist';
const PORT = 4173 + Math.floor((process.pid % 1000)); // 병렬 빌드 포트 충돌 회피
const SUBDIR = process.env.BUILD_TARGET === 'subdir';
const BASE = SUBDIR ? '/tools/serp/' : '/';

const BASE_ROUTES = [
  '/',
  '/guide',
  '/faq',
];

const LANGS = ['ko', 'en'];

const ROUTES = LANGS.flatMap((lang) =>
  BASE_ROUTES.map((r) =>
    lang === 'ko' ? r : r === '/' ? '/en' : `/en${r}`,
  ),
);

async function startServer() {
  return preview({ preview: { port: PORT }, base: BASE });
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30000);
  // AdSense/광고·analytics 요청 차단 — prerender 시 동적 주입을 dist HTML에 굳히지 않음
  // show_ads_impl.js?bust=... 등 stale URL 404 + 페이지 로딩 지연 방지
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    if (u.includes('googlesyndication.com') || u.includes('googleads.g.doubleclick.net') || u.includes('google-analytics.com') || u.includes('googletagmanager.com') || u.includes('doubleclick.net') || u.includes('ads-partners.coupang.com') || u.includes('coupang.com/g.js')) {
      req.abort();
    } else {
      req.continue();
    }
  });
  const routePath = route === '/' ? BASE : `${BASE}${route.slice(1)}`;
  await page.goto(`http://localhost:${PORT}${routePath}`, { waitUntil: 'networkidle0' });

  try {
    await page.waitForSelector('h1', { timeout: 5000 });
  } catch {
    console.warn(`! ${route}: h1 not found within 5s (continuing)`);
  }

  await page.evaluate(() => {
    const keepLast = (sel) => {
      const n = document.querySelectorAll(sel);
      for (let i = 0; i < n.length - 1; i++) n[i].remove();
    };
    keepLast('title');
    keepLast('meta[name="description"]');
    keepLast('link[rel="canonical"]');
    keepLast('meta[property="og:url"]');
    keepLast('meta[property="og:title"]');
    keepLast('meta[property="og:description"]');
    keepLast('meta[property="og:image"]');
    keepLast('meta[name="twitter:title"]');
    keepLast('meta[name="twitter:description"]');
    keepLast('meta[name="twitter:image"]');
    keepLast('meta[name="robots"]');
    keepLast('meta[property="og:image:alt"]');
    keepLast('meta[name="twitter:image:alt"]');
      // AdSense prerender 잔재 정리 — 차단 누락 시에도 안전
    document.querySelectorAll('script[src*="show_ads_impl"], script[src*="googlesyndication.com/pagead/managed"]').forEach((n) => n.remove());
    document.querySelectorAll('ins.adsbygoogle[data-adsbygoogle-status]').forEach((n) => {
      n.removeAttribute('data-adsbygoogle-status');
      n.removeAttribute('data-ad-status');
      n.removeAttribute('data-ad-hi');
      n.removeAttribute('style');
      n.innerHTML = '';
    });
    document.querySelectorAll('iframe[id^="aswift_"], iframe#google_esf, iframe[src*="recaptcha/api2/aframe"]').forEach((n) => n.remove());
    // 쿠팡 파트너스 prerender 잔재 정리
    document.querySelectorAll('script[src*="ads-partners.coupang.com"], script[src*="coupang.com/g.js"]').forEach((n) => n.remove());
    document.querySelectorAll('aside[aria-label="advertisement"] iframe, iframe[src*="coupang.com"]').forEach((n) => n.remove());
  });
  const html = await page.content();
  await page.close();
  return html;
}

function outPathFor(route) {
  if (route === '/') return join(DIST, 'index.html');
  if (route === '/en') return join(DIST, 'en', 'index.html');
  return join(DIST, route.slice(1), 'index.html');
}

async function main() {
  console.log('→ start static server');
  const server = await startServer();

  console.log('→ launch puppeteer');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of ROUTES) {
      process.stdout.write(`  prerendering ${route} ... `);
      const html = await prerenderRoute(browser, route);
      const outPath = outPathFor(route);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html);
      console.log('✓');
    }
  } finally {
    await browser.close();
    server.httpServer.close();
  }
  console.log('✓ prerender done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
