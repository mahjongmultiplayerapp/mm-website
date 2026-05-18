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
const wallStepRules = [
  'Start with all tiles face down and mix them thoroughly so no one knows where any tile is.',
  'Each player stacks tiles two high in front of them, building a straight wall 17 stacks long.',
  'The four player walls become the full square wall that supplies tiles for the hand.',
  'Push the walls inward until they form a tidy square, leaving a clean center for discards.',
];
const dealSteps = ['East takes first', 'South takes next', 'West takes next', 'North takes next', 'Repeat around the table', 'East starts the hand'];
const dealStepRules = [
  'East begins the deal by taking the first two stacks from the live wall, immediately beside the break.',
  'South takes the next two stacks from the wall after East has drawn.',
  'West follows South and takes the next two stacks in the dealing sequence.',
  'North takes the next two stacks, completing one full pass around the table.',
  'Continue cycling East, South, West, North until each player has 12 tiles.',
  'East takes the final two top-tier tiles to reach 14, while the other players finish with 13 tiles.',
];
const diceWallMap = [
  { totals: '2, 6, 10', wall: 'South' },
  { totals: '3, 7, 11', wall: 'West' },
  { totals: '4, 8, 12', wall: 'North' },
  { totals: '5, 9', wall: 'East' },
];
const diceOpeningQuestions: ChoiceQuestion[] = [
  {
    prompt: 'East rolls 1 + 4 = 5. Which wall is broken?',
    options: ['East', 'South', 'West', 'North'],
    answer: 0,
    explanation: 'Starting with East as 1 and counting East, South, West, North, a total of 5 lands back on East.',
  },
  {
    prompt: 'Once East’s wall is selected, where do you start counting stacks?',
    options: ['From East’s right-hand end', 'From South’s wall', 'From the center of the wall', 'From any loose tile'],
    answer: 0,
    explanation: 'Count stacks from the selected player’s right-hand end, from that player’s perspective.',
  },
  {
    prompt: 'With a dice total of 5, where is the break made?',
    options: ['Before the 5th stack', 'After the 5th stack', 'After 5 individual tiles', 'At the opposite wall'],
    answer: 1,
    explanation: 'Count 5 stacks, then break immediately after the counted stack.',
  },
];
const liveDeadQuestions: ChoiceQuestion[] = [
  {
    prompt: 'On a normal turn, where does a player draw from?',
    options: ['Live wall', 'Dead wall', 'River', 'Open meld area'],
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
    options: ['A normal turn draw', 'Kong tile replacement', 'Any discard', 'The final draw after the live wall runs out'],
    answer: 1,
    explanation: 'Declared kongs need replacement tiles from the dead wall.',
  },
];

const tableAreas: Record<string, string> = {
  'Concealed hand': 'Your private tiles, kept in front of you.',
  'Open meld area': 'Called melds and declared kongs, visible to everyone.',
  River: 'The face-up discard area where played tiles collect.',
  Wall: 'The face-down supply of tiles for the hand.',
};

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
      src="/assets/board-images/hong_kong/setup_walls.jpg"
      alt="A mahjong wall built from stacked face-down tiles."
    />
  );
}

function DiceOpeningVisual() {
  return (
    <div className="section-three-dice-guide">
      <div className="section-three-dice-example">
        <span className="eyebrow">Example roll</span>
        <strong>1 + 4 = 5</strong>
        <p>Count players from East in turn order: East, South, West, North. The 5 lands back on East.</p>
      </div>
      <div className="section-three-dice-map">
        {diceWallMap.map((item) => (
          <div className={item.wall === 'East' ? 'active' : ''} key={item.totals}>
            <span>{item.totals}</span>
            <strong>{item.wall}</strong>
          </div>
        ))}
      </div>
      <img
        className="section-three-wall-photo section-three-opening-photo"
        src="/assets/board-images/hong_kong/opening_the_wall.jpg"
        alt="A mahjong wall opened at the break point."
      />
      <p className="section-three-dice-note">From East’s right-hand end, count 5 stacks and break after the 5th stack.</p>
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
      <h3>Use the roll 1 + 4 = 5.</h3>
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
    <img
      className="section-three-wall-photo"
      src="/assets/board-images/hong_kong/live_and_dead_wall.jpg"
      alt="A mahjong wall showing the live wall and dead wall areas."
    />
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
      title="The wall is the face-down supply of tiles."
      copy={[
        'Before the hand begins, all 136 tiles are shuffled face down. Each player builds a wall in front of them using two-tile-high stacks that is 17 tiles long.',
        'The four walls form a square. Players draw from the wall in order, so keeping it neat matters.',
      ]}
      visual={<WallPhotoVisual />}
      ruleTitle={wallSteps[active]}
      rule={wallStepRules[active]}
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
        'Count players in counter-clockwise order starting from East as the first seat: East, South, West, North, East, South, West, etc. Keep going until you reach the number shown on the dice. This seat which you landed on is the wall which will be broken at.',
        'Once the wall is selected, count that number of stacks from the selected player’s right end of their wall. Count stacks, not individual tiles. Break immediately after the counted stack, then dealing begins from the break.',
      ]}
      visual={<DiceOpeningVisual />}
      ruleTitle="Count walls, then stacks."
      rule="Use the dice total to count players from East, then count that many stacks from the selected wall’s right-hand end and break after the counted stack."
      check={<DiceOpeningCheck onComplete={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'The dice total chooses both the wall and the break point.', body: 'For a roll of 5, break East’s wall after counting 5 stacks from East’s right-hand end.' }}
    />
  );
}

