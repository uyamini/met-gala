import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Hugging Face Inference Providers — free monthly credits.
// We use FLUX.1-schnell which is fast (~4 steps) and editorial-quality.
// Falls back to SDXL if FLUX is unavailable.
const MODELS = [
  'black-forest-labs/FLUX.1-schnell',
  'stabilityai/stable-diffusion-xl-base-1.0',
];

async function generateWithHF(prompt: string, hfToken: string): Promise<string | null> {
  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_inference_steps: model.includes('schnell') ? 4 : 30,
              guidance_scale: model.includes('schnell') ? 0 : 7,
            },
          }),
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.warn(`HF ${model} failed: ${res.status} ${text.slice(0, 200)}`);
        continue;
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        const body = await res.text().catch(() => '');
        console.warn(`HF ${model} returned non-image: ${body.slice(0, 200)}`);
        continue;
      }

      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return `data:${contentType};base64,${base64}`;
    } catch (e: any) {
      console.warn(`HF ${model} threw:`, e?.message);
      continue;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    const hfToken = process.env.HUGGINGFACE_API_KEY;
    if (!hfToken) {
      // Graceful degradation — return null so the UI shows a tasteful empty state
      console.warn('HUGGINGFACE_API_KEY not set');
      return NextResponse.json({ imageUrl: null });
    }

    // Beef up the prompt with editorial fashion direction
    const fullPrompt = `Editorial fashion photography, Vogue magazine style, single model on a runway, dramatic studio lighting, cinematic composition, high fashion couture, no text, no logos, no writing, no words, photorealistic, 35mm film grain. ${prompt}`;

    const imageUrl = await generateWithHF(fullPrompt, hfToken);

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error('Generate error:', err);
    return NextResponse.json(
      { error: err?.message || 'Generation failed' },
      { status: 500 },
    );
  }
}
