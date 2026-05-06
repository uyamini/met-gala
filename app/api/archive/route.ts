import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Search Wikimedia Commons for full-length outfit photos.
// Filter by aspect ratio: full-body red carpet photos are portrait (height > width).
async function searchWikimedia(query: string): Promise<string | null> {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrsearch', query);
  url.searchParams.set('gsrlimit', '15');
  url.searchParams.set('gsrnamespace', '6');
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|mime|size');
  url.searchParams.set('iiurlwidth', '800');
  url.searchParams.set('origin', '*');

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'MetGalaAI/1.0 (educational; contact via github)',
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  type Candidate = {
    url: string;
    ratio: number;
    area: number;
  };

  const candidates: Candidate[] = [];

  for (const key of Object.keys(pages)) {
    const page = pages[key];
    const info = page?.imageinfo?.[0];
    if (!info) continue;

    const mime: string = info.mime || '';
    if (!mime.startsWith('image/')) continue;
    if (mime.includes('svg')) continue;

    const origWidth = info.width || 0;
    const origHeight = info.height || 0;
    if (origWidth < 400 || origHeight < 400) continue;

    const ratio = origHeight / origWidth;
    const imageUrl = info.thumburl || info.url;

    candidates.push({ url: imageUrl, ratio, area: origWidth * origHeight });
  }

  if (candidates.length === 0) return null;

  // Strongly prefer portrait images (ratio > 1.2 = likely full body)
  candidates.sort((a, b) => {
    const aPortrait = a.ratio > 1.2 ? 1 : 0;
    const bPortrait = b.ratio > 1.2 ? 1 : 0;
    if (aPortrait !== bPortrait) return bPortrait - aPortrait;
    if (aPortrait && bPortrait) return b.ratio - a.ratio;
    return b.area - a.area;
  });

  return candidates[0].url;
}

export async function POST(req: NextRequest) {
  try {
    const { celebrity, year } = await req.json();
    if (!celebrity) {
      return NextResponse.json({ error: 'Celebrity required' }, { status: 400 });
    }

    // Queries optimized for full-length red carpet shots
    const queries = [
      `${celebrity} Met Gala ${year} red carpet full length`,
      `${celebrity} Met Gala ${year} gown`,
      `${celebrity} Met Gala ${year}`,
      `${celebrity} Met Gala red carpet`,
      `${celebrity} Met Gala`,
      `${celebrity} red carpet gown`,
      `${celebrity} red carpet`,
    ];

    for (const q of queries) {
      const imageUrl = await searchWikimedia(q);
      if (imageUrl) {
        return NextResponse.json({
          imageUrl,
          caption: `${celebrity}, Met Gala ${year} · Image via Wikimedia Commons`,
        });
      }
    }

    return NextResponse.json({
      imageUrl: null,
      caption: `${celebrity}, Met Gala ${year}`,
    });
  } catch (err: any) {
    console.error('Archive error:', err);
    return NextResponse.json(
      { error: err?.message || 'Archive lookup failed' },
      { status: 500 },
    );
  }
}
