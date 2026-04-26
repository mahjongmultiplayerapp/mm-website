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

const pointRows = [
  { fan: 3, total: 32, selfDraw: 16 },
  { fan: 4, total: 64, selfDraw: 32 },
  { fan: 5, total: 96, selfDraw: 48 },
  { fan: 6, total: 128, selfDraw: 64 },
  { fan: 7, total: 192, selfDraw: 96 },
  { fan: 8, total: 256, selfDraw: 128 },
  { fan: 9, total: 384, selfDraw: 192 },
  { fan: 10, total: 512, selfDraw: 256 },
];

const beginnerFanCards = [
  { name: 'Self-Draw', clue: 'Your own draw completes the winning hand.', tiles: ['3', '4', '5', '中', '中', '中'] },
  { name: 'Concealed Hand', clue: 'Your melds stayed hidden until the win.', tiles: ['2', '3', '4', '6', '7', '8'] },
  { name: 'All Sequences', clue: 'The hand is built from chows, not triplets.', tiles: ['1', '2', '3', '4', '5', '6'] },
  { name: 'Dragon Pung', clue: 'A triplet of dragon tiles scores.', tiles: ['中', '中', '中'] },
  { name: 'Wind Pung', clue: 'A triplet of the right wind can score.', tiles: ['東', '東', '東'] },
  { name: 'Robbing a Kong', clue: 'You win on the tile another player tried to add to a pung.', tiles: ['7', '7', '7', '7'] },
];

const intermediateFanCards = [
  { name: 'Half Flush', clue: 'One suit plus honors.', tiles: ['1', '3', '5', '東', '中'] },
  { name: 'Full Flush', clue: 'One suit only, with no honors.', tiles: ['1', '2', '3', '5', '6', '7'] },
  { name: 'All Triplets', clue: 'Triplets and a pair, no sequences.', tiles: ['2', '2', '2', '發', '發', '發'] },
  { name: 'Little Three Dragons', clue: 'Two dragon triplets plus a dragon pair.', tiles: ['中', '中', '中', '發', '發', '發', '白', '白'] },
  { name: 'Big Three Dragons', clue: 'Triplets of all three dragons.', tiles: ['中', '中', '中', '發', '發', '發', '白', '白', '白'] },
];

const limitHands = [
  'All Honors',
  'Little Four Winds',
  'Big Four Winds',
  'Four Concealed Triplets',
  'Eighteen Arhats',
  'Pure Terminals',
  'Heavenly Hand',
  'Earthly Hand',
  'Thirteen Orphans',
  'Kong-on-Kong Self-Draw',
  'Nine Gates',
];

const checkpointQuestions: ChoiceQuestion[] = [
  { prompt: 'What is the minimum fan requirement in this curriculum?', options: ['1 fan', '2 fan', '3 fan', '10 fan'], answer: 2, explanation: 'This ruleset uses a 3-fan minimum.' },
  { prompt: 'What does fan measure?', options: ['How many players pay', 'The scoring value of patterns in the winning hand', 'The number of tiles left in the wall', 'The seat order'], answer: 1, explanation: 'Fan is the scoring value attached to valid patterns.' },
  { prompt: 'What is the fan cap in this ruleset?', options: ['5 fan', '8 fan', '10 fan', 'No cap'], answer: 2, explanation: 'Fan is capped at 10. Limit hands count as 10 fan.' },
  { prompt: 'Who pays when you win on a discard?', options: ['Only the discarder', 'All three opponents', 'Only the dealer', 'Nobody pays'], answer: 0, explanation: 'On a discard win, the player who dealt in pays the full amount.' },
  { prompt: 'Who pays when you self-draw?', options: ['Only the player on your left', 'The discarder', 'All three opponents', 'Only East'], answer: 2, explanation: 'Self-draw is paid by all three opponents.' },
  { prompt: 'What is package payment?', options: ['A penalty for enabling certain dangerous exposed hands', 'A bonus for every chow', 'A way to skip scoring', 'A tile arrangement rule'], answer: 0, explanation: 'Package payment is a liability rule for dangerous exposed hands.' },
  { prompt: 'Which is a beginner fan pattern?', options: ['Dragon Pung', 'Random honors', 'Two unrelated pairs', 'Any open chow'], answer: 0, explanation: 'A triplet of dragon tiles is a common beginner scoring pattern.' },
  { prompt: 'Which hand points toward Half Flush?', options: ['One suit plus honors', 'All three suits mixed freely', 'Only terminals and honors', 'Four unrelated pairs'], answer: 0, explanation: 'Half Flush uses one suit together with honors.' },
  { prompt: 'Which one is a limit hand?', options: ['Thirteen Orphans', 'One Chow', 'Two suited pairs', 'Dealer starts'], answer: 0, explanation: 'Thirteen Orphans is a rare limit hand counted as 10 fan.' },
  { prompt: 'At 3 fan, what is the total point value in the table?', options: ['16', '32', '64', '512'], answer: 1, explanation: 'The conversion table starts at 3 fan = 32 total points.' },
];

