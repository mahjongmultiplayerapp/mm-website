'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Category = 'Tiles' | 'Setup' | 'Turn flow' | 'Calls' | 'Scoring' | 'Rounds';

type FinalQuestion = {
  category: Category;
  prompt: string;
  detail: string;
  options: string[];
  answer: number;
  explanation: string;
  reviewHref: string;
  reviewLabel: string;
  tiles?: string[];
};

const storageKey = 'mahjong-multiplayer-learn-progress';

const questions: FinalQuestion[] = [
  {
    category: 'Tiles',
    prompt: 'Which group is a sequence?',
    detail: 'A sequence uses three consecutive suited tiles.',
    options: ['2-3-4 bamboo', 'East-East-East', 'Red-Red-Red', '1-1-2 dots'],
    answer: 0,
    explanation: '2-3-4 in the same suit is a chow, which is a sequence.',
    reviewHref: '/learn/tiles-melds-winning-hands/tile-groupings',
    reviewLabel: 'Review tile groupings',
    tiles: ['2', '3', '4'],
  },
  {
    category: 'Tiles',
    prompt: 'Which group is not a valid sequence?',
    detail: 'Honors cannot form sequences.',
    options: ['3-4-5 characters', '6-7-8 dots', 'East-South-West', '1-2-3 bamboo'],
    answer: 2,
    explanation: 'Wind tiles are honors, so East-South-West cannot be a sequence.',
    reviewHref: '/learn/tiles-melds-winning-hands/honor-tiles',
    reviewLabel: 'Review honors',
    tiles: ['E', 'S', 'W'],
  },
  {
    category: 'Tiles',
    prompt: 'Which structure is the standard winning hand shape?',
    detail: 'Most hands use four melds and one pair.',
    options: ['Four melds plus one pair', 'Five pairs and one single', 'Three melds only', 'Four pairs and no melds'],
    answer: 0,
    explanation: 'The standard shape is four melds and a pair.',
    reviewHref: '/learn/tiles-melds-winning-hands/standard-winning-shape',
    reviewLabel: 'Review winning shape',
  },
  {
    category: 'Tiles',
    prompt: 'Why is this a near miss instead of a win?',
    detail: 'The tiles look organized, but one complete meld is still missing.',
    options: ['It has no pair', 'It has only three complete melds and a pair', 'It has too many dragons', 'It includes suited tiles'],
    answer: 1,
    explanation: 'A standard win needs four complete melds and a pair, not three melds and a pair.',
    reviewHref: '/learn/tiles-melds-winning-hands/valid-shape-vs-scoring-pattern',
    reviewLabel: 'Review shape vs scoring',
  },
  {
    category: 'Tiles',
    prompt: 'Which tiles are honors?',
    detail: 'Honors are winds and dragons.',
    options: ['East, Red Dragon, White Dragon', '1 dot, 2 dot, 3 dot', '4 bamboo, 5 bamboo, 6 bamboo', '7 character, 8 character, 9 character'],
    answer: 0,
    explanation: 'Winds and dragons are honor tiles.',
    reviewHref: '/learn/tiles-melds-winning-hands/honor-tiles',
    reviewLabel: 'Review honor tiles',
    tiles: ['E', 'R', 'W'],
  },
  {
    category: 'Setup',
    prompt: 'Who is the dealer at the start of a hand?',
    detail: 'Dealer is represented by East.',
    options: ['East', 'South', 'West', 'North'],
    answer: 0,
    explanation: 'East is the dealer and starts the hand.',
    reviewHref: '/learn/setup-and-dealing/dealer-and-east',
    reviewLabel: 'Review dealer and East',
  },
  {
    category: 'Setup',
    prompt: 'What is the live wall used for?',
    detail: 'Normal turn draws come from the live wall.',
    options: ['Normal draws during play', 'Score verification', 'Discard storage', 'Seat assignment only'],
    answer: 0,
    explanation: 'Players draw from the live wall during normal play.',
    reviewHref: '/learn/setup-and-dealing/live-wall-vs-dead-wall',
    reviewLabel: 'Review walls',
  },
  {
    category: 'Setup',
    prompt: 'After the wall is opened, what happens next?',
    detail: 'The hand begins only after players receive starting tiles.',
    options: ['Tiles are dealt to the players', 'Everyone scores immediately', 'The round ends', 'All exposed melds are declared'],
    answer: 0,
    explanation: 'After opening the wall, tiles are dealt into starting hands.',
    reviewHref: '/learn/setup-and-dealing/dealing-the-tiles',
    reviewLabel: 'Review dealing',
  },
  {
    category: 'Turn flow',
    prompt: 'East discards and nobody calls. Who acts next?',
    detail: 'Normal play follows table order.',
    options: ['South', 'West', 'North', 'East again'],
    answer: 0,
    explanation: 'If nobody calls, play continues to the next player in order: South.',
    reviewHref: '/learn/turn-flow-and-discarding/turn-order-around-the-table',
    reviewLabel: 'Review turn order',
  },
  {
    category: 'Turn flow',
    prompt: 'What is the basic shape of a normal turn?',
    detail: 'A turn has a simple rhythm.',
    options: ['Draw, consider, discard', 'Discard, draw, score', 'Call, shuffle, pass', 'Score, draw, reveal'],
    answer: 0,
    explanation: 'The basic turn rhythm is draw, consider, discard.',
    reviewHref: '/learn/turn-flow-and-discarding/anatomy-of-a-turn',
    reviewLabel: 'Review turn anatomy',
  },
  {
    category: 'Turn flow',
    prompt: 'When does the call window happen?',
    detail: 'Other players can only claim the latest discard during a brief window.',
    options: ['Immediately after a discard', 'Before anyone discards', 'After scoring is complete', 'During the deal'],
    answer: 0,
    explanation: 'The call window opens immediately after a discard.',
    reviewHref: '/learn/turn-flow-and-discarding/the-call-window',
    reviewLabel: 'Review call window',
  },
  {
    category: 'Calls',
    prompt: 'When is Chow legal?',
    detail: 'Chow completes a sequence.',
    options: ['Only from the player on your left', 'From any player for any group', 'Only from the dealer', 'Only with honor tiles'],
    answer: 0,
    explanation: 'Chow is legal only from the player on your left, and only for a sequence.',
    reviewHref: '/learn/calls-chow-pung-kong-win/chow',
    reviewLabel: 'Review Chow',
  },
  {
    category: 'Calls',
    prompt: 'When is Pung legal?',
    detail: 'Pung completes a triplet.',
    options: ['When any player discards the third matching tile and you hold two', 'Only from your left', 'Only after a kong', 'Only with numbered sequences'],
    answer: 0,
    explanation: 'Pung can claim a matching discard from any player when you hold the other two tiles.',
    reviewHref: '/learn/calls-chow-pung-kong-win/pung',
    reviewLabel: 'Review Pung',
  },
  {
    category: 'Calls',
    prompt: 'Which situation can create a big exposed kong?',
    detail: 'A big exposed kong uses another player’s discard.',
    options: ['You hold three matching tiles and claim the fourth from a discard', 'You call Chow from the left', 'You draw a winning tile', 'You reveal a pair'],
    answer: 0,
    explanation: 'A big exposed kong claims the fourth matching tile from another player’s discard.',
    reviewHref: '/learn/calls-chow-pung-kong-win/big-exposed-kong',
    reviewLabel: 'Review kong calls',
  },
  {
    category: 'Calls',
    prompt: 'Two players want the same discard: one can Chow, one can Win. What happens?',
    detail: 'Call priority resolves conflicts.',
    options: ['Win has priority', 'Chow has priority', 'The closest player always wins', 'Both players take the tile'],
    answer: 0,
    explanation: 'Win has highest priority over other calls.',
    reviewHref: '/learn/calls-chow-pung-kong-win/call-priority',
    reviewLabel: 'Review call priority',
  },
  {
    category: 'Scoring',
    prompt: 'What does the 3-fan minimum mean?',
    detail: 'Shape alone is not always enough.',
    options: ['A legal hand must have at least 3 fan to win', 'Every hand must have exactly 3 pairs', 'The dealer draws 3 extra tiles', 'Only 3 players pay'],
    answer: 0,
    explanation: 'In this curriculum, a winning hand needs legal shape and at least 3 fan.',
    reviewHref: '/learn/scoring-and-fan/what-makes-a-hand-winnable',
    reviewLabel: 'Review 3-fan minimum',
  },
  {
    category: 'Scoring',
    prompt: 'Which pattern is Dragon Pung?',
    detail: 'Dragon triplets are beginner fan patterns.',
    options: ['Three matching dragon tiles', 'Three consecutive suited tiles', 'Any pair of winds', 'A discarded tile from East'],
    answer: 0,
    explanation: 'A triplet of dragon tiles is Dragon Pung.',
    reviewHref: '/learn/scoring-and-fan/beginner-fan',
    reviewLabel: 'Review beginner fan',
    tiles: ['R', 'R', 'R'],
  },
  {
    category: 'Scoring',
    prompt: 'Who pays when you win on another player’s discard?',
    detail: 'Discard win and self-draw are paid differently.',
    options: ['The discarder pays the full amount', 'All three opponents pay equally', 'Only East pays', 'Nobody pays'],
    answer: 0,
    explanation: 'On a discard win, the discarder pays the full amount.',
    reviewHref: '/learn/scoring-and-fan/payment-basics',
    reviewLabel: 'Review payment basics',
  },
  {
    category: 'Scoring',
    prompt: 'Who pays when you self-draw?',
    detail: 'Self-draw is shared by opponents.',
    options: ['All three opponents', 'Only the previous discarder', 'Only South', 'Only the dealer'],
    answer: 0,
    explanation: 'Self-draw wins are paid by all three opponents.',
    reviewHref: '/learn/scoring-and-fan/payment-basics',
    reviewLabel: 'Review payment basics',
  },
  {
    category: 'Rounds',
    prompt: 'What is a drawn hand?',
    detail: 'A draw is an end state, not a call.',
    options: ['The live wall runs out and nobody wins', 'East always wins', 'A player calls Pung', 'A player reveals a chow'],
    answer: 0,
    explanation: 'A drawn hand means the live wall ran out before anyone won.',
    reviewHref: '/learn/rounds-draws-table-rules/drawn-hands',
    reviewLabel: 'Review drawn hands',
  },
  {
    category: 'Rounds',
    prompt: 'Which action is a beginner foul?',
    detail: 'Most table errors come from count, timing, or invalid calls.',
    options: ['Drawing before the prior discard window resolves', 'Keeping discards orderly', 'Calling Pung clearly', 'Verifying scores after a round'],
    answer: 0,
    explanation: 'Drawing too early disrupts the table order and can lead to a dead hand.',
    reviewHref: '/learn/rounds-draws-table-rules/dead-hands-and-common-errors',
    reviewLabel: 'Review common errors',
  },
];

