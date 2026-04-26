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
  { prompt: 'What is a call?', options: ['A clear claim on the latest discard', 'A draw from the live wall', 'A scoring cap', 'A seat wind'], answer: 0, explanation: 'A call claims the most recently discarded tile.' },
  { prompt: 'When is Chow legal?', options: ['Any discard for any group', 'A sequence from the player on your left', 'A triplet from anyone', 'Four identical tiles'], answer: 1, explanation: 'Chow completes a sequence, and only from the player on your left.' },
  { prompt: 'When is Pung legal?', options: ['You have two matching tiles and any player discards the third', 'Only from your left', 'Only with suited tiles', 'Only after a kong'], answer: 0, explanation: 'Pung completes a triplet and can be called from any player.' },
  { prompt: 'What starts a concealed kong?', options: ['Four identical tiles in your concealed hand', 'An open sequence', 'Any three honors', 'A discard from the left'], answer: 0, explanation: 'A concealed kong begins with four identical concealed tiles.' },
  { prompt: 'What is an added kong?', options: ['Adding the fourth matching tile to an open triplet', 'Calling a sequence', 'Drawing from the river', 'Passing a discard'], answer: 0, explanation: 'An added kong upgrades an existing open triplet.' },
  { prompt: 'What is a big exposed kong?', options: ['Calling a discard with three matching concealed tiles', 'A hidden pair', 'A Chow from the left', 'Any self-draw win'], answer: 0, explanation: 'A big exposed kong uses another player’s discard to complete four of a kind.' },
  { prompt: 'Where does a kong supplement tile come from?', options: ['Dead wall / kong tail', 'River', 'Any opponent', 'Open meld area'], answer: 0, explanation: 'Kong supplement tiles come from the dead wall.' },
  { prompt: 'What is self-draw?', options: ['You draw your own winning tile', 'You win on another player’s discard', 'You call Chow', 'You pass on a discard'], answer: 0, explanation: 'Self-draw means your own draw completes the hand.' },
  { prompt: 'What is robbing a kong?', options: ['Winning on the tile another player adds for an added kong', 'Taking a tile from the live wall early', 'Calling Chow on an honor', 'Scoring without a legal hand'], answer: 0, explanation: 'Robbing a kong stops the added kong because that tile is your winning tile.' },
  { prompt: 'What is the call priority order?', options: ['Win > Pung/Kong > Chow', 'Chow > Pung > Win', 'Pung > Win > Chow', 'All calls are equal'], answer: 0, explanation: 'Win has highest priority, then Pung/Kong, then Chow.' },
];

