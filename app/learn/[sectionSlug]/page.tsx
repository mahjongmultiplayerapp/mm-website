import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LearnShell, SectionProgress, TileRail } from '../components';
import { getFirstLessonPath, getSection, learnSections } from '../learn-data';

type SectionPageProps = {
  params: Promise<{ sectionSlug: string }>;
};

export function generateStaticParams() {
  return learnSections.map((section) => ({ sectionSlug: section.slug }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { sectionSlug } = await params;
  const section = getSection(sectionSlug);
  if (!section) return {};

  return {
    title: `${section.title} | Learn Hong Kong Mahjong`,
    description: section.purpose,
  };
}

export default async function SectionOverviewPage({ params }: SectionPageProps) {
  const { sectionSlug } = await params;
  const section = getSection(sectionSlug);
  if (!section) notFound();

  return (
    <LearnShell>
      <section className="learn-section-hero felt">
        <div className="wrap learn-section-hero-grid">
          <div>
            <nav className="learn-breadcrumb-trail" aria-label="Breadcrumb">
              <Link href="/learn">← Curriculum</Link>
              <span>Section {section.number}</span>
            </nav>
            <h1 style={{ marginTop: '18px' }}>{section.title}</h1>
            <p className="lede">{section.purpose}</p>
            <div className="learn-section-actions">
              <Link className="btn-primary gold" href={getFirstLessonPath(section)}>
                Start section
              </Link>
              <Link className="learn-secondary-link" href={`/learn/${section.slug}/checkpoint`}>
                View checkpoint
              </Link>
            </div>
          </div>
          <div className="learn-goals-card">
            <div className="learn-section-card-top">
              <span className="learn-section-number">{String(section.number).padStart(2, '0')}</span>
              <SectionProgress section={section} />
            </div>
            <h3>By the end, you&apos;ll be able to...</h3>
            <ul>
              {section.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
            <TileRail />
          </div>
        </div>
      </section>

      <section className="learn-lessons">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Lessons</span>
            <h2 style={{ marginTop: '14px' }}>Work through this section in order.</h2>
          </div>
          <div className="learn-lesson-list">
            {section.lessons.map((lesson) => (
              <Link className="learn-lesson-row" href={`/learn/${section.slug}/${lesson.slug}`} key={lesson.slug}>
                <span className="learn-lesson-number">{lesson.number}</span>
                <span>
                  <strong>{lesson.title}</strong>
                  <small>{lesson.objective}</small>
                </span>
                <span className="learn-row-arrow">→</span>
              </Link>
            ))}
            <Link className="learn-lesson-row learn-lesson-row-muted" href={`/learn/${section.slug}/recap`}>
              <span className="learn-lesson-number">R</span>
              <span>
                <strong>Section recap</strong>
                <small>Review the key ideas before the checkpoint.</small>
              </span>
              <span className="learn-row-arrow">→</span>
            </Link>
            <Link className="learn-lesson-row learn-lesson-row-muted" href={`/learn/${section.slug}/checkpoint`}>
              <span className="learn-lesson-number">Q</span>
              <span>
                <strong>Checkpoint quiz</strong>
                <small>Locked in the full build. Scaffolded now for routing.</small>
              </span>
              <span className="learn-row-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </LearnShell>
  );
}
