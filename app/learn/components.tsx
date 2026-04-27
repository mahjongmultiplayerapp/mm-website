'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LearnSection } from './learn-data';

const progressStorageKey = 'mahjong-multiplayer-learn-progress';

type LearnProgressStore = {
  completedLessons?: string[];
  completedSections?: string[];
  lastVisitedPath?: string;
};

function readLearnProgress(): Required<Pick<LearnProgressStore, 'completedLessons' | 'completedSections'>> & { lastVisitedPath?: string } {
  if (typeof window === 'undefined') return { completedLessons: [], completedSections: [] };

  try {
    const stored = window.localStorage.getItem(progressStorageKey);
    if (!stored) return { completedLessons: [], completedSections: [] };
    const parsed = JSON.parse(stored) as LearnProgressStore;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedSections: Array.isArray(parsed.completedSections) ? parsed.completedSections : [],
      lastVisitedPath: parsed.lastVisitedPath,
    };
  } catch {
    return { completedLessons: [], completedSections: [] };
  }
}

function writeLearnProgress(progress: LearnProgressStore) {
  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  window.dispatchEvent(new Event('learn-progress-updated'));
}

export function LearnNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="top">
      <div className="wrap row">
        <Link className="brand" href="/">
          <span className="mark">
            <img src="/assets/floating-tile-logo-sm.jpg" alt="Mahjong Multiplayer logo" />
          </span>
          <span className="name">Mahjong Multiplayer</span>
        </Link>
        <span className="brand-name-mobile">Mahjong Multiplayer</span>
        <button
          type="button"
          className={`menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul>
          <li>
            <Link href="/learn">Learn</Link>
          </li>
          <li>
            <Link href="/#features">Features</Link>
          </li>
          <li>
            <Link href="/#how">How it works</Link>
          </li>
          <li>
            <Link href="/#faq">FAQ</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
        </ul>
        <Link className="nav-cta" href="/#signup">
          Get early access →
        </Link>

        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <Link className="mobile-menu-cta" href="/#signup" onClick={closeMobileMenu}>
            Get early access →
          </Link>
          <div className="mobile-menu-cols">
            <div>
              <h4>App</h4>
              <ul>
                <li>
                  <Link href="/learn" onClick={closeMobileMenu}>
                    Learn
                  </Link>
                </li>
                <li>
                  <Link href="/#features" onClick={closeMobileMenu}>
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/#how" onClick={closeMobileMenu}>
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" onClick={closeMobileMenu}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" onClick={closeMobileMenu}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link href="#" onClick={closeMobileMenu}>
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={closeMobileMenu}>
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function LearnFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="row">
          <div>
            <Link className="brand" href="/" style={{ marginBottom: '14px' }}>
              <span className="mark">
                <img src="/assets/floating-tile-logo-sm.jpg" alt="Mahjong Multiplayer logo" />
              </span>
              <span className="name">Mahjong Multiplayer</span>
            </Link>
            <p style={{ color: 'var(--ivory-dim)', maxWidth: '32ch', margin: '14px 0 0', fontSize: '14px' }}>Play Mahjong online with friends, for free.</p>
          </div>
          <div className="cols">
            <div>
              <h4>App</h4>
              <ul>
                <li>
                  <Link href="/learn">Learn</Link>
                </li>
                <li>
                  <Link href="/#features">Features</Link>
                </li>
                <li>
                  <Link href="/#how">How it works</Link>
                </li>
                <li>
                  <Link href="/#faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/#contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link href="#">Privacy</Link>
                </li>
                <li>
                  <Link href="#">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="fine">© 2026 Mahjong Multiplayer · Built with ♥ for the tiles.</div>
      </div>
    </footer>
  );
}

export function TileRail() {
  const tiles = ['1-crak', '2-crak', '3-crak', 'dragon-red-chun', 'dragon-green-fa', 'east-wind'];

  return (
    <div className="learn-tile-rail" aria-hidden="true">
      {tiles.map((tile) => (
        <MiniTile tile={tile} key={tile} />
      ))}
    </div>
  );
}

const tileAliases: Record<string, string> = {
  '1': '1-dot',
  '2': '2-dot',
  '3': '3-dot',
  '4': '4-dot',
  '5': '5-dot',
  '6': '6-dot',
  '7': '7-dot',
  '8': '8-dot',
  '9': '9-dot',
  '一': '1-crak',
  '二': '2-crak',
  '三': '3-crak',
  '四': '4-crak',
  '五': '5-crak',
  '六': '6-crak',
  '七': '7-crak',
  '八': '8-crak',
  '九': '9-crak',
  '1萬': '1-crak',
  '2萬': '2-crak',
  '3萬': '3-crak',
  '4萬': '4-crak',
  '5萬': '5-crak',
  '6萬': '6-crak',
  '7萬': '7-crak',
  '8萬': '8-crak',
  '9萬': '9-crak',
  '東': 'east-wind',
  '南': 'south-wind',
  '西': 'west-wind',
  '北': 'north-wind',
  E: 'east-wind',
  S: 'south-wind',
  W: 'west-wind',
  N: 'north-wind',
  '中': 'dragon-red-chun',
  R: 'dragon-red-chun',
  red: 'dragon-red-chun',
  '發': 'dragon-green-fa',
  G: 'dragon-green-fa',
  green: 'dragon-green-fa',
  '白': 'dragon-white-soap',
  white: 'dragon-white-soap',
};

function normalizeTile(tile: string) {
  const normalized = tileAliases[tile] ?? tile;
  return normalized.endsWith('.svg') ? normalized.replace(/\.svg$/, '') : normalized;
}

export function getTileSrc(tile: string) {
  return `/assets/tiles/${normalizeTile(tile)}.svg`;
}

export function MiniTile({ tile, className = '' }: { tile: string; className?: string }) {
  const slug = normalizeTile(tile);

  return (
    <span className={`mini-tile tile-image ${className}`.trim()} title={tile} aria-label={tile}>
      <img src={`/assets/tiles/${slug}.svg`} alt="" />
    </span>
  );
}

export function SectionProgress({ section }: { section: LearnSection }) {
  return (
    <div className="learn-progress-ring" aria-label={`${section.lessons.length} lessons`}>
      <span>{section.lessons.length}</span>
      <small>lessons</small>
    </div>
  );
}

export function SectionTopProgress({ section }: { section: LearnSection }) {
  const [progress, setProgress] = useState(() => readLearnProgress());
  const sectionItemIds = useMemo(() => [...section.lessons.map((lesson) => `${section.slug}/${lesson.slug}`), `${section.slug}/recap`, `${section.slug}/checkpoint`], [section]);
  const completedCount = sectionItemIds.filter((itemId) => progress.completedLessons.includes(itemId)).length;
  const progressPercent = (completedCount / sectionItemIds.length) * 100;

  useEffect(() => {
    const refresh = () => setProgress(readLearnProgress());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('learn-progress-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('learn-progress-updated', refresh);
    };
  }, []);

  return (
    <div
      className="learn-top-progress"
      role="progressbar"
      aria-label={`Section progress: ${completedCount} of ${sectionItemIds.length} items complete`}
      aria-valuemin={0}
      aria-valuemax={sectionItemIds.length}
      aria-valuenow={completedCount}
    >
      <span style={{ width: `${progressPercent}%` }} />
    </div>
  );
}

export function CompleteProgressItem({ itemId, nextHref, sectionId }: { itemId: string; nextHref: string; sectionId?: string }) {
  useEffect(() => {
    const progress = readLearnProgress();
    const completedLessons = progress.completedLessons.includes(itemId) ? progress.completedLessons : [...progress.completedLessons, itemId];
    const completedSections = sectionId && !progress.completedSections.includes(sectionId) ? [...progress.completedSections, sectionId] : progress.completedSections;
    writeLearnProgress({ ...progress, completedLessons, completedSections, lastVisitedPath: nextHref });
  }, [itemId, nextHref, sectionId]);

  return null;
}

export function LearnShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LearnNav />
      <main className="learn-shell">{children}</main>
      <LearnFooter />
    </>
  );
}
