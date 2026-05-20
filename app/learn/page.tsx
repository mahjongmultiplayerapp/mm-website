import type { Metadata } from 'next';
import Link from 'next/link';
import { LearnShell } from './components';
import { hongKongLearnPath, learnSections, totalLessonCount } from './learn-data';

export const metadata: Metadata = {
  title: 'Learn Mahjong | Mahjong Multiplayer',
  description: 'Choose a mahjong ruleset to learn, starting with Hong Kong Mahjong.',
};

const mahjongVersions = [
  {
    name: 'Hong Kong Mahjong',
    label: 'Available now',
    description: 'A beginner-friendly path through 13-tile Hong Kong Mahjong, from tiles and turns to calls, scoring, and table flow.',
    href: hongKongLearnPath,
    isAvailable: true,
    stats: [`${learnSections.length} sections`, `${totalLessonCount} lessons`],
  },
  {
    name: 'American Mahjong (NMJL)',
    label: 'Coming Soon',
    description: 'Card-based hands, jokers, Charleston, and the National Mah Jongg League style of play.',
    isAvailable: false,
    stats: ['NMJL card', 'Jokers'],
  },
  {
    name: 'Riichi Mahjong (Japanese)',
    label: 'Coming Soon',
    description: 'Yaku, riichi declarations, furiten, dora, and the distinctive flow of Japanese mahjong.',
    isAvailable: false,
    stats: ['Yaku', 'Dora'],
  },
  {
    name: 'Taiwanese Mahjong',
    label: 'Coming Soon',
    description: 'The 16-tile style with Taiwanese table structure, winning shapes, and scoring patterns.',
    isAvailable: false,
    stats: ['16 tiles', 'Scoring'],
  },
];

const [hongKongVersion, ...comingSoonVersions] = mahjongVersions;

export default function LearnVersionPickerPage() {
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
            <h1 style={{ marginTop: '18px' }}>Choose Your Mahjong Style</h1>
            <p className="lede">
              <strong>Start with learning Hong Kong Mahjong, the world&apos;s most popular version</strong>, then come back to learn other rulesets over time.
            </p>
          </div>
          <Link className="learn-version-card learn-version-card-featured" href={hongKongLearnPath}>
            <div className="learn-version-card-top">
              <span className="learn-version-mark">HK</span>
              <span className="learn-status-pill available">{hongKongVersion.label}</span>
            </div>
            <h3>{hongKongVersion.name}</h3>
            <p>{hongKongVersion.description}</p>
            <div className="learn-card-meta">
              {hongKongVersion.stats.map((stat) => (
                <span key={stat}>{stat}</span>
              ))}
            </div>
            <span className="btn-primary gold learn-version-card-cta">Start Learning Hong Kong Mahjong</span>
          </Link>
        </div>
      </section>

      <section className="learn-curriculum">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Versions</span>
            <h2 style={{ marginTop: '14px' }}>More Mahjong ruleset lessons coming soon</h2>
          </div>
          <div className="learn-version-grid">
            {comingSoonVersions.map((version) => (
              <article className="learn-version-card disabled" aria-disabled="true" key={version.name}>
                <div className="learn-version-card-top">
                  <span className="learn-version-mark">{version.name.slice(0, 2).toUpperCase()}</span>
                  <span className="learn-status-pill">{version.label}</span>
                </div>
                <h3>{version.name}</h3>
                <p>{version.description}</p>
                <div className="learn-card-meta">
                  {version.stats.map((stat) => (
                    <span key={stat}>{stat}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </LearnShell>
  );
}
