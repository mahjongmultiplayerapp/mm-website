'use client';

import { useEffect, useMemo, useState } from 'react';
import { MiniTile } from './components';

type LessonRuntimeProps = {
  lessonId: string;
  nextHref: string;
};

const storageKey = 'mahjong-multiplayer-learn-progress';

const styles = [
  {
    title: 'Hong Kong Mahjong',
    eyebrow: 'This course',
    detail: 'Fast, social, call-friendly, and scored with fan.',
    tiles: ['東', '南', '發'],
  },
  {
    title: 'Riichi',
    eyebrow: 'Japanese style',
    detail: 'Uses riichi declarations, dora, and a different scoring system.',
    tiles: ['一', '九', '白'],
  },
  {
    title: 'Taiwanese',
    eyebrow: '16-tile style',
    detail: 'Often played with larger hands and regional table rules.',
    tiles: ['三', '四', '五'],
  },
  {
    title: 'Other Chinese Styles',
    eyebrow: 'Regional family',
    detail: 'Rules can change by city, family, club, or table convention.',
    tiles: ['中', '西', '北'],
  },
];

const handFlowSteps = ['Setup', 'Deal', 'Play', 'Calls', 'Win / Draw', 'Score'];

const recapItems = [
  {
    title: 'Hong Kong Mahjong is one ruleset.',
    body: 'Mahjong has many variants. This course teaches 13-tile Classical Hong Kong Mahjong.',
  },
  {
    title: 'A hand has a clear goal.',
    body: 'Players race to complete a legal winning hand before the wall runs out.',
  },
  {
    title: 'The table has a shape.',
    body: 'Four players sit as East, South, West, and North. East is the dealer.',
  },
  {
    title: 'A hand has a rhythm.',
    body: 'Setup, deal, play, calls, win or draw, then score.',
  },
];

const checkpointQuestions = [
  {
    prompt: 'What is the goal of a hand?',
    options: ['Collect the most tiles', 'Complete a legal winning hand', 'Always call every discard', 'Avoid discarding honors'],
    answer: 1,
    explanation: 'Exactly. The hand is a race to complete a legal winning hand.',
  },
  {
    prompt: 'What is the usual shape of a standard winning hand?',
    options: ['3 melds + 2 pairs', '4 melds + 1 pair', '5 pairs', 'Any 14 tiles in one suit'],
    answer: 1,
    explanation: 'Right. The basic shape to remember is four melds plus one pair.',
  },
  {
    prompt: 'How many players sit at a Hong Kong Mahjong table?',
    options: ['2', '3', '4', '5'],
    answer: 2,
    explanation: 'Correct. Mahjong is organized around a four-player table.',
  },
  {
    prompt: 'Which seat is the dealer at the start of a hand?',
    options: ['East', 'South', 'West', 'North'],
    answer: 0,
    explanation: 'Yes. East is the dealer and starts the hand.',
  },
  {
    prompt: 'Which sequence best describes one hand?',
    options: ['Score, setup, deal, play', 'Setup, deal, play, score', 'Calls, score, setup, deal', 'Deal, score, play, setup'],
    answer: 1,
    explanation: 'That is the table rhythm: setup, deal, play, then score if someone wins.',
  },
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

function CompleteButton({ lessonId, nextHref, ready = true }: LessonRuntimeProps & { ready?: boolean; label?: string }) {
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

function MiniTable({ activeSeat, onSeat }: { activeSeat?: string; onSeat?: (seat: string) => void }) {
  const seats = [
    { id: 'East', meta: 'Dealer', className: 'welcome-seat-east' },
    { id: 'South', meta: 'Next seat', className: 'welcome-seat-south' },
    { id: 'West', meta: 'Across', className: 'welcome-seat-west' },
    { id: 'North', meta: 'Fourth seat', className: 'welcome-seat-north' },
  ];

  return (
    <div className="welcome-table section-one-table">
      {seats.map((seat) => (
        <button
          type="button"
          className={`welcome-seat ${seat.className} ${activeSeat === seat.id ? 'active' : ''}`}
          key={seat.id}
          onClick={() => onSeat?.(seat.id)}
        >
          <span>{seat.id}</span>
          <small>{seat.meta}</small>
        </button>
      ))}
      <div className="welcome-wall welcome-wall-top"></div>
      <div className="welcome-wall welcome-wall-right"></div>
      <div className="welcome-wall welcome-wall-bottom"></div>
      <div className="welcome-wall welcome-wall-left"></div>
      <div className="welcome-table-center">
        <strong>Draw</strong>
        <span>Discard</span>
        <span>Call</span>
        <strong>Complete</strong>
      </div>
    </div>
  );
}

function TileGroup({ label, tiles }: { label: string; tiles: string[] }) {
  return (
    <div className="section-one-tile-group">
      <div className="learn-tile-rail">
        {tiles.map((tile, index) => (
          <MiniTile tile={tile} key={`${tile}-${index}`} />
        ))}
      </div>
      <small>{label}</small>
    </div>
  );
}

export function MahjongStylesLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewed, setViewed] = useState(() => new Set([0]));
  const current = styles[activeIndex];
  const allViewed = viewed.size === styles.length;
  const viewedProgress = (viewed.size / styles.length) * 100;

  const selectStyle = (index: number) => {
    setActiveIndex(index);
    setViewed((items) => new Set([...items, index]));
  };

  return (
    <div className="learn-lesson-template section-one-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Mahjong is a family of games.</h3>
        <p>
          Mahjong is not one single universal game. It is a family of related games, like poker has Texas Hold&apos;em, Omaha, and other variants. Hong Kong Mahjong is
          one of the most common Chinese-style rulesets.
        </p>
        <p>This course teaches 13-tile Classical Hong Kong Mahjong, so when you see rules from other versions, expect differences.</p>
      </article>

      <section className="learn-content-card section-one-carousel">
        <div className="learn-card-title-row">
          <span className="eyebrow">Visual example</span>
          <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={allViewed} />
        </div>
        <h3>Swipe through common mahjong styles.</h3>
        <p>{allViewed ? 'You viewed all styles. The important habit is knowing which ruleset your table is using.' : 'Open each style card to see how this course focuses on Hong Kong Mahjong.'}</p>
        <div className="welcome-flow-meter" aria-label={`${viewed.size} of ${styles.length} style cards viewed`}>
          <span style={{ width: `${viewedProgress}%` }} />
        </div>
        <div className="section-one-style-card">
          <span className="eyebrow">{current.eyebrow}</span>
          <h3>{current.title}</h3>
          <p>{current.detail}</p>
          <div className="learn-tile-rail">
            {current.tiles.map((tile) => (
              <MiniTile tile={tile} key={tile} />
            ))}
          </div>
        </div>
        <div className="section-one-tabs" role="tablist" aria-label="Mahjong styles">
          {styles.map((style, index) => (
            <button type="button" className={index === activeIndex ? 'active' : ''} onClick={() => selectStyle(index)} key={style.title}>
              {style.title}
            </button>
          ))}
        </div>
      </section>

      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Learn one table at a time.</h3>
        <p>Do not panic if another table plays slightly differently. This curriculum gives you one clear ruleset first.</p>
      </section>

      <section className="learn-content-card learn-takeaway-card">
        <span className="eyebrow">Takeaway</span>
        <h3>Mahjong is not one universal ruleset.</h3>
        <p>This course teaches Hong Kong Mahjong specifically.</p>
      </section>
    </div>
  );
}

