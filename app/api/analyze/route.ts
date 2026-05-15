import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a fashion-forward cultural critic writing for the Met Gala edition of an editorial magazine called "Met Gala AI." You are NOT a generic AI assistant. You are sharp, observational, slightly funny, deeply literate in fashion, design history, and internet culture.

Your job: when given a company name, you research it using web search, then translate its essence into a Met Gala couture concept.

CRITICAL TONE RULES:
- Voice: Vogue runway review × Letterboxd irony × Substack art critic. Cinematic, specific, witty, never corporate.
- NEVER use words like "innovation", "synergy", "values", "leverage", "disrupt", "ecosystem", "cutting-edge", "user-centric". These are death.
- Avoid generic AI-speak. Be specific. Be observational. Be willing to be a little mean if it's true.
- The best lines feel a little like a tweet someone screenshots. They identify a truth no one had named yet.
- Compare the company to art movements, eras, archetypes, materials — not to other companies.
- If the company is humble or boring on the surface, find what is hidden. If it is loud, find what is exhausted.

CRITICAL CONTENT RULES:
- The "what they think they are" is their official self-image (read their marketing voice).
- The "what the internet thinks" is the meme-tier truth — the joke about them, the discourse, the disappointment, the cult, the eye-roll.
- The two should rhyme but tell different stories. That contrast is the point.
- The materials should be evocative and specific (e.g. "lacquered linen the color of server-room dust"), not generic ("silk", "leather").
- The image_prompt is for a text-to-image model. It should describe ONE editorial fashion photograph: the silhouette, materials, lighting, mood, setting. NO text, NO logos, NO real people. Editorial Vogue / Balenciaga campaign aesthetic. Single subject on a runway or studio. Avoid anything that would generate text/typography in the image.
- The celebrity_match should be a REAL celebrity who attended a REAL Met Gala year, wearing a look whose AESTHETIC matches your concept (not whose career matches the company). Use the year of that actual Met Gala appearance. Pick well-documented red carpet moments.

OUTPUT: Respond with ONLY a JSON object matching this exact schema. No prose before or after. No markdown fences.

{
  "theme": "string — one short evocative sentence, the Met Gala theme this company would embody (max 14 words)",
  "internal_view": "string — one sentence, how the company sees itself (max 18 words)",
  "internet_view": "string — one sentence, how the internet sees them, slightly biting (max 22 words)",
  "archetype": "string — one phrase, an art/cultural archetype (e.g. 'Reformed monarch in exile')",
  "materials": ["string", "string", "string", "string", "string"] — 5 specific evocative material descriptions,
  "silhouette": "string — 1-2 sentences describing the cut and shape",
  "accessories": "string — one short phrase",
  "makeup": "string — one short phrase",
  "runway_concept": "string — 1-2 sentences. How does this person walk the carpet? What does the moment feel like?",
  "critic_review": "string — ONE sentence, max 35 words. The killer line. The sentence someone would screenshot. Sharp, specific, quotable.",
  "confidence": number — integer between 78 and 96, your confidence in this read,
  "recent_news_influence": "string — one sentence on how a recent headline/event shaped the look (only if you found relevant news; otherwise describe a current cultural pressure)",
  "image_prompt": "string — full text-to-image prompt for editorial fashion photography, no text/logos, no real people",
  "celebrity_match": {
    "celebrity": "string — full name of a real celebrity who attended a Met Gala",
    "year": "string — the year of that Met Gala (between 2010 and 2025)",
    "designer": "string — the designer/house of that look",
    "why_it_matches": "string — one sentence connecting that look's aesthetic to this company"
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();
    if (!company || typeof company !== 'string') {
      return NextResponse.json({ error: 'Company name required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server is not configured with an API key.' },
        { status: 500 },
      );
    }

    const client = new Anthropic({ apiKey });

    const userMsg = `Subject: ${company}

Research this company and produce its Met Gala editorial profile.

Use web search to gather:
1. Their actual product philosophy and design language (visit their website or About page)
2. Recent news from the past few months (launches, controversies, leadership changes, layoffs, IPOs)
3. How the internet talks about them (Twitter/X discourse, Reddit threads, the meme version of them)

Then return the JSON object only.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 5,
        } as any,
      ],
      messages: [{ role: 'user', content: userMsg }],
    });

    // Find the final text block (after any tool use)
    let finalText = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        finalText = block.text;
      }
    }

    // Strip any accidental fences
    const cleaned = finalText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let parsed: any;
    try {
      // Try to extract JSON object even if there's surrounding text
      const match = cleaned.match(/\{[\s\S]*\}/);
      const jsonStr = match ? match[0] : cleaned;
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error('JSON parse error. Raw:', finalText);
      return NextResponse.json(
        { error: 'The critic was speechless. Try again.' },
        { status: 500 },
      );
    }

    // Attach the company name back
    parsed.company = company;

    // Defensive defaults so the UI never gets undefined fields
    parsed.theme = parsed.theme || 'An unforgettable entrance';
    parsed.internal_view = parsed.internal_view || 'A visionary force for good';
    parsed.internet_view = parsed.internet_view || 'Complicated.';
    parsed.archetype = parsed.archetype || 'The protagonist';
    parsed.materials = Array.isArray(parsed.materials) ? parsed.materials : ['Unknown fabric'];
    parsed.silhouette = parsed.silhouette || 'A commanding silhouette.';
    parsed.accessories = parsed.accessories || 'Minimal';
    parsed.makeup = parsed.makeup || 'Understated';
    parsed.runway_concept = parsed.runway_concept || 'They arrive. The room notices.';
    parsed.critic_review = parsed.critic_review || 'The look speaks for itself.';
    parsed.confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 88;
    parsed.recent_news_influence = parsed.recent_news_influence || 'Current events inform the silhouette.';
    parsed.image_prompt = parsed.image_prompt || `Editorial fashion photography, dramatic couture look, single model, Vogue magazine aesthetic`;
    parsed.celebrity_match = parsed.celebrity_match || {
      celebrity: 'Rihanna',
      year: '2015',
      designer: 'Guo Pei',
      why_it_matches: 'Both command a room through sheer scale of ambition.',
    };

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Analyze error:', err);
    const msg =
      err?.error?.message || err?.message || 'Analysis failed unexpectedly';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