export function LiveDeadWallLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Draw from the live wall for normal draws, and dead wall for replacements."
      copy={[
        'After the dice break, the wall has two distinct ends. The live wall is the main draw pile: after the initial deal, ordinary turns draw from the live wall in order.',
        'The dead wall is a reserved section of 14 tiles, or 7 stacks. After the break is made, those 7 stacks are taken from the back side of the break, opposite the side where the dealer starts taking tiles.',
        'The dead wall is used for replacement tiles. When a player declares a Kong, they also draw the replacement tile from the dead wall before discarding.',
        'If the live wall runs out before anyone wins, the hand ends in a draw. The dead wall does not become a normal draw pile.',
      ]}
      visual={<LiveDeadWallVisual />}
      ruleTitle="Draw from the live wall, unless you had a Kong."
      rule="Normal draws come from the live wall. The dead wall is reserved for Kong replacement tiles."
      check={<LiveDeadWallCheck onComplete={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Live wall is ordinary play; dead wall is replacement reserve.', body: 'Do not use the dead wall as a normal draw pile. Only use it for Kong tile replacements, which you will learn about in more detail in later sections.' }}
    />
  );
}

function DealingTilesVisual() {
  return (
    <div className="section-three-dealing-photos">
      <img
        className="section-three-wall-photo"
        src="/assets/board-images/hong_kong/draw_from_wall.jpg"
        alt="A player drawing tiles from the opened mahjong wall."
      />
      <img
        className="section-three-wall-photo"
        src="/assets/board-images/hong_kong/drawing_final_tiles.jpg"
        alt="A player drawing the final setup tiles from the wall."
      />
    </div>
  );
}

function TableAreasVisual({ active, onChoose }: { active: string; onChoose: (area: string) => void }) {
  return (
    <div>
      <img
        className="section-three-wall-photo"
        src="/assets/board-images/hong_kong/table_areas.jpg"
        alt="A mahjong table showing the concealed hand, open meld area, river, and wall."
      />
      <div className="section-two-table-map">
        {Object.keys(tableAreas).map((area) => (
          <button type="button" className={active === area ? 'active' : ''} onClick={() => onChoose(area)} key={area}>
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DealingTilesLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [active, setActive] = useState(0);
  const ready = active === dealSteps.length - 1;
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="East draws first, followed by South, then West, and North, and so on."
      copy={[
        'After the wall is opened, East starts by drawing four tiles (two stacks) left of where the wall was broken.',
        'After East draws, then South draws the next two stacks, and then West, and then North. This continues until each player has twelve tiles in their hand.',
        'The order of play is counter-clockwise (e.g. East then South, etc). In contrast, the order of drawing tiles from the wall is clockwise.',
        'Once the dealer has twelve tiles, they draw two more from the top tier of the wall, by drawing one tile, skipping a tile, and then drawing one more tile (all from the top tier). This means the dealer has 14 tiles in their hand. All other players pick one last tile to end with 13 tiles in their hand.'
      ]}
      visual={<DealingTilesVisual />}
      ruleTitle={dealSteps[active]}
      rule={dealStepRules[active]}
      check={<><h3>Tap through the dealing sequence.</h3><FlowStepper steps={dealSteps} active={active} onActive={setActive} /></>}
      ready={ready}
      takeaway={{ title: 'Dealing starts with East and proceeds around the table.', body: 'East starts the first play rhythm by discarding.' }}
    />
  );
}

export function TableAreasLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [active, setActive] = useState('Concealed hand');
  const [visited, setVisited] = useState(() => new Set(['Concealed hand']));
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
      visual={<TableAreasVisual active={active} onChoose={choose} />}
      ruleTitle={active}
      rule={tableAreas[active]}
      check={<><h3>Tap each area of the table.</h3><p>{ready ? 'You visited each area.' : 'Tap concealed hand, open meld area, river, and wall.'}</p></>}
      ready={ready}
      takeaway={{ title: 'Knowing the table areas helps you follow the game and avoid mistakes.', body: 'Clear placement makes the game easier for everyone.' }}
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
    completeLesson('setup-and-dealing/checkpoint', '/learn/hong-kong/turn-flow-and-discarding');
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
          <a className="btn-primary gold" href="/learn/hong-kong/turn-flow-and-discarding">
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
