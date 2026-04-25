'use client';

import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';

function Brand() {
  return (
    <a className="brand" href="#">
      <span className="mark">
        <img src="/assets/floating-tile-logo-sm.jpg" alt="Mahjong Multiplayer logo" />
      </span>
      <span className="name">Mahjong Multiplayer</span>
    </a>
  );
}

function TopNav({ onOpenSignup }: { onOpenSignup: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onSignupClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onOpenSignup();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="top">
      <div className="wrap row">
        <Brand />
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
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#learning">Learning</a>
          </li>
          <li>
            <a href="#how">How it works</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <a className="nav-cta" href="#" onClick={onSignupClick}>
          Get early access →
        </a>

        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <a className="mobile-menu-cta" href="#" onClick={onSignupClick}>
            Get early access →
          </a>
          <div className="mobile-menu-cols">
            <div>
              <h4>App</h4>
              <ul>
                <li>
                  <a href="#features" onClick={closeMobileMenu}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how" onClick={closeMobileMenu}>
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#learning" onClick={closeMobileMenu}>
                    Learning
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={closeMobileMenu}>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={closeMobileMenu}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#" onClick={closeMobileMenu}>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" onClick={closeMobileMenu}>
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onSignupSubmit }: { onSignupSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <header className="hero felt">
      <div className="bamboo" aria-hidden="true">
        <svg viewBox="0 0 200 800" width="200" style={{ left: '-20px', top: '40px' }}>
          <g stroke="#1F8A62" strokeWidth="2" fill="none" opacity="0.5">
            <path d="M40 0 C 60 200, 20 400, 40 800" />
            <path d="M80 20 C 100 220, 60 420, 80 800" />
            <path d="M10 80 C 30 280, -10 480, 10 780" />
          </g>
        </svg>
        <svg viewBox="0 0 200 800" width="180" style={{ right: '-10px', top: '80px' }}>
          <g stroke="#1F8A62" strokeWidth="2" fill="none" opacity="0.4">
            <path d="M160 0 C 140 200, 180 400, 160 800" />
            <path d="M120 30 C 100 230, 140 430, 120 800" />
          </g>
        </svg>
      </div>

      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Coming soon to iOS &amp; Android</span>
          <h1 style={{ marginTop: '18px' }}>
            Play Mahjong <span className="accent">with friends</span>, online for free
          </h1>
          <p className="lede">Play American and Hong Kong style, practice versus bots, and start an online game with friends in seconds.</p>

          <form className="capture" id="signup" onSubmit={onSignupSubmit}>
            <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address" />
            <button className="btn-primary" type="submit">
              Get early access
            </button>
          </form>

          <div className="capture-meta">
            <div className="stack-faces">
              <span className="face">M</span>
              <span className="face f2">J</span>
              <span className="face f3">L</span>
              <span className="face f4">+</span>
            </div>
            <span>
              <strong style={{ color: 'var(--ivory)' }}>1.4k+</strong> players have signed up
            </span>
          </div>
        </div>

        <div>
          <div className="hero-stage default angle-stage">
            <div className="gold-ring"></div>
            <img className="hero-phone-img" src="/assets/iphone-mockup-portrait-hero.png" alt="Mahjong Multiplayer running on iPhone" />
          </div>

          <div className="hero-stage table" style={{ width: '400px' }}>
            <div className="gold-ring" style={{ width: '80%', aspectRatio: '1.1' }}></div>
            <div className="dragon" style={{ fontSize: '120px' }}>
              龍
            </div>
            <div className="tile" style={{ left: '6%', top: '46%', transform: 'rotate(90deg)' }}>
              <span className="corner">W</span>西
            </div>
            <div className="tile" style={{ right: '6%', top: '46%', transform: 'rotate(-90deg)' }}>
              <span className="corner">E</span>東
            </div>
            <div className="tile" style={{ left: '46%', top: '6%' }}>
              <span className="corner">N</span>北
            </div>
            <div className="tile" style={{ left: '46%', bottom: '6%', top: 'auto' }}>
              <span className="corner">S</span>南
            </div>
            <div className="tile red" style={{ left: '30%', top: '40%' }}>
              <span className="corner">C</span>中
            </div>
            <div className="tile" style={{ right: '30%', top: '40%' }}>
              <span className="corner">F</span>發
            </div>
          </div>

          <div className="hero-stage rain">
            <div className="rain-tile" style={{ left: '8%', ['--r' as string]: '-10deg', animationDelay: '0s' }}>
              發
            </div>
            <div className="rain-tile" style={{ left: '22%', ['--r' as string]: '6deg', animationDelay: '1.2s' }}>
              中
            </div>
            <div className="rain-tile" style={{ left: '36%', ['--r' as string]: '-4deg', animationDelay: '0.6s' }}>
              東
            </div>
            <div className="rain-tile" style={{ left: '50%', ['--r' as string]: '12deg', animationDelay: '2s' }}>
              南
            </div>
            <div className="rain-tile" style={{ left: '64%', ['--r' as string]: '-8deg', animationDelay: '0.3s' }}>
              西
            </div>
            <div className="rain-tile" style={{ left: '78%', ['--r' as string]: '4deg', animationDelay: '1.8s' }}>
              北
            </div>
            <div className="rain-tile" style={{ left: '14%', ['--r' as string]: '8deg', animationDelay: '3s' }}>
              白
            </div>
            <div className="rain-tile" style={{ left: '56%', ['--r' as string]: '-12deg', animationDelay: '3.6s' }}>
              九
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '24px 0',
          borderTop: '1px solid rgba(245,238,221,.06)',
          borderBottom: '1px solid rgba(245,238,221,.06)',
          background: 'rgba(5,19,15,.6)',
          marginTop: '56px'
        }}
      >
        <div
          className="wrap marquee-row"
          style={{
            display: 'flex',
            gap: '48px',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: 'var(--ivory-dim)'
          }}
        >
          <span>Hong Kong rules</span>
          <span style={{ color: 'var(--gold-500)' }}>·</span>
          <span>American mahjong</span>
          <span style={{ color: 'var(--gold-500)' }}>·</span>
          <span>Cross-platform · iOS &amp; Android</span>
        </div>
      </div>
    </header>
  );
}

