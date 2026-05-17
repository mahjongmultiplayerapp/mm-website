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
const diceWallMap = [
  { totals: '2, 6, 10', wall: 'South' },
  { totals: '3, 7, 11', wall: 'West' },
  { totals: '4, 8, 12', wall: 'North' },
  { totals: '5, 9', wall: 'East' },
];
const diceOpeningQuestions: ChoiceQuestion[] = [
  {
    prompt: 'East rolls 3 + 5 = 8. Which wall is broken?',
    options: ['East', 'South', 'West', 'North'],
    answer: 3,
    explanation: 'Starting with East as 1 and counting East, South, West, North, a total of 8 lands on North.',
  },
  {
    prompt: 'Once North’s wall is selected, where do you start counting stacks?',
    options: ['From North’s right-hand end', 'From East’s wall', 'From the center of the wall', 'From any loose tile'],
    answer: 0,
    explanation: 'Count stacks from the selected player’s right-hand end, from that player’s perspective.',
  },
  {
    prompt: 'With a dice total of 8, where is the break made?',
    options: ['Before the 8th stack', 'After the 8th stack', 'After 8 individual tiles', 'At the opposite wall'],
    answer: 1,
    explanation: 'Count 8 stacks, then break immediately after the counted stack.',
  },
];
const liveDeadQuestions: ChoiceQuestion[] = [
  {
    prompt: 'On a normal turn, where does a player draw from?',
    options: ['Live wall', 'Dead wall / kong box', 'River', 'Open meld area'],
    answer: 0,
    explanation: 'Normal turn draws come from the live wall.',
  },
  {
    prompt: 'How large is the standard dead wall reserve?',
    options: ['7 stacks / 14 tiles', '8 stacks / 16 tiles', '14 stacks / 28 tiles', 'The whole selected wall'],
    answer: 0,
    explanation: 'The dead wall is usually 14 tiles, which is 7 two-tile stacks.',
  },
  {
    prompt: 'After the break is made, which stacks become the dead wall?',
    options: ['The first 7 stacks on the draw side', 'The 7 stacks immediately behind the break', 'Any 7 stacks chosen by East', 'The last 7 discards'],
    answer: 1,
    explanation: 'The dead wall is the 7-stack reserve immediately behind the break, on the side opposite the live draw start.',
  },
  {
    prompt: 'Which event uses the dead wall?',
    options: ['A normal turn draw', 'A flower, season, or kong replacement', 'Any discard', 'The final draw after the live wall runs out'],
    answer: 1,
    explanation: 'Flowers, seasons, and declared kongs need replacement tiles from the dead wall.',
  },
];

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
  { prompt: 'What do the dice determine?', options: ['The winner', 'Which wall and break point to use', 'Which suit is wild', 'The final score'], answer: 1, explanation: 'The dice total chooses the wall and the exact break point in that wall.' },
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

function WallPhotoVisual() {
  return (
    <img
      className="section-three-wall-photo"
      src="/assets/lesson-3-mahjong-wall.jpg"
      alt="A mahjong wall built from stacked face-down tiles."
    />
  );
}

function DiceOpeningVisual() {
  return (
    <div className="section-three-dice-guide">
      <div className="section-three-dice-example">
        <span className="eyebrow">Example roll</span>
        <strong>3 + 5 = 8</strong>
        <p>Count players from East in turn order: East, South, West, North. The 8 lands on North.</p>
      </div>
      <div className="section-three-dice-map">
        {diceWallMap.map((item) => (
          <div className={item.wall.startsWith('North') ? 'active' : ''} key={item.totals}>
            <span>{item.totals}</span>
            <strong>{item.wall}</strong>
          </div>
        ))}
      </div>
      <div className="section-three-stack-count" aria-label="Eight stacks counted from the right end of North's wall">
        {Array.from({ length: 17 }).map((_, index) => {
          const stackNumber = 17 - index;
          const isCounted = stackNumber <= 8;

          return (
            <span className={`${isCounted ? 'counted' : ''} ${stackNumber === 8 ? 'break-after' : ''}`} key={stackNumber}>
              {isCounted ? stackNumber : ''}
            </span>
          );
        })}
      </div>
      <p className="section-three-dice-note">From North’s right-hand end, count 8 stacks and break after the 8th stack.</p>
    </div>
  );
}

