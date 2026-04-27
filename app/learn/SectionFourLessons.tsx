'use client';

import { useEffect, useMemo, useState } from 'react';
import { MiniTile, getTileSrc } from './components';

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
const turnStages = ['Draw', 'Arrange', 'Discard', 'Call window'];
const seats = ['East', 'South', 'West', 'North'];

const recapItems = [
  { title: 'East starts the play phase.', body: 'After the deal, East makes the first discard. Normal order continues if no one calls.' },
  { title: 'A turn has four stages.', body: 'Draw, arrange, discard, then pause for the call window.' },
  { title: 'Do not draw early.', body: 'Wait until the previous discard is clearly released and the call window has passed.' },
  { title: 'Discards must be clear.', body: 'Place one tile face up in the river where everyone can see it.' },
  { title: 'Calls interrupt order.', body: 'A caller exposes the set, then discards. Play continues from the caller.' },
  { title: 'Hands end by win or draw.', body: 'Someone wins, or the live wall runs out with no winner.' },
];

const checkpointQuestions: ChoiceQuestion[] = [
  { prompt: 'Who starts the play phase after dealing?', options: ['East', 'South', 'West', 'North'], answer: 0, explanation: 'East starts the hand.' },
  { prompt: 'What are the four stages of a normal turn?', options: ['Score, draw, call, sit', 'Draw, arrange, discard, call window', 'Call, draw, win, score', 'Deal, call, score, draw'], answer: 1, explanation: 'Draw, arrange, discard, then pause for the call window.' },
  { prompt: 'Where do normal turns draw from?', options: ['Live wall', 'Dead wall', 'River', 'Open meld area'], answer: 0, explanation: 'Normal turns draw from the live wall.' },
  { prompt: 'When should you avoid drawing?', options: ['After the call window passes', 'When it is your turn', 'Before the previous discard is released', 'From the live wall'], answer: 2, explanation: 'Drawing early can block legal calls.' },
  { prompt: 'Where should a discard go?', options: ['Back into your hand', 'Face up in the river', 'Into the dead wall', 'Under an open meld'], answer: 1, explanation: 'A discard should be clear, face up, and visible in the river.' },
  { prompt: 'What happens after a discard if nobody calls?', options: ['The next player draws', 'The hand ends immediately', 'East draws again', 'The tile returns to hand'], answer: 0, explanation: 'If nobody calls, the next player draws from the live wall.' },
  { prompt: 'South discards. West calls Pung. Who discards next?', options: ['South', 'East', 'West', 'North'], answer: 2, explanation: 'Calls move play to the caller, so West discards next.' },
  { prompt: 'Which two events can end a hand?', options: ['Win or draw', 'Chow or Pung', 'Deal or wall build', 'Discard or pass'], answer: 0, explanation: 'A hand ends when someone wins or when the wall runs out with no winner.' },
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
      {selected !== null ? <p className="section-one-feedback">{correct ? question.explanation : 'Not quite. Follow the turn rhythm and try again.'}</p> : null}
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
    <div className="learn-lesson-template section-one-lesson section-four-lesson">
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

function TurnTable({ activeSeat = 'East', calledSeat }: { activeSeat?: string; calledSeat?: string }) {
  return (
    <div className="section-four-turn-table">
      {seats.map((seat) => (
        <div className={`${activeSeat === seat ? 'active' : ''} ${calledSeat === seat ? 'called' : ''} seat-${seat.toLowerCase()}`} key={seat}>
          <span>{seat}</span>
          <small>{calledSeat === seat ? 'Called' : activeSeat === seat ? 'Turn' : 'Waiting'}</small>
        </div>
      ))}
      <div className="section-four-turn-center">{calledSeat ? 'Call interrupts order' : 'Normal order'}</div>
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

export function DealerStartsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="East starts; normal order continues if no one calls."
      copy={['After the deal, East starts the play phase. For beginners, think of East as making the first discard.', 'If nobody calls that discard, play passes to the next player in order.']}
      visual={<TurnTable activeSeat="East" />}
      ruleTitle="East discards first."
      rule="East starts the hand, then play continues around the table unless interrupted."
      check={<ChoiceCheck question={{ prompt: 'East discards and nobody calls. Who acts next?', options: ['East again', 'The player on East’s right', 'Any player who wants to', 'The dealer chooses'], answer: 1, explanation: 'Correct. If nobody calls, normal order continues to the next player.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'East starts the hand, then play continues around the table unless interrupted.', body: 'The first rhythm is simple: East discards, then normal order begins.' }}
    />
  );
}

export function AnatomyTurnLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [active, setActive] = useState(0);
  const ready = active === turnStages.length - 1;
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Draw, decide, discard, pause."
      copy={['A normal turn has four stages: draw, arrange, discard, and call window.', 'First draw from the live wall. Next, decide whether you can win, declare a kong, or continue. Then discard one tile. Finally, the other players may call.']}
      visual={<FlowStepper steps={turnStages} active={active} onActive={setActive} />}
      ruleTitle={turnStages[active]}
      rule={['Draw a tile from the live wall.', 'Check whether to win, kong, or continue.', 'Place one tile face up in the river.', 'Pause so other players may call.'][active]}
      check={<><h3>Tap through the four stages of a turn.</h3><p>{ready ? 'You reached the call window.' : 'Move through each stage in order.'}</p></>}
      ready={ready}
      takeaway={{ title: 'Every normal turn follows draw, arrange, discard, then call window.', body: 'This is the rhythm to hear in your head while playing.' }}
    />
  );
}

export function DrawingTileLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Hands off the wall until the discard is released."
      copy={['Only draw when it is your turn. Draw from the live wall, not the dead wall, unless you are taking a kong supplement.', 'Do not reach early while the previous player is still deciding or has not clearly discarded. Other players may still have the right to call.']}
      visual={<div className="section-four-draw-visual"><div className="section-four-wall-mini"></div><TileRail tiles={['三', '四', '五', '中']} /><span>Wait for discard → then draw</span></div>}
      ruleTitle="No early draw."
      rule="Wait until the previous discard is clearly placed and released."
      check={<ChoiceCheck question={{ prompt: 'What is wrong if a player reaches before the previous discard lands?', options: ['They are drawing too early', 'They are scoring', 'They are calling Pung', 'Nothing is wrong'], answer: 0, explanation: 'Exactly. Early draws create confusion and can block legal calls.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Wait for the previous discard before drawing.', body: 'At a real table, patience keeps calls fair.' }}
    />
  );
}

export function ArrangingHandLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Do not discard automatically."
      copy={['After drawing, pause and evaluate. Did the tile complete your hand? If yes, you may declare self-draw if the hand is legal and has enough fan.', 'Did the tile give you a kong? You may be able to declare it. Otherwise, choose a discard that moves your hand forward.']}
      visual={<div className="section-four-choice-panel"><TileRail tiles={['一', '二', '三', '中', '中', '中', '東', '東']} /><div><button>Win?</button><button>Kong?</button><button>Discard?</button></div></div>}
      ruleTitle="Think first."
      rule="The arrangement stage is where you decide whether to win, kong, or discard."
      check={<ChoiceCheck question={{ prompt: 'You draw a tile that completes your hand. What can you declare?', options: ['Self-draw', 'Pass', 'Dead wall', 'River'], answer: 0, explanation: 'Correct. A winning draw is a self-draw.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'The arrangement stage is where you decide whether to win, kong, or discard.', body: 'Check win, check kong, then choose your discard.' }}
    />
  );
}

export function DiscardingLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [discarded, setDiscarded] = useState<string | null>(null);
  const ready = Boolean(discarded);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Confirm the discard only after it visibly lands in the river."
      copy={['To discard, choose one tile and place it face up in the river so everyone can see it.', 'Once the tile is clearly discarded, you cannot pull it back into your concealed hand. Clear discards make calls fair.']}
      visual={<div className="section-four-discard-board"><div><span className="eyebrow">Hand</span><div className="learn-tile-rail">{['一', '二', '三', '發', '9萬'].map((tile) => <button type="button" className={`mini-tile tile-image ${selected === tile ? 'active' : ''}`} onClick={() => setSelected(tile)} key={tile}><img src={getTileSrc(tile)} alt="" /></button>)}</div></div><button type="button" className="section-four-river" onClick={() => selected && setDiscarded(selected)}><span className="eyebrow">River</span>{discarded ? <MiniTile tile={discarded} /> : 'Tap after choosing a tile'}</button></div>}
      ruleTitle="Discard clearly."
      rule="A discard must be clear, face up, and visible to everyone."
      check={<><h3>Place one tile into the river.</h3><p>{ready ? 'Discard confirmed. Other players can now call or pass.' : 'Choose a tile, then tap the river.'}</p></>}
      ready={ready}
      takeaway={{ title: 'A discard must be clear, face up, and visible to everyone.', body: 'Visible discards make calls fair.' }}
    />
  );
}

