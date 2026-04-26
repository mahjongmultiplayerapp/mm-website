import type { Metadata } from 'next';
import Link from 'next/link';
import { FinalReadinessTest } from '../FinalReadinessTest';
import { LearnShell } from '../components';

export const metadata: Metadata = {
  title: 'Final Readiness Test | Learn Hong Kong Mahjong',
  description: 'A 20-question readiness test for Hong Kong Mahjong fundamentals.',
};

export default function FinalReadinessTestPage() {
  return (
    <LearnShell>
      <section className="learn-lesson-page felt">
        <div className="wrap learn-readable">
          <Link className="learn-breadcrumb" href="/learn">
            ← Curriculum
          </Link>
          <span className="eyebrow">Final readiness test</span>
          <h1 style={{ marginTop: '18px' }}>Are You Ready to Play Hong Kong Mahjong?</h1>
          <p className="lede">Answer 20 practical questions across the whole curriculum. Score 85% or better to pass.</p>
          <FinalReadinessTest />
        </div>
      </section>
    </LearnShell>
  );
}