const recapItems = [
  { title: 'Only the latest discard can be called.', body: 'Calls are clear, immediate claims on the most recent discard.' },
  { title: 'Chow and Pung are different.', body: 'Chow is sequence-from-left. Pung is triplet-from-anyone.' },
  { title: 'Kongs need declaration.', body: 'Concealed, added, and big exposed kongs all need a clear table declaration and supplement draw.' },
  { title: 'Wins can come from draw or discard.', body: 'Self-draw uses your own draw. Win on discard uses another player’s tile.' },
  { title: 'Priority resolves conflicts.', body: 'Win outranks Pung/Kong, and Pung/Kong outrank Chow.' },
  { title: 'Calls move the turn.', body: 'After a call, the caller exposes the set and discards immediately.' },
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
        <span className={`mini-tile ${tile === '中' ? 'red' : ''}`} key={`${tile}-${index}`}>
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
      {selected !== null ? <p className="section-one-feedback">{correct ? question.explanation : 'Not quite. Check the call type, timing, and player position.'}</p> : null}
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
    <div className="learn-lesson-template section-one-lesson section-five-lesson">
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

function CallButtonsVisual({ active = 'Pung' }: { active?: string }) {
  return (
    <div className="section-five-call-visual">
      <div className="section-five-discard">
        <span className="eyebrow">Latest discard</span>
        <span className="mini-tile red">中</span>
      </div>
      <div className="section-five-call-buttons">
        {['Chow', 'Pung', 'Kong', 'Win', 'Pass'].map((call) => (
          <span className={active === call ? 'active' : ''} key={call}>
            {call}
          </span>
        ))}
      </div>
    </div>
  );
}

function MeldVisual({ label, concealed, open }: { label: string; concealed: string[]; open?: string[] }) {
  return (
    <div className="section-five-meld-visual">
      <div>
        <span className="eyebrow">Concealed hand</span>
        <TileRail tiles={concealed} />
      </div>
      {open ? (
        <div>
          <span className="eyebrow">Open meld area</span>
          <TileRail tiles={open} />
        </div>
      ) : null}
      <strong>{label}</strong>
    </div>
  );
}

function FlowSteps({ steps, onDone }: { steps: string[]; onDone: () => void }) {
  const [active, setActive] = useState(0);
  const done = active === steps.length - 1;

  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  return (
    <div className="section-one-timeline">
      {steps.map((step, index) => (
        <button type="button" className={active === index ? 'active' : ''} onClick={() => setActive(index)} key={step}>
          <span>{index + 1}</span>
          {step}
        </button>
      ))}
    </div>
  );
}

export function WhatIsCallLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="A call is a clear claim on the latest discard."
      copy={['A call is a spoken claim on the most recent discard. You are saying, clearly and immediately, that you want to use that tile.', 'The main calls are Chow, Pung, Kong, and Win. Calls are powerful, but they expose information and can change turn order.']}
      visual={<CallButtonsVisual active="Win" />}
      ruleTitle="Latest discard only."
      rule="Only the most recently discarded tile can be called."
      check={<ChoiceCheck question={{ prompt: 'Which tile can you call?', options: ['Only the most recently discarded tile', 'Any tile in the river', 'Any tile in the wall', 'A tile from another hand'], answer: 0, explanation: 'Exactly. Calls only apply to the latest discard.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'A call is a clear declaration to take the latest discard.', body: 'Say it clearly and immediately.' }}
    />
  );
}

export function ChowLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Chow completes a sequence from the player on your left."
      copy={['Chow means using the latest discard to complete a three-tile sequence. You can Chow only from the player on your left.', 'The sequence must be three consecutive numbers in the same suit. You cannot Chow honors, and you cannot Chow from across or from your right.']}
      visual={<MeldVisual label="Left player discards 5 Bamboo. You have 3 and 4 Bamboo." concealed={['三', '四']} open={['三', '四', '五']} />}
      ruleTitle="Sequence from left."
      rule="Chow completes a sequence, but only from the player on your left."
      check={<ChoiceCheck question={{ prompt: 'Left player discards 5 Bamboo. You have 3 and 4 Bamboo. Can you Chow?', options: ['Yes, legal Chow', 'No, not from left', 'No, honors cannot Chow', 'Only if it is a triplet'], answer: 0, explanation: 'Correct. It completes a same-suit sequence from the left.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Chow completes a sequence, but only from the player on your left.', body: 'Chow has the lowest call priority.' }}
    />
  );
}

export function PungLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Pung completes a triplet from any player."
      copy={['Pung means using the latest discard to complete a triplet. If you have two matching tiles in your concealed hand and any player discards the third, you may call Pung.', 'The triplet becomes open, and then you discard. Unlike Chow, Pung can be called from any player.']}
      visual={<MeldVisual label="Any player discards Red. You have two Reds." concealed={['中', '中']} open={['中', '中', '中']} />}
      ruleTitle="Triplet from anyone."
      rule="Pung completes a triplet and can be called from any player."
      check={<ChoiceCheck question={{ prompt: 'Any player discards East. You have East + East. Can you Pung?', options: ['Yes', 'No, only from left', 'No, honors cannot Pung', 'Only if East is dealer'], answer: 0, explanation: 'Exactly. Pung can be called from any player if you have the matching pair.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Pung completes a triplet and can be called from any player.', body: 'Chow is sequence-from-left; Pung is triplet-from-anyone.' }}
    />
  );
}

