'use client';

import { useEffect, useMemo, useState } from 'react';

type LearnProgressState = {
  completedLessons: string[];
  lastVisitedPath?: string;
};

const storageKey = 'mahjong-multiplayer-learn-progress';

function readProgress(): LearnProgressState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return { completedLessons: [] };
    const parsed = JSON.parse(stored) as Partial<LearnProgressState>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      lastVisitedPath: typeof parsed.lastVisitedPath === 'string' ? parsed.lastVisitedPath : undefined,
    };
  } catch {
    return { completedLessons: [] };
  }
}

function writeProgress(progress: LearnProgressState) {
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

export function LandingProgressActions({ firstLessonHref, totalLessons }: { firstLessonHref: string; totalLessons: number }) {
  const [progress, setProgress] = useState<LearnProgressState>({ completedLessons: [] });
  const completedCount = progress.completedLessons.length;
  const progressLabel = useMemo(() => `${completedCount} of ${totalLessons} lessons complete`, [completedCount, totalLessons]);

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  return (
    <div className="learn-action-panel" aria-label="Learning progress">
      <div>
        <span className="eyebrow">Your path</span>
        <p>{progressLabel}</p>
      </div>
      <div className="learn-action-row">
        <a className="btn-primary gold" href={progress.lastVisitedPath ?? firstLessonHref}>
          {progress.lastVisitedPath ? 'Continue' : 'Start learning'}
        </a>
        <a className="learn-secondary-link" href="#curriculum">
          View curriculum
        </a>
      </div>
    </div>
  );
}

export function LessonCompletionPanel({ lessonId, nextHref }: { lessonId: string; nextHref: string }) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const progress = readProgress();
    setIsComplete(progress.completedLessons.includes(lessonId));
  }, [lessonId]);

  const markComplete = () => {
    const progress = readProgress();
    const completedLessons = progress.completedLessons.includes(lessonId) ? progress.completedLessons : [...progress.completedLessons, lessonId];
    writeProgress({ completedLessons, lastVisitedPath: nextHref });
    setIsComplete(true);
  };

  return (
    <div className="learn-complete-card">
      <div>
        <span className="eyebrow">Interactive check</span>
        <h3>{isComplete ? 'Check complete' : 'Ready for the lesson interaction'}</h3>
        <p>{isComplete ? 'This placeholder is marked complete for now.' : 'The real exercise will live here in the next build pass.'}</p>
      </div>
      <a className={`btn-primary ${isComplete ? 'gold' : ''}`} href={nextHref} onClick={markComplete}>
        {isComplete ? 'Continue' : 'Mark complete'}
      </a>
    </div>
  );
}
