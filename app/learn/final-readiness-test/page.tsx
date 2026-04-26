import type { Metadata } from 'next';
import Link from 'next/link';
import { LearnShell, TileRail } from '../components';

export const metadata: Metadata = {
  title: 'Final Readiness Test | Learn Hong Kong Mahjong',
  description: 'A scaffold for the final Hong Kong Mahjong readiness test.',
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
          <h1 style={{ marginTop: '18px' }}>Are you ready for a real table?</h1>
          <p className="lede">This final test route is scaffolded for mixed questions across tiles, hand shape, calls, scoring, and table rules.</p>
          <div className="learn-content-grid">
            <div className="learn-content-card">
              <span className="eyebrow">Format</span>
              <h3>Mixed practical checks</h3>
              <p>The final version will combine multiple choice, tile grouping, call decisions, payments, and mistake spotting.</p>
            </div>
            <div className="learn-content-card">
              <span className="eyebrow">Pass state</span>
              <h3>Confident table play</h3>
              <p>Passing will confirm the learner can sit down and follow a Hong Kong Mahjong hand with confidence.</p>
            </div>
          </div>
          <div className="learn-complete-card">
            <div>
              <TileRail />
              <p>Question content and scoring logic will be added after the section lessons are built.</p>
            </div>
            <Link className="btn-primary gold" href="/learn">
              Back to curriculum
            </Link>
          </div>
        </div>
      </section>
    </LearnShell>
  );
}