export function ConcealedKongLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Four concealed matching tiles can become a kong."
      copy={['A concealed kong starts with four identical tiles in your concealed hand. On your own turn, you can declare the kong.', 'Even though it started concealed, you must announce it and place it appropriately so the table can verify it. Then you take a supplement tile from the dead wall.']}
      visual={<MeldVisual label="Four identical concealed tiles" concealed={['8', '8', '8', '8']} />}
      ruleTitle="Declare it."
      rule="Four identical concealed tiles are not automatically a kong until declared."
      check={<ChoiceCheck question={{ prompt: 'Which group can be declared as a concealed kong?', options: ['Four identical concealed tiles', 'Three mixed suited tiles', 'Two matching tiles', 'An open sequence'], answer: 0, explanation: 'Correct. A concealed kong starts with four identical concealed tiles.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'A concealed kong starts from four identical tiles in your own hand.', body: 'Declare it before drawing the supplement tile.' }}
    />
  );
}

export function AddedKongLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Upgrade an open triplet with the fourth tile."
      copy={['An added kong happens when you already have an open triplet and later get the fourth matching tile.', 'On your turn, you may add that fourth tile to the open triplet and declare Kong. Then you draw a supplement tile.']}
      visual={<MeldVisual label="Open 5 Character triplet plus fourth 5 Character" concealed={['5萬']} open={['5萬', '5萬', '5萬', '5萬']} />}
      ruleTitle="Open triplet first."
      rule="An added kong upgrades your existing open triplet with the fourth tile."
      check={<ChoiceCheck question={{ prompt: 'Can an open sequence plus a matching tile become an added kong?', options: ['No', 'Yes', 'Only from the left', 'Only if it is self-draw'], answer: 0, explanation: 'Right. Added kong upgrades an open triplet, not a sequence.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'An added kong upgrades your existing open triplet with the fourth tile.', body: 'This is the kong type that can be robbed.' }}
    />
  );
}

export function BigExposedKongLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Call Kong on a discard when you have the concealed triplet."
      copy={['A big exposed kong uses another player’s discard to complete four of a kind.', 'You need three identical concealed tiles, and another player must discard the fourth. You call Kong, expose all four tiles, and draw a supplement tile from the dead wall.']}
      visual={<MeldVisual label="Opponent discards 9 Bamboo. You have three." concealed={['九', '九', '九']} open={['九', '九', '九', '九']} />}
      ruleTitle="Three in hand, fourth discarded."
      rule="A big exposed kong uses another player’s discard to complete four of a kind."
      check={<ChoiceCheck question={{ prompt: 'You have three 9 Bamboo. Another player discards the fourth. What can you call?', options: ['Kong', 'Chow', 'Pass only', 'Self-draw'], answer: 0, explanation: 'Correct. Three concealed matches plus the discard can make a big exposed kong.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'A big exposed kong uses another player’s discard to complete four of a kind.', body: 'Pung needs two matching tiles; big exposed Kong needs three.' }}
    />
  );
}

export function SupplementKongLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Declare kong, expose kong, draw supplement."
      copy={['A kong uses four physical tiles but still counts as one set in the hand structure.', 'Because the kong uses an extra tile, you draw a supplement tile after declaring it. The supplement comes from the dead wall, not the live wall.']}
      visual={<div className="section-five-kong-flow"><MeldVisual label="Exposed Kong" concealed={[]} open={['發', '發', '發', '發']} /><span>Dead wall supplement</span></div>}
      ruleTitle="Expose first."
      rule="Declare and expose the kong first, then draw the supplement tile from the dead wall."
      check={<ChoiceCheck question={{ prompt: 'What must happen before drawing a kong supplement tile?', options: ['The kong must be clearly exposed and confirmed', 'A Chow must happen', 'The river must be empty', 'East must pass'], answer: 0, explanation: 'Exactly. Expose and confirm the kong before the supplement draw.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Declare and expose the kong first, then draw the supplement tile from the dead wall.', body: 'That order keeps the table state clear.' }}
    />
  );
}

export function SelfDrawWinLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="You drew your own winning tile."
      copy={['Self-draw means the tile you draw on your own turn completes your winning hand.', 'You declare the win immediately, reveal your hand for verification, and identify the winning tile. Self-draw matters for payment later.']}
      visual={<MeldVisual label="Drawn tile completes the hand" concealed={['一', '二', '三', '中', '中', '中', '東', '東']} />}
      ruleTitle="Your draw, your win."
      rule="Self-draw means you draw your own winning tile."
      check={<ChoiceCheck question={{ prompt: 'You draw the tile that completes your legal hand. What is this called?', options: ['Self-draw', 'Win on discard', 'Chow', 'Robbing a kong'], answer: 0, explanation: 'Correct. You drew your own winning tile.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Self-draw means you draw your own winning tile.', body: 'Later scoring uses this to decide who pays.' }}
    />
  );
}

export function WinOnDiscardLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Another player throws your winning tile."
      copy={['Win on discard means another player discards the exact tile you need to complete your hand. During the call window, you call Win and reveal your hand.', 'The discarder is the player who dealt in. The hand still needs to be a legal shape and meet the minimum fan requirement.']}
      visual={<CallButtonsVisual active="Win" />}
      ruleTitle="Call during the window."
      rule="Win on discard means another player throws the tile that completes your hand."
      check={<ChoiceCheck question={{ prompt: 'Another player discards the exact tile that completes your legal hand. What can you call?', options: ['Win', 'Self-draw', 'Pass only', 'Chow only'], answer: 0, explanation: 'Exactly. You may call Win on the discard.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Win on discard means another player throws the tile that completes your hand.', body: 'Completing shape is not enough if the ruleset requires 3 fan.' }}
    />
  );
}