const recapItems = [
  { title: 'Shape is only the first gate.', body: 'A hand also needs at least 3 fan and a correct declaration.' },
  { title: 'Fan is pattern value.', body: 'Fan names the value created by scoring patterns in the winning hand.' },
  { title: 'Only the winner scores.', body: 'The table counts valid fan, applies the cap, then converts fan to points.' },
  { title: 'Payment follows the win type.', body: 'Discard win means one payer. Self-draw means three payers.' },
  { title: 'Package payment is liability.', body: 'Some dangerous exposed hands can make one player responsible.' },
  { title: 'Limit hands hit the cap.', body: 'Rare special hands count as 10 fan in this ruleset.' },
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

function TileRail({ tiles }: { tiles: string[] }) {
  return (
    <div className="learn-tile-rail">
      {tiles.map((tile, index) => (
        <span className={`mini-tile ${['中', '發', '白'].includes(tile) ? 'red' : ''}`} key={`${tile}-${index}`}>
          {tile}
        </span>
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
      {selected !== null ? <p className="section-one-feedback">{correct ? question.explanation : 'Not quite. Check shape, fan value, payment, or table timing again.'}</p> : null}
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
    <div className="learn-lesson-template section-one-lesson section-six-lesson">
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

function FanBadges() {
  return (
    <div className="section-six-fan-badges">
      {[1, 3, 5, 7, 10].map((fan) => (
        <span className={fan === 10 ? 'limit' : ''} key={fan}>
          {fan} fan{fan === 10 ? ' limit' : ''}
        </span>
      ))}
    </div>
  );
}

function ScoreChecklist() {
  return (
    <div className="section-six-checklist">
      <span>Valid shape</span>
      <span>3+ fan</span>
      <span>Correct declaration</span>
    </div>
  );
}

function PaymentVisual({ mode }: { mode: 'discard' | 'self-draw' }) {
  return (
    <div className="section-six-payment-visual">
      <div className={mode === 'self-draw' ? 'payer' : ''}>Left</div>
      <div className="winner">You win</div>
      <div className={mode === 'discard' ? 'payer' : mode === 'self-draw' ? 'payer' : ''}>{mode === 'discard' ? 'Discarder' : 'Across'}</div>
      <div className={mode === 'self-draw' ? 'payer' : ''}>Right</div>
    </div>
  );
}

function FanCardGallery({ cards }: { cards: { name: string; clue: string; tiles: string[] }[] }) {
  const [index, setIndex] = useState(0);
  const card = cards[index];

  return (
    <div className="section-six-gallery">
      <div>
        <strong>{card.name}</strong>
        <p>{card.clue}</p>
        <TileRail tiles={card.tiles} />
      </div>
      <div className="section-six-gallery-controls" aria-label="Fan examples">
        {cards.map((item, itemIndex) => (
          <button type="button" className={itemIndex === index ? 'active' : ''} onClick={() => setIndex(itemIndex)} key={item.name}>
            {itemIndex + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function LimitHandGallery() {
  const [selected, setSelected] = useState(8);

  return (
    <div className="section-six-limit-grid">
      {limitHands.map((hand, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={hand}>
          {hand}
        </button>
      ))}
      <p>
        <strong>{limitHands[selected]}</strong> counts as 10 fan here. Beginners only need to recognize these as rare, special hands.
      </p>
    </div>
  );
}

function PointsSlider({ onReady }: { onReady: () => void }) {
  const [fan, setFan] = useState(3);
  const row = pointRows.find((item) => item.fan === fan) ?? pointRows[0];

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <div className="section-six-points-tool">
      <label htmlFor="fan-slider">Fan value: {fan}</label>
      <input id="fan-slider" type="range" min="3" max="10" value={fan} onChange={(event) => setFan(Number(event.target.value))} />
      <div className="section-six-point-output">
        <span>
          Total points <strong>{row.total}</strong>
        </span>
        <span>
          Discard win <strong>{row.total}</strong> from discarder
        </span>
        <span>
          Self-draw <strong>{row.selfDraw}</strong> from each opponent
        </span>
      </div>
    </div>
  );
}

function PointsTable() {
  return (
    <table className="section-six-points-table">
      <thead>
        <tr>
          <th>Fan</th>
          <th>Total</th>
          <th>Self-draw payment</th>
        </tr>
      </thead>
      <tbody>
        {pointRows.map((row) => (
          <tr key={row.fan}>
            <td>{row.fan}</td>
            <td>{row.total}</td>
            <td>{row.selfDraw} x 3</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function WhatMakesHandWinnableLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="A legal win has three gates"
      copy={[
        'To win, a hand needs more than a pleasing shape. It must be a legal winning shape, it must meet the minimum fan requirement, and it must be declared at the correct time.',
        'In this curriculum, the minimum is 3 fan. A valid shape with only 1 fan is not enough, and a valuable-looking pattern with invalid shape is not a win.',
      ]}
      visual={<ScoreChecklist />}
      ruleTitle="Legal shape + 3 fan + correct declaration"
      rule="Check shape first, then check fan, then check whether the win was called at the right moment."
      check={
        <ChoiceCheck
          question={{
            prompt: 'Which hand can legally win?',
            options: ['Valid shape, 1 fan', 'Invalid shape, 5 fan-looking pattern', 'Valid shape, 3 fan', 'Random 14 tiles'],
            answer: 2,
            explanation: 'Correct. Valid shape plus at least 3 fan clears the basic winning threshold.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Shape is necessary, not enough', body: 'To win, you need a valid shape and at least 3 fan.' }}
    />
  );
}

export function WhatIsFanLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Fan is hand value"
      copy={[
        'Fan is the scoring value attached to patterns in your winning hand. Some patterns are simple and common; others are rare and valuable.',
        'Fan is not the same as points paid. First the table counts fan, then the payment table converts that fan value into points.',
      ]}
      visual={<FanBadges />}
      ruleTitle="Fan measures how valuable the win is"
      rule="Multiple fan patterns usually add together, but the final fan count still respects the scoring cap."
      check={
        <ChoiceCheck
          question={{
            prompt: 'What does fan describe?',
            options: ['The number of tiles in the wall', 'The value of scoring patterns in the hand', 'The direction of play', 'The discard pile order'],
            answer: 1,
            explanation: 'Exactly. Fan is pattern value before payment conversion.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Count fan before points', body: 'Fan measures how valuable your winning hand is.' }}
    />
  );
}

export function BasicScoringPrinciplesLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="The winner scores"
      copy={[
        'Only a winning hand scores. The table identifies every valid fan pattern in that hand, adds them according to the rules, applies the minimum and cap, and then converts fan to points.',
        'This ruleset uses a 3-fan minimum and a 10-fan cap. Limit hands count as 10 fan.',
      ]}
      visual={
        <div className="section-six-rule-stack">
          <span>Only the winner scores</span>
          <span>Minimum: 3 fan</span>
          <span>Maximum: 10 fan</span>
          <span>Limit hand: counts as 10 fan</span>
        </div>
      }
      ruleTitle="Minimum and maximum matter"
      rule="A complete hand still cannot win below 3 fan, and scoring stops at 10 fan for this ruleset."
      check={
        <ChoiceCheck
          question={{
            prompt: 'What is the maximum fan counted in this ruleset?',
            options: ['7 fan', '8 fan', '10 fan', 'Unlimited fan'],
            answer: 2,
            explanation: 'Correct. 10 fan is the cap.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Winner, minimum, cap', body: 'Only the winner scores, patterns add, and 10 fan is the cap.' }}
    />
  );
}

export function PaymentBasicsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [mode, setMode] = useState<'discard' | 'self-draw'>('discard');
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Payment depends on how you won"
      copy={[
        'Fan tells the table how valuable the hand is. Payment tells the table who pays that value.',
        'If you win on another player\'s discard, the discarder pays the full amount. If you self-draw, all three opponents pay.',
      ]}
      visual={
        <div className="section-six-payment-toggle">
          <div className="section-one-tabs">
            <button type="button" className={mode === 'discard' ? 'active' : ''} onClick={() => setMode('discard')}>
              Win on discard
            </button>
            <button type="button" className={mode === 'self-draw' ? 'active' : ''} onClick={() => setMode('self-draw')}>
              Self-draw
            </button>
          </div>
          <PaymentVisual mode={mode} />
        </div>
      }
      ruleTitle="Discard win = one payer; self-draw = three payers"
      rule="This payment rule is separate from identifying the hand's fan."
      check={
        <ChoiceCheck
          question={{
            prompt: 'You self-draw a legal winning hand. Who pays?',
            options: ['Only the player who discarded last', 'All three opponents', 'Only East', 'Nobody'],
            answer: 1,
            explanation: 'Correct. Self-draw wins are paid by all three opponents.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Separate fan from payer', body: 'First count fan, then decide who pays based on self-draw or discard win.' }}
    />
  );
}

export function PackagePaymentLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="A liability rule for dangerous hands"
      copy={[
        'Package payment is a special liability rule. It applies when a player enables certain dangerous exposed hands, and that player may become responsible for payments that would otherwise be shared.',
        'Beginners do not need every edge case yet. Learn the warning: some discards are dangerous because they help an opponent complete an obvious high-value exposed hand.',
      ]}
      visual={
        <div className="section-six-package-card">
          <span>Opponent has 12 open tiles</span>
          <strong>Dangerous exposed hand</strong>
          <span>One liable player may pay for everyone</span>
        </div>
      }
      ruleTitle="Package payment punishes the enabling discard"
      rule="The classic beginner idea is table safety: do not feed obvious high-value exposed hands."
      check={
        <ChoiceCheck
          question={{
            prompt: 'In package payment, who may pay?',
            options: ['The liable player who enabled the dangerous hand', 'Every player equally, always', 'Only the winner', 'Nobody pays'],
            answer: 0,
            explanation: 'Correct. Package payment can make one liable player cover what others would have paid.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Advanced, but important', body: 'Package payment is a table-safety rule for dangerous exposed hands.' }}
    />
  );
}

export function BeginnerFanLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Common fan you will see early"
      copy={[
        'Start with patterns that appear often: Self-Draw, Concealed Hand, All Sequences, Dragon Pung, Wind Pung, Under the Sea, Robbing a Kong, and Kong-on-Self-Draw.',
        'Do not only memorize names. Look for why the fan applies. A triplet of Red Dragons scores because dragon triplets are valuable.',
      ]}
      visual={<FanCardGallery cards={beginnerFanCards} />}
      ruleTitle="Beginner fan are visible patterns"
      rule="Train your eye to connect a scoring name to the tiles or win condition on the table."
      check={
        <ChoiceCheck
          question={{
            prompt: 'Which fan applies to a triplet of Red Dragons?',
            options: ['All Sequences', 'Dragon Pung', 'Half Flush', 'Nine Gates'],
            answer: 1,
            explanation: 'Correct. A dragon triplet is Dragon Pung.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Start with common patterns', body: 'Learn the scoring patterns you will see often before chasing rare hands.' }}
    />
  );
}

export function IntermediateFanLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Mid-level patterns have a theme"
      copy={[
        'Intermediate fan often come from concentrating your hand around a suit, triplets, or dragons.',
        'Half Flush uses one suit plus honors. Full Flush uses one suit only. All Triplets uses no sequences. Little Three Dragons and Big Three Dragons involve multiple dragon sets.',
      ]}
      visual={<FanCardGallery cards={intermediateFanCards} />}
      ruleTitle="Look for suit focus, triplets, and dragons"
      rule="These patterns are easier to recognize once you can separate suits, honors, sequences, and triplets."
      check={
        <ChoiceCheck
          question={{
            prompt: 'Which pattern uses one suit plus honors?',
            options: ['Full Flush', 'Half Flush', 'All Sequences', 'Four Concealed Triplets'],
            answer: 1,
            explanation: 'Correct. Half Flush is one suit plus honors.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Patterns have families', body: 'Intermediate fan often come from suit concentration, triplets, or dragon patterns.' }}
    />
  );
}

export function LimitHandsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Rare hands at the cap"
      copy={[
        'Limit hands are rare, memorable hands that count at the scoring cap. Beginners should recognize them as special, not feel pressured to play for them immediately.',
        'Examples include All Honors, Big Four Winds, Four Concealed Triplets, Thirteen Orphans, Kong-on-Kong Self-Draw, and Nine Gates.',
      ]}
      visual={<LimitHandGallery />}
      ruleTitle="Limit hands count as 10 fan"
      rule="They are exciting exceptions. Treat them as recognition targets first, strategy goals later."
      check={
        <ChoiceCheck
          question={{
            prompt: 'How many fan does a limit hand count as here?',
            options: ['3 fan', '6 fan', '8 fan', '10 fan'],
            answer: 3,
            explanation: 'Correct. Limit hands count as 10 fan.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Special hands, simple rule', body: 'Limit hands are rare, memorable hands that count as 10 fan.' }}
    />
  );
}

export function PointsConversionTableLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Convert fan after counting it"
      copy={[
        'Once the fan count is known, use the conversion table to determine points. At 3 fan, the total is 32 points and self-draw payment is 16 from each opponent.',
        'You do not need to calculate the table from scratch. You need to read the fan row correctly and apply the right payment type.',
      ]}
      visual={
        <div className="section-six-table-wrap">
          <PointsTable />
          <PointsSlider onReady={() => setReady(true)} />
        </div>
      }
      ruleTitle="Read the row, then apply payment"
      rule="Discard win uses the total from the discarder. Self-draw uses the self-draw payment from each opponent."
      check={<p className="section-one-feedback">Move the fan slider and compare discard versus self-draw payment.</p>}
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'The table does the math', body: 'Once fan is known, the points table tells you the payment.' }}
    />
  );
}

export function PresentingWinningHandLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);

  return (
    <LessonFrame
      title="Show the hand so it can be verified"
      copy={[
        'After a win, do not mix the tiles. Expose the full hand clearly and arrange standard hands into four melds and a pair.',
        'For self-draw, show the winning tile distinctly, such as sideways beside the hand. For special hands, arrange the required tiles so the table can verify them.',
      ]}
      visual={
        <div className="section-six-present-hand">
          <div>
            <strong>Clear</strong>
            <TileRail tiles={['1', '2', '3', '4', '5', '6', '中', '中', '中', '8', '8']} />
            <small>Grouped melds and pair</small>
          </div>
          <div>
            <strong>Messy</strong>
            <TileRail tiles={['中', '1', '8', '3', '中', '4', '2', '8', '5', '中', '6']} />
            <small>Hard to verify</small>
          </div>
        </div>
      }
      ruleTitle="Reveal, group, verify, then score"
      rule="Clear presentation prevents disputes and helps everyone score the same hand."
      check={
        <ChoiceCheck
          question={{
            prompt: 'What should you do immediately after winning?',
            options: ['Mix all tiles into the wall', 'Reveal and group the winning hand clearly', 'Hide your pair', 'Discard again'],
            answer: 1,
            explanation: 'Correct. Reveal the full hand and group it for verification.',
          }}
          onCorrect={() => setReady(true)}
        />
      }
      lessonId={lessonId}
      nextHref={nextHref}
      ready={ready}
      takeaway={{ title: 'Make scoring easy', body: 'A winning hand should be displayed clearly so everyone can verify and score it.' }}
    />
  );
}

export function SectionSixRecap() {
  return (
    <div className="learn-lesson-template section-one-lesson section-six-lesson">
      <div className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Section 6 recap</span>
        <h3>Scoring starts after a legal win</h3>
        <p>
          Section 6 connects hand shape to scoring value. The table verifies the hand, counts fan, applies the 3-fan minimum and 10-fan cap, then uses the payment rules.
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
        <h3>Can you explain both value and payment?</h3>
        <p>If you can say why a hand has fan and who pays for the win, you are ready for the checkpoint.</p>
      </div>
    </div>
  );
}

export function SectionSixCheckpoint() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => checkpointQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const passed = submitted && score >= 8;

  useEffect(() => {
    if (passed) completeSection('section-6');
  }, [passed]);

  return (
    <div className="section-one-score-card section-six-checkpoint">
      <div className="learn-content-card">
        <span className="eyebrow">Checkpoint quiz</span>
        <h3>Score at least 8 out of 10</h3>
        <p>Confirm the 3-fan minimum, fan meaning, cap, payment basics, package payment, common fan, limit hands, and the points table.</p>
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
          <h3>{submitted ? `${score}/10 correct` : 'Submit when ready'}</h3>
          <p>{passed ? 'Checkpoint passed. Section 6 is complete.' : 'You need 8 correct answers to pass this checkpoint.'}</p>
        </div>
        <button type="button" className="btn-primary gold" disabled={Object.keys(answers).length < checkpointQuestions.length} onClick={() => setSubmitted(true)}>
          Submit checkpoint
        </button>
      </div>
    </div>
  );
}
