'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { LearnProgress } from '@/lib/learn-progress';
import { defaultProgress, readProgress, writeProgress } from '@/lib/learn-progress';

type Ctx = {
  progress: LearnProgress;
  setProgress: (next: LearnProgress) => void;
};

const LearnProgressContext = createContext<Ctx>({
  progress: defaultProgress,
  setProgress: () => undefined,
});

export function LearnProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<LearnProgress>(defaultProgress);

  useEffect(() => {
    setProgressState(readProgress());
  }, []);

  const setProgress = (next: LearnProgress) => {
    setProgressState(next);
    writeProgress(next);
  };

  const value = useMemo(() => ({ progress, setProgress }), [progress]);
  return <LearnProgressContext.Provider value={value}>{children}</LearnProgressContext.Provider>;
}

export const useLearnProgress = () => useContext(LearnProgressContext);