export function ObjectiveLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === 1;

  return (
    <div className="learn-lesson-template section-one-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Your job is to finish a legal hand.</h3>
        <p>
          Your job in each hand is to be the first player to make a legal winning hand. The standard winning hand is four completed groups, called melds, plus one
          pair.
        </p>
        <p>Shape comes first: before scoring or strategy matters, your tiles must actually form a legal hand.</p>
      </article>

      <section className="learn-content-card section-one-hand-card">
        <span className="eyebrow">Visual example</span>
        <div className="section-one-hand-shape">
          <TileGroup label="Meld 1" tiles={['一', '二', '三']} />
          <TileGroup label="Meld 2" tiles={['五', '五', '五']} />
          <TileGroup label="Meld 3" tiles={['七', '八', '九']} />
          <TileGroup label="Meld 4" tiles={['發', '發', '發']} />
          <TileGroup label="Pair" tiles={['東', '東']} />
        </div>
      </section>

      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Repeat the shape.</h3>
        <p>Most winning hands are four melds plus one pair. Later lessons teach what counts as a meld.</p>
      </section>

      <section className="learn-complete-card section-one-quiz-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <h3>What is the usual shape of a standard winning hand?</h3>
          <div className="section-one-answer-grid">
            {['3 melds + 2 pairs', '4 melds + 1 pair', '5 pairs', 'Any 14 tiles with the same suit'].map((answer, index) => (
              <button type="button" className={selected === index ? (correct ? 'correct' : 'incorrect') : ''} onClick={() => setSelected(index)} key={answer}>
                {answer}
              </button>
            ))}
          </div>
          {selected !== null ? <p className="section-one-feedback">{correct ? 'Exactly. Four melds plus one pair is the shape to repeat until it becomes automatic.' : 'Not quite. Look back at the hand skeleton and count the groups.'}</p> : null}
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={correct} />
      </section>

      <section className="learn-content-card learn-takeaway-card">
        <span className="eyebrow">Takeaway</span>
        <h3>The standard winning shape is four melds plus one pair.</h3>
        <p>That mental shape will make every later lesson easier.</p>
      </section>
    </div>
  );
}

