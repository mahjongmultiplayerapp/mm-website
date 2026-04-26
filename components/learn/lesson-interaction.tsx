'use client';

import { useMemo, useState } from 'react';
import type { InteractionData, Option } from '@/lib/learn-curriculum';

type Props = {
  interaction: InteractionData;
  onComplete: () => void;
};

function OptionButtons({ options, onDone }: { options: Option[]; onDone: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = useMemo(() => options.find((o) => o.id === selected), [options, selected]);
  const isCorrect = !!selectedOption?.correct;

  return (
    <div className="learn-stack">
      <div className="learn-grid-2">
        {options.map((option) => (
          <button
            key={option.id}
            className={`learn-option ${submitted && option.id === selected ? (option.correct ? 'correct' : 'wrong') : ''}`}
            onClick={() => setSelected(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="learn-btn"
        disabled={!selected}
        onClick={() => {
          setSubmitted(true);
          if (isCorrect) onDone();
        }}
      >
        Check answer
      </button>
      {submitted && selectedOption ? (
        <p className={`learn-feedback ${isCorrect ? 'ok' : 'bad'}`}>
          {isCorrect ? '✅ Correct. ' : '❌ Not quite. '}
          {selectedOption.explanation}
        </p>
      ) : null}
    </div>
  );
}

function ClickThroughCard({ interaction, onComplete }: { interaction: Extract<InteractionData, { type: 'clickThrough' }>; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const done = step === interaction.steps.length - 1;

  return (
    <div className="learn-card">
      <h4>{interaction.title}</h4>
      <p className="learn-muted">{interaction.prompt}</p>
      <div className="learn-interaction-surface">
        <h5>{interaction.steps[step].title}</h5>
        <p>{interaction.steps[step].description}</p>
      </div>
      <div className="learn-row">
        <button type="button" className="learn-btn ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </button>
        {done ? (
          <button type="button" className="learn-btn" onClick={onComplete}>
            Mark complete
          </button>
        ) : (
          <button type="button" className="learn-btn" onClick={() => setStep((s) => s + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function TileClassifierCard({ interaction, onComplete }: { interaction: Extract<InteractionData, { type: 'tileClassifier' }>; onComplete: () => void }) {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const allComplete = interaction.tiles.every((tile) => status[tile.id]);

  return (
    <div className="learn-card">
      <h4>{interaction.title}</h4>
      <p className="learn-muted">{interaction.prompt}</p>
      <div className="learn-stack">
        {interaction.tiles.map((tile) => (
          <div className="learn-row between" key={tile.id}>
            <span className="learn-tile">{tile.label}</span>
            <div className="learn-row">
              <button type="button" className="learn-btn ghost" onClick={() => setStatus((p) => ({ ...p, [tile.id]: tile.category === 'suit' }))}>
                Suit
              </button>
              <button type="button" className="learn-btn ghost" onClick={() => setStatus((p) => ({ ...p, [tile.id]: tile.category === 'honor' }))}>
                Honor
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="learn-btn" disabled={!allComplete} onClick={onComplete}>
          Continue
        </button>
      </div>
    </div>
  );
}

function HandValidatorCard({ interaction, onComplete }: { interaction: Extract<InteractionData, { type: 'handValidator' }>; onComplete: () => void }) {
  const [correctCount, setCorrectCount] = useState(0);
  return (
    <div className="learn-card">
      <h4>{interaction.title}</h4>
      <p className="learn-muted">{interaction.prompt}</p>
      <div className="learn-stack">
        {interaction.hands.map((hand) => (
          <button
            key={hand.id}
            type="button"
            className="learn-option"
            onClick={() => setCorrectCount((prev) => (hand.isWinningShape ? prev + 1 : prev))}
          >
            {hand.label}
            <span className="learn-muted"> {hand.explanation}</span>
          </button>
        ))}
        <button type="button" className="learn-btn" disabled={correctCount < 1} onClick={onComplete}>
          Continue
        </button>
      </div>
    </div>
  );
}

function CardCarouselCard({ interaction, onComplete }: { interaction: Extract<InteractionData, { type: 'cardCarousel' }>; onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const done = index === interaction.cards.length - 1;

  return (
    <div className="learn-card">
      <h4>{interaction.title}</h4>
      <p className="learn-muted">{interaction.prompt}</p>
      <div className="learn-interaction-surface">
        <p className="learn-eyebrow">
          Card {index + 1}/{interaction.cards.length}
        </p>
        <h5>{interaction.cards[index].title}</h5>
        {interaction.cards[index].tag ? <p className="learn-feedback ok">{interaction.cards[index].tag}</p> : null}
        <p>{interaction.cards[index].description}</p>
      </div>
      <div className="learn-row">
        <button type="button" className="learn-btn ghost" disabled={index === 0} onClick={() => setIndex((v) => v - 1)}>
          Back
        </button>
        {done ? (
          <button type="button" className="learn-btn" onClick={onComplete}>
            Mark complete
          </button>
        ) : (
          <button type="button" className="learn-btn" onClick={() => setIndex((v) => v + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function TableMapCard({ interaction, onComplete }: { interaction: Extract<InteractionData, { type: 'tableMap' }>; onComplete: () => void }) {
  const [seen, setSeen] = useState<string[]>([]);
  const allSeen = interaction.hotspots.every((spot) => seen.includes(spot.id));
  return (
    <div className="learn-card">
      <h4>{interaction.title}</h4>
      <p className="learn-muted">{interaction.prompt}</p>
      <div className="learn-grid-2">
        {interaction.hotspots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            className={`learn-option ${seen.includes(spot.id) ? 'selected' : ''}`}
            onClick={() => setSeen((prev) => (prev.includes(spot.id) ? prev : [...prev, spot.id]))}
          >
            <strong>{spot.label}</strong>
            <p className="learn-muted">{spot.description}</p>
          </button>
        ))}
      </div>
      <button type="button" className="learn-btn" disabled={!allSeen} onClick={onComplete}>
        Continue
      </button>
    </div>
  );
}

export function LessonInteraction({ interaction, onComplete }: Props) {
  switch (interaction.type) {
    case 'clickThrough':
      return <ClickThroughCard interaction={interaction} onComplete={onComplete} />;
    case 'cardCarousel':
      return <CardCarouselCard interaction={interaction} onComplete={onComplete} />;
    case 'multipleChoice':
      return (
        <div className="learn-card">
          <h4>{interaction.title}</h4>
          <p className="learn-muted">{interaction.prompt}</p>
          <p className="learn-question">{interaction.question}</p>
          <OptionButtons options={interaction.options} onDone={onComplete} />
        </div>
      );
    case 'tileClassifier':
      return <TileClassifierCard interaction={interaction} onComplete={onComplete} />;
    case 'handValidator':
      return <HandValidatorCard interaction={interaction} onComplete={onComplete} />;
    case 'tableMap':
      return <TableMapCard interaction={interaction} onComplete={onComplete} />;
    case 'turnOrderSimulator':
      return (
        <div className="learn-card">
          <h4>{interaction.title}</h4>
          <p className="learn-muted">{interaction.prompt}</p>
          <p>{interaction.scenario.action}</p>
          <OptionButtons
            options={interaction.scenario.choices.map((choice, idx) => ({
              id: String(idx),
              label: choice,
              correct: choice === interaction.scenario.correctChoice,
              explanation: interaction.scenario.explanation,
            }))}
            onDone={onComplete}
          />
        </div>
      );
    case 'callDecision':
      return (
        <div className="learn-card">
          <h4>{interaction.title}</h4>
          <p className="learn-muted">{interaction.prompt}</p>
          <p>
            Discard came from <strong>{interaction.scenario.discarder}</strong>: <strong>{interaction.scenario.discardedTile}</strong>
          </p>
          <OptionButtons options={interaction.scenario.choices} onDone={onComplete} />
        </div>
      );
    case 'paymentSimulator':
      return (
        <div className="learn-card">
          <h4>{interaction.title}</h4>
          <p className="learn-muted">{interaction.prompt}</p>
          <p>
            {interaction.scenario.winType === 'selfDraw' ? 'Self-draw' : 'Discard'} win at {interaction.scenario.fan} fan.
          </p>
          <ul>
            {interaction.scenario.payments.map((payment) => (
              <li key={payment.player}>
                {payment.player}: {payment.amount}
              </li>
            ))}
          </ul>
          <button type="button" className="learn-btn" onClick={onComplete}>
            I understand
          </button>
        </div>
      );
    case 'fanSelector':
      return (
        <div className="learn-card">
          <h4>{interaction.title}</h4>
          <p className="learn-muted">{interaction.prompt}</p>
          <p className="learn-question">{interaction.question}</p>
          <OptionButtons options={interaction.options} onDone={onComplete} />
        </div>
      );
    default:
      return null;
  }
}
