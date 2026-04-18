export interface SerpInput {
  url: string;
  title: string;
  description: string;
  date?: string;
}

export const LIMITS = {
  google: { titlePx: 600, descriptionChars: 160 },
  naver: { titleChars: 38, descriptionChars: 80 },
  mobile: { titleChars: 32, descriptionChars: 120 },
};

export function charWidthPx(s: string): number {
  let w = 0;
  for (const c of s) {
    if (/[\uac00-\ud7af]/.test(c)) w += 14;
    else if (/[A-Z]/.test(c)) w += 10;
    else if (/[a-z0-9]/.test(c)) w += 8;
    else w += 6;
  }
  return w;
}

export function truncateByChar(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + '…';
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function breadcrumb(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname.replace(/\/$/, '').replace(/\//g, ' › ')}`;
  } catch {
    return url;
  }
}