function DiceOpeningCheck({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const complete = diceOpeningQuestions.every((question, index) => answers[index] === question.answer);

  useEffect(() => {
    if (complete) onComplete();
  }, [complete, onComplete]);

  return (
    <div className="section-three-dice-check">
      <h3>Use the roll 3 + 5 = 8.</h3>
      {diceOpeningQuestions.map((question, questionIndex) => (
        <div className="section-three-dice-question" key={question.prompt}>
          <p>{question.prompt}</p>
          <div className="section-one-answer-grid">
            {question.options.map((option, optionIndex) => {
              const selected = answers[questionIndex] === optionIndex;
              const correct = selected && optionIndex === question.answer;
              const incorrect = selected && optionIndex !== question.answer;

              return (
                <button
                  type="button"
                  className={correct ? 'correct' : incorrect ? 'incorrect' : ''}
                  onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                  key={option}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {answers[questionIndex] !== undefined ? <p className="section-one-feedback">{question.explanation}</p> : null}
        </div>
      ))}
    </div>
  );
}

function LiveDeadWallVisual() {
  return (
    <div className="section-three-live-dead-guide">
      <div className="section-three-live-dead-wall">
        <div className="section-three-live-dead-row" aria-label="Dead wall and live wall separated by the break point">
          {Array.from({ length: 17 }).map((_, index) => {
            const stackNumber = index + 1;
            const isDead = stackNumber <= 7;
            const isLiveStart = stackNumber === 8;

            return (
              <span className={`${isDead ? 'dead' : 'live'} ${isLiveStart ? 'live-start' : ''}`} key={stackNumber}>
                {isDead ? stackNumber : isLiveStart ? 8 : ''}
              </span>
            );
          })}
        </div>
        <div className="section-three-live-dead-legend">
          <span>Dead wall / kong box: 7 stacks behind the break</span>
          <span>Live wall starts at stack 8 and continues right</span>
        </div>
      </div>
      <div className="section-three-live-dead-labels">
        <div>
          <span className="eyebrow">Live wall</span>
          <strong>Main draw pile</strong>
          <p>Normal turns draw from here after the initial deal.</p>
        </div>
        <div>
          <span className="eyebrow">Dead wall / kong box</span>
          <strong>7 stacks = 14 tiles</strong>
          <p>The 7 stacks immediately behind the break become the replacement reserve.</p>
        </div>
      </div>
      <div className="section-three-replacement-grid">
        <div>
          <strong>Flower or season</strong>
          <p>Reveal it, set it aside, then draw a replacement from the dead wall.</p>
        </div>
        <div>
          <strong>Kong</strong>
          <p>Declare the kong, draw one replacement from the dead wall, then discard.</p>
        </div>
        <div>
          <strong>Live wall empty</strong>
          <p>If no one wins before the live wall runs out, the hand is a draw.</p>
        </div>
      </div>
    </div>
  );
}

function LiveDeadWallCheck({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const complete = liveDeadQuestions.every((question, index) => answers[index] === question.answer);

  useEffect(() => {
    if (complete) onComplete();
  }, [complete, onComplete]);

  return (
    <div className="section-three-dice-check">
      <h3>Choose the right wall area.</h3>
      {liveDeadQuestions.map((question, questionIndex) => (
        <div className="section-three-dice-question" key={question.prompt}>
          <p>{question.prompt}</p>
          <div className="section-one-answer-grid">
            {question.options.map((option, optionIndex) => {
              const selected = answers[questionIndex] === optionIndex;
              const correct = selected && optionIndex === question.answer;
              const incorrect = selected && optionIndex !== question.answer;

              return (
                <button
                  type="button"
                  className={correct ? 'correct' : incorrect ? 'incorrect' : ''}
                  onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                  key={option}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {answers[questionIndex] !== undefined ? <p className="section-one-feedback">{question.explanation}</p> : null}
        </div>
      ))}
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
      visual={<WallPhotoVisual />}
      ruleTitle={wallSteps[active]}
      rule="The wall is built before play and becomes the supply of tiles for the hand."
      check={<><h3>Build the wall step by step.</h3><FlowStepper steps={wallSteps} active={active} onActive={setActive} /></>}
      ready={ready}
      takeaway={{ title: 'The wall is the face-down supply of tiles used during the hand.', body: 'Neat walls make the rest of setup easier.' }}
    />
  );
}

export function DiceOpeningLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Dice choose the wall and the break point."
      copy={[
        'After the four walls are built, East rolls two dice and adds the total. That same total does two jobs: it chooses which player’s wall is broken, and it chooses the exact break point in that wall.',
        'Count players from East as 1 in normal turn order: East, South, West, North. Totals 2, 6, and 10 break South’s wall; 3, 7, and 11 break West’s wall; 4, 8, and 12 break North’s wall; 5 and 9 break East’s wall.',
        'Once the wall is selected, count that number of stacks from the selected player’s right-hand end. Count stacks, not individual tiles. Break immediately after the counted stack, then dealing begins from the break.',
      ]}
      visual={<DiceOpeningVisual />}
      ruleTitle="Count walls, then stacks."
      rule="Use the dice total to count players from East, then count that many stacks from the selected wall’s right-hand end and break after the counted stack."
      check={<DiceOpeningCheck onComplete={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'The dice total chooses both the wall and the break point.', body: 'For a roll of 8, break North’s wall after counting 8 stacks from North’s right-hand end.' }}
    />
  );
}

export function LiveDeadWallLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Live wall for normal draws, dead wall for replacements."
      copy={[
        'After the dice break, the wall has two jobs. The live wall is the main draw pile: after the initial deal, ordinary turns draw from the live wall in order.',
        'The dead wall, also called the kong box, is a reserved section of 14 tiles, or 7 stacks. After the break is made, those 7 stacks are taken from the back side of the break, opposite the side where the dealer starts taking tiles. The remaining wall from the draw side is the live wall.',
        'The dead wall is used for replacement tiles. If a player receives or draws a flower or season, they reveal it, set it aside, and draw a replacement from the dead wall. When a player declares a kong, they also draw the replacement tile from the dead wall before discarding.',
        'If the live wall runs out before anyone wins, the hand ends in a draw. The dead wall does not become a normal draw pile.',
      ]}
      visual={<LiveDeadWallVisual />}
      ruleTitle="Reserve 7 stacks behind the break."
      rule="The live wall begins on the draw side of the break. The 7 stacks immediately behind the break become the 14-tile dead wall reserve."
      check={<LiveDeadWallCheck onComplete={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Live wall is ordinary play; dead wall is replacement reserve.', body: 'Do not use the dead wall as a normal draw pile, even near the end of the hand.' }}
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
