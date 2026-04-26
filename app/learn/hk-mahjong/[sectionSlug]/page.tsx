'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useLearnProgress } from '@/components/learn/progress-provider';
import { getSectionBySlug } from '@/lib/learn-curriculum';

export default function SectionOverviewPage() {
  const params = useParams<{ sectionSlug: string | string[] }>();
  const sectionSlug = Array.isArray(params.sectionSlug) ? params.sectionSlug[0] : params.sectionSlug;
  const section = sectionSlug ? getSectionBySlug(sectionSlug) : undefined;
  const { progress } = useLearnProgress();

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

  const firstIncomplete = useMemo(
    () => section.lessons.find((lesson) => !progress.completedLessons.includes(lesson.id)) ?? section.lessons[0],
    [section.lessons, progress.completedLessons],
  );

  const completed = section.lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
  const checkpointScore = progress.checkpointScores[section.id];

  return (
    <main className="learn-page">
      <Link href="/learn/hk-mahjong" className="learn-link">← Back to curriculum</Link>
      <section className="learn-card">
        <p className="learn-eyebrow">Section {section.number}</p>
        <h1>{section.title}</h1>
        <p>{section.purpose}</p>
        <ul>
          {section.learningGoals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
        <p className="learn-muted">{completed}/{section.lessons.length} lessons complete</p>
        <Link className="learn-btn" href={`/learn/hk-mahjong/${section.slug}/${firstIncomplete.slug}`}>
          Continue section
        </Link>
      </section>

      <section className="learn-grid">
        {section.lessons.map((lesson, index) => {
          const done = progress.completedLessons.includes(lesson.id);
          return (
            <article key={lesson.id} className="learn-card">
              <p className="learn-eyebrow">Lesson {section.number}.{index + 1}</p>
              <h3>{lesson.title}</h3>
              <p className="learn-muted">{lesson.objective}</p>
              <Link href={`/learn/hk-mahjong/${section.slug}/${lesson.slug}`} className="learn-btn ghost">
                {done ? 'Review' : 'Start'} lesson
              </Link>
            </article>
          );
        })}
      </section>

      <section className="learn-card">
        <h3>Section checkpoint</h3>
        <p className="learn-muted">Pass score: {section.checkpoint.passThreshold}%</p>
        {completed < section.lessons.length ? (
          <p className="learn-feedback bad">Complete all lessons before unlocking this checkpoint.</p>
        ) : (
          <Link className="learn-btn" href={`/learn/hk-mahjong/${section.slug}/checkpoint`}>
            {checkpointScore ? 'Retry checkpoint' : 'Start checkpoint'}
          </Link>
        )}
        {typeof checkpointScore === 'number' ? <p className="learn-feedback ok">Best score: {checkpointScore}%</p> : null}
      </section>
    </main>
  );
}
