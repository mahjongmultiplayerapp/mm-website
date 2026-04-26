import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingProgressActions } from './LearnProgress';
import { LearnShell, SectionProgress, TileRail } from './components';
import { getFirstLessonPath, learnSections, totalLessonCount } from './learn-data';

export const metadata: Metadata = {
  title: 'Learn Hong Kong Mahjong | Mahjong Multiplayer',
  description: 'Learn Hong Kong Mahjong interactively, from tiles and turns to calls, scoring, rounds, and table rules.',
};

export default function LearnLandingPage() {
  const firstLessonHref = getFirstLessonPath(learnSections[0]);
  const totalMinutes = learnSections.reduce((sum, section) => sum + section.estimatedMinutes, 0);

  return (
    <LearnShell>
      <section className="learn-hero felt">
        <div className="bamboo" aria-hidden="true">
          <svg viewBox="0 0 200 800" width="200" style={{ left: '-30px', top: '20px' }}>
            <g stroke="#1F8A62" strokeWidth="2" fill="none" opacity="0.45">
              <path d="M42 0 C 60 180, 22 410, 42 800" />
              <path d="M82 30 C 105 230, 58 450, 82 800" />
            </g>
          </svg>
        </div>
        <div className="wrap learn-hero-grid">
          <div>
            <span className="eyebrow">Learning Hub</span>
            <h1 style={{ marginTop: '18px' }}>Learn Hong Kong Mahjong for free</h1>
            <p className="lede">Perfect for beginners looking to learn enough of the basics to play a full round.</p>
            <LandingProgressActions firstLessonHref={firstLessonHref} totalLessons={totalLessonCount} />
          </div>
          <div className="learn-hero-card">
            <TileRail />
            <div className="learn-hero-stat">
              <span>{learnSections.length}</span>
              <small>sections</small>
            </div>
            <div className="learn-hero-stat">
              <span>{totalLessonCount}</span>
              <small>lessons</small>
            </div>
            <div className="learn-hero-stat">
              <span>{totalMinutes}</span>
              <small>minutes</small>
            </div>
          </div>
        </div>
      </section>

      <section id="curriculum" className="learn-curriculum">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Curriculum</span>
            <h2 style={{ marginTop: '14px' }}>Seven sections from first tile to real table.</h2>
          </div>
          <div className="learn-section-grid">
            {learnSections.map((section) => (
              <Link className="learn-section-card" href={`/learn/${section.slug}`} key={section.slug}>
                <div className="learn-section-card-top">
                  <span className="learn-section-number">{String(section.number).padStart(2, '0')}</span>
                  <SectionProgress section={section} />
                </div>
                <h3>{section.title}</h3>
                <p>{section.purpose}</p>
                <div className="learn-card-meta">
                  <span>{section.estimatedMinutes} min</span>
                  <span>Start →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="learn-outcome tight felt">
        <div className="wrap">
          <div className="final learn-outcome-card">
            <span className="eyebrow">Check your readiness</span>
            <h2 style={{ marginTop: '14px' }}>Take the Final Quiz</h2>
            <p className="lede">
              Check how well you understand Hong Kong Mahjong so that you prepared for your first game.
            </p>
            <Link className="btn-primary gold" href="/learn/final-readiness-test">
              Take Final Quiz
            </Link>
          </div>
        </div>
      </section>
    </LearnShell>
  );
}
