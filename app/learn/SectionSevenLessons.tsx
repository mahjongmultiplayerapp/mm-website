'use client';

import { useEffect, useMemo, useState } from 'react';

type LessonRuntimeProps = {
  lessonId: string;
  nextHref: string;
};

type ChoiceQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const storageKey = 'mahjong-multiplayer-learn-progress';

const checkpointQuestions: ChoiceQuestion[] = [
  { prompt: 'What happens after a hand ends by win?', options: ['Shuffle immediately', 'Verify, score, settle, then prepare the next hand', 'Skip dealer movement', 'Keep drawing tiles'], answer: 1, explanation: 'After a win, the table verifies the hand, scores it, settles payments, then moves on.' },
  { prompt: 'When is a hand drawn?', options: ['When East discards first', 'When the live wall runs out and no one wins', 'When someone calls Chow', 'When a player has 13 tiles'], answer: 1, explanation: 'A drawn hand means the live wall was exhausted before anyone won.' },
  { prompt: 'Under these tournament-style rules, what happens to dealer on a draw?', options: ['Dealer always continues', 'Dealer does not continue', 'Dealer is chosen randomly', 'North becomes dealer every time'], answer: 1, explanation: 'For this course, dealer does not continue on a draw.' },
  { prompt: 'If East does not win and the deal passes, who becomes the next dealer?', options: ['Previous South', 'Previous West', 'Previous North', 'The winner only'], answer: 0, explanation: 'When the deal passes, the previous South becomes the next East.' },
  { prompt: 'What do wind cycles do?', options: ['Organize hands into the larger game structure', 'Change suited tiles into honors', 'Cancel all scoring', 'Remove the dead wall'], answer: 0, explanation: 'Hands combine into cycles, and cycles combine into rounds.' },
  { prompt: 'What should players do at the end of a formal round?', options: ['Verify scores', 'Mix tiles before checking totals', 'Ignore the score sheet', 'Declare every hand drawn'], answer: 0, explanation: 'Formal rounds end with score confirmation.' },
  { prompt: 'What is a dead hand?', options: ['A hand with no honors', 'A serious error that removes your right to win that hand', 'A limit hand', 'A hand after self-draw'], answer: 1, explanation: 'A dead hand means you cannot win that hand because of a serious error.' },
  { prompt: 'Which behavior is good table etiquette?', options: ['Say Pung clearly, expose the set, then discard', 'Touch the wall before your turn', 'Mix a winning hand before verification', 'Give advice during a live decision'], answer: 0, explanation: 'Clear calls, neat tiles, and patient hands keep the game fair.' },
];

const recapItems = [
  { title: 'Hands have an afterlife.', body: 'A win or draw is followed by verification, settlement, dealer movement, and setup for the next hand.' },
  { title: 'Draws move the table forward.', body: 'In this ruleset, a drawn hand happens when the live wall runs out with no winner, and dealer does not continue.' },
  { title: 'Dealer movement gives structure.', body: 'When the deal passes, previous South becomes the next East.' },
  { title: 'Rounds are bigger than hands.', body: 'Dealer cycles and round winds organize a full game session.' },
  { title: 'Dead hands are preventable.', body: 'Most beginner fouls come from tile-count errors, wrong timing, or invalid calls.' },
  { title: 'Etiquette protects clarity.', body: 'Clear calls, neat discards, and waiting for verification keep everyone aligned.' },
];

const readinessItems = [
  { label: 'Tile set', review: '/learn/tiles-melds-winning-hands/the-tile-set' },
  { label: 'Standard winning shape', review: '/learn/tiles-melds-winning-hands/standard-winning-shape' },
  { label: 'Setup and dealing', review: '/learn/setup-and-dealing/dealing-the-tiles' },
  { label: 'Turn flow', review: '/learn/turn-flow-and-discarding/anatomy-of-a-turn' },
  { label: 'Chow, Pung, Kong, Win', review: '/learn/calls-chow-pung-kong-win/what-is-a-call' },
  { label: 'Call priority', review: '/learn/calls-chow-pung-kong-win/call-priority' },
  { label: '3-fan minimum', review: '/learn/scoring-and-fan/what-makes-a-hand-winnable' },
  { label: 'Self-draw vs discard payment', review: '/learn/scoring-and-fan/payment-basics' },
  { label: 'Dealer and round flow', review: '/learn/rounds-draws-table-rules/passing-the-deal' },
  { label: 'Common mistakes', review: '/learn/rounds-draws-table-rules/dead-hands-and-common-errors' },
];

