'use client';

import { useEffect, useMemo, useState } from 'react';
import { MiniTile } from './components';

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

const seats = ['East', 'South', 'West', 'North'];
const wallSteps = ['Shuffle face down', 'Stack tiles in pairs', 'Build four walls', 'Push walls together'];
const dealSteps = ['East takes first', 'South takes next', 'West takes next', 'North takes next', 'Repeat around the table', 'East starts the hand'];

const tableAreas: Record<string, string> = {
  Wall: 'The face-down supply of tiles for the hand.',
  River: 'The face-up discard area where played tiles collect.',
  'Concealed hand': 'Your private tiles, kept in front of you.',
  'Open meld area': 'Called melds and declared kongs, visible to everyone.',
};

const mistakes = [
  { title: 'South starts dealing instead of East.', answer: 'Wrong dealer', explanation: 'East is the dealer for the current hand and starts the deal.' },
  { title: 'A player looks before the deal is confirmed.', answer: 'Looking too early', explanation: 'Slow down during setup. Confirm the deal before reading tiles.' },
  { title: 'A player draws from the dead wall on a normal turn.', answer: 'Wrong wall area', explanation: 'Normal turns draw from the live wall.' },
  { title: 'A player has too many tiles after the deal.', answer: 'Wrong tile count', explanation: 'Tile counts should be checked before play begins.' },
];

const recapItems = [
  { title: 'East is the dealer.', body: 'Identify East first, then follow seat order around the table.' },
  { title: 'The wall is the supply.', body: 'Tiles are shuffled face down, stacked, and pushed into a square wall.' },
  { title: 'Dice open the wall.', body: 'The dice create the official starting point for drawing.' },
  { title: 'Live wall and dead wall are different.', body: 'Normal draws come from the live wall. Kong supplements come from the dead wall.' },
  { title: 'Table areas prevent confusion.', body: 'Keep the wall, river, concealed hand, and open meld area clear.' },
];

const checkpointQuestions: ChoiceQuestion[] = [
  { prompt: 'Which seat is the dealer?', options: ['East', 'South', 'West', 'North'], answer: 0, explanation: 'East is the dealer for the current hand.' },
  { prompt: 'What is the seat order starting from East?', options: ['East, West, South, North', 'East, South, West, North', 'North, West, South, East', 'South, East, North, West'], answer: 1, explanation: 'The beginner order to remember is East, South, West, North.' },
  { prompt: 'What is the wall?', options: ['The discard pile', 'The face-down tile supply', 'A scoring chart', 'The open meld area'], answer: 1, explanation: 'The wall is the face-down supply used during the hand.' },
  { prompt: 'What do the dice determine?', options: ['The winner', 'Which suit is wild', 'Where the wall opens', 'The final score'], answer: 2, explanation: 'Dice determine the official wall opening and draw start.' },
  { prompt: 'Where do normal draws come from?', options: ['River', 'Dead wall', 'Live wall', 'Open meld area'], answer: 2, explanation: 'Normal turns draw from the live wall.' },
  { prompt: 'Where does a kong supplement tile come from?', options: ['Dead wall / kong tail', 'River', 'Any player hand', 'Discard pile'], answer: 0, explanation: 'Kong supplement tiles come from the dead wall.' },
  { prompt: 'Who takes first in the deal?', options: ['North', 'West', 'South', 'East'], answer: 3, explanation: 'East takes first and starts play.' },
  { prompt: 'Where do called sets belong?', options: ['Open meld area', 'Hidden in your hand', 'Mixed into the wall', 'In the river'], answer: 0, explanation: 'Called melds are exposed in the open meld area.' },
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
  window.dispatchEvent(new Event('learn-progress-updated'));
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

  useEffect(() => {
    if (!ready || isComplete) return;
    completeLesson(lessonId, nextHref);
    setIsComplete(true);
  }, [isComplete, lessonId, nextHref, ready, setIsComplete]);

  return (
    <span className={`lesson-status-pill ${isComplete ? 'complete' : ''}`}>{isComplete ? 'Completed' : 'Not complete'}</span>
  );
}

function TileRail({ tiles }: { tiles: string[] }) {
  return (
    <div className="learn-tile-rail">
      {tiles.map((tile, index) => (
        <MiniTile tile={tile} key={`${tile}-${index}`} />
      ))}
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
      {selected !== null ? <p className="section-one-feedback">{correct ? question.explanation : 'Not quite. Slow down and identify the table role or wall area.'}</p> : null}
    </div>
  );
}

