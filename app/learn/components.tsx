import Link from 'next/link';
import { LearnSection, getFirstLessonPath, learnSections, totalLessonCount } from './learn-data';

export function LearnNav() {
  return (
    <nav className="top learn-top">
      <div className="wrap row">
        <Link className="brand" href="/">
          <span className="mark">
            <img src="/assets/floating-tile-logo-sm.jpg" alt="Mahjong Multiplayer logo" />
          </span>
          <span className="name">Mahjong Multiplayer</span>
        </Link>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/learn">Curriculum</Link>
          </li>
          <li>
            <Link href="/learn/final-readiness-test">Final test</Link>
          </li>
        </ul>
        <Link className="nav-cta" href={getFirstLessonPath(learnSections[0])}>
          Start learning →
        </Link>
      </div>
    </nav>
  );
}

export function LearnFooter() {
  return (
    <footer className="learn-footer">
      <div className="wrap">
        <div className="row">
          <div>
            <Link className="brand" href="/">
              <span className="mark">
                <img src="/assets/floating-tile-logo-sm.jpg" alt="Mahjong Multiplayer logo" />
              </span>
              <span className="name">Mahjong Multiplayer</span>
            </Link>
            <p style={{ color: 'var(--ivory-dim)', maxWidth: '34ch', margin: '14px 0 0', fontSize: '14px' }}>
              Learn the rhythm of Hong Kong Mahjong, then bring it to the table.
            </p>
          </div>
          <div className="cols">
            <div>
              <h4>Learn</h4>
              <ul>
                <li>
                  <Link href="/learn">Curriculum</Link>
                </li>
                <li>
                  <Link href="/learn/final-readiness-test">Final test</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>App</h4>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/#contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="fine">Phase 1 shell · {totalLessonCount} lessons mapped</div>
      </div>
    </footer>
  );
}

export function TileRail() {
  return (
    <div className="learn-tile-rail" aria-hidden="true">
      <span className="mini-tile">一</span>
      <span className="mini-tile">二</span>
      <span className="mini-tile">三</span>
      <span className="mini-tile red">中</span>
      <span className="mini-tile">發</span>
      <span className="mini-tile">東</span>
    </div>
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

export function LearnShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LearnNav />
      <main className="learn-shell">{children}</main>
      <LearnFooter />
    </>
  );
}
