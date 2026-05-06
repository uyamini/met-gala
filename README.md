# Met Gala AI

> An AI cultural critic that studies any company — its product philosophy, internet reputation, and current news — then designs the look it would wear to the **Met Gala**.

Built by [Yamini](https://github.com/uyamini) · Powered by Claude

---

## What it does

You enter a company name. That's it.

The algorithm:

1. **Researches** the company live (product language, recent headlines, internet discourse)
2. **Translates** it into a fashion concept — theme, materials, silhouette, runway moment
3. **Surfaces the duality**: what the company thinks it is vs. what the internet thinks
4. **Renders the look** in one of two ways:
   - **Archive Mode** — matches the ethos to a real Met Gala look from the historical record
   - **Couture Mode** — generates an original editorial image of the look

The result is an editorial spread you can screenshot and post.

---

## Run it locally

```bash
git clone https://github.com/uyamini/met-gala.git
cd met-gala
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY (and optionally HUGGINGFACE_API_KEY)
npm run dev
```

Visit `http://localhost:3000`.

### API keys

- **`ANTHROPIC_API_KEY`** — required. Get one at [console.anthropic.com](https://console.anthropic.com).
- **`HUGGINGFACE_API_KEY`** — optional. Only needed for **Couture Mode** (image generation). Get one free at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens). Without it, Archive Mode still works perfectly.

---

## Deploy

Push to GitHub, then [import to Vercel](https://vercel.com/new). Add the env vars in the Vercel dashboard. That's it. Free tier handles this easily.

---

## Stack

- **Next.js 14** (App Router)
- **Anthropic Claude** (Sonnet 4.5) with built-in web search
- **Hugging Face Inference Providers** — FLUX.1-schnell for couture generation
- **Wikimedia Commons** — for archive-mode photo lookup (free, properly licensed)
- **Tailwind CSS** + custom editorial typography (Italiana, Fraunces, JetBrains Mono)

---

## Aesthetic notes

This is not a "tech demo" or an "AI image generator." It's an editorial.

The voice is intentional: Vogue runway review × Letterboxd irony × Substack art critic. Specific, observational, occasionally sharp. Words like "innovation," "synergy," and "leverage" are explicitly forbidden in the system prompt.

The visual design is bone-and-ink — printed magazine, not glowing dashboard. Italiana display type for the headlines, Fraunces for the body, JetBrains Mono for the system metadata. One accent: oxblood.

---

## License

MIT. Take it and remix it.