function readProgress() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return { completedLessons: [] as string[], completedSections: [] as string[], lastVisitedPath: undefined as string | undefined };
    const parsed = JSON.parse(stored) as { completedLessons?: string[]; completedSections?: string[]; lastVisitedPath?: string };
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedSections: Array.isArray(parsed.completedSections) ? parsed.completedSections : [],
      lastVisitedPath: typeof parsed.lastVisitedPath === 'string' ? parsed.lastVisitedPath : undefined,
    };
  } catch {
    return { completedLessons: [] as string[], completedSections: [] as string[], lastVisitedPath: undefined as string | undefined };
  }
}

function saveProgress(progress: ReturnType<typeof readProgress>) {
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

function completeLesson(lessonId: string, nextHref: string) {
  const progress = readProgress();
  saveProgress({
    ...progress,
    completedLessons: progress.completedLessons.includes(lessonId) ? progress.completedLessons : [...progress.completedLessons, lessonId],
    lastVisitedPath: nextHref,
  });
}

function completeSection(sectionId: string) {
  const progress = readProgress();
  saveProgress({
    ...progress,
    completedSections: progress.completedSections.includes(sectionId) ? progress.completedSections : [...progress.completedSections, sectionId],
  });
}

function useCompletion(lessonId: string) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(readProgress().completedLessons.includes(lessonId));
  }, [lessonId]);

  return { isComplete, setIsComplete };
}

function CompleteButton({ lessonId, nextHref, ready = true }: LessonRuntimeProps & { ready?: boolean }) {
  const { isComplete, setIsComplete } = useCompletion(lessonId);

  const onComplete = () => {
    if (!ready) return;
    completeLesson(lessonId, nextHref);
    setIsComplete(true);
  };

  return (
    <div className="section-one-complete">
      <button type="button" className={`btn-primary ${ready || isComplete ? 'gold' : ''}`} disabled={!ready} onClick={onComplete}>
        {isComplete ? 'Completed' : 'Mark complete'}
      </button>
      {isComplete ? (
        <a className="learn-secondary-link" href={nextHref}>
          Continue
        </a>
      ) : null}
    </div>
  );
}

