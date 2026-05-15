'use client';

import { useState } from 'react';
import type { Mode } from '@/app/page';

type Props = {
  onSubmit: (company: string, mode: Mode) => void;
};

export default function LandingHero({ onSubmit }: Props) {
  const [company, setCompany] = useState('');
  const [mode, setMode] = useState<Mode>('generate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = company.trim();
    if (trimmed.length > 0) onSubmit(trimmed, mode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top masthead */}
      <header className="border-b border-ink/80 px-6 md:px-12 py-4 flex items-center justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest">
        <span>Vol. 01 — Met Gala Edition</span>
        <span className="hidden md:inline">AI Fashion Stylist</span>
        <span>Issue No. 001 / 2026</span>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center px-6 md:px-12 py-12 md:py-20 relative">
        {/* Plate number */}
        <div className="absolute top-8 right-6 md:right-12 font-mono text-[10px] tracking-widest text-ink/50 plate-num">
          PLATE I
        </div>

        <div className="max-w-6xl mx-auto w-full">
          {/* Eyebrow */}
          <p className="font-mono text-[11px] md:text-xs uppercase tracking-widest text-oxblood mb-6 md:mb-8 reveal" style={{ animationDelay: '0.1s' }}>
            ⎯⎯⎯⎯ &nbsp; AI Fashion Stylist &nbsp; ⎯⎯⎯⎯
          </p>

          {/* Display title */}
          <h1
            className="font-display text-[14vw] md:text-[10vw] lg:text-[140px] leading-[0.85] tracking-tight mb-6 md:mb-10 reveal"
            style={{ animationDelay: '0.2s' }}
          >
            Met Gala
            <br />
            <span className="italic font-body font-light">AI</span>
          </h1>

          {/* Subhead */}
          <div className="grid md:grid-cols-12 gap-6 md:gap-12 mb-12 md:mb-16">
            <p
              className="md:col-span-7 text-lg md:text-2xl font-body leading-snug reveal"
              style={{ animationDelay: '0.35s' }}
            >
              An AI stylist that studies a company&rsquo;s philosophy, product
              language, and reputation — then designs the look it would
              wear to the Met Gala.
            </p>
            <div
              className="md:col-span-4 md:col-start-9 font-mono text-[11px] uppercase tracking-widest space-y-2 self-end reveal"
              style={{ animationDelay: '0.5s' }}
            >
              <p className="flex justify-between border-b hairline pb-2">
                <span>Subject</span>
                <span>Tech / Brand</span>
              </p>
              <p className="flex justify-between border-b hairline pb-2">
                <span>Method</span>
                <span>Live Research</span>
              </p>
              <p className="flex justify-between border-b hairline pb-2">
                <span>Output</span>
                <span>Couture</span>
              </p>
              <p className="flex justify-between">
                <span>Tone</span>
                <span>Editorial</span>
              </p>
            </div>
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="reveal"
            style={{ animationDelay: '0.65s' }}
          >
            <div className="border-y border-ink/80 py-6 md:py-8">
              <label
                htmlFor="company"
                className="block font-mono text-[10px] md:text-xs uppercase tracking-widest text-ink/60 mb-3"
              >
                Enter the subject of analysis
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Notion, Duolingo…"
                className="w-full bg-transparent font-display text-3xl md:text-5xl outline-none placeholder:text-ink/25 border-none focus:ring-0"
                autoFocus
                maxLength={60}
              />
            </div>

            {/* Mode selector */}
            <div className="mt-8 mb-8">
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-ink/60 mb-4">
                Select rendering method
              </p>
              <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={() => setMode('archive')}
                  className={`text-left p-5 md:p-6 border transition-all ${
                    mode === 'archive'
                      ? 'border-ink bg-ink text-bone'
                      : 'border-ink/30 hover:border-ink'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                      Method A
                    </span>
                    <span className="font-mono text-[10px] tracking-widest">
                      ARCHIVE
                    </span>
                  </div>
                  <p className="font-display text-2xl md:text-3xl mb-1">
                    From the Archive
                  </p>
                  <p className="text-sm opacity-80 font-body">
                    Match the company&rsquo;s ethos to a real Met Gala look from the
                    historical record.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('generate')}
                  className={`text-left p-5 md:p-6 border transition-all ${
                    mode === 'generate'
                      ? 'border-ink bg-ink text-bone'
                      : 'border-ink/30 hover:border-ink'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                      Method B
                    </span>
                    <span className="font-mono text-[10px] tracking-widest">
                      COUTURE
                    </span>
                  </div>
                  <p className="font-display text-2xl md:text-3xl mb-1">
                    Original Couture
                  </p>
                  <p className="text-sm opacity-80 font-body">
                    Generate a new look entirely. The algorithm dresses the
                    subject from scratch.
                  </p>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!company.trim()}
              className="btn-editorial relative inline-flex items-center gap-3 border border-ink px-8 md:px-10 py-4 font-mono text-xs md:text-sm uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Begin Analysis</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/80 px-6 md:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-xs font-mono uppercase tracking-widest">
        <span>by Yamini</span>
        <span className="italic">
          Fashion is the most powerful art there is.
        </span>
        <span>Met Gala AI</span>
      </footer>
    </div>
  );
}
