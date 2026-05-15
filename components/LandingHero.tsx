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
    <div className="min-h-screen flex flex-col bg-void text-bone">
      <header className="border-b border-bone/10 px-6 md:px-12 py-4 flex items-center justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest text-bone/30">
        <span>Vol. 01 — Met Gala Edition</span>
        <span className="hidden md:inline">An AI Cultural Critic</span>
        <span>Issue No. 001 / 2026</span>
      </header>

      <section className="flex-1 flex flex-col justify-center px-6 md:px-12 py-12 md:py-20 relative">
        <div className="absolute top-8 right-6 md:right-12 font-mono text-[10px] tracking-widest text-bone/15 plate-num">PLATE I</div>

        <div className="max-w-6xl mx-auto w-full">
          <p className="font-mono text-[11px] md:text-xs uppercase tracking-widest text-gold mb-6 md:mb-8 reveal" style={{ animationDelay: '0.1s' }}>
            ⎯⎯⎯⎯ &nbsp; AI Cultural Stylist &nbsp; ⎯⎯⎯⎯
          </p>

          <h1 className="font-display text-[14vw] md:text-[10vw] lg:text-[140px] leading-[0.85] tracking-tight mb-6 md:mb-10 reveal" style={{ animationDelay: '0.2s' }}>
            Met Gala
            <br />
            <span className="italic font-body font-light text-bone/50">AI</span>
          </h1>

          <div className="grid md:grid-cols-12 gap-6 md:gap-12 mb-12 md:mb-16">
            <p className="md:col-span-7 text-lg md:text-2xl font-body leading-snug text-bone/60 reveal" style={{ animationDelay: '0.35s' }}>
              An AI cultural critic that studies a company&rsquo;s philosophy, product language, and current reputation — then designs the look it would wear to the Met Gala.
            </p>
            <div className="md:col-span-4 md:col-start-9 font-mono text-[11px] uppercase tracking-widest space-y-2 self-end reveal" style={{ animationDelay: '0.5s' }}>
              {[['Subject', 'Tech / Brand'], ['Method', 'Live Research'], ['Output', 'Couture'], ['Tone', 'Editorial']].map(([k, v]) => (
                <p key={k} className="flex justify-between border-b border-bone/10 pb-2">
                  <span className="text-bone/30">{k}</span>
                  <span className="text-bone/60">{v}</span>
                </p>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="reveal" style={{ animationDelay: '0.65s' }}>
            <div className="border-y border-bone/10 py-6 md:py-8">
              <label htmlFor="company" className="block font-mono text-[10px] md:text-xs uppercase tracking-widest text-bone/25 mb-3">
                Enter the subject of analysis
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, OpenAI, Notion, Duolingo…"
                className="w-full bg-transparent font-display text-3xl md:text-5xl outline-none placeholder:text-bone/10 border-none focus:ring-0 text-bone"
                autoFocus
                maxLength={60}
              />
            </div>

            <div className="mt-8 mb-8">
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-bone/25 mb-4">Select rendering method</p>
              <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                {[
                  { id: 'archive' as Mode, label: 'Method A', tag: 'ARCHIVE', title: 'From the Archive', desc: "Match the company's ethos to a real Met Gala look from the historical record." },
                  { id: 'generate' as Mode, label: 'Method B', tag: 'COUTURE', title: 'Original Couture', desc: 'Generate a new look entirely. The algorithm dresses the subject from scratch.' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMode(opt.id)}
                    className={`text-left p-5 md:p-6 border transition-all duration-200 ${
                      mode === opt.id
                        ? 'border-gold/60 bg-gold/5'
                        : 'border-bone/10 hover:border-bone/20'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-bone/25">{opt.label}</span>
                      <span className={`font-mono text-[10px] tracking-widest ${mode === opt.id ? 'text-gold' : 'text-bone/30'}`}>{opt.tag}</span>
                    </div>
                    <p className={`font-display text-2xl md:text-3xl mb-1 ${mode === opt.id ? 'text-bone' : 'text-bone/50'}`}>{opt.title}</p>
                    <p className={`text-sm font-body ${mode === opt.id ? 'text-bone/60' : 'text-bone/30'}`}>{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!company.trim()}
              className="btn-editorial relative inline-flex items-center gap-3 border border-bone/20 px-8 md:px-10 py-4 font-mono text-xs md:text-sm uppercase tracking-widest text-bone disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <span>Begin Analysis</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-bone/10 px-6 md:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-xs font-mono uppercase tracking-widest text-bone/20">
        <span>by Yamini</span>
        <span className="italic normal-case text-bone/30">Fashion is the most powerful art there is.</span>
        <span>Met Gala AI</span>
      </footer>
    </div>
  );
}
