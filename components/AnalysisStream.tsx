'use client';

import { useEffect, useRef, useState } from 'react';
import type { CompanyAnalysis, Mode } from '@/app/page';

type Props = {
  company: string;
  mode: Mode;
  onComplete: (analysis: CompanyAnalysis, imageUrl: string | null, imageCaption: string | null) => void;
  onError: () => void;
};

const STAGES = [
  { label: 'Researching company identity', duration: 2200 },
  { label: 'Cross-referencing recent headlines', duration: 1800 },
  { label: 'Decoding product philosophy', duration: 1600 },
  { label: 'Reading the internet', duration: 1700 },
  { label: 'Translating to material language', duration: 1900 },
  { label: 'Drafting the editorial', duration: 1500 },
];

export default function AnalysisStream({ company, mode, onComplete, onError }: Props) {
  const [stageIdx, setStageIdx] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (stageIdx >= STAGES.length) return;
    const t = setTimeout(() => setStageIdx((s) => s + 1), STAGES[stageIdx].duration);
    return () => clearTimeout(t);
  }, [stageIdx]);

  useEffect(() => {
    const target = Math.min(96, (stageIdx + 1) * 16);
    const interval = setInterval(() => {
      setConfidence((c) => (c >= target ? c : c + 1));
    }, 30);
    return () => clearInterval(interval);
  }, [stageIdx]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      try {
        const analysisRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company }),
        });

        if (!analysisRes.ok) {
          const data = await analysisRes.json().catch(() => ({}));
          throw new Error(data.error || 'Analysis failed');
        }

        const analysis: CompanyAnalysis = await analysisRes.json();

        let imageUrl: string | null = null;
        let imageCaption: string | null = null;

        if (mode === 'archive') {
          const archiveRes = await fetch('/api/archive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              celebrity: analysis.celebrity_match?.celebrity ?? 'Rihanna',
              year: analysis.celebrity_match?.year ?? '2015',
            }),
          });
          if (archiveRes.ok) {
            const data = await archiveRes.json();
            imageUrl = data.imageUrl ?? null;
            imageCaption = data.caption ?? null;
          }
        } else {
          const genRes = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: analysis.image_prompt }),
          });
          if (genRes.ok) {
            const data = await genRes.json();
            imageUrl = data.imageUrl ?? null;
            imageCaption = `Generated couture — ${analysis.silhouette}`;
          }
        }

        const minDuration = STAGES.reduce((a, b) => a + b.duration, 0);
        const elapsed = performance.now() - startTime;
        if (elapsed < minDuration) {
          await new Promise((r) => setTimeout(r, minDuration - elapsed));
        }

        onComplete(analysis, imageUrl, imageCaption);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Something went wrong');
        setTimeout(onError, 3500);
      }
    };

    const startTime = performance.now();
    run();
  }, [company, mode, onComplete, onError]);

  return (
    <div className="min-h-screen flex flex-col bg-void text-bone">
      <header className="border-b border-bone/10 px-6 md:px-12 py-4 flex items-center justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest text-bone/30">
        <span>Analysis in progress</span>
        <span className="text-gold">
          <span className="pulse-dot inline-block">●</span> LIVE
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-gold/20 scanline" />

        <div className="max-w-3xl w-full">
          <p className="font-mono text-[11px] uppercase tracking-widest text-bone/30 mb-4">Subject</p>
          <h2 className="font-display text-5xl md:text-7xl mb-12 leading-none text-bone">{company}</h2>

          <div className="mb-10">
            <div className="flex items-baseline justify-between mb-2 font-mono text-[10px] uppercase tracking-widest">
              <span className="text-bone/30">Confidence score</span>
              <span className="text-gold text-2xl font-display">{String(confidence).padStart(2, '0')}%</span>
            </div>
            <div className="h-px bg-bone/10 relative">
              <div className="absolute inset-y-0 left-0 bg-gold transition-all duration-300 ease-out" style={{ width: `${confidence}%` }} />
            </div>
          </div>

          <ol className="space-y-2 font-mono text-sm">
            {STAGES.map((stage, idx) => {
              const status = idx < stageIdx ? 'done' : idx === stageIdx ? 'active' : 'pending';
              return (
                <li key={stage.label} className={`flex items-center gap-4 transition-opacity ${status === 'pending' ? 'opacity-20' : 'opacity-100'}`}>
                  <span className="font-mono text-[10px] tracking-widest text-bone/25 w-8">{String(idx + 1).padStart(2, '0')}</span>
                  <span className={`flex-1 uppercase tracking-wider text-xs ${status === 'active' ? 'text-bone' : 'text-bone/50'}`}>{stage.label}</span>
                  <span className="text-xs text-gold">
                    {status === 'done' && '✓'}
                    {status === 'active' && <span className="pulse-dot inline-block">●</span>}
                    {status === 'pending' && <span className="text-bone/20">○</span>}
                  </span>
                </li>
              );
            })}
          </ol>

          {errorMsg && (
            <div className="mt-10 border border-gold/30 p-4 font-mono text-xs text-gold/80">
              ⚠ {errorMsg}. Returning to landing…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
