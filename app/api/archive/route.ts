import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Wikimedia Commons free image search.
// We search for the celebrity + "Met Gala" and return the first usable photo.
async function searchWikimedia(query: string): Promise<string | null> {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrsearch', query);
  url.searchParams.set('gsrlimit', '8');
  url.searchParams.set('gsrnamespace', '6'); // file namespace
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|mime|size');
  url.searchParams.set('iiurlwidth', '900');
  url.searchParams.set('origin', '*');

  const res = await fetch(url.toString(), {
    headers: {
      // Wikimedia requires a descriptive UA
      'User-Agent': 'TheAlgorithmWorePrada/1.0 (educational; contact via github)',
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  // Pick the first image that's a real photo (jpg/png) and decently sized
  for (const key of Object.keys(pages)) {
    const page = pages[key];
    const info = page?.imageinfo?.[0];
    if (!info) continue;
    const mime: string = info.mime || '';
    if (!mime.startsWith('image/')) continue;
    if (mime.includes('svg')) continue;
    const width = info.thumbwidth || info.width || 0;
    if (width < 400) continue;
    // Prefer the thumbnail (smaller payload) or fall back to original
    return info.thumburl || info.url;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { celebrity, year } = await req.json();
    if (!celebrity) {
      return NextResponse.json({ error: 'Celebrity required' }, { status: 400 });
    }

    // Try increasingly broad queries
    const queries = [
      `${celebrity} Met Gala ${year}`,
      `${celebrity} Met Gala`,
      `${celebrity} ${year}`,
      `${celebrity}`,
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

    // No image found — that's ok, the UI handles it
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