function LessonFrame({
  eyebrow,
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
  eyebrow?: string;
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
    <div className="learn-lesson-template section-one-lesson section-three-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">{eyebrow ?? 'Concept'}</span>
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

function SeatTable({ activeSeat, onSeat }: { activeSeat?: string; onSeat?: (seat: string) => void }) {
  return (
    <div className="section-three-seat-table">
      {seats.map((seat, index) => (
        <button type="button" className={`${activeSeat === seat ? 'active' : ''} seat-${seat.toLowerCase()}`} onClick={() => onSeat?.(seat)} key={seat}>
          <span>{seat}</span>
          <small>{index === 0 ? 'Dealer' : 'Seat wind'}</small>
        </button>
      ))}
      <div className="section-three-turn-arrow">East → South → West → North</div>
    </div>
  );
}

function WallVisual({ liveDead = false, breakPoint = false }: { liveDead?: boolean; breakPoint?: boolean }) {
  return (
    <div className={`section-three-wall-visual ${liveDead ? 'split' : ''}`}>
      <div className="wall-row top">{Array.from({ length: 14 }).map((_, index) => <span className={breakPoint && index === 8 ? 'break' : ''} key={index}></span>)}</div>
      <div className="wall-row right">{Array.from({ length: 8 }).map((_, index) => <span className={liveDead && index > 4 ? 'dead' : ''} key={index}></span>)}</div>
      <div className="wall-row bottom">{Array.from({ length: 14 }).map((_, index) => <span key={index}></span>)}</div>
      <div className="wall-row left">{Array.from({ length: 8 }).map((_, index) => <span key={index}></span>)}</div>
      <strong>{liveDead ? 'Live Wall / Dead Wall' : breakPoint ? 'Dice Break Point' : 'Four Walls'}</strong>
    </div>
  );
}

function FlowStepper({ steps, active, onActive }: { steps: string[]; active: number; onActive: (index: number) => void }) {
  return (
    <div className="section-one-timeline">
      {steps.map((step, index) => (
        <button type="button" className={active === index ? 'active' : ''} onClick={() => onActive(index)} key={step}>
          <span>{index + 1}</span>
          {step}
        </button>
      ))}
    </div>
  );
}

export function SeatingSeatWindsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [activeSeat, setActiveSeat] = useState('East');
  const [visited, setVisited] = useState(() => new Set(['East']));
  const ready = visited.size === seats.length;

  const choose = (seat: string) => {
    setActiveSeat(seat);
    setVisited((current) => new Set([...current, seat]));
  };

  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Identify East first, then follow the rotation."
      copy={[
        'The four seats are East, South, West, and North. East is the dealer.',
        'Play order moves around the table from East to South to West to North, then back to East. Seat winds can matter for scoring, so it is worth knowing where you sit.',
      ]}
      visual={<SeatTable activeSeat={activeSeat} onSeat={choose} />}
      ruleTitle={activeSeat}
      rule={activeSeat === 'East' ? 'East is the dealer and starts the hand.' : `${activeSeat} is a non-dealer seat in the table order.`}
      check={<><h3>Tap each wind around the table.</h3><p>{ready ? 'You visited every seat.' : 'Start with East, then follow the rotation.'}</p></>}
      ready={ready}
      takeaway={{ title: 'Each player has a seat wind, and East is the dealer.', body: 'Find East first and the rest of the table becomes easier to read.' }}
    />
  );
}

export function DealerEastLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="East is a role for the current hand."
      copy={[
        'East is the dealer for the current hand. That means East starts the hand and has special importance in the flow of the game.',
        'When people say East, they often mean the dealer seat, not necessarily a fixed person. As hands end, a different player can become East.',
      ]}
      visual={<SeatTable activeSeat="East" />}
      ruleTitle="East starts."
      rule="East is always the dealer for the current hand."
      check={<ChoiceCheck question={{ prompt: 'Which seat is the dealer?', options: ['East', 'South', 'West', 'North'], answer: 0, explanation: 'Exactly. East is the dealer for the current hand.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'East is always the dealer for the current hand.', body: 'The person can change later, but the role is called East.' }}
    />
  );
}

export function WallLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [active, setActive] = useState(0);
  const ready = active === wallSteps.length - 1;
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="The wall is the face-down supply."
      copy={[
        'Before the hand begins, all tiles are shuffled face down. Each player builds a wall in front of them using two-tile-high stacks.',
        'The four walls form a square. Players draw from the wall in order, so keeping it neat matters.',
      ]}
      visual={<WallVisual />}
      ruleTitle={wallSteps[active]}
      rule="The wall is built before play and becomes the supply of tiles for the hand."
      check={<><h3>Build the wall step by step.</h3><FlowStepper steps={wallSteps} active={active} onActive={setActive} /></>}
      ready={ready}
      takeaway={{ title: 'The wall is the face-down supply of tiles used during the hand.', body: 'Neat walls make the rest of setup easier.' }}
    />
  );
}

