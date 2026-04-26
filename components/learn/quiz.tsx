'use client';

import { useState } from 'react';
import type { Option } from '@/lib/learn-curriculum';

type Question = { id: string; question: string; options: Option[] };

export function Quiz({
  questions,
  passThreshold,
  onPass,
  onFinish,
}: {
  questions: Question[];
  passThreshold: number;
  onPass: (score: number) => void;
  onFinish?: (score: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const score = Math.round((correct / questions.length) * 100);

  if (done) {
    const passed = score >= passThreshold;
    return (
      <section className="learn-card">
        <h3>{passed ? 'Passed 🎉' : 'Not passed yet'}</h3>
        <p>
          Score: {score}% (need {passThreshold}%)
        </p>
        <p className={`learn-feedback ${passed ? 'ok' : 'bad'}`}>
          {passed ? 'Great work. You can move forward.' : 'Review weak areas and retry.'}
        </p>
        <button type="button" className="learn-btn" onClick={() => window.location.reload()}>
          Retry quiz
        </button>
      </section>
    );
  }

  return (
    <section className="learn-card">
      <p className="learn-eyebrow">
        Question {index + 1}/{questions.length}
      </p>
      <h3>{q.question}</h3>
      <div className="learn-stack">
        {q.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`learn-option ${selected === option.id ? 'selected' : ''}`}
            onClick={() => !feedback && setSelected(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {feedback ? <p className={`learn-feedback ${feedback.correct ? 'ok' : 'bad'}`}>{feedback.explanation}</p> : null}
      <button
        type="button"
        className="learn-btn"
        disabled={!selected}
        onClick={() => {
          if (!feedback) {
            const selectedOption = q.options.find((o) => o.id === selected);
            setFeedback({
              correct: !!selectedOption?.correct,
              explanation: selectedOption?.explanation ?? 'Review the rule and try again.',
            });
            return;
          }

          const selectedOption = q.options.find((o) => o.id === selected);
          const isCorrect = !!selectedOption?.correct;
          const nextCorrect = correct + (isCorrect ? 1 : 0);
          const nextIndex = index + 1;

          if (nextIndex >= questions.length) {
            const final = Math.round((nextCorrect / questions.length) * 100);
            if (final >= passThreshold) onPass(final);
            onFinish?.(final);
            setCorrect(nextCorrect);
            setDone(true);
            return;
          }

          setCorrect(nextCorrect);
          setIndex(nextIndex);
          setSelected(null);
          setFeedback(null);
        }}
      >
        {feedback ? 'Next question' : 'Check answer'}
      </button>
    </section>
  );
}