export function CallWindowLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Discard, pause, then next draw."
      copy={['After a discard, the table briefly pauses. Other players may call the most recent discard for Chow, Pung, Kong, or Win if the rules allow it.', 'If nobody calls, the next player draws from the live wall. The pause matters because drawing too quickly can block a legal call.']}
      visual={<div className="section-four-call-window"><MiniTile tile="中" /><button>Call</button><button>Pass</button><button>Pass</button></div>}
      ruleTitle="Pause after discard."
      rule="After every discard, there is a brief chance for opponents to call."
      check={<ChoiceCheck question={{ prompt: 'A tile is discarded. Nobody calls. What happens next?', options: ['Next player draws from the live wall', 'The tile returns to hand', 'The hand ends', 'East scores'], answer: 0, explanation: 'Correct. If nobody calls, the next player draws.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'After every discard, there is a brief chance for opponents to call.', body: 'The rhythm is discard, pause, then next draw.' }}
    />
  );
}

export function TurnOrderLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Calls interrupt turn order."
      copy={['Normally, play moves around the table in order. Calls interrupt that order.', 'If a player calls Pung, Kong, or Chow, that player exposes the set and then discards. Play continues from the caller, not from the player who would have drawn next.']}
      visual={<TurnTable activeSeat="South" calledSeat="West" />}
      ruleTitle="Caller discards next."
      rule="South discards, West calls Pung, West discards next."
      check={<ChoiceCheck question={{ prompt: 'South discards. West calls Pung. Who discards next?', options: ['South', 'East', 'West', 'North'], answer: 2, explanation: 'Exactly. Calls move play to the caller.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Calls interrupt turn order and move play to the caller.', body: 'This is why calls can skip players.' }}
    />
  );
}