export function DiceOpeningLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [selected, setSelected] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Dice create the official starting point."
      copy={[
        'The dice determine where the wall is opened. The dealer rolls, the table identifies the wall and break point, and drawing begins from the correct place.',
        'Beginners do not need every dice-counting detail on day one. They do need to know the wall is opened by dice, not by a random hand choice.',
      ]}
      visual={<WallVisual breakPoint />}
      ruleTitle="Open by dice."
      rule="The dice decide where the wall opens and where drawing begins."
      check={<><h3>The dice selected this wall. Tap where the live wall begins.</h3><button type="button" className={`section-three-hotspot ${selected ? 'correct' : ''}`} onClick={() => setSelected(true)}>Live wall begins after the break</button></>}
      ready={selected}
      takeaway={{ title: 'The dice decide where the wall opens and where drawing begins.', body: 'This gives setup an official shared starting point.' }}
    />
  );
}

export function LiveDeadWallLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Normal draw from live wall, kong supplement from dead wall."
      copy={[
        'The live wall is where normal draws come from. The dead wall, also called the kong tail, is reserved for supplement tiles after kongs.',
        'On a normal turn, draw from the live wall. After a valid kong is declared, draw the supplement tile from the dead wall.',
      ]}
      visual={<WallVisual liveDead />}
      ruleTitle="Different draw sources."
      rule="Normal turns draw from the live wall. Kong supplements come from the dead wall."
      check={<ChoiceCheck question={{ prompt: 'After declaring a kong, where does the supplement tile come from?', options: ['The river', 'The live wall', 'The dead wall / kong tail', 'Another player'], answer: 2, explanation: 'Correct. Kong supplements come from the dead wall.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Normal turns draw from the live wall. Kong supplements come from the dead wall.', body: 'This distinction prevents many setup and kong mistakes.' }}
    />
  );
}

export function DealingTilesLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [active, setActive] = useState(0);
  const ready = active === dealSteps.length - 1;
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="East starts; everyone else follows in table order."
      copy={[
        'After the wall is opened, tiles are dealt starting with East and continuing around the table.',
        'The deal gives everyone their starting hand. East begins with the extra tile needed to start play, then discards first.',
      ]}
      visual={<SeatTable activeSeat={seats[Math.min(active, 3)]} />}
      ruleTitle={dealSteps[active]}
      rule="Dealing starts with East and proceeds around the table."
      check={<><h3>Tap through the dealing sequence.</h3><FlowStepper steps={dealSteps} active={active} onActive={setActive} /></>}
      ready={ready}
      takeaway={{ title: 'Dealing starts with East and proceeds around the table.', body: 'East starts the first play rhythm by discarding.' }}
    />
  );
}

export function TableAreasLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [active, setActive] = useState('Wall');
  const [visited, setVisited] = useState(() => new Set(['Wall']));
  const ready = visited.size === Object.keys(tableAreas).length;

  const choose = (area: string) => {
    setActive(area);
    setVisited((current) => new Set([...current, area]));
  };

  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Every tile needs a clear place."
      copy={[
        'A mahjong table has distinct areas. The wall is the face-down supply. The river is the face-up discard area.',
        'Your concealed hand is private. Open melds are exposed sets from calls or declared kongs.',
      ]}
      visual={<div className="section-two-table-map">{Object.keys(tableAreas).map((area) => <button type="button" className={active === area ? 'active' : ''} onClick={() => choose(area)} key={area}>{area}</button>)}</div>}
      ruleTitle={active}
      rule={tableAreas[active]}
      check={<><h3>Tap each area of the table.</h3><p>{ready ? 'You visited each area.' : 'Tap wall, river, concealed hand, and open meld area.'}</p></>}
      ready={ready}
      takeaway={{ title: 'Knowing the table areas helps you follow the game and avoid mistakes.', body: 'Clear placement makes the game easier for everyone.' }}
    />
  );
}