const categories: Category[] = ['Tiles', 'Setup', 'Turn flow', 'Calls', 'Scoring', 'Rounds'];

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

function completeFinalTest() {
  const progress = readProgress();
  saveProgress({
    ...progress,
    completedSections: progress.completedSections.includes('final-readiness-test') ? progress.completedSections : [...progress.completedSections, 'final-readiness-test'],
    lastVisitedPath: '/learn/final-readiness-test',
  });
}

function saveProgress(progress: ReturnType<typeof readProgress>) {
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

function MiniTiles({ tiles }: { tiles?: string[] }) {
  if (!tiles?.length) return null;

  return (
    <div className="learn-tile-rail final-test-tiles" aria-hidden="true">
      {tiles.map((tile, index) => (
        <span className={`mini-tile ${['R', 'W'].includes(tile) ? 'red' : ''}`} key={`${tile}-${index}`}>
          {tile}
        </span>
      ))}
    </div>
  );
}

export function FinalReadinessTest() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const passed = submitted && score >= 17;
  const answeredCount = Object.keys(answers).length;
  const missedQuestions = submitted ? questions.filter((question, index) => answers[index] !== question.answer) : [];
  const reviewTargets = Array.from(new Map(missedQuestions.map((question) => [question.reviewHref, question])).values()).slice(0, 6);

  const categoryScores = categories.map((category) => {
    const categoryQuestions = questions
      .map((question, index) => ({ question, index }))
      .filter((item) => item.question.category === category);
    const correct = categoryQuestions.filter((item) => answers[item.index] === item.question.answer).length;
    return { category, correct, total: categoryQuestions.length };
  });

  useEffect(() => {
    if (passed) completeFinalTest();
  }, [passed]);

  return (
    <div className="final-test">
      <section className="learn-content-card final-test-intro">
        <span className="eyebrow">20 questions</span>
        <h3>Mixed practical checks</h3>
        <p>
          This final test samples the whole course: tiles, melds, setup, dealing, turn flow, calls, scoring, draws, and table etiquette. Score 17 out of 20 to pass.
        </p>
        <div className="final-test-progress" aria-label={`${answeredCount} of ${questions.length} answered`}>
          <span style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
        <p>{answeredCount}/20 answered</p>
      </section>

      <section className="final-test-category-strip" aria-label="Category progress">
        {categoryScores.map((item) => (
          <span key={item.category}>
            {item.category}
            <strong>{submitted ? `${item.correct}/${item.total}` : item.total}</strong>
          </span>
        ))}
      </section>

      {questions.map((question, index) => (
        <section className="learn-content-card final-test-question" key={question.prompt}>
          <div className="final-test-question-head">
            <span className="eyebrow">
              Question {index + 1} · {question.category}
            </span>
            <MiniTiles tiles={question.tiles} />
          </div>
          <h3>{question.prompt}</h3>
          <p>{question.detail}</p>
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
          {submitted ? (
            <div className="final-test-feedback">
              <p>{question.explanation}</p>
              {answers[index] !== question.answer ? <Link href={question.reviewHref}>{question.reviewLabel}</Link> : null}
            </div>
          ) : null}
        </section>
      ))}

      <section className={`learn-complete-card final-test-result ${submitted ? (passed ? 'passed' : 'failed') : ''}`}>
        <div>
          <span className="eyebrow">Result</span>
          <h3>{submitted ? `${score}/20 correct` : 'Submit when ready'}</h3>
          <p>
            {passed
              ? "You're ready for your first Hong Kong Mahjong table."
              : submitted
                ? "You're close. Review these areas first."
                : 'Answer every question, then submit for your final readiness result.'}
          </p>
        </div>
        <button type="button" className="btn-primary gold" disabled={answeredCount < questions.length} onClick={() => setSubmitted(true)}>
          Submit final test
        </button>
      </section>

      {submitted ? (
        <section className="final-test-next-steps">
          {passed ? (
            <>
              <Link className="btn-primary gold" href="/learn">
                Start practice drills
              </Link>
              <Link className="learn-secondary-link" href="/learn/scoring-and-fan">
                Review scoring
              </Link>
              <Link className="learn-secondary-link" href="/learn/turn-flow-and-discarding">
                Play a guided hand
              </Link>
            </>
          ) : (
            reviewTargets.map((question) => (
              <Link className="learn-secondary-link" href={question.reviewHref} key={question.reviewHref}>
                {question.reviewLabel}
              </Link>
            ))
          )}
        </section>
      ) : null}
    </div>
  );
}
