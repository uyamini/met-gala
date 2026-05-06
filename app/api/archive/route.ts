import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 45;

// Use Claude with web search to find a real, full-length Met Gala photo URL.
// This is far more reliable than Wikimedia which lacks paparazzi/red carpet archives.
async function findMetGalaImage(
  celebrity: string,
  year: string,
  apiKey: string,
): Promise<{ imageUrl: string | null; caption: string }> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 500,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 3,
      } as any,
    ],
    system: `You are a research assistant finding direct image URLs. 
You MUST search the web and return ONLY a JSON object — no prose, no markdown.
Schema: { "imageUrl": "https://...", "caption": "..." }
If no full-length image is found, return: { "imageUrl": null, "caption": "..." }`,
    messages: [
      {
        role: 'user',
        content: `Find a direct, publicly accessible full-length photo URL of ${celebrity} at the Met Gala ${year} showing their complete outfit from head to toe.

Search for: "${celebrity} Met Gala ${year} full length outfit"

Requirements:
- Must be a direct image URL ending in .jpg, .jpeg, or .png
- Must show the FULL outfit — head to toe, no cropping
- Prefer sources like vogue.com, harpersbazaar.com, popsugar.com, gettyimages.com, people.com
- The URL must be a direct image link, not a webpage

Return ONLY JSON: { "imageUrl": "https://...", "caption": "${celebrity}, Met Gala ${year}" }
If you cannot find a suitable full-length image URL, return: { "imageUrl": null, "caption": "${celebrity}, Met Gala ${year}" }`,
      },
    ],
  });

  // Extract the final text block
  let finalText = '';
  for (const block of response.content) {
    if (block.type === 'text') finalText = block.text;
  }

  try {
    const match = finalText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found');
    const parsed = JSON.parse(match[0]);
    return {
      imageUrl: parsed.imageUrl || null,
      caption: parsed.caption || `${celebrity}, Met Gala ${year}`,
    };
  } catch {
    return { imageUrl: null, caption: `${celebrity}, Met Gala ${year}` };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { celebrity, year } = await req.json();
    if (!celebrity) {
      return NextResponse.json({ error: 'Celebrity required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ imageUrl: null, caption: `${celebrity}, Met Gala ${year}` });
    }

    const result = await findMetGalaImage(celebrity, year, apiKey);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Archive error:', err);
    return NextResponse.json({ imageUrl: null, caption: 'Image unavailable' });
  }
}
