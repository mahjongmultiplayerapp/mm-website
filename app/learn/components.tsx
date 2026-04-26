'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LearnSection } from './learn-data';

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
