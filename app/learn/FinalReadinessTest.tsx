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
};

const storageKey = 'mahjong-multiplayer-learn-progress';

const questions: FinalQuestion[] = [
  {
    category: 'Tiles',
    prompt: 'Which group is a Chow?',
    detail: 'Identify the group that forms one legal sequence meld.',
    options: ['2-3-4 bamboo', 'East-East-East', '1-1-2 dots', 'Red-Red-Red'],
    answer: 0,
    explanation: '2-3-4 in the same suit is a chow, which is a sequence.',
    reviewHref: '/learn/tiles-melds-winning-hands/tile-groupings',
    reviewLabel: 'Review tile groupings',
  },
  {
    category: 'Tiles',
    prompt: 'Which group is not a valid sequence?',
    detail: 'Choose the group that cannot be used as a numbered run.',
    options: ['3-4-5 characters', 'East-South-West', '1-2-3 bamboo', '6-7-8 dots'],
    answer: 1,
    explanation: 'Wind tiles are honors, so East-South-West cannot be a sequence.',
    reviewHref: '/learn/tiles-melds-winning-hands/honor-tiles',
    reviewLabel: 'Review honors',
  },
  {
    category: 'Tiles',
    prompt: 'Which structure is the standard winning hand shape?',
    detail: 'Pick the normal complete-hand structure taught in the course.',
    options: ['Five pairs and one single', 'Four melds plus one pair', 'Three melds only', 'Four pairs and no melds'],
    answer: 1,
    explanation: 'The standard shape is four melds and a pair.',
    reviewHref: '/learn/tiles-melds-winning-hands/standard-winning-shape',
    reviewLabel: 'Review winning shape',
  },
  {
    category: 'Tiles',
    prompt: 'Which tiles are honors?',
    detail: 'Choose the set made from non-suited special tiles.',
    options: ['1 dot, 2 dot, 3 dot', 'East, Red Dragon, White Dragon', '7 character, 8 character, 9 character', '4 bamboo, 5 bamboo, 6 bamboo'],
    answer: 1,
    explanation: 'Winds and dragons are honor tiles.',
    reviewHref: '/learn/tiles-melds-winning-hands/honor-tiles',
    reviewLabel: 'Review honor tiles',
  },
  {
    category: 'Setup',
    prompt: 'Who is the dealer at the start of a hand?',
    detail: 'Use the seat role that begins the hand.',
    options: ['South', 'West', 'East', 'North'],
    answer: 2,
    explanation: 'East is the dealer and starts the hand.',
    reviewHref: '/learn/setup-and-dealing/dealer-and-east',
    reviewLabel: 'Review dealer and East',
  },
  {
    category: 'Setup',
    prompt: 'What is the live wall used for?',
    detail: 'Choose the main purpose of this part of the wall during play.',
    options: ['Normal draws during play', 'Score verification', 'Discard storage', 'Seat assignment only'],
    answer: 0,
    explanation: 'Players draw from the live wall during normal play.',
    reviewHref: '/learn/setup-and-dealing/live-wall-vs-dead-wall',
    reviewLabel: 'Review walls',
  },
  {
    category: 'Setup',
    prompt: 'After the wall is opened, what happens next?',
    detail: 'Choose the next setup step before normal turns begin.',
    options: ['Everyone scores immediately', 'All exposed melds are declared', 'The round ends', 'Tiles are dealt to the players'],
    answer: 3,
    explanation: 'After opening the wall, tiles are dealt into starting hands.',
    reviewHref: '/learn/setup-and-dealing/dealing-the-tiles',
    reviewLabel: 'Review dealing',
  },
  {
    category: 'Turn flow',
    prompt: 'East discards and nobody calls. Who acts next?',
    detail: 'Assume no call interrupts the normal rotation.',
    options: ['West', 'North', 'East again', 'South'],
    answer: 3,
    explanation: 'If nobody calls, play continues to the next player in order: South.',
    reviewHref: '/learn/turn-flow-and-discarding/turn-order-around-the-table',
    reviewLabel: 'Review turn order',
  },
  {
    category: 'Turn flow',
    prompt: 'What is the basic shape of a normal turn?',
    detail: 'Choose the normal action order for a player’s turn.',
    options: ['Discard, draw, score', 'Draw, consider, discard', 'Score, draw, reveal', 'Call, shuffle, pass'],
    answer: 1,
    explanation: 'The basic turn rhythm is draw, consider, discard.',
    reviewHref: '/learn/turn-flow-and-discarding/anatomy-of-a-turn',
    reviewLabel: 'Review turn anatomy',
  },
  {
    category: 'Turn flow',
    prompt: 'When does the call window happen?',
    detail: 'Choose the timing when other players may claim a tile.',
    options: ['Immediately after a discard', 'Before anyone discards', 'After scoring is complete', 'During the deal'],
    answer: 0,
    explanation: 'The call window opens immediately after a discard.',
    reviewHref: '/learn/turn-flow-and-discarding/the-call-window',
    reviewLabel: 'Review call window',
  },
  {
    category: 'Calls',
    prompt: 'When is Chow legal?',
    detail: 'Choose the positional restriction for this call.',
    options: ['From any player for any group', 'Only from the dealer', 'Only from the player on your left', 'Only with honor tiles'],
    answer: 2,
    explanation: 'Chow is legal only from the player on your left, and only for a sequence.',
    reviewHref: '/learn/calls-chow-pung-kong-win/chow',
    reviewLabel: 'Review Chow',
  },
  {
    category: 'Calls',
    prompt: 'When is Pung legal?',
    detail: 'Choose the situation that lets you claim a matching discard.',
    options: ['When any player discards the third matching tile and you hold two', 'Only from your left', 'Only after a kong', 'Only with numbered sequences'],
    answer: 0,
    explanation: 'Pung can claim a matching discard from any player when you hold the other two tiles.',
    reviewHref: '/learn/calls-chow-pung-kong-win/pung',
    reviewLabel: 'Review Pung',
  },
  {
    category: 'Calls',
    prompt: 'Which situation can create a big exposed kong?',
    detail: 'Choose the situation that creates an exposed four-of-a-kind call.',
    options: ['You call Chow from the left', 'You draw a winning tile', 'You reveal a pair', 'You hold three matching tiles and claim the fourth from a discard'],
    answer: 3,
    explanation: 'A big exposed kong claims the fourth matching tile from another player’s discard.',
    reviewHref: '/learn/calls-chow-pung-kong-win/big-exposed-kong',
    reviewLabel: 'Review kong calls',
  },
  {
    category: 'Calls',
    prompt: 'Two players want the same discard: one can Chow, one can Win. What happens?',
    detail: 'Apply the priority order for competing claims.',
    options: ['Chow has priority', 'The closest player always wins', 'Both players take the tile', 'Win has priority'],
    answer: 3,
    explanation: 'Win has highest priority over other calls.',
    reviewHref: '/learn/calls-chow-pung-kong-win/call-priority',
    reviewLabel: 'Review call priority',
  },
  {
    category: 'Scoring',
    prompt: 'What does the 3-fan minimum mean?',
    detail: 'Choose the rule that connects hand value to declaring a win.',
    options: ['Every hand must have exactly 3 pairs', 'Only 3 players pay', 'A legal hand must have at least 3 fan to win', 'The dealer draws 3 extra tiles'],
    answer: 2,
    explanation: 'In this curriculum, a winning hand needs legal shape and at least 3 fan.',
    reviewHref: '/learn/scoring-and-fan/what-makes-a-hand-winnable',
    reviewLabel: 'Review 3-fan minimum',
  },
  {
    category: 'Scoring',
    prompt: 'Which pattern is Dragon Pung?',
    detail: 'Choose the tile pattern that matches this scoring name.',
    options: ['Three consecutive suited tiles', 'Any pair of winds', 'A discarded tile from East', 'Three matching dragon tiles'],
    answer: 3,
    explanation: 'A triplet of dragon tiles is Dragon Pung.',
    reviewHref: '/learn/scoring-and-fan/beginner-fan',
    reviewLabel: 'Review beginner fan',
  },
  {
    category: 'Scoring',
    prompt: 'Who pays when you win on another player’s discard?',
    detail: 'Choose the payment rule for a win caused by another player’s tile.',
    options: ['All three opponents pay equally', 'Only East pays', 'The discarder pays the full amount', 'Nobody pays'],
    answer: 2,
    explanation: 'On a discard win, the discarder pays the full amount.',
    reviewHref: '/learn/scoring-and-fan/payment-basics',
    reviewLabel: 'Review payment basics',
  },
  {
    category: 'Scoring',
    prompt: 'Who pays when you self-draw?',
    detail: 'Choose the payment rule when your own draw completes the hand.',
    options: ['Only the previous discarder', 'All three opponents', 'Only South', 'Only the dealer'],
    answer: 1,
    explanation: 'Self-draw wins are paid by all three opponents.',
    reviewHref: '/learn/scoring-and-fan/payment-basics',
    reviewLabel: 'Review payment basics',
  },
  {
    category: 'Rounds',
    prompt: 'What is a drawn hand?',
    detail: 'Choose the table state that ends a hand without a winner.',
    options: ['East always wins', 'A player calls Pung', 'The live wall runs out and nobody wins', 'A player reveals a chow'],
    answer: 2,
    explanation: 'A drawn hand means the live wall ran out before anyone won.',
    reviewHref: '/learn/rounds-draws-table-rules/drawn-hands',
    reviewLabel: 'Review drawn hands',
  },
  {
    category: 'Rounds',
    prompt: 'Which action is a beginner foul?',
    detail: 'Choose the action that disrupts legal table order.',
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
