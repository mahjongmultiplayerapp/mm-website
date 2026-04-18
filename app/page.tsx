import Image from 'next/image';
import styles from './page.module.css';

const mockupCards = [
  {
    src: '/assets/mockup-screen-1.png',
    alt: 'Gameplay mockup screen',
    title: 'Authentic table feel',
    text: 'Play a polished digital mahjong experience that keeps the rhythm and clarity of real-table play.',
  },
  {
    src: '/assets/mockup-screen-3.png',
    alt: 'Social lobby mockup screen',
    title: 'Play with friends',
    text: 'Create private rooms, invite friends, and jump into rounds together from anywhere.',
  },
  {
    src: '/assets/mockup-screen-4.png',
    alt: 'Progress mockup screen',
    title: 'Track your progress',
    text: 'See your win streaks, sharpen your strategy, and follow your growth over time.',
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.brand}>
          <Image
            src="/assets/floating-tile-logo.jpg"
            alt="Mahjong Multiplayer logo"
            width={44}
            height={44}
            className={styles.logo}
            priority
          />
          <span>Mahjong Multiplayer</span>
        </div>
        <a href="#waitlist" className={styles.navButton}>
          Join Waitlist
        </a>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>COMING SOON</p>
          <h1 className={styles.title}>Play mahjong with friends, anywhere.</h1>
          <p className={styles.subtitle}>
            A modern multiplayer mahjong experience inspired by classic table play — thoughtfully designed for
            mobile and desktop.
          </p>
          <a href="#waitlist" className={styles.cta}>
            Get Early Access
          </a>
        </div>

        <div className={styles.heroVisual}>
          <Image
            src="/assets/iphone-mockup-portrait-hero.png"
            alt="Mahjong app hero mockup"
            width={640}
            height={640}
            className={styles.heroImage}
            priority
          />
        </div>
      </section>

      <section className={styles.gallery}>
        {mockupCards.map((card) => (
          <article key={card.title} className={styles.card}>
            <Image src={card.src} alt={card.alt} width={420} height={300} className={styles.cardImage} />
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.split}>
        <div>
          <h2>Built for clear play and quick decisions</h2>
          <p>
            Typography, spacing, and tile presentation are tuned to keep each round readable and fast, without
            losing the warmth of a physical table.
          </p>
        </div>
        <Image
          src="/assets/iphone-mockup-angle.png"
          alt="Angled iPhone mockup"
          width={700}
          height={460}
          className={styles.splitImage}
        />
      </section>

      <section id="waitlist" className={styles.waitlist}>
        <h2>Be first to play</h2>
        <p>Join the early access list to get launch updates, beta invites, and exclusive announcements.</p>
        <form className={styles.form}>
          <input type="email" placeholder="you@example.com" aria-label="Email address" />
          <button type="submit">Notify Me</button>
        </form>
      </section>
    </main>
  );
}