export function WhatEndsHandLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  return (
    <LessonFrame
      lessonId={lessonId}
      nextHref={nextHref}
      title="Every hand ends with a win or a draw."
      copy={['A hand ends in one of two ways. Someone wins, either by self-draw or by claiming another player’s discard, or the live wall runs out and nobody wins.', 'After a win, the hand is verified and scored. After a draw, players move to the next hand according to the round rules.']}
      visual={<div className="section-four-ending-branches"><div><h3>Someone wins</h3><p>Verify and score</p></div><div><h3>Wall runs out</h3><p>Drawn hand</p></div></div>}
      ruleTitle="Two endings."
      rule="A hand ends when someone wins, or when the live wall runs out with no winner."
      check={<ChoiceCheck question={{ prompt: 'Which two events can end a hand?', options: ['A player wins, or the wall runs out with no winner', 'A player draws, or a player arranges', 'A player passes, or East speaks', 'A player builds the wall, or rolls dice'], answer: 0, explanation: 'Correct. Every hand ends in either a win or a draw.' }} onCorrect={() => setReady(true)} />}
      ready={ready}
      takeaway={{ title: 'Every hand ends in either a win or a draw.', body: 'Scoring happens after a win; round rules handle draws.' }}
    />
  );
}

export function SectionFourRecap() {
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
          <span className="eyebrow">Turn rhythm</span>
          <h3>Draw, arrange, discard, pause.</h3>
          <p>Keep that rhythm and the table stays readable.</p>
        </div>
        <TileRail tiles={['一', '二', '三', '中']} />
      </div>
    </div>
  );
}

export function SectionFourCheckpoint() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => checkpointQuestions.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0), [answers]);
  const answeredCount = Object.keys(answers).length;

  const submit = () => {
    setSubmitted(true);
    completeLesson('turn-flow-and-discarding/checkpoint', '/learn/calls-chow-pung-kong-win');
    completeSection('section-4');
  };

  return (
    <div className="section-one-checkpoint">
      <div className="learn-content-card section-one-checkpoint-intro">
        <span className="eyebrow">Checkpoint quiz</span>
        <h3>Can you follow a hand turn by turn?</h3>
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
              {submitted && selected !== undefined ? <p className="section-one-feedback">{isCorrect ? question.explanation : 'Not quite. Review the turn rhythm, then try again.'}</p> : null}
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
          <a className="btn-primary gold" href="/learn/calls-chow-pung-kong-win">
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