function AppStorePreview() {
  return (
    <section className="store-preview">
      <div className="wrap">
        <div className="store-preview-card">
          <div className="store-icon-wrap" aria-hidden="true">
            <img src="/assets/floating-tile-logo-sm.jpg" alt="" />
          </div>
          <div className="store-copy">
            <p className="store-title">
              <strong>Mahjong Multiplayer</strong>
            </p>
            <p className="store-subtitle">Play Mahjong online with friends for free, practice versus bots</p>
          </div>
          <div className="store-badges">
            <div className="store-badge ios">
              <span className="store-badge-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path
                    d="M16.06 12.94c.03 3.2 2.8 4.26 2.83 4.27-.02.08-.44 1.5-1.46 2.97-.88 1.27-1.8 2.54-3.24 2.57-1.42.03-1.88-.84-3.5-.84-1.62 0-2.13.81-3.47.87-1.4.05-2.47-1.39-3.35-2.65-1.8-2.6-3.17-7.34-1.33-10.52.91-1.58 2.54-2.58 4.3-2.61 1.35-.03 2.62.91 3.5.91.87 0 2.5-1.12 4.22-.95.72.03 2.75.29 4.06 2.2-.1.07-2.43 1.41-2.41 4.18ZM13.64 5.4c.74-.89 1.24-2.12 1.1-3.35-1.07.04-2.36.71-3.13 1.6-.68.78-1.28 2.04-1.12 3.24 1.19.09 2.4-.61 3.15-1.49Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>Launching on iOS</span>
            </div>
            <div className="store-badge play">
              <span className="store-badge-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M3.5 2.5v19l16-9.5-16-9.5Z" fill="currentColor" />
                </svg>
              </span>
              <span>Launching on Google Play</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features({ onOpenSignup }: { onOpenSignup: () => void }) {
  return (
    <section id="features" className="felt">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Built for real mahjong</span>
          <h2 style={{ marginTop: '14px' }}>
            Everything a home table has — <em className="serif-it">minus the living room.</em>
          </h2>
          <p className="lede">Designed hand in hand with real players. From the rhythm of the draws to the sound of a claim, every detail is tuned for the feel of the game.</p>
          <div style={{ marginTop: '26px' }}>
            <button type="button" className="btn-primary" onClick={onOpenSignup}>
              Get early access →
            </button>
          </div>
        </div>

        <div className="features">
          <div className="card span-7">
            <span className="eyebrow">Friends Tables</span>
            <h3>A clubhouse for your crew.</h3>
            <p>Persistent rooms you keep around between sessions. Members drop in when they can, pick up between hands, and carry a running score night after night.</p>
            <div className="fv fv-tables">
              <div className="mini-table">
                <div>
                  <div className="tt">Maple Ln Neighbors</div>
                  <div className="tmeta">
                    <span style={{ color: 'var(--gold-300)' }}>Hong Kong · Private</span> · <span className="dot"></span>2 online · 8 members
                  </div>
                </div>
                <span className="persist">Persistent</span>
              </div>
              <div className="mini-table">
                <div>
                  <div className="tt">High School Friends</div>
                  <div className="tmeta">
                    <span style={{ color: 'var(--gold-300)' }}>American · Open</span> · 0 online · 6 members
                  </div>
                </div>
                <span className="persist" style={{ background: 'rgba(197,162,92,.12)', color: 'var(--gold-300)', borderColor: 'rgba(197,162,92,.3)' }}>
                  2 days ago
                </span>
              </div>
              <div className="mini-table">
                <div>
                  <div className="tt">Weeknight Regulars</div>
                  <div className="tmeta">
                    <span style={{ color: 'var(--gold-300)' }}>Hong Kong · Private</span> · <span className="dot"></span>3 online · 4 members
                  </div>
                </div>
                <span className="persist">Persistent</span>
              </div>
            </div>
          </div>

          <div className="card span-5">
            <span className="eyebrow">Variants</span>
            <h3>Play it the way you know it.</h3>
            <p>Launching with Hong Kong ruleset and American ruleset on the way. Customize rules and game speed to match how you love to play with friends in person.</p>
            <div className="fv fv-variants">
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span className="chip on">Hong Kong</span>
                  <span className="chip">American</span>
                </div>
                <div className="variant-tile-row" style={{ justifyContent: 'center' }}>
                  <span className="mini-tile">發</span>
                  <span className="mini-tile red">中</span>
                  <span className="mini-tile">東</span>
                  <span className="mini-tile red">西</span>
                  <span className="mini-tile">九</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card span-4">
            <span className="eyebrow">Private invites</span>
            <h3>Create your own table.</h3>
            <p>Share a code, skip the lobby. Your game, your rules, your people.</p>
            <div className="fv fv-invite">
              <div className="invite-code">JADE-428</div>
            </div>
          </div>

          <div className="card span-8">
            <span className="eyebrow">Friends</span>
            <h3>See who&apos;s around, and make new friends.</h3>
            <p>Invite your friends to play and easily see who&apos;s online at any time to notify them. Make new friends by jumping into public tables to play.</p>
            <div className="fv fv-friends">
              <div className="friend">
                <span className="avatar">M</span>Mary<span className="status"></span>
              </div>
              <div className="friend">
                <span className="avatar" style={{ background: 'linear-gradient(135deg,#A68340,#7A5F2A)' }}>
                  J
                </span>
                Jin<span className="status"></span>
              </div>
              <div className="friend">
                <span className="avatar" style={{ background: 'linear-gradient(135deg,#8A3131,#5A2020)' }}>
                  L
                </span>
                Lena
              </div>
              <div className="friend">
                <span className="avatar" style={{ background: 'linear-gradient(135deg,#3d7b63,#1F8A62)' }}>
                  E
                </span>
                Elena<span className="status"></span>
              </div>
              <div className="friend">
                <span className="avatar">W</span>Wei
              </div>
              <div className="friend">
                <span className="avatar" style={{ background: 'linear-gradient(135deg,#8A3131,#5A2020)' }}>
                  S
                </span>
                Sam<span className="status"></span>
              </div>
              <div className="friend">
                <span className="avatar" style={{ background: 'linear-gradient(135deg,#A68340,#7A5F2A)' }}>
                  N
                </span>
                Nora
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Showcase({ onOpenSignup }: { onOpenSignup: () => void }) {
  return (
    <section className="showcase">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: 'center', margin: '0 auto 56px' }}>
          <span className="eyebrow">Gameplay</span>
          <h2 style={{ marginTop: '14px' }}>
            Quiet, intentional, <em className="serif-it">unmistakably mahjong.</em>
          </h2>
          <div style={{ marginTop: '26px' }}>
            <button type="button" className="btn-primary" onClick={onOpenSignup}>
              Get early access →
            </button>
          </div>
        </div>

        <div className="phones-row">
          <div>
            <div className="phone">
              <div className="notch"></div>
              <div className="screen">
                <img src="/assets/mockup-screen-1.png" alt="Mahjong Multiplayer home screen" />
              </div>
            </div>
            <div className="phone-cap">Home · Your tables</div>
          </div>
          <div>
            <div className="phone center">
              <div className="notch"></div>
              <div className="screen">
                <img src="/assets/mockup-screen-3.png" alt="In-game mahjong table" />
              </div>
            </div>
            <div className="phone-cap">Game · Your turn</div>
          </div>
          <div>
            <div className="phone">
              <div className="notch"></div>
              <div className="screen">
                <img src="/assets/mockup-screen-4.png" alt="Friends tables list" />
              </div>
            </div>
            <div className="phone-cap">Tables · Friends</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ onOpenSignup }: { onOpenSignup: () => void }) {
  return (
    <section id="how" className="felt tight">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 style={{ marginTop: '14px' }}>Start playing in under a minute.</h2>
          <div style={{ marginTop: '26px' }}>
            <button type="button" className="btn-primary" onClick={onOpenSignup}>
              Get early access →
            </button>
          </div>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Create your table, or join one.</h3>
            <p>Make your table private and invite friends, or make it public to let other players join.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Invite your friends.</h3>
            <p>Share the invite code or a link. They join the table and the game starts in seconds.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Play and track your score.</h3>
            <p>Automatically tracks hands scores over time so your friends can see who the real champ is.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LearningModule({ onOpenSignup }: { onOpenSignup: () => void }) {
  const modules = [
    {
      title: 'Module 1 · Tile Literacy & Setup',
      objective: 'Learn the full Hong Kong tile set, seating flow, and how to build the wall and deal correctly.',
      lessons: ['Suited tiles, honors, and flowers basics', 'Seat winds, dealer rotation, and round progression', 'Building walls, breaking, and opening hand structure']
    },
    {
      title: 'Module 2 · Turn Flow & Legal Actions',
      objective: 'Practice a legal turn cycle and know exactly when Chow, Pung, Kong, and win calls are allowed.',
      lessons: ['Draw-discard rhythm and hand state tracking', 'Call priority: win over Kong over Pung over Chow', 'Concealed vs exposed meld behavior']
    },
    {
      title: 'Module 3 · Winning Hands & Scoring',
      objective: 'Build confidence in standard hand patterns and calculate fan quickly after each hand.',
      lessons: ['4 melds + 1 pair structure and common waits', 'Hong Kong fan table foundations and payout flow', 'Limit hands, penalties, and invalid hand checks']
    },
    {
      title: 'Module 4 · Applied Play Drills',
      objective: 'Use scenario-based drills to transition from knowing rules to making stronger table decisions.',
      lessons: ['Safe discard and risk-reading drills', 'Offense vs defense checkpoints by hand stage', 'Post-hand review and mistake taxonomy']
    }
  ];

  return (
    <section id="learning" className="learning-module">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Hong Kong curriculum</span>
          <h2 style={{ marginTop: '14px' }}>A structured learning module, from first shuffle to confident play.</h2>
          <p className="lede">
            This track turns Hong Kong Mahjong rules into practical lessons with objectives, drills, and checkpoints. It is built to support guided onboarding, solo practice, and coach-led sessions.
          </p>
          <div style={{ marginTop: '26px' }}>
            <button type="button" className="btn-primary" onClick={onOpenSignup}>
              Join learning beta →
            </button>
          </div>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <article key={module.title} className="module-card">
              <h3>{module.title}</h3>
              <p className="module-objective">{module.objective}</p>
              <ul>
                {module.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <section className="tight">
      <div className="wrap">
        <div className="quote-wrap">
          <blockquote>
            It&apos;s the closest thing to sitting around the table with my grandmother. The tiles <em className="serif-it">sound</em> right.
          </blockquote>
          <div>
            <p className="lede" style={{ margin: 0 }}>
              We&apos;re building Mahjong Multiplayer for people who grew up hearing the tiles shuffle — and for anyone who&apos;s ever been curious about the game but didn&apos;t have a fourth.
            </p>
            <div className="quote-attr">— Private beta user, March 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="felt tight">
      <div className="wrap" style={{ maxWidth: '900px' }}>
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2 style={{ marginTop: '14px' }}>Questions?</h2>
        </div>
        <div className="faq">
          <details open>
            <summary>
              When does the app launch? <span className="plus">+</span>
            </summary>
            <div className="answer">We&apos;re targeting a public launch very soon on iOS and Android. Everyone on the waitlist gets access first and a special thank you.</div>
          </details>
          <details>
            <summary>
              Which variants will you support? <span className="plus">+</span>
            </summary>
            <div className="answer">Hong Kong rules on launch, with American close behind. Taiwanese and Japanese Riichi are on the roadmap — we&apos;d rather ship each one done right than have five half-finished rulesets.</div>
          </details>
          <details>
            <summary>
              Will it be free? <span className="plus">+</span>
            </summary>
            <div className="answer">Mahjong Multiplayer will always offer a way to play online with friends for free. We&apos;re exploring an optional subscription for additional features but nothing that affects the core gameplay.</div>
          </details>
          <details>
            <summary>
              Can I play with people who don&apos;t have the app? <span className="plus">+</span>
            </summary>
            <div className="answer">Each player will need to have a profile to play online. We plan on launching the game to be available in the web browser which will make it possible to play regardless if you have the app downloaded or not.</div>
          </details>
          <details>
            <summary>
              Is there a desktop version? <span className="plus">+</span>
            </summary>
            <div className="answer">We plan to make it possible to play in your web browser, and have the game be cross-platform. This means you can be playing in the web browser while you&apos;re playing against a friend who&apos;s playing on the app.</div>
          </details>
        </div>
      </div>
    </section>
  );
}

function Contact({ onOpenContact, onOpenSignup }: { onOpenContact: () => void; onOpenSignup: () => void }) {
  const onSignupClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onOpenSignup();
  };

  return (
    <section id="contact" className="felt tight">
      <div className="wrap" style={{ maxWidth: '900px' }}>
        <div className="section-head" style={{ marginBottom: '36px' }}>
          <span className="eyebrow">Contact</span>
          <h2 style={{ marginTop: '14px' }}>Say hello.</h2>
          <p className="lede">Questions, feedback, partnership ideas, or just want to swap mahjong stories — we&apos;d love to hear from you.</p>
        </div>
        <div className="contact-grid">
          <button type="button" className="contact-card" onClick={onOpenContact} style={{ cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>
            <span className="contact-eye">Email</span>
            <div className="contact-val">Send us a message →</div>
            <div className="contact-meta">We reply within a day or two.</div>
          </button>
          <a className="contact-card" href="#signup" onClick={onSignupClick}>
            <span className="contact-eye">Early access</span>
            <div className="contact-val">Join the waitlist →</div>
            <div className="contact-meta">Be first when we launch.</div>
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onSignupSubmit }: { onSignupSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="tight">
      <div className="wrap">
        <div className="final">
          <div className="final-tiles">
            <div className="tile ft1">
              <span className="corner">1</span>發
            </div>
            <div className="tile ft2 red">
              <span className="corner">2</span>中
            </div>
            <div className="tile ft3">
              <span className="corner">3</span>東
            </div>
            <div className="tile ft4 red">
              <span className="corner">4</span>西
            </div>
          </div>
          <span className="eyebrow">Early access</span>
          <h2 style={{ marginTop: '14px' }}>Pull up a chair.</h2>
          <p className="lede">Join the waitlist and we&apos;ll send one — and only one — email when the app is ready for you.</p>
          <form className="capture" onSubmit={onSignupSubmit}>
            <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address" />
            <button className="btn-primary gold" type="submit">
              Reserve my seat
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="row">
          <div>
            <a className="brand" href="#" style={{ marginBottom: '14px' }}>
              <span className="mark">
                <img src="/assets/floating-tile-logo-sm.jpg" alt="Mahjong Multiplayer logo" />
              </span>
              <span className="name">Mahjong Multiplayer</span>
            </a>
            <p style={{ color: 'var(--ivory-dim)', maxWidth: '32ch', margin: '14px 0 0', fontSize: '14px' }}>Play Mahjong online with friends, for free.</p>
          </div>
          <div className="cols">
            <div>
              <h4>App</h4>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#how">How it works</a>
                </li>
                <li>
                  <a href="#learning">Learning</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Privacy</a>
                </li>
                <li>
                  <a href="#">Terms</a>
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

function ContactModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className={`modal ${isOpen ? 'on' : ''}`} id="contactModal" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-card">
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <span className="eyebrow">Contact us</span>
        <h2 id="contactModalTitle" style={{ marginTop: '10px', fontSize: '30px' }}>
          Say hello.
        </h2>
        <p className="lede" style={{ marginTop: '12px' }}>
          Drop us a note and we&apos;ll be in touch as soon as possible.
        </p>
        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            Name
            <input type="text" name="name" required placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" name="email" required placeholder="your@email.com" />
          </label>
          <label>
            Message
            <textarea name="message" required rows={4} placeholder="What's on your mind?"></textarea>
          </label>
          <button className="btn-primary gold" type="submit" style={{ width: '100%', marginTop: '6px' }}>
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}

function SignupModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className={`modal ${isOpen ? 'on' : ''}`} id="signupModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-card">
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <span className="eyebrow">Early access</span>
        <h2 id="modalTitle" style={{ marginTop: '10px', fontSize: '34px' }}>
          Pull up a chair.
        </h2>
        <p className="lede" style={{ marginTop: '14px' }}>
          Drop your email and we&apos;ll send one note when the app is ready for you.
        </p>
        <form className="capture" style={{ marginTop: '22px', maxWidth: 'none' }} onSubmit={onSubmit}>
          <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address" />
          <button className="btn-primary gold" type="submit">
            Reserve my seat
          </button>
        </form>
      </div>
    </div>
  );
}

function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div className={`toast ${show ? 'show' : ''}`} id="toast">
      <span className="check">✓</span>
      <span>{message}</span>
    </div>
  );
}

function TweaksPanel() {
  return (
    <div className="tweaks-panel" id="tweaks">
      <h5>
        Tweaks <span style={{ color: 'var(--ivory-dim)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>v1</span>
      </h5>

      <label>Hero visual</label>
      <div className="seg" data-key="hero">
        <button data-v="default" className="on">
          Scatter
        </button>
        <button data-v="table">Table</button>
        <button data-v="tile-rain">Rain</button>
      </div>

      <label>Primary accent</label>
      <div className="seg" data-key="accent">
        <button data-v="jade" className="on">
          Jade
        </button>
        <button data-v="gold">Gold</button>
        <button data-v="red">Red</button>
      </div>

      <label>Felt intensity</label>
      <div className="seg" data-key="felt">
        <button data-v="low">Subtle</button>
        <button data-v="med" className="on">
          Medium
        </button>
        <button data-v="high">Rich</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("You're on the list. Look out for a note from us.");
  const [toastVisible, setToastVisible] = useState(false);
  const [isSavingSignup, setIsSavingSignup] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    document.body.dataset.hero = 'default';
    document.body.dataset.accent = 'gold';
    document.body.style.setProperty('--felt-opacity', '0.55');

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setSignupModalOpen(false);
      setContactModalOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3400);
  };

  const insertRow = async (table: string, payload: Record<string, string>) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { error: new Error('Supabase environment variables are missing.') };
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { error: new Error(`Supabase insert failed with status ${response.status}`) };
    }

    return { error: null };
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingSignup) return;

    const form = event.currentTarget;
    const emailField = form.elements.namedItem('email') as HTMLInputElement | null;
    const email = emailField?.value.trim();

    if (!email) {
      showToast('Please enter a valid email address.');
      return;
    }

    if (!emailField?.checkValidity()) {
      emailField?.reportValidity();
      showToast('Please enter a valid email address.');
      return;
    }

    setIsSavingSignup(true);

    const { error } = await insertRow('email_early_access', { email });

    setIsSavingSignup(false);

    if (error) {
      showToast('Unable to save your email right now. Please try again.');
      return;
    }

    form.reset();
    setSignupModalOpen(false);
    showToast("You're on the list. Look out for a note from us.");
  };

  const handleContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingContact) return;

    const form = event.currentTarget;
    const nameField = form.elements.namedItem('name') as HTMLInputElement | null;
    const emailField = form.elements.namedItem('email') as HTMLInputElement | null;
    const messageField = form.elements.namedItem('message') as HTMLTextAreaElement | null;

    const name = nameField?.value.trim();
    const email = emailField?.value.trim();
    const message = messageField?.value.trim();

    if (!name || !email || !message) {
      showToast('Please complete all contact form fields.');
      return;
    }

    if (!emailField?.checkValidity()) {
      emailField?.reportValidity();
      showToast('Please enter a valid email address for contact.');
      return;
    }

    setIsSavingContact(true);

    const { error } = await insertRow('contact_submissions', {
      name,
      email,
      message
    });

    setIsSavingContact(false);

    if (error) {
      showToast('Unable to send your message right now. Please try again.');
      return;
    }

    form.reset();
    setContactModalOpen(false);
    showToast("Thanks! We'll be in touch as soon as possible.");
  };

  return (
    <>
      <TopNav onOpenSignup={() => setSignupModalOpen(true)} />
      <Hero onSignupSubmit={handleSignup} />
      <AppStorePreview />
      <Features onOpenSignup={() => setSignupModalOpen(true)} />
      <Showcase onOpenSignup={() => setSignupModalOpen(true)} />
      <HowItWorks onOpenSignup={() => setSignupModalOpen(true)} />
      <LearningModule onOpenSignup={() => setSignupModalOpen(true)} />
      <QuoteSection />
      <FAQ />
      <Contact onOpenContact={() => setContactModalOpen(true)} onOpenSignup={() => setSignupModalOpen(true)} />
      <FinalCTA onSignupSubmit={handleSignup} />
      <Footer />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} onSubmit={handleContact} />
      <SignupModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} onSubmit={handleSignup} />
      <Toast message={toastMessage} show={toastVisible} />
      <TweaksPanel />
    </>
  );
}