function ChoiceCheck({ question, onCorrect }: { question: ChoiceQuestion; onCorrect: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === question.answer;

  useEffect(() => {
    if (correct) onCorrect();
  }, [correct, onCorrect]);

  return (
    <div>
      <h3>{question.prompt}</h3>
      <div className="section-one-answer-grid">
        {question.options.map((option, index) => (
          <button type="button" className={selected === index ? (correct ? 'correct' : 'incorrect') : ''} onClick={() => setSelected(index)} key={option}>
            {option}
          </button>
        ))}
      </div>
      {selected !== null ? <p className="section-one-feedback">{correct ? question.explanation : 'Not quite. Check the hand result, dealer movement, timing, or table behavior again.'}</p> : null}
    </div>
  );
}

function LessonFrame({
  title,
  copy,
  visual,
  ruleTitle,
  rule,
  check,
  lessonId,
  nextHref,
  ready,
  takeaway,
}: LessonRuntimeProps & {
  title: string;
  copy: string[];
  visual: React.ReactNode;
  ruleTitle: string;
  rule: string;
  check: React.ReactNode;
  ready: boolean;
  takeaway: { title: string; body: string };
}) {
  return (
    <div className="learn-lesson-template section-one-lesson section-seven-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>{title}</h3>
        {copy.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
      <section className="learn-content-card">
        <span className="eyebrow">Visual example</span>
        {visual}
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>{ruleTitle}</h3>
        <p>{rule}</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          {check}
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={ready} />
      </section>
      <section className="learn-content-card learn-takeaway-card">
        <span className="eyebrow">Takeaway</span>
        <h3>{takeaway.title}</h3>
        <p>{takeaway.body}</p>
      </section>
    </div>
  );
}

function FlowSteps({ steps }: { steps: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="section-seven-flow">
      {steps.map((step, index) => (
        <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={step}>
          <span>{index + 1}</span>
          {step}
        </button>
      ))}
    </div>
  );
}

function WallDrawVisual() {
  return (
    <div className="section-seven-wall-empty">
      {Array.from({ length: 12 }).map((_, index) => (
        <span className={index > 2 ? 'empty' : ''} key={index} />
      ))}
      <strong>Drawn Hand</strong>
      <p>No winner before the live wall is exhausted.</p>
    </div>
  );
}

function DealerTable({ dealer = 'East' }: { dealer?: 'East' | 'South' | 'West' | 'North' }) {
  const seats = [
    { name: 'East', area: 'east' },
    { name: 'South', area: 'south' },
    { name: 'West', area: 'west' },
    { name: 'North', area: 'north' },
  ];

  return (
    <div className="section-seven-dealer-table">
      {seats.map((seat) => (
        <div className={`seat ${seat.area} ${dealer === seat.name ? 'dealer' : ''}`} key={seat.name}>
          <span>{seat.name}</span>
          {dealer === seat.name ? <small>Dealer</small> : null}
        </div>
      ))}
      <div className="center">Deal passes to previous South</div>
    </div>
  );
}

function WindCycleVisual() {
  const [step, setStep] = useState(0);
  const dealers = ['East', 'South', 'West', 'North', 'East'] as const;
  const roundWind = step < 4 ? 'East round' : 'South round next';

  return (
    <div className="section-seven-wind-cycle">
      <DealerTable dealer={dealers[step]} />
      <div className="section-seven-cycle-controls">
        <button type="button" className="btn-primary gold" onClick={() => setStep((current) => Math.min(current + 1, dealers.length - 1))}>
          Advance dealer
        </button>
        <button type="button" className="learn-secondary-link" onClick={() => setStep(0)}>
          Reset
        </button>
      </div>
      <p>
        Dealer step {step + 1} of {dealers.length}: <strong>{roundWind}</strong>
      </p>
    </div>
  );
}

function RoundTracker() {
  const [complete, setComplete] = useState(2);

  return (
    <div className="section-seven-round-tracker">
      {[1, 2, 3, 4].map((cycle) => (
        <button type="button" className={cycle <= complete ? 'active' : ''} onClick={() => setComplete(cycle)} key={cycle}>
          Cycle {cycle}
        </button>
      ))}
      <p>{complete === 4 ? 'Round endpoint reached. Verify final scores.' : 'Keep playing until the formal endpoint is reached.'}</p>
    </div>
  );
}

function MistakeSpotter({ scenarios, onReady }: { scenarios: ChoiceQuestion[]; onReady: () => void }) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const question = scenarios[index];

  return (
    <div>
      <ChoiceCheck
        question={question}
        onCorrect={() => {
          setCorrectCount((current) => {
            const next = Math.max(current, index + 1);
            if (next >= scenarios.length) onReady();
            return next;
          });
        }}
      />
      <div className="section-seven-cycle-controls">
        <button type="button" className="learn-secondary-link" onClick={() => setIndex((current) => Math.max(0, current - 1))}>
          Previous scenario
        </button>
        <button type="button" className="btn-primary gold" onClick={() => setIndex((current) => Math.min(scenarios.length - 1, current + 1))}>
          Next scenario
        </button>
      </div>
      <p className="section-one-feedback">
        Scenario {index + 1} of {scenarios.length}. Correct scenarios seen: {correctCount}/{scenarios.length}.
      </p>
    </div>
  );
}

function EtiquetteGrid() {
  return (
    <div className="section-seven-etiquette-grid">
      {['Make calls clearly', 'Keep discards orderly', 'Wait for your turn', 'Verify before mixing tiles', 'Avoid live-decision table talk', 'Do not touch the wall early'].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ReadinessChecklist({ onReady }: { onReady: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const checkedCount = readinessItems.filter((item) => checked[item.label]).length;

  useEffect(() => {
    if (checkedCount >= 6) onReady();
  }, [checkedCount, onReady]);

  return (
    <div className="section-seven-readiness">
      <div className="section-seven-readiness-bar">
        <span style={{ width: `${(checkedCount / readinessItems.length) * 100}%` }} />
      </div>
      {readinessItems.map((item) => (
        <label key={item.label}>
          <input
            type="checkbox"
            checked={Boolean(checked[item.label])}
            onChange={(event) => setChecked((current) => ({ ...current, [item.label]: event.target.checked }))}
          />
          <span>{item.label}</span>
          {!checked[item.label] ? <a href={item.review}>Review</a> : null}
        </label>
      ))}
      <p>{checkedCount >= 6 ? 'Good. You have enough confidence marked to continue.' : 'Mark the areas you feel comfortable with. Review links appear beside unchecked areas.'}</p>
    </div>
  );
}

export function AfterHandEndsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="The table settles before it resets"
      copy={[
        'When a hand ends, the table does not immediately shuffle. First, determine whether the hand ended by win or draw.',
        'If someone won, verify the hand and score it. Then settle payments. After that, determine the next dealer and prepare the next hand.',
      ]}
      visual={<FlowSteps steps={['Hand ends by win or draw', 'Verify and score if someone won', 'Confirm settlement', 'Determine next dealer', 'Start next hand']} />}
      ruleTitle="End, verify, score, settle, next dealer"
      rule="This order keeps the game fair and avoids arguments."
      check={
        <ChoiceCheck
          question={{
            prompt: 'What comes before preparing the next hand?',
            options: ['Settlement and next dealer decision', 'Mixing tiles immediately', 'Skipping score confirmation', 'Drawing another live-wall tile'],
            answer: 0,
            explanation: 'Correct. Settle the hand and determine the next dealer before the next hand begins.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Every hand has a closing flow', body: 'Every hand ends with settlement, then the table prepares for the next hand.' }}
    />
  );
}

export function DrawnHandsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="A draw means the wall ran out"
      copy={[
        'A drawn hand happens when the final live-wall tile is drawn and discarded with no win. No one wins that hand.',
        'In these tournament-style rules, the dealer does not continue on a draw. Social tables may vary, so confirm house rules when you play elsewhere.',
      ]}
      visual={<WallDrawVisual />}
      ruleTitle="Wall runs out, no winner, hand is drawn"
      rule="For this course, a draw moves the table forward and dealer does not continue."
      check={
        <ChoiceCheck
          question={{
            prompt: 'When is a hand drawn?',
            options: ['When the live wall runs out and no one wins', 'When East wins', 'When anyone calls Pung', 'When the dead wall is touched'],
            answer: 0,
            explanation: 'Correct. The live wall is exhausted with no winner.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'No winner before the wall ends', body: 'A drawn hand means the wall ran out before anyone won.' }}
    />
  );
}

export function PassingDealLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="East is dealer, but East changes"
      copy={[
        'The dealer is East. When the hand ends, the dealer may remain or the deal may pass depending on the result and table rules.',
        'In the beginner model, if East does not win, the deal passes and the previous South becomes the next East.',
      ]}
      visual={<DealerTable dealer="South" />}
      ruleTitle="Previous South becomes new East when the deal passes"
      rule="Dealer rotation ensures every player gets a turn as East."
      check={
        <ChoiceCheck
          question={{
            prompt: 'East does not win the hand. Who becomes the next dealer?',
            options: ['Previous South', 'Previous West', 'Previous North', 'The player across from East'],
            answer: 0,
            explanation: 'Correct. The previous South becomes East.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'The deal passes forward', body: 'The deal usually passes forward unless East wins or specific continuation rules apply.' }}
    />
  );
}

export function WindCyclesRoundsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Hands build into rounds"
      copy={[
        'A full game is organized by dealer movement and round winds. Each player gets chances to be dealer.',
        'When the dealer position cycles back to the original dealer, a wind cycle is complete. Round winds, such as East round and South round, provide the larger match structure.',
      ]}
      visual={<WindCycleVisual />}
      ruleTitle="Hands combine into cycles; cycles combine into rounds"
      rule="Seat wind and round wind can both matter for scoring."
      check={
        <ChoiceCheck
          question={{
            prompt: 'What do wind cycles and round winds provide?',
            options: ['Structure for a full game session', 'A way to ignore dealer movement', 'A replacement for scoring', 'A new tile suit'],
            answer: 0,
            explanation: 'Correct. They organize the full game beyond a single hand.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'A game is more than one hand', body: 'Wind cycles and round winds give structure to the full game.' }}
    />
  );
}

export function EndRoundLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Formal rounds have endpoints"
      copy={[
        'A formal round has a defined endpoint. In the tournament rulebook, one round consists of four complete wind cycles, and there may also be time or hand-count limits.',
        'At the end, players verify scores before leaving the table. A game session is a structured series of hands, not just one hand.',
      ]}
      visual={<RoundTracker />}
      ruleTitle="Finish by confirming the final score"
      rule="Score verification prevents confusion once tiles and score markers are moved."
      check={
        <ChoiceCheck
          question={{
            prompt: 'What should players do at the end of a formal round?',
            options: ['Verify the scores before ending the round', 'Mix tiles before checking totals', 'Skip final confirmation', 'Reset the dealer only'],
            answer: 0,
            explanation: 'Correct. Verify scores before the round ends.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Confirm the endpoint', body: 'A full round has a structure, endpoint, and final score confirmation.' }}
    />
  );
}

export function DeadHandsErrorsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  const scenarios = [
    { prompt: 'A player has too many tiles after drawing out of turn. What is the issue?', options: ['Wrong tile count', 'A legal Chow', 'A wind cycle', 'A normal discard'], answer: 0, explanation: 'Too many tiles is a serious tile-count problem.' },
    { prompt: 'A player draws before the prior discard window is resolved. What is the issue?', options: ['Wrong timing', 'A limit hand', 'A legal self-draw', 'A round wind'], answer: 0, explanation: 'Drawing too early disrupts the table order.' },
    { prompt: 'A player calls Chow from the player across the table. What is the issue?', options: ['Invalid call', 'Correct Chow', 'Package payment', 'Passing the deal'], answer: 0, explanation: 'Chow is only from the player on your left.' },
    { prompt: 'A player declares win with invalid shape. What is the issue?', options: ['False win', 'Drawn hand', 'Dealer continuation', 'Good etiquette'], answer: 0, explanation: 'Declaring a win without a legal shape is a serious error.' },
  ];

  return (
    <LessonFrame
      title="Most mistakes have three roots"
      copy={[
        'A dead hand means you lose the right to win that hand because of a serious error.',
        'Common beginner errors include wrong tile count, drawing too early, discarding before drawing, drawing from the wrong wall, invalid calls, exposing too many tiles, and false wins.',
      ]}
      visual={
        <div className="section-seven-mistake-grid">
          {['Wrong number of tiles', 'Drawing too early', 'Discard before draw', 'Wrong wall', 'Invalid call', 'False win'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      }
      ruleTitle="Slow down, count tiles, wait your turn, call clearly"
      rule="Most beginner fouls come from wrong tile count, wrong timing, or invalid calls."
      check={<MistakeSpotter scenarios={scenarios} onReady={() => setReady(true)} />}
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Avoid preventable dead hands', body: 'Most beginner fouls come from wrong tile count, wrong timing, or invalid calls.' }}
    />
  );
}

export function TableEtiquetteLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  const scenarios = [
    { prompt: 'Which behavior is good etiquette?', options: ['Saying Pung clearly, exposing the set, then discarding', 'Saying wait without a call', 'Mixing tiles before score confirmation', 'Touching the wall early'], answer: 0, explanation: 'Clear calls and orderly action make the game fair.' },
    { prompt: 'A player mixes tiles before the win is verified. What is the issue?', options: ['Bad etiquette', 'A required scoring step', 'A legal call', 'A drawn hand'], answer: 0, explanation: 'Do not disturb tiles before the hand is verified.' },
    { prompt: 'A player gives strategic advice during another player’s decision. What is the issue?', options: ['Table talk affecting play', 'Correct scoring', 'Dealer movement', 'A wind cycle'], answer: 0, explanation: 'Avoid table talk that changes live decisions.' },
  ];

  return (
    <LessonFrame
      title="Good etiquette protects the game state"
      copy={[
        'Good etiquette makes mahjong smoother and fairer. Make calls clearly, keep discards orderly, and do not touch the wall early.',
        'Do not mix tiles before a win is verified, and avoid table talk that affects live decisions. Clear speech, neat tiles, and patient hands help everyone trust the game state.',
      ]}
      visual={<EtiquetteGrid />}
      ruleTitle="Say Pung clearly, expose the set, then discard"
      rule="Clear calls, neat discards, and patient hands make the game fair and smooth."
      check={<MistakeSpotter scenarios={scenarios} onReady={() => setReady(true)} />}
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Clarity is kindness at the table', body: 'Clear calls, neat discards, and patient hands make the game fair and smooth.' }}
    />
  );
}

export function ReadyForRealTableLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="You know enough to begin"
      copy={[
        'Before joining a real table, feel comfortable with the tile set, standard winning shape, setup, turn flow, calls, call priority, the 3-fan minimum, payment basics, dealer movement, draws, and common mistakes.',
        'You do not need to be an expert. You need enough confidence to follow the game, ask good questions, and avoid disruptive errors. Real play will make these ideas faster.',
      ]}
      visual={<ReadinessChecklist onReady={() => setReady(true)} />}
      ruleTitle="Core rules first, speed later"
      rule="Real table confidence comes from clear fundamentals and patient play."
      check={
        <ChoiceCheck
          question={{
            prompt: 'What is the best beginner mindset for a real table?',
            options: ['Know the core rules, ask clear questions, and avoid disruptive errors', 'Memorize every rare hand first', 'Ignore turn order', 'Rush every discard'],
            answer: 0,
            explanation: 'Correct. You need solid fundamentals and table awareness, not perfection.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Ready to start playing', body: 'You now know the core rules needed to start playing Hong Kong Mahjong.' }}
    />
  );
}

export function SectionSevenRecap() {
  return (
    <div className="learn-lesson-template section-one-lesson section-seven-lesson">
      <div className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Section 7 recap</span>
        <h3>From one hand to a full table</h3>
        <p>
          Section 7 wraps the course around real play: what happens after a hand ends, how drawn hands and dealer movement work, how rounds are structured, and how to avoid common table errors.
        </p>
      </div>
      <div className="learn-content-grid">
        {recapItems.map((item) => (
          <div className="learn-content-card" key={item.title}>
            <span className="eyebrow">Remember</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
      <div className="learn-content-card learn-takeaway-card">
        <span className="eyebrow">Ready check</span>
        <h3>Can you keep the table moving cleanly?</h3>
        <p>If you can settle a hand, follow dealer movement, avoid dead-hand errors, and behave clearly at the table, you are ready for the checkpoint.</p>
      </div>
    </div>
  );
}

export function SectionSevenCheckpoint() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => checkpointQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const passed = submitted && score >= 7;

  useEffect(() => {
    if (passed) completeSection('section-7');
  }, [passed]);

  return (
    <div className="section-one-score-card section-seven-checkpoint">
      <div className="learn-content-card">
        <span className="eyebrow">Checkpoint quiz</span>
        <h3>Score at least 7 out of 8</h3>
        <p>Confirm post-hand flow, drawn hands, dealer movement, wind cycles, round endings, dead hands, and etiquette.</p>
      </div>
      {checkpointQuestions.map((question, index) => (
        <div className="learn-content-card" key={question.prompt}>
          <span className="eyebrow">Question {index + 1}</span>
          <h3>{question.prompt}</h3>
          <div className="section-one-answer-grid">
            {question.options.map((option, optionIndex) => {
              const selected = answers[index] === optionIndex;
              const correct = question.answer === optionIndex;
              const showResult = submitted && (selected || correct);
              return (
                <button
                  type="button"
                  className={showResult ? (correct ? 'correct' : selected ? 'incorrect' : '') : selected ? 'active' : ''}
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers((current) => ({ ...current, [index]: optionIndex }));
                  }}
                  key={option}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {submitted ? <p className="section-one-feedback">{question.explanation}</p> : null}
        </div>
      ))}
      <div className="learn-complete-card">
        <div>
          <span className="eyebrow">Result</span>
          <h3>{submitted ? `${score}/8 correct` : 'Submit when ready'}</h3>
          <p>{passed ? 'Checkpoint passed. Section 7 is complete.' : 'You need 7 correct answers to pass this checkpoint.'}</p>
        </div>
        <button type="button" className="btn-primary gold" disabled={Object.keys(answers).length < checkpointQuestions.length} onClick={() => setSubmitted(true)}>
          Submit checkpoint
        </button>
      </div>
    </div>
  );
}
