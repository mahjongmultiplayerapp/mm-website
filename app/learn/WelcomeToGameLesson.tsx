'use client';

import { useEffect, useMemo, useState } from 'react';

type WelcomeToGameLessonProps = {
  lessonId: string;
  nextHref: string;
};

const storageKey = 'mahjong-multiplayer-learn-progress';

const flowSteps = [
  {
    title: 'Four players sit around the table.',
    body: 'A Hong Kong Mahjong hand starts with East, South, West, and North seated around one shared table.',
  },
  {
    title: 'Tiles are shuffled and dealt.',
    body: 'The wall is built, each player receives a starting hand, and East begins with the first discard.',
  },
  {
    title: 'Players draw and discard.',
    body: 'On a normal turn, a player draws one tile, studies the hand, and discards one tile they no longer need.',
  },
  {
    title: 'Players may call useful discards.',
    body: 'Sometimes a discard completes a useful group, so another player claims it and uses it immediately.',
  },
  {
    title: 'Someone completes a hand or the wall runs out.',
    body: 'The hand ends when a player finishes a legal winning hand, or when there are no more playable tiles.',
  },
];

function readProgress() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return { completedLessons: [] as string[], lastVisitedPath: undefined as string | undefined };
    const parsed = JSON.parse(stored) as { completedLessons?: string[]; lastVisitedPath?: string };
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      lastVisitedPath: typeof parsed.lastVisitedPath === 'string' ? parsed.lastVisitedPath : undefined,
    };
  } catch {
    return { completedLessons: [] as string[], lastVisitedPath: undefined as string | undefined };
  }
}

function completeLesson(lessonId: string, nextHref: string) {
  const progress = readProgress();
  const completedLessons = progress.completedLessons.includes(lessonId) ? progress.completedLessons : [...progress.completedLessons, lessonId];
  window.localStorage.setItem(storageKey, JSON.stringify({ completedLessons, lastVisitedPath: nextHref }));
}

export function WelcomeToGameLesson({ lessonId, nextHref }: WelcomeToGameLessonProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const currentStep = flowSteps[activeStep];
  const hasReachedEnd = activeStep === flowSteps.length - 1;
  const progress = useMemo(() => ((activeStep + 1) / flowSteps.length) * 100, [activeStep]);

  useEffect(() => {
    setIsComplete(readProgress().completedLessons.includes(lessonId));
  }, [lessonId]);

  const goNext = () => {
    if (!hasReachedEnd) {
      setActiveStep((step) => step + 1);
      return;
    }

    completeLesson(lessonId, nextHref);
    setIsComplete(true);
  };

  return (
    <div className="learn-lesson-template welcome-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>One hand, four players, one race.</h3>
        <p>
          Mahjong is a four-player tile game. Think of it as a race, but not one where everyone runs in a straight line. Each player is quietly building a complete
          hand while also watching what the other players throw away.
        </p>
        <p>
          On your turn, you usually draw one tile, decide what your hand is trying to become, and discard one tile you no longer need. Sometimes another player&apos;s
          discard is exactly what you need, so you call it and use it immediately.
        </p>
      </article>

      <section className="learn-content-card welcome-table-card" aria-label="Four player mahjong table visual">
        <span className="eyebrow">Visual example</span>
        <div className="welcome-table">
          <div className="welcome-seat welcome-seat-east">
            <span>East</span>
            <small>Dealer</small>
          </div>
          <div className="welcome-seat welcome-seat-south">
            <span>South</span>
            <small>Next</small>
          </div>
          <div className="welcome-seat welcome-seat-west">
            <span>West</span>
            <small>Across</small>
          </div>
          <div className="welcome-seat welcome-seat-north">
            <span>North</span>
            <small>Fourth</small>
          </div>
          <div className="welcome-wall welcome-wall-top"></div>
          <div className="welcome-wall welcome-wall-right"></div>
          <div className="welcome-wall welcome-wall-bottom"></div>
          <div className="welcome-wall welcome-wall-left"></div>
          <div className="welcome-table-center">
            <strong>Draw</strong>
            <span>Discard</span>
            <span>Call</span>
            <strong>Complete a Hand</strong>
          </div>
        </div>
      </section>

      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Most turns are simple.</h3>
        <p>Draw one tile, improve your hand if you can, then discard one tile. Calls interrupt that rhythm only when a discard helps someone complete a set or win.</p>
      </section>

      <section className="learn-complete-card welcome-flow-card">
        <div className="welcome-flow-copy">
          <span className="eyebrow">Interactive check</span>
          <h3>Tap through the basic life cycle of a hand.</h3>
          <p>{currentStep.body}</p>
          <div className="welcome-flow-meter" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="welcome-flow-controls">
          <ol className="welcome-flow-steps" aria-label="Mahjong hand life cycle">
            {flowSteps.map((step, index) => (
              <li key={step.title}>
                <button type="button" className={index === activeStep ? 'active' : ''} onClick={() => setActiveStep(index)} aria-current={index === activeStep ? 'step' : undefined}>
                  <span>{index + 1}</span>
                  {step.title}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className={`btn-primary ${hasReachedEnd || isComplete ? 'gold' : ''}`} onClick={goNext}>
            {isComplete ? 'Completed' : hasReachedEnd ? 'Mark complete' : 'Next step'}
          </button>
        </div>
      </section>

      <section className="learn-content-card learn-takeaway-card welcome-takeaway-card">
        <span className="eyebrow">Takeaway</span>
        <h3>Four players, draw, discard, call, complete a hand.</h3>
        <p>Hong Kong Mahjong is a race to complete a legal hand through drawing, discarding, and calling tiles.</p>
        {isComplete ? (
          <a className="btn-primary gold" href={nextHref}>
            Continue to Lesson 1.2
          </a>
        ) : null}
      </section>
    </div>
  );
}
