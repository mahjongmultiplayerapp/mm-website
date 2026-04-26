import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonCompletionPanel } from '../../LearnProgress';
import { HandFlowLesson, MahjongStylesLesson, ObjectiveLesson, SectionOneCheckpoint, SectionOneRecap, ShapeOfGameLesson } from '../../SectionOneLessons';
import { WelcomeToGameLesson } from '../../WelcomeToGameLesson';
import { LearnShell, TileRail } from '../../components';
import { getLesson, getNextLessonPath, getPreviousLessonPath, learnSections } from '../../learn-data';

type LessonPageProps = {
  params: Promise<{ sectionSlug: string; lessonSlug: string }>;
};

export function generateStaticParams() {
  return learnSections.flatMap((section) => [
    ...section.lessons.map((lesson) => ({ sectionSlug: section.slug, lessonSlug: lesson.slug })),
    { sectionSlug: section.slug, lessonSlug: 'recap' },
    { sectionSlug: section.slug, lessonSlug: 'checkpoint' },
  ]);
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { sectionSlug, lessonSlug } = await params;
  const { section, lesson } = getLesson(sectionSlug, lessonSlug);
  if (!section) return {};

  if (lessonSlug === 'recap') {
    return {
      title: `${section.title} Recap | Learn Hong Kong Mahjong`,
      description: `Review ${section.title}.`,
    };
  }

  if (lessonSlug === 'checkpoint') {
    return {
      title: `${section.title} Checkpoint | Learn Hong Kong Mahjong`,
      description: `Checkpoint quiz for ${section.title}.`,
    };
  }

  return {
    title: `${lesson?.title ?? section.title} | Learn Hong Kong Mahjong`,
    description: lesson?.objective ?? section.purpose,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { sectionSlug, lessonSlug } = await params;
  const { section, lesson } = getLesson(sectionSlug, lessonSlug);
  if (!section) notFound();
  const isSectionOne = section.slug === 'what-is-hong-kong-mahjong';

  if (lessonSlug === 'recap') {
    return (
      <LearnShell>
        <section className="learn-lesson-page felt">
          <div className="wrap learn-readable">
            <Link className="learn-breadcrumb" href={`/learn/${section.slug}`}>
              ← {section.title}
            </Link>
            <span className="eyebrow">Section recap</span>
            <h1 style={{ marginTop: '18px' }}>{section.title}</h1>
            <p className="lede">{isSectionOne ? 'Review the big picture before the checkpoint.' : 'This recap page is scaffolded for the section summary, key concepts, and checkpoint preparation.'}</p>
            {isSectionOne ? (
              <SectionOneRecap />
            ) : (
              <div className="learn-content-grid">
                {section.goals.map((goal) => (
                  <div className="learn-content-card" key={goal}>
                    <span className="eyebrow">Key idea</span>
                    <h3>{goal}</h3>
                    <p>Lesson-specific reinforcement will be added here as the curriculum content is built out.</p>
                  </div>
                ))}
              </div>
            )}
            <div className="learn-prev-next">
              <Link className="learn-secondary-link" href={`/learn/${section.slug}`}>
                Section overview
              </Link>
              <Link className="btn-primary gold" href={`/learn/${section.slug}/checkpoint`}>
                Go to checkpoint
              </Link>
            </div>
          </div>
        </section>
      </LearnShell>
    );
  }

  if (lessonSlug === 'checkpoint') {
    return (
      <LearnShell>
        <section className="learn-lesson-page felt">
          <div className="wrap learn-readable">
            <Link className="learn-breadcrumb" href={`/learn/${section.slug}`}>
              ← {section.title}
            </Link>
            <span className="eyebrow">Checkpoint</span>
            <h1 style={{ marginTop: '18px' }}>Checkpoint: {section.title}</h1>
            <p className="lede">{isSectionOne ? 'Answer five questions to confirm you understand the big picture.' : 'This quiz route is ready for the 80% pass checkpoint flow from the spec.'}</p>
            {isSectionOne ? (
              <SectionOneCheckpoint />
            ) : (
              <div className="learn-complete-card">
                <div>
                  <span className="eyebrow">Coming next</span>
                  <h3>Quiz shell</h3>
                  <p>Multiple choice, ordering, and table-identification checks will live here.</p>
                </div>
                <Link className="btn-primary gold" href="/learn">
                  Back to curriculum
                </Link>
              </div>
            )}
          </div>
        </section>
      </LearnShell>
    );
  }

  if (!lesson) notFound();

  const lessonId = `${section.slug}/${lesson.slug}`;
  const nextHref = getNextLessonPath(section.slug, lesson.slug);
  const previousHref = getPreviousLessonPath(section.slug, lesson.slug);
  const lessonProgress = ((section.lessons.findIndex((item) => item.slug === lesson.slug) + 1) / section.lessons.length) * 100;

  return (
    <LearnShell>
      <section className="learn-lesson-page felt">
        <div className="learn-top-progress" aria-hidden="true">
          <span style={{ width: `${lessonProgress}%` }} />
        </div>
        <div className="wrap learn-readable">
          <Link className="learn-breadcrumb" href={`/learn/${section.slug}`}>
            ← {section.title}
          </Link>
          <span className="eyebrow">Lesson {lesson.number}</span>
          <h1 style={{ marginTop: '18px' }}>{lesson.title}</h1>
          <p className="lede">{lesson.objective}</p>

          {lesson.slug === 'welcome-to-the-game' && isSectionOne ? (
            <WelcomeToGameLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'hk-mahjong-vs-other-styles' && isSectionOne ? (
            <MahjongStylesLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'objective-of-a-hand' && isSectionOne ? (
            <ObjectiveLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'shape-of-the-game' && isSectionOne ? (
            <ShapeOfGameLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'how-a-hand-flows' && isSectionOne ? (
            <HandFlowLesson lessonId={lessonId} nextHref={nextHref} />
          ) : (
            <div className="learn-lesson-template">
              <div className="learn-content-card">
                <span className="eyebrow">Concept</span>
                <h3>{lesson.title}</h3>
                <p>This area will introduce the lesson idea in beginner-friendly language.</p>
              </div>
              <div className="learn-content-card">
                <span className="eyebrow">Visual example</span>
                <TileRail />
                <p>Tiles, table diagrams, or flow visuals will be inserted here for this lesson.</p>
              </div>
              <div className="learn-content-card">
                <span className="eyebrow">Rule in plain English</span>
                <h3>Simple table rule</h3>
                <p>The formal rulebook idea will be translated into practical table language.</p>
              </div>
              <LessonCompletionPanel lessonId={lessonId} nextHref={nextHref} />
              <div className="learn-content-card learn-takeaway-card">
                <span className="eyebrow">Takeaway</span>
                <h3>What the learner should remember</h3>
                <p>A concise takeaway from the PRD will go here when we build this lesson.</p>
              </div>
            </div>
          )}

          <div className="learn-prev-next">
            <Link className="learn-secondary-link" href={previousHref}>
              ← Previous
            </Link>
            <Link className="btn-primary gold" href={nextHref}>
              Next
            </Link>
          </div>
        </div>
      </section>
    </LearnShell>
  );
}