export function CommonSetupMistakesLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const scenario = mistakes[index];
  const ready = mistakes.every((_, mistakeIndex) => solved[mistakeIndex]);

  const choose = (answer: string) => {
    if (answer === scenario.answer) {
      setSolved((current) => ({ ...current, [index]: true }));
    }
  };

  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Setup errors are normal; careful habits prevent them."
      copy={[
        'Most setup mistakes come from rushing: wrong dealer, wrong tile count, looking too early, drawing from the wrong part of the wall, or confusing live wall with dead wall.',
        'The best beginner habit is to slow down and confirm East, the wall opening, and tile counts before play begins.',
      ]}
      visual={<div className="section-three-mistake-card"><span className="eyebrow">Scenario</span><h3>{scenario.title}</h3>{solved[index] ? <p>{scenario.explanation}</p> : null}</div>}
      ruleTitle="Check before play."
      rule="Confirm dealer, wall opening, and tile counts before the first discard."
      check={<><h3>Spot the setup mistake.</h3><div className="section-one-answer-grid">{['Wrong dealer', 'Wrong tile count', 'Looking too early', 'Wrong wall area'].map((answer) => <button type="button" className={solved[index] && answer === scenario.answer ? 'correct' : ''} onClick={() => choose(answer)} key={answer}>{answer}</button>)}</div><div className="section-two-pager">{mistakes.map((item, mistakeIndex) => <button type="button" className={mistakeIndex === index ? 'active' : ''} onClick={() => setIndex(mistakeIndex)} key={item.title}>{mistakeIndex + 1}</button>)}</div></>}
      ready={ready}
      takeaway={{ title: 'Most setup mistakes come from wrong dealer, wrong count, or wrong wall area.', body: 'Slow setup creates cleaner play.' }}
    />
  );
}

export function SectionThreeRecap() {
  return (
    <div className="section-one-recap">
      <div className="learn-content-grid">
        {recapItems.map((item) => (
          <div className="learn-content-card" key={item.title}>
            <span className="eyebrow">Remember</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
      <div className="learn-complete-card section-one-recap-flow">
        <div>
          <span className="eyebrow">Setup habit</span>
          <h3>Confirm East, wall opening, and tile counts.</h3>
          <p>Those checks prevent most beginner setup errors.</p>
        </div>
        <TileRail tiles={['東', '南', '西', '北', '中']} />
      </div>
    </div>
  );
}

export function SectionThreeCheckpoint() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => checkpointQuestions.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0), [answers]);
  const answeredCount = Object.keys(answers).length;

  const submit = () => {
    setSubmitted(true);
    completeLesson('setup-and-dealing/checkpoint', '/learn/turn-flow-and-discarding');
    completeSection('section-3');
  };

  return (
    <div className="section-one-checkpoint">
      <div className="learn-content-card section-one-checkpoint-intro">
        <span className="eyebrow">Checkpoint quiz</span>
        <h3>Can you start a hand correctly?</h3>
        <p>Answer all eight questions, then submit to see your score.</p>
      </div>
      <div className="section-one-question-list">
        {checkpointQuestions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const isCorrect = selected === question.answer;
          return (
            <section className="learn-content-card section-one-question-card" key={question.prompt}>
              <span className="eyebrow">Question {questionIndex + 1}</span>
              <h3>{question.prompt}</h3>
              <div className="section-one-answer-grid">
                {question.options.map((option, optionIndex) => (
                  <button
                    type="button"
                    className={selected === optionIndex && submitted ? (isCorrect ? 'correct' : 'incorrect') : selected === optionIndex ? 'active' : ''}
                    onClick={() => {
                      setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
                      setSubmitted(false);
                    }}
                    key={option}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {submitted && selected !== undefined ? <p className="section-one-feedback">{isCorrect ? question.explanation : 'Not quite. Review setup order and table areas, then try again.'}</p> : null}
            </section>
          );
        })}
      </div>
      <div className="learn-complete-card section-one-score-card">
        <div>
          <span className="eyebrow">Score</span>
          <h3>{submitted ? `${score}/${checkpointQuestions.length} Correct` : `${answeredCount} / ${checkpointQuestions.length} answered`}</h3>
          <p>{submitted ? 'Score recorded. Keep moving while the ideas are fresh.' : 'Submit when every question has an answer.'}</p>
        </div>
        {submitted ? (
          <a className="btn-primary gold" href="/learn/turn-flow-and-discarding">
            Continue to next section
          </a>
        ) : (
          <button type="button" className="btn-primary gold" disabled={answeredCount < checkpointQuestions.length} onClick={submit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
