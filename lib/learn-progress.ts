'use client';

export const progressKey = 'hk-mahjong-learn-progress';

export type LearnProgress = {
  completedLessons: string[];
  completedSections: string[];
  checkpointScores: Record<string, number>;
  lastVisitedLessonId?: string;
  finalReadinessScore?: number;
};

export const defaultProgress: LearnProgress = {
  completedLessons: [],
  completedSections: [],
  checkpointScores: {},
};

export const readProgress = (): LearnProgress => {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = window.localStorage.getItem(progressKey);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) } as LearnProgress;
  } catch {
    return defaultProgress;
  }
};

export const writeProgress = (next: LearnProgress) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(progressKey, JSON.stringify(next));
};

export const updateProgress = (updater: (current: LearnProgress) => LearnProgress): LearnProgress => {
  const current = readProgress();
  const next = updater(current);
  writeProgress(next);
  return next;
};
