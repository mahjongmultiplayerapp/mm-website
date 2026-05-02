'use client';

import { useEffect, useMemo, useState } from 'react';

type LearnProgressState = {
  completedLessons: string[];
  completedSections: string[];
  lastVisitedPath?: string;
};

const storageKey = 'mahjong-multiplayer-learn-progress';

function readProgress(): LearnProgressState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return { completedLessons: [], completedSections: [] };
    const parsed = JSON.parse(stored) as Partial<LearnProgressState>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedSections: Array.isArray(parsed.completedSections) ? parsed.completedSections : [],
      lastVisitedPath: typeof parsed.lastVisitedPath === 'string' ? parsed.lastVisitedPath : undefined,
    };
  } catch {
    return { completedLessons: [], completedSections: [] };
  }
}

function writeProgress(progress: LearnProgressState) {
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
  window.dispatchEvent(new Event('learn-progress-updated'));
}

export function LandingProgressActions({ firstLessonHref, totalLessons }: { firstLessonHref: string; totalLessons: number }) {
  const [progress, setProgress] = useState<LearnProgressState>({ completedLessons: [], completedSections: [] });
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

  useEffect(() => {
    const progress = readProgress();
    const completedLessons = progress.completedLessons.includes(lessonId) ? progress.completedLessons : [...progress.completedLessons, lessonId];
    writeProgress({ ...progress, completedLessons, lastVisitedPath: nextHref });
    setIsComplete(true);
  }, [lessonId, nextHref]);

  return (
    <div className="learn-complete-card">
      <div>
        <span className="eyebrow">Interactive check</span>
        <h3>Lesson interaction complete</h3>
        <p>This placeholder auto-completes while the full lesson interaction is being built.</p>
      </div>
      <span className={`lesson-status-pill ${isComplete ? 'complete' : ''}`}>{isComplete ? 'Completed' : 'Not complete'}</span>
    </div>
  );
}
