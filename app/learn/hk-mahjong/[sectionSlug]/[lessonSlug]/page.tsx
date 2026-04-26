'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { LessonInteraction } from '@/components/learn/lesson-interaction';
import { useLearnProgress } from '@/components/learn/progress-provider';
import { getSectionBySlug } from '@/lib/learn-curriculum';

export default function LessonPage() {
  const params = useParams<{ sectionSlug: string | string[]; lessonSlug: string | string[] }>();
  const sectionSlug = Array.isArray(params.sectionSlug) ? params.sectionSlug[0] : params.sectionSlug;
  const lessonSlug = Array.isArray(params.lessonSlug) ? params.lessonSlug[0] : params.lessonSlug;
  const { progress, setProgress } = useLearnProgress();
  const section = sectionSlug ? getSectionBySlug(sectionSlug) : undefined;
  const lesson = lessonSlug ? section?.lessons.find((item) => item.slug === lessonSlug) : undefined;
  const [interactionComplete, setInteractionComplete] = useState(false);

  if (!section || !lesson) {
    return (
      <main className="learn-page">
        <section className="learn-card">
          <h1>Lesson not found</h1>
          <Link href="/learn/hk-mahjong" className="learn-btn">
            Back to curriculum
          </Link>
        </section>
      </main>
    );
  }

  const lessonIndex = section.lessons.findIndex((item) => item.id === lesson.id);
  const prevLesson = lessonIndex > 0 ? section.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < section.lessons.length - 1 ? section.lessons[lessonIndex + 1] : null;
  const isDone = progress.completedLessons.includes(lesson.id);

  const continueHref = useMemo(() => {
    if (nextLesson) return `/learn/hk-mahjong/${section.slug}/${nextLesson.slug}`;
    return `/learn/hk-mahjong/${section.slug}/recap`;
  }, [nextLesson, section.slug]);

  return (
    <main className="learn-page">
      <nav className="learn-breadcrumbs">
        <Link href="/learn/hk-mahjong">Learn</Link>
        <span> / </span>
        <Link href={`/learn/hk-mahjong/${section.slug}`}>{section.title}</Link>
        <span> / </span>
        <span>{lesson.title}</span>
      </nav>

      <div className="learn-progress-track">
        <div className="learn-progress-fill" style={{ width: `${((lessonIndex + 1) / section.lessons.length) * 100}%` }} />
      </div>

      <section className="learn-card">
        <h1>{lesson.title}</h1>
        <p className="learn-muted">Objective: {lesson.objective}</p>
      </section>

      <section className="learn-card">
        <h3>Concept</h3>
        <p>{lesson.concept}</p>
        <h3>Visual example</h3>
        <p>{lesson.visualSpec}</p>
        <h3>Rule in plain English</h3>
        <p>{lesson.plainEnglishRule}</p>
      </section>

      <LessonInteraction
        interaction={lesson.interaction}
        onComplete={() => {
          setInteractionComplete(true);
          if (!isDone) {
            setProgress({
              ...progress,
              completedLessons: [...progress.completedLessons, lesson.id],
              lastVisitedLessonId: lesson.id,
            });
          }
        }}
      />

      <section className="learn-card">
        <h3>Takeaway</h3>
        <p>{lesson.takeaway}</p>
      </section>

      <div className="learn-row between">
        {prevLesson ? (
          <Link className="learn-btn ghost" href={`/learn/hk-mahjong/${section.slug}/${prevLesson.slug}`}>
            Previous lesson
          </Link>
        ) : (
          <Link className="learn-btn ghost" href={`/learn/hk-mahjong/${section.slug}`}>
            Section overview
          </Link>
        )}

        <Link className="learn-btn" aria-disabled={!(interactionComplete || isDone)} href={interactionComplete || isDone ? continueHref : '#'}>
          Continue
        </Link>
      </div>
    </main>
  );
}
