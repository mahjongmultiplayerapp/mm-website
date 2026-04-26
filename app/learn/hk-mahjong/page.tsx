'use client';

import Link from 'next/link';
import { curriculumDescription, curriculumTitle, flattenLessons, sections } from '@/lib/learn-curriculum';
import { useLearnProgress } from '@/components/learn/progress-provider';

export default function LearnLandingPage() {
  const { progress } = useLearnProgress();
  const allLessons = flattenLessons();
  const completedCount = progress.completedLessons.length;
  const pct = Math.round((completedCount / allLessons.length) * 100) || 0;
  const last = allLessons.find((l) => l.id === progress.lastVisitedLessonId);

  return (
    <main className="learn-page">
      <section className="learn-hero">
        <p className="learn-eyebrow">Hong Kong Mahjong Curriculum</p>
        <h1>{curriculumTitle}</h1>
        <p>{curriculumDescription}</p>
        <div className="learn-row">
          <Link href={`/learn/hk-mahjong/${sections[0].slug}/${sections[0].lessons[0].slug}`} className="learn-btn">
            Start learning
          </Link>
          {last ? (
            <Link href={`/learn/hk-mahjong/${last.sectionSlug}/${last.slug}`} className="learn-btn ghost">
              Continue where you left off
            </Link>
          ) : null}
        </div>
      </section>

      <section className="learn-progress-card">
        <h3>Overall progress</h3>
        <p>{completedCount} lessons complete</p>
        <div className="learn-progress-track">
          <div className="learn-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="learn-grid">
        {sections.map((section) => {
          const sectionCompleted = section.lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
          return (
            <article key={section.id} className="learn-card">
              <p className="learn-eyebrow">Section {section.number}</p>
              <h3>{section.title}</h3>
              <p className="learn-muted">{section.description}</p>
              <p className="learn-muted">Est. {section.estimatedMinutes} min</p>
              <p className="learn-muted">
                {sectionCompleted}/{section.lessons.length} lessons complete
              </p>
              <Link href={`/learn/hk-mahjong/${section.slug}`} className="learn-btn">
                {sectionCompleted > 0 ? 'Continue' : 'Start'}
              </Link>
            </article>
          );
        })}
      </section>

      <section className="learn-card">
        <h3>Ready for a real table</h3>
        <p className="learn-muted">Complete all checkpoints and pass the final readiness test to unlock your completion milestone.</p>
        <Link className="learn-btn ghost" href="/learn/hk-mahjong/final-readiness-test">
          View final readiness test
        </Link>
      </section>
    </main>
  );
}
