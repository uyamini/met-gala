'use client';

import { useState } from 'react';
import LandingHero from '@/components/LandingHero';
import AnalysisStream from '@/components/AnalysisStream';
import EditorialResult from '@/components/EditorialResult';

export type Mode = 'archive' | 'generate';

export type CompanyAnalysis = {
  company: string;
  theme: string;
  internal_view: string;
  internet_view: string;
  archetype: string;
  materials: string[];
  silhouette: string;
  accessories: string;
  makeup: string;
  runway_concept: string;
  critic_review: string;
  confidence: number;
  recent_news_influence: string;
  image_prompt: string;
  celebrity_match: {
    celebrity: string;
    year: string;
    designer: string;
    why_it_matches: string;
  };
};

export type AppState =
  | { phase: 'landing' }
  | { phase: 'analyzing'; company: string; mode: Mode }
  | {
      phase: 'result';
      company: string;
      mode: Mode;
      analysis: CompanyAnalysis;
      imageUrl: string | null;
      imageCaption: string | null;
    };

export default function Page() {
  const [state, setState] = useState<AppState>({ phase: 'landing' });

  return (
    <main className="relative z-10">
      {state.phase === 'landing' && (
        <LandingHero
          onSubmit={(company, mode) =>
            setState({ phase: 'analyzing', company, mode })
          }
        />
      )}

      {state.phase === 'analyzing' && (
        <AnalysisStream
          company={state.company}
          mode={state.mode}
          onComplete={(analysis, imageUrl, imageCaption) =>
            setState({
              phase: 'result',
              company: state.company,
              mode: state.mode,
              analysis,
              imageUrl,
              imageCaption,
            })
          }
          onError={() => setState({ phase: 'landing' })}
        />
      )}

      {state.phase === 'result' && (
        <EditorialResult
          company={state.company}
          mode={state.mode}
          analysis={state.analysis}
          imageUrl={state.imageUrl}
          imageCaption={state.imageCaption}
          onReset={() => setState({ phase: 'landing' })}
        />
      )}
    </main>
  );
}