export function ShapeOfGameLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [activeSeat, setActiveSeat] = useState('East');
  const [visited, setVisited] = useState(() => new Set(['East']));
  const allVisited = visited.size === 4;
  const visitedProgress = (visited.size / 4) * 100;
  const descriptions: Record<string, string> = {
    East: 'East is the dealer for this hand and starts play.',
    South: 'South is the next seat in normal turn order.',
    West: 'West sits across from East.',
    North: 'North completes the four-player table.',
  };

  const selectSeat = (seat: string) => {
    setActiveSeat(seat);
    setVisited((items) => new Set([...items, seat]));
  };

  return (
    <div className="learn-lesson-template section-one-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Seats organize the game.</h3>
        <p>
          Every hand happens around a four-player table. The seats are named East, South, West, and North. East is special because East is the dealer for the current
          hand and starts play.
        </p>
        <p>A full game is made of many individual hands, and the dealer position moves as hands finish.</p>
      </article>

      <section className="learn-content-card welcome-table-card">
        <div className="learn-card-title-row">
          <span className="eyebrow">Visual example</span>
          <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={allVisited} />
        </div>
        <h3>Tap each seat to learn its role.</h3>
        <p>{allVisited ? 'You have visited every seat. East is the dealer, and every player has a seat wind.' : 'Tap East, South, West, and North on the table.'}</p>
        <div className="welcome-flow-meter" aria-label={`${visited.size} of 4 seats visited`}>
          <span style={{ width: `${visitedProgress}%` }} />
        </div>
        <MiniTable activeSeat={activeSeat} onSeat={selectSeat} />
      </section>

      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>{activeSeat}</h3>
        <p>{descriptions[activeSeat]}</p>
      </section>

      <section className="learn-content-card learn-takeaway-card">
        <span className="eyebrow">Takeaway</span>
        <h3>Every hand has a dealer, and every player has a seat wind.</h3>
        <p>The seats give the table its order and help organize the whole game.</p>
      </section>
    </div>
  );
}

export function HandFlowLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [activeStep, setActiveStep] = useState(0);
  const complete = activeStep === handFlowSteps.length - 1;
  const stepProgress = ((activeStep + 1) / handFlowSteps.length) * 100;
  const descriptions = [
    'Shuffle the tiles and build the wall.',
    'Open the wall and deal each player their starting hand.',
    'East begins, then players draw and discard in turn.',
    'Useful discards can be claimed by legal calls.',
    'Someone completes a hand, or the wall runs out.',
    'If someone wins, the table verifies and scores the hand.',
  ];

  return (
    <div className="learn-lesson-template section-one-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>A hand follows a predictable rhythm.</h3>
        <p>
          First, players shuffle and build the wall. Then the wall is opened and tiles are dealt. East starts. Players take turns drawing and discarding. After each
          discard, other players get a chance to call that tile if it helps them.
        </p>
        <p>Eventually, someone wins, or the wall runs out and the hand is drawn.</p>
      </article>

      <section className="learn-content-card section-one-timeline-card">
        <div className="learn-card-title-row">
          <span className="eyebrow">Visual example</span>
          <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={complete} />
        </div>
        <h3>Tap through one complete hand from setup to scoring.</h3>
        <p>{complete ? 'You reached scoring. You can now narrate the full shape of one hand.' : 'Tap each stage in order.'}</p>
        <div className="welcome-flow-meter" aria-label={`Step ${activeStep + 1} of ${handFlowSteps.length}`}>
          <span style={{ width: `${stepProgress}%` }} />
        </div>
        <div className="section-one-timeline">
          {handFlowSteps.map((step, index) => (
            <button type="button" className={index === activeStep ? 'active' : ''} onClick={() => setActiveStep(index)} key={step}>
              <span>{index + 1}</span>
              {step}
            </button>
          ))}
        </div>
      </section>

      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>{handFlowSteps[activeStep]}</h3>
        <p>{descriptions[activeStep]}</p>
      </section>

      <section className="learn-content-card learn-takeaway-card">
        <span className="eyebrow">Takeaway</span>
        <h3>A hand is a repeated cycle of setup, play, win or draw, then scoring.</h3>
        <p>You do not need every detailed rule yet. First, learn the rhythm.</p>
      </section>
    </div>
  );
}

export function SectionOneRecap() {
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
          <span className="eyebrow">Big picture</span>
          <h3>Can you narrate one hand?</h3>
          <p>Four players sit down, build the wall, deal, draw and discard, call when legal, win or draw, then score.</p>
        </div>
        <div className="learn-tile-rail">
          {['東', '南', '西', '北', '中'].map((tile) => (
            <MiniTile tile={tile} key={tile} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SectionOneCheckpoint() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => checkpointQuestions.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0), [answers]);
  const answeredCount = Object.keys(answers).length;

  const submit = () => {
    setSubmitted(true);
    completeLesson('what-is-hong-kong-mahjong/checkpoint', '/learn/tiles-melds-winning-hands');
    completeSection('section-1');
  };

  return (
    <div className="section-one-checkpoint">
      <div className="learn-content-card section-one-checkpoint-intro">
        <span className="eyebrow">Checkpoint quiz</span>
        <h3>Do you understand the big picture?</h3>
        <p>Answer all five questions, then submit to see your score.</p>
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
              {submitted && selected !== undefined ? <p className="section-one-feedback">{isCorrect ? question.explanation : 'Not quite. Review the section recap and try again.'}</p> : null}
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
          <a className="btn-primary gold" href="/learn/tiles-melds-winning-hands">
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
