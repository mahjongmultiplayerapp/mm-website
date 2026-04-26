'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Quiz } from '@/components/learn/quiz';
import { useLearnProgress } from '@/components/learn/progress-provider';
import { getSectionBySlug } from '@/lib/learn-curriculum';

export default function CheckpointPage() {
  const params = useParams<{ sectionSlug: string | string[] }>();
  const sectionSlug = Array.isArray(params.sectionSlug) ? params.sectionSlug[0] : params.sectionSlug;
  const section = sectionSlug ? getSectionBySlug(sectionSlug) : undefined;
  const { progress, setProgress } = useLearnProgress();
  if (!section) {
    return (
      <main className="learn-page">
        <section className="learn-card">
          <h1>Section not found</h1>
          <Link href="/learn/hk-mahjong" className="learn-btn">
            Back to curriculum
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="learn-page">
      <Link href={`/learn/hk-mahjong/${section.slug}`} className="learn-link">
        ← Back to section
      </Link>
      <Quiz
        questions={section.checkpoint.questions}
        passThreshold={section.checkpoint.passThreshold}
        onPass={(score) => {
          setProgress({
            ...progress,
            completedSections: progress.completedSections.includes(section.id)
              ? progress.completedSections
              : [...progress.completedSections, section.id],
            checkpointScores: {
              ...progress.checkpointScores,
              [section.id]: Math.max(progress.checkpointScores[section.id] ?? 0, score),
            },
          });
        }}
      />
    </main>
  );
}
