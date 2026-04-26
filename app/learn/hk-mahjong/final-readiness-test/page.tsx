'use client';

import Link from 'next/link';
import { Quiz } from '@/components/learn/quiz';
import { useLearnProgress } from '@/components/learn/progress-provider';
import { finalReadinessQuestions, sections } from '@/lib/learn-curriculum';

export default function FinalReadinessTestPage() {
  const { progress, setProgress } = useLearnProgress();

  return (
    <main className="learn-page">
      <Link href="/learn/hk-mahjong" className="learn-link">
        ← Back to curriculum
      </Link>
      <section className="learn-card">
        <h1>Final readiness test</h1>
        <p className="learn-muted">20 scenario questions · pass threshold 85%</p>
      </section>
      <Quiz
        questions={finalReadinessQuestions}
        passThreshold={85}
        onPass={(score) => {
          setProgress({ ...progress, finalReadinessScore: score });
        }}
        onFinish={(score) => {
          setProgress({ ...progress, finalReadinessScore: score });
        }}
      />
      {(progress.finalReadinessScore ?? 0) < 85 ? (
        <section className="learn-card">
          <h3>Suggested weak areas</h3>
          <ul>
            {sections
              .filter((section) => !progress.completedSections.includes(section.id))
              .slice(0, 3)
              .map((section) => (
                <li key={section.id}>
                  <Link href={`/learn/hk-mahjong/${section.slug}`}>{section.title}</Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