export function RobbingKongLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="The kong gets stopped because it was your winning tile."
      copy={['Robbing a kong is a special win. If an opponent tries to make an added kong with a tile that would complete your winning hand, you may call Win on that tile.', 'In practical terms, the tile they are adding to their open triplet is treated as available for your win before the kong completes.']}
      visual={<MeldVisual label="Added tile is your winning tile" concealed={['九', '九']} open={['5萬', '5萬', '5萬', '5萬']} />}
      ruleTitle="Rob added kong."
      rule="Robbing a kong lets you win on the tile another player uses for an added kong."
      check={<FlowSteps steps={['Opponent has open triplet', 'Opponent adds fourth tile', 'That tile completes your hand', 'You call Win', 'The kong is robbed']} onDone={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Robbing a kong lets you win on the tile another player uses for an added kong.', body: 'The kong gets stopped because it was your winning tile.' }}
    />
  );
}

export function CallPriorityLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Win beats Pung/Kong; Pung/Kong beat Chow."
      copy={['Sometimes more than one player wants the same discard. Priority decides who gets it.', 'Win has the highest priority. Pung and Kong beat Chow. Chow has the lowest priority.']}
      visual={<div className="section-five-priority"><span>Win</span><span>Pung / Kong</span><span>Chow</span></div>}
      ruleTitle="Priority ladder."
      rule="Call priority is Win > Pung/Kong > Chow."
      check={<ChoiceCheck question={{ prompt: 'One player wants Chow and another wants Pung on the same discard. Who gets it?', options: ['Pung', 'Chow', 'Neither', 'The next player'], answer: 0, explanation: 'Correct. Pung outranks Chow.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Call priority is Win > Pung/Kong > Chow.', body: 'If someone can win, that outranks ordinary set-making calls.' }}
    />
  );
}

