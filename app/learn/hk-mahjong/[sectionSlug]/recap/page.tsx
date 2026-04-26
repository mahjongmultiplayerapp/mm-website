'use client';

import Link from 'next/link';
import { getSectionBySlug } from '@/lib/learn-curriculum';

export default function RecapPage({ params }: { params: { sectionSlug: string } }) {
  const section = getSectionBySlug(params.sectionSlug);
  if (!section) {
    return (
      <main className="learn-page">
        <section className="learn-card">
          <h1>Section not found</h1>
          <Link href="/learn/hk-mahjong" className="learn-btn">
            Back to curriculum
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="learn-page">
      <section className="learn-card">
        <p className="learn-eyebrow">Section recap</p>
        <h1>{section.title}</h1>
        <h3>You learned…</h3>
        <ul>
          {section.recap.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="learn-grid-2">
          {section.learningGoals.slice(0, 4).map((goal) => (
            <article key={goal} className="learn-mini-card">
              <h4>Rule card</h4>
              <p className="learn-muted">{goal}</p>
            </article>
          ))}
        </div>
        <Link href={`/learn/hk-mahjong/${section.slug}/checkpoint`} className="learn-btn">
          Take checkpoint quiz
        </Link>
      </section>
    </main>
  );
}
