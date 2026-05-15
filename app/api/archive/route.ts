import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 20;

// Archive mode: instead of hunting for hotlink-protected CDN images,
// we return a Google Images search URL for the look + a generation prompt
// so the UI can show a search link AND trigger image generation styled after the reference.
export async function POST(req: NextRequest) {
  try {
    const { celebrity, year, designer, image_prompt } = await req.json();
    if (!celebrity) {
      return NextResponse.json({ error: 'Celebrity required' }, { status: 400 });
    }

    const searchQuery = encodeURIComponent(`${celebrity} Met Gala ${year} ${designer || ''} full length outfit`);
    const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${searchQuery}`;

    // The generation prompt is styled after the reference look
    const styledPrompt = image_prompt
      ? `${image_prompt} — styled in the aesthetic of ${celebrity}'s Met Gala ${year} look by ${designer || 'a luxury house'}, editorial fashion photography, full length, Vogue magazine, dramatic lighting, no text, no logos`
      : `Editorial fashion photography inspired by ${celebrity}'s Met Gala ${year} look by ${designer || 'a luxury house'}, full length couture gown, dramatic lighting, single model on red carpet, Vogue aesthetic, no text, no logos`;

    return NextResponse.json({
      imageUrl: null,
      caption: `${celebrity}, Met Gala ${year}${designer ? ` · ${designer}` : ''}`,
      googleImagesUrl,
      styledPrompt,
    });
  } catch (err: any) {
    console.error('Archive error:', err);
    return NextResponse.json({ imageUrl: null, caption: 'Reference unavailable' });
  }
}