export function CallsChangeFlowLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="After a call, the caller exposes the set and discards."
      copy={['After a call, the caller does not draw a tile from the wall. They take the discard, expose the completed set, and then discard from their own hand.', 'Play continues from the caller. This can cause players to be skipped, which is why everyone must pay attention after each discard.']}
      visual={<div className="section-four-turn-table"><div className="seat-east"><span>East</span><small>Waiting</small></div><div className="seat-south called"><span>South</span><small>Calls</small></div><div className="seat-west"><span>West</span><small>Skipped</small></div><div className="seat-north active"><span>North</span><small>Discarded</small></div><div className="section-four-turn-center">North discard → South call</div></div>}
      ruleTitle="Caller acts next."
      rule="North discards, South calls Pung, South discards next."
      check={<ChoiceCheck question={{ prompt: 'North discards. South calls Pung. What happens next?', options: ['South exposes the triplet and discards', 'West draws', 'North takes back the tile', 'East scores'], answer: 0, explanation: 'Exactly. Play moves to the caller.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'After a call, the caller exposes the set and discards immediately.', body: 'Calls can skip players in the normal order.' }}
    />
  );
}

export function OpenMeldPlacementLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="If it is called or declared, make it visible and organized."
      copy={['Called sets must be placed clearly in the open meld area. They should be visible to all players and kept in the order they were called.', 'This helps the table reconstruct the hand, check scoring, and avoid disputes. Concealed kongs are also placed in the open meld area in the appropriate declared form.']}
      visual={<div className="section-two-table-map"><button>Wall</button><button className="active">Open meld area</button><button>River</button><button>Concealed hand</button></div>}
      ruleTitle="Open meld area."
      rule="Called melds must be exposed clearly in the open meld area."
      check={<ChoiceCheck question={{ prompt: 'Where should a called Pung be placed?', options: ['Open meld area', 'Back in concealed hand', 'Dead wall', 'Under the river'], answer: 0, explanation: 'Correct. Called sets are public and organized in the open meld area.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Called melds must be exposed clearly in the open meld area.', body: 'Visible and ordered melds prevent scoring disputes.' }}
    />
  );
}

export function BeginnerCallDecisionsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="First learn legality. Strategy comes later."
      copy={['At first, do not try to master advanced strategy. Start with legality.', 'Ask: can I call this tile? What set does it make? Is it from the correct player? What happens to turn order after I call? Legal does not always mean smart, but illegal is always wrong.']}
      visual={<div className="section-five-decision-tree"><span>Can I call?</span><span>What set?</span><span>What changes next?</span></div>}
      ruleTitle="Decision checklist."
      rule="Before thinking strategy, learn call legality and turn consequences."
      check={<ChoiceCheck question={{ prompt: 'Which question should come first for a beginner?', options: ['Is this call legal?', 'Will this scare opponents?', 'Can I hide this meld?', 'Can I change the score cap?'], answer: 0, explanation: 'Exactly. Legal first, strategy later.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Before thinking strategy, learn call legality and turn consequences.', body: 'Can I call, what does it make, what changes next?' }}
    />
  );
}

export function SectionFiveRecap() {
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
          <span className="eyebrow">Call checklist</span>
          <h3>Latest discard, legal set, clear declaration, visible meld.</h3>
          <p>That checklist carries most beginner call decisions.</p>
        </div>
        <CallButtonsVisual active="Win" />
      </div>
    </div>
  );
}

export function SectionFiveCheckpoint() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => checkpointQuestions.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0), [answers]);
  const answeredCount = Object.keys(answers).length;
  const passed = score >= 8;

  const submit = () => {
    setSubmitted(true);
    if (score >= 8) completeSection('section-5');
  };

  return (
    <div className="section-one-checkpoint">
      <div className="learn-content-card section-one-checkpoint-intro">
        <span className="eyebrow">Checkpoint quiz</span>
        <h3>Can you make legal calls?</h3>
        <p>Answer all ten questions. A passing score is 8 out of 10.</p>
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
              {submitted && selected !== undefined ? <p className="section-one-feedback">{isCorrect ? question.explanation : 'Not quite. Review call legality and priority, then try again.'}</p> : null}
            </section>
          );
        })}
      </div>
      <div className="learn-complete-card section-one-score-card">
        <div>
          <span className="eyebrow">Score</span>
          <h3>{submitted ? `${score} / ${checkpointQuestions.length}` : `${answeredCount} / ${checkpointQuestions.length} answered`}</h3>
          <p>{submitted ? (passed ? 'Passed. You can handle the core calls in Hong Kong Mahjong.' : 'Almost. Review the missed call rules, then submit again.') : 'Submit when every question has an answer.'}</p>
        </div>
        <button type="button" className="btn-primary gold" disabled={answeredCount < checkpointQuestions.length} onClick={submit}>
          {submitted ? 'Resubmit' : 'Submit checkpoint'}
        </button>
      </div>
    </div>
  );
}
