export interface SerpInput {
  url: string;
  title: string;
  description: string;
  date?: string;
}

export const LIMITS = {
  google: { titlePx: 600, descriptionChars: 160 },
  googleMobile: { titlePx: 920, descriptionChars: 120 }, // ~2 lines, wider in px due to font size diff
  naver: { titleChars: 38, descriptionChars: 80 },
  mobile: { titleChars: 32, descriptionChars: 120 },
};

let _canvas: HTMLCanvasElement | null = null;
let _ctx: CanvasRenderingContext2D | null = null;

/** Canvas-based pixel measurement using Arial 20px (matches Google title font approx) */
export function charWidthPx(s: string, fontSize = 20): number {
  if (typeof document !== 'undefined') {
    if (!_canvas) _canvas = document.createElement('canvas');
    if (!_ctx) _ctx = _canvas.getContext('2d');
    if (_ctx) {
      _ctx.font = `${fontSize}px Arial, sans-serif`;
      return Math.round(_ctx.measureText(s).width);
    }
  }
  // Fallback for SSR / canvas unavailable
  let w = 0;
  for (const c of s) {
    const cp = c.codePointAt(0) ?? 0;
    // CJK Unified Ideographs, Hangul Syllables, Hiragana, Katakana, etc.
    if (
      (cp >= 0xac00 && cp <= 0xd7af) || // Hangul
      (cp >= 0x4e00 && cp <= 0x9fff) || // CJK
      (cp >= 0x3040 && cp <= 0x30ff)    // Hiragana/Katakana
    ) {
      w += 14;
    } else if (/[A-Z]/.test(c)) {
      w += 10;
    } else if (/[a-z0-9]/.test(c)) {
      w += 8;
    } else {
      w += 6;
    }
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
