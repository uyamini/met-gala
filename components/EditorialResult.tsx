'use client';

import { useEffect, useState } from 'react';
import type { CompanyAnalysis, Mode } from '@/app/page';

type Props = {
  company: string;
  mode: Mode;
  analysis: CompanyAnalysis;
  imageUrl: string | null;
  imageCaption: string | null;
  onReset: () => void;
  onRetry: () => void;
};

export default function EditorialResult({ company, mode, analysis, imageUrl, imageCaption, onReset, onRetry }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `${company} at the Met Gala — analyzed by Met Gala AI.\n\n"${analysis.theme}"\n\nBuilt by Yamini.`;
    if (navigator.share) {
      try { await navigator.share({ title: `${company} at the Met Gala`, text, url }); return; } catch {}
    }
    await navigator.clipboard.writeText(`${text}\n\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 bg-void text-bone">
      {/* Masthead */}
      <header className="border-b border-bone/10 px-6 md:px-12 py-4 flex items-center justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest sticky top-0 bg-void z-40">
        <button onClick={onReset} className="text-bone/30 hover:text-gold transition-colors">← New Subject</button>
        <span className="hidden md:inline text-bone/20">Editorial No. {Math.floor(Math.random() * 900 + 100)}</span>
        <button onClick={handleShare} className="text-bone/30 hover:text-gold transition-colors">
          {copied ? '✓ Copied' : 'Share →'}
        </button>
      </header>

      {/* Issue header */}
      <div className="px-6 md:px-12 pt-10 md:pt-16 pb-6 max-w-7xl mx-auto">
        <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-gold mb-4 reveal" style={{ animationDelay: '0.1s' }}>
          ⎯⎯⎯⎯ &nbsp; The Met Gala Profile &nbsp; ⎯⎯⎯⎯
        </p>
        <h1 className="font-display text-[14vw] md:text-[12vw] lg:text-[11rem] leading-[0.85] mb-6 reveal text-bone" style={{ animationDelay: '0.2s' }}>
          {company}
        </h1>
        <p className="text-2xl md:text-4xl font-body italic font-light max-w-4xl text-bone/50 reveal" style={{ animationDelay: '0.35s' }}>
          &ldquo;{analysis.theme}&rdquo;
        </p>
      </div>

      {/* Main spread */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 md:gap-12 mt-12">
        {/* Image column */}
        <div className="lg:col-span-7 reveal" style={{ animationDelay: '0.5s' }}>
          <div className="relative aspect-[4/5] bg-dim border border-bone/10 overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={`${company} Met Gala interpretation`} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs text-bone/20 uppercase tracking-widest p-8 text-center gap-4">
                <span className="text-4xl text-bone/10">◇</span>
                <span>Image unavailable<br />The text speaks for itself.</span>
              </div>
            )}
            <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest bg-void/80 px-2 py-1 plate-num text-bone/40">PLATE II</div>
            <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest bg-void/80 px-2 py-1 uppercase text-bone/40">
              {mode === 'archive' ? 'Archive' : 'Couture'}
            </div>
          </div>
          {imageCaption && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-bone/25">{imageCaption}</p>
          )}

          {mode === 'archive' && (
            <div className="mt-8 border-t border-bone/10 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-bone/25 mb-2">Reference look</p>
              <p className="font-display text-2xl mb-1 text-bone">{analysis.celebrity_match.celebrity}</p>
              <p className="font-body text-sm text-bone/40 mb-3">Met Gala {analysis.celebrity_match.year} · {analysis.celebrity_match.designer}</p>
              <p className="font-body text-base italic text-bone/60">{analysis.celebrity_match.why_it_matches}</p>
            </div>
          )}
        </div>

        {/* Text column */}
        <div className="lg:col-span-5 space-y-10 reveal" style={{ animationDelay: '0.65s' }}>
          {/* Dual identity */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-4">The Two Selves</p>
            <div className="space-y-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-bone/25 mb-1">What they think they are</p>
                <p className="font-body text-lg leading-snug text-bone/80">{analysis.internal_view}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-bone/25 mb-1">What the internet thinks</p>
                <p className="font-body text-lg leading-snug italic text-bone/60">{analysis.internet_view}</p>
              </div>
            </div>
          </section>

          {/* Materials */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-4">Materials</p>
            <ul className="font-mono text-xs space-y-2">
              {analysis.materials.map((m, idx) => (
                <li key={idx} className="flex gap-3 border-b border-bone/10 pb-2">
                  <span className="text-bone/20 plate-num">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="uppercase tracking-wider text-bone/60">{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Confidence */}
          <section>
            <div className="flex items-baseline justify-between mb-2 font-mono text-[10px] uppercase tracking-widest">
              <span className="text-bone/25">Cultural confidence</span>
              <span className="text-gold font-display text-3xl">{analysis.confidence}%</span>
            </div>
            <div className="h-px bg-bone/10 relative">
              <div className="absolute inset-y-0 left-0 bg-gold fill-bar" style={{ width: `${analysis.confidence}%` }} />
            </div>
          </section>
        </div>
      </div>

      {/* Critic review */}
      <div className="px-6 md:px-12 max-w-4xl mx-auto mt-20 md:mt-28 reveal" style={{ animationDelay: '0.8s' }}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-6 text-center">
          ⎯⎯⎯⎯ &nbsp; The Critic Speaks &nbsp; ⎯⎯⎯⎯
        </p>
        <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight text-center text-bone">
          <span className="text-gold">&ldquo;</span>
          {analysis.critic_review}
          <span className="text-gold">&rdquo;</span>
        </blockquote>
      </div>

      {/* Detail grid */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mt-20 md:mt-28 grid md:grid-cols-3 gap-10 md:gap-12 reveal" style={{ animationDelay: '0.95s' }}>
        {[
          { label: 'Silhouette', text: analysis.silhouette },
          { label: 'Accessories & Beauty', text: `${analysis.accessories} · ${analysis.makeup}` },
          { label: 'Recent News, Translated', text: analysis.recent_news_influence },
        ].map(({ label, text }) => (
          <div key={label} className="border-t border-bone/10 pt-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-3">{label}</p>
            <p className="font-body text-base leading-snug text-bone/60">{text}</p>
          </div>
        ))}
      </div>

      {/* Runway concept */}
      <div className="px-6 md:px-12 max-w-4xl mx-auto mt-20 md:mt-24 reveal" style={{ animationDelay: '1.1s' }}>
        <div className="border border-bone/10 p-8 md:p-10 bg-dim">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-3">Runway Concept</p>
          <p className="font-display text-2xl md:text-3xl leading-snug text-bone">{analysis.runway_concept}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 md:px-12 max-w-4xl mx-auto mt-20 text-center reveal" style={{ animationDelay: '1.25s' }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onRetry} className="btn-editorial border border-gold/30 text-gold/70 px-8 md:px-10 py-4 font-mono text-xs md:text-sm uppercase tracking-widest hover:text-void">
            Try Again ↻
          </button>
          <button onClick={onReset} className="btn-editorial border border-bone/15 text-bone/40 px-8 md:px-10 py-4 font-mono text-xs md:text-sm uppercase tracking-widest hover:text-void">
            New Company →
          </button>
        </div>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-widest text-bone/15">
          Met Gala AI · Built by Yamini · Powered by Claude
        </p>
      </div>
    </div>
  );
}
