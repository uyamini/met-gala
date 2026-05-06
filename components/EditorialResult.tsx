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
};

export default function EditorialResult({
  company,
  mode,
  analysis,
  imageUrl,
  imageCaption,
  onReset,
}: Props) {
  const [copied, setCopied] = useState(false);

  // Smooth scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const shareText = `${company} at the Met Gala — analyzed by Met Gala AI.\n\n"${analysis.theme}"\n\nBuilt by Yamini.`;

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${company} at the Met Gala`,
          text: shareText,
          url,
        });
        return;
      } catch {
        // fall through to copy
      }
    }
    await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Masthead */}
      <header className="border-b border-ink/80 px-6 md:px-12 py-4 flex items-center justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest sticky top-0 bg-bone z-40">
        <button onClick={onReset} className="hover:text-oxblood transition-colors">
          ← New Subject
        </button>
        <span className="hidden md:inline">Editorial No. {Math.floor(Math.random() * 900 + 100)}</span>
        <button
          onClick={handleShare}
          className="hover:text-oxblood transition-colors"
        >
          {copied ? '✓ Link Copied' : 'Share →'}
        </button>
      </header>

      {/* Issue header */}
      <div className="px-6 md:px-12 pt-10 md:pt-16 pb-6 max-w-7xl mx-auto">
        <p
          className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-oxblood mb-4 reveal"
          style={{ animationDelay: '0.1s' }}
        >
          ⎯⎯⎯⎯ &nbsp; The Met Gala Profile &nbsp; ⎯⎯⎯⎯
        </p>
        <h1
          className="font-display text-[14vw] md:text-[12vw] lg:text-[11rem] leading-[0.85] mb-6 reveal"
          style={{ animationDelay: '0.2s' }}
        >
          {company}
        </h1>
        <p
          className="text-2xl md:text-4xl font-body italic font-light max-w-4xl text-ink/80 reveal"
          style={{ animationDelay: '0.35s' }}
        >
          &ldquo;{analysis.theme}&rdquo;
        </p>
      </div>

      {/* Main spread */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 md:gap-12 mt-12">
        {/* Image column */}
        <div
          className="lg:col-span-7 reveal"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="relative aspect-[4/5] bg-ink/5 border hairline overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={`${company} Met Gala interpretation`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-xs text-ink/40 uppercase tracking-widest p-8 text-center">
                Image unavailable.<br />The text speaks for itself.
              </div>
            )}
            {/* Plate marker */}
            <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest bg-bone/90 px-2 py-1 plate-num">
              PLATE II
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest bg-bone/90 px-2 py-1 uppercase">
              {mode === 'archive' ? 'Archive' : 'Couture'}
            </div>
          </div>
          {imageCaption && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink/60">
              {imageCaption}
            </p>
          )}

          {mode === 'archive' && (
            <div className="mt-8 border-t border-ink/20 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink/60 mb-2">
                Reference look
              </p>
              <p className="font-display text-2xl mb-1">
                {analysis.celebrity_match.celebrity}
              </p>
              <p className="font-body text-sm text-ink/70 mb-3">
                Met Gala {analysis.celebrity_match.year} · {analysis.celebrity_match.designer}
              </p>
              <p className="font-body text-base italic text-ink/80">
                {analysis.celebrity_match.why_it_matches}
              </p>
            </div>
          )}
        </div>

        {/* Text column */}
        <div
          className="lg:col-span-5 space-y-10 reveal"
          style={{ animationDelay: '0.65s' }}
        >
          {/* Dual identity */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-widest text-oxblood mb-4">
              The Two Selves
            </p>
            <div className="space-y-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                  What they think they are
                </p>
                <p className="font-body text-lg leading-snug">
                  {analysis.internal_view}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-1">
                  What the internet thinks
                </p>
                <p className="font-body text-lg leading-snug italic">
                  {analysis.internet_view}
                </p>
              </div>
            </div>
          </section>

          {/* Materials */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-widest text-oxblood mb-4">
              Materials
            </p>
            <ul className="font-mono text-xs space-y-2">
              {analysis.materials.map((m, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 border-b hairline border-ink/10 pb-2"
                >
                  <span className="text-ink/40 plate-num">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="uppercase tracking-wider">{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Confidence */}
          <section>
            <div className="flex items-baseline justify-between mb-2 font-mono text-[10px] uppercase tracking-widest">
              <span className="text-ink/60">Cultural confidence</span>
              <span className="text-oxblood font-display text-3xl">
                {analysis.confidence}%
              </span>
            </div>
            <div className="h-px bg-ink/20 relative">
              <div
                className="absolute inset-y-0 left-0 bg-oxblood fill-bar"
                style={{ width: `${analysis.confidence}%` }}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Critic review - full width editorial */}
      <div
        className="px-6 md:px-12 max-w-4xl mx-auto mt-20 md:mt-28 reveal"
        style={{ animationDelay: '0.8s' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-oxblood mb-6 text-center">
          ⎯⎯⎯⎯ &nbsp; The Critic Speaks &nbsp; ⎯⎯⎯⎯
        </p>
        <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight text-center">
          <span className="text-oxblood">&ldquo;</span>
          {analysis.critic_review}
          <span className="text-oxblood">&rdquo;</span>
        </blockquote>
      </div>

      {/* Detail grid */}
      <div
        className="px-6 md:px-12 max-w-7xl mx-auto mt-20 md:mt-28 grid md:grid-cols-3 gap-10 md:gap-12 reveal"
        style={{ animationDelay: '0.95s' }}
      >
        <div className="border-t border-ink/30 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-oxblood mb-3">
            Silhouette
          </p>
          <p className="font-body text-base leading-snug">{analysis.silhouette}</p>
        </div>
        <div className="border-t border-ink/30 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-oxblood mb-3">
            Accessories &amp; Beauty
          </p>
          <p className="font-body text-base leading-snug">
            {analysis.accessories} &nbsp;·&nbsp; {analysis.makeup}
          </p>
        </div>
        <div className="border-t border-ink/30 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-oxblood mb-3">
            Recent News, Translated
          </p>
          <p className="font-body text-base leading-snug">
            {analysis.recent_news_influence}
          </p>
        </div>
      </div>

      {/* Runway concept */}
      <div
        className="px-6 md:px-12 max-w-4xl mx-auto mt-20 md:mt-24 reveal"
        style={{ animationDelay: '1.1s' }}
      >
        <div className="border border-ink/30 p-8 md:p-10 bg-ink text-bone">
          <p className="font-mono text-[10px] uppercase tracking-widest text-bone/60 mb-3">
            Runway Concept
          </p>
          <p className="font-display text-2xl md:text-3xl leading-snug">
            {analysis.runway_concept}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div
        className="px-6 md:px-12 max-w-4xl mx-auto mt-20 text-center reveal"
        style={{ animationDelay: '1.25s' }}
      >
        <button
          onClick={onReset}
          className="btn-editorial border border-ink px-8 md:px-10 py-4 font-mono text-xs md:text-sm uppercase tracking-widest"
        >
          Analyze Another →
        </button>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-widest text-ink/50">
          Met Gala AI · Built by Yamini · Powered by Claude
        </p>
      </div>
    </div>
  );
}
