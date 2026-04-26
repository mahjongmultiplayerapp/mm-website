import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonCompletionPanel } from '../../LearnProgress';
import { HandFlowLesson, MahjongStylesLesson, ObjectiveLesson, SectionOneCheckpoint, SectionOneRecap, ShapeOfGameLesson } from '../../SectionOneLessons';
import {
  HonorTilesLesson,
  OpenVsConcealedLesson,
  SectionTwoCheckpoint,
  SectionTwoRecap,
  ShapeVsScoringLesson,
  StandardWinningShapeLesson,
  ThirteenOrphansLesson,
  ThreeSuitsLesson,
  TileGroupingsLesson,
  TileSetLesson,
} from '../../SectionTwoLessons';
import {
  CommonSetupMistakesLesson,
  DealerEastLesson,
  DealingTilesLesson,
  DiceOpeningLesson,
  LiveDeadWallLesson,
  SeatingSeatWindsLesson,
  SectionThreeCheckpoint,
  SectionThreeRecap,
  TableAreasLesson,
  WallLesson,
} from '../../SectionThreeLessons';
import {
  AnatomyTurnLesson,
  ArrangingHandLesson,
  CallWindowLesson,
  DealerStartsLesson,
  DiscardingLesson,
  DrawingTileLesson,
  SectionFourCheckpoint,
  SectionFourRecap,
  TurnOrderLesson,
  WhatEndsHandLesson,
} from '../../SectionFourLessons';
import {
  AddedKongLesson,
  BeginnerCallDecisionsLesson,
  BigExposedKongLesson,
  CallsChangeFlowLesson,
  CallPriorityLesson,
  ChowLesson,
  ConcealedKongLesson,
  OpenMeldPlacementLesson,
  PungLesson,
  RobbingKongLesson,
  SectionFiveCheckpoint,
  SectionFiveRecap,
  SelfDrawWinLesson,
  SupplementKongLesson,
  WhatIsCallLesson,
  WinOnDiscardLesson,
} from '../../SectionFiveLessons';
import {
  BasicScoringPrinciplesLesson,
  BeginnerFanLesson,
  IntermediateFanLesson,
  LimitHandsLesson,
  PackagePaymentLesson,
  PaymentBasicsLesson,
  PointsConversionTableLesson,
  PresentingWinningHandLesson,
  SectionSixCheckpoint,
  SectionSixRecap,
  WhatIsFanLesson,
  WhatMakesHandWinnableLesson,
} from '../../SectionSixLessons';
import {
  AfterHandEndsLesson,
  DeadHandsErrorsLesson,
  DrawnHandsLesson,
  EndRoundLesson,
  PassingDealLesson,
  ReadyForRealTableLesson,
  SectionSevenCheckpoint,
  SectionSevenRecap,
  TableEtiquetteLesson,
  WindCyclesRoundsLesson,
} from '../../SectionSevenLessons';
import { WelcomeToGameLesson } from '../../WelcomeToGameLesson';
import { LearnShell, TileRail } from '../../components';
import { getLesson, getNextLessonPath, getPreviousLessonPath, learnSections } from '../../learn-data';

type LessonPageProps = {
  params: Promise<{ sectionSlug: string; lessonSlug: string }>;
};

export function generateStaticParams() {
  return learnSections.flatMap((section) => [
    ...section.lessons.map((lesson) => ({ sectionSlug: section.slug, lessonSlug: lesson.slug })),
    { sectionSlug: section.slug, lessonSlug: 'recap' },
    { sectionSlug: section.slug, lessonSlug: 'checkpoint' },
  ]);
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { sectionSlug, lessonSlug } = await params;
  const { section, lesson } = getLesson(sectionSlug, lessonSlug);
  if (!section) return {};

  if (lessonSlug === 'recap') {
    return {
      title: `${section.title} Recap | Learn Hong Kong Mahjong`,
      description: `Review ${section.title}.`,
    };
  }

  if (lessonSlug === 'checkpoint') {
    return {
      title: `${section.title} Checkpoint | Learn Hong Kong Mahjong`,
      description: `Checkpoint quiz for ${section.title}.`,
    };
  }

  return {
    title: `${lesson?.title ?? section.title} | Learn Hong Kong Mahjong`,
    description: lesson?.objective ?? section.purpose,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { sectionSlug, lessonSlug } = await params;
  const { section, lesson } = getLesson(sectionSlug, lessonSlug);
  if (!section) notFound();
  const isSectionOne = section.slug === 'what-is-hong-kong-mahjong';
  const isSectionTwo = section.slug === 'tiles-melds-winning-hands';
  const isSectionThree = section.slug === 'setup-and-dealing';
  const isSectionFour = section.slug === 'turn-flow-and-discarding';
  const isSectionFive = section.slug === 'calls-chow-pung-kong-win';
  const isSectionSix = section.slug === 'scoring-and-fan';
  const isSectionSeven = section.slug === 'rounds-draws-table-rules';

  if (lessonSlug === 'recap') {
    return (
      <LearnShell>
        <section className="learn-lesson-page felt">
          <div className="wrap learn-readable">
            <nav className="learn-breadcrumb-trail" aria-label="Breadcrumb">
              <Link href="/learn">← Curriculum</Link>
              <Link href={`/learn/${section.slug}`}>Section {section.number}</Link>
              <span>Recap</span>
            </nav>
            <h1 style={{ marginTop: '18px' }}>{section.title}</h1>
            <p className="lede">
              {isSectionOne
                ? 'Review the big picture before the checkpoint.'
                : isSectionTwo
                  ? 'Review tiles, groups, and winning shapes before the checkpoint.'
                  : isSectionThree
                    ? 'Review seating, wall setup, dealing, and table areas before the checkpoint.'
                    : isSectionFour
                      ? 'Review draw, arrange, discard, call windows, interruptions, and hand endings.'
                      : isSectionFive
                        ? 'Review call legality, kongs, wins, priority, and call turn flow.'
                        : isSectionSix
                          ? 'Review fan, minimums, caps, payment, package payment, and winning-hand presentation.'
                          : isSectionSeven
                            ? 'Review hand endings, draws, dealer movement, wind cycles, dead hands, and etiquette.'
                            : 'This recap page is scaffolded for the section summary, key concepts, and checkpoint preparation.'}
            </p>
            {isSectionOne ? (
              <SectionOneRecap />
            ) : isSectionTwo ? (
              <SectionTwoRecap />
            ) : isSectionThree ? (
              <SectionThreeRecap />
            ) : isSectionFour ? (
              <SectionFourRecap />
            ) : isSectionFive ? (
              <SectionFiveRecap />
            ) : isSectionSix ? (
              <SectionSixRecap />
            ) : isSectionSeven ? (
              <SectionSevenRecap />
            ) : (
              <div className="learn-content-grid">
                {section.goals.map((goal) => (
                  <div className="learn-content-card" key={goal}>
                    <span className="eyebrow">Key idea</span>
                    <h3>{goal}</h3>
                    <p>Lesson-specific reinforcement will be added here as the curriculum content is built out.</p>
                  </div>
                ))}
              </div>
            )}
            <div className="learn-prev-next">
              <Link className="learn-secondary-link" href={`/learn/${section.slug}`}>
                Section overview
              </Link>
              <Link className="btn-primary gold" href={`/learn/${section.slug}/checkpoint`}>
                Go to checkpoint
              </Link>
            </div>
          </div>
        </section>
      </LearnShell>
    );
  }

  if (lessonSlug === 'checkpoint') {
    return (
      <LearnShell>
        <section className="learn-lesson-page felt">
          <div className="wrap learn-readable">
            <nav className="learn-breadcrumb-trail" aria-label="Breadcrumb">
              <Link href="/learn">← Curriculum</Link>
              <Link href={`/learn/${section.slug}`}>Section {section.number}</Link>
              <span>Checkpoint</span>
            </nav>
            <h1 style={{ marginTop: '18px' }}>Checkpoint: {section.title}</h1>
            <p className="lede">
              {isSectionOne
                ? 'Answer five questions to confirm you understand the big picture.'
                : isSectionTwo
                  ? 'Answer eight questions to confirm you can read tiles and shapes.'
                  : isSectionThree
                    ? 'Answer eight questions to confirm you can start a hand correctly.'
                    : isSectionFour
                      ? 'Answer eight questions to confirm you can follow a hand turn by turn.'
                      : isSectionFive
                        ? 'Answer ten questions to confirm you understand legal calls.'
                        : isSectionSix
                          ? 'Answer ten questions to confirm you understand fan and payment basics.'
                          : isSectionSeven
                            ? 'Answer eight questions to confirm you are ready for table flow and etiquette.'
                            : 'This quiz route is ready for the 80% pass checkpoint flow from the spec.'}
            </p>
            {isSectionOne ? (
              <SectionOneCheckpoint />
            ) : isSectionTwo ? (
              <SectionTwoCheckpoint />
            ) : isSectionThree ? (
              <SectionThreeCheckpoint />
            ) : isSectionFour ? (
              <SectionFourCheckpoint />
            ) : isSectionFive ? (
              <SectionFiveCheckpoint />
            ) : isSectionSix ? (
              <SectionSixCheckpoint />
            ) : isSectionSeven ? (
              <SectionSevenCheckpoint />
            ) : (
              <div className="learn-complete-card">
                <div>
                  <span className="eyebrow">Coming next</span>
                  <h3>Quiz shell</h3>
                  <p>Multiple choice, ordering, and table-identification checks will live here.</p>
                </div>
                <Link className="btn-primary gold" href="/learn">
                  Back to curriculum
                </Link>
              </div>
            )}
          </div>
        </section>
      </LearnShell>
    );
  }

  if (!lesson) notFound();

  const lessonId = `${section.slug}/${lesson.slug}`;
  const nextHref = getNextLessonPath(section.slug, lesson.slug);
  const previousHref = getPreviousLessonPath(section.slug, lesson.slug);
  const lessonProgress = ((section.lessons.findIndex((item) => item.slug === lesson.slug) + 1) / section.lessons.length) * 100;

  return (
    <LearnShell>
      <section className="learn-lesson-page felt">
        <div className="learn-top-progress" aria-hidden="true">
          <span style={{ width: `${lessonProgress}%` }} />
        </div>
        <div className="wrap learn-readable">
          <nav className="learn-breadcrumb-trail" aria-label="Breadcrumb">
            <Link href="/learn">← Curriculum</Link>
            <Link href={`/learn/${section.slug}`}>Section {section.number}</Link>
            <span>Lesson {lesson.number}</span>
          </nav>
          <h1 style={{ marginTop: '18px' }}>{lesson.title}</h1>
          <p className="lede">{lesson.objective}</p>

          {lesson.slug === 'welcome-to-the-game' && isSectionOne ? (
            <WelcomeToGameLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'hk-mahjong-vs-other-styles' && isSectionOne ? (
            <MahjongStylesLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'objective-of-a-hand' && isSectionOne ? (
            <ObjectiveLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'shape-of-the-game' && isSectionOne ? (
            <ShapeOfGameLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'how-a-hand-flows' && isSectionOne ? (
            <HandFlowLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'the-tile-set' && isSectionTwo ? (
            <TileSetLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'the-three-suits' && isSectionTwo ? (
            <ThreeSuitsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'honor-tiles' && isSectionTwo ? (
            <HonorTilesLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'tile-groupings' && isSectionTwo ? (
            <TileGroupingsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'open-vs-concealed' && isSectionTwo ? (
            <OpenVsConcealedLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'standard-winning-shape' && isSectionTwo ? (
            <StandardWinningShapeLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'thirteen-orphans' && isSectionTwo ? (
            <ThirteenOrphansLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'valid-shape-vs-scoring-pattern' && isSectionTwo ? (
            <ShapeVsScoringLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'seating-and-seat-winds' && isSectionThree ? (
            <SeatingSeatWindsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'dealer-and-east' && isSectionThree ? (
            <DealerEastLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'the-wall' && isSectionThree ? (
            <WallLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'rolling-dice-opening-wall' && isSectionThree ? (
            <DiceOpeningLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'live-wall-vs-dead-wall' && isSectionThree ? (
            <LiveDeadWallLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'dealing-the-tiles' && isSectionThree ? (
            <DealingTilesLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'table-areas' && isSectionThree ? (
            <TableAreasLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'common-setup-mistakes' && isSectionThree ? (
            <CommonSetupMistakesLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'dealer-starts' && isSectionFour ? (
            <DealerStartsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'anatomy-of-a-turn' && isSectionFour ? (
            <AnatomyTurnLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'drawing-a-tile' && isSectionFour ? (
            <DrawingTileLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'arranging-your-hand' && isSectionFour ? (
            <ArrangingHandLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'discarding' && isSectionFour ? (
            <DiscardingLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'the-call-window' && isSectionFour ? (
            <CallWindowLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'turn-order-around-the-table' && isSectionFour ? (
            <TurnOrderLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'what-ends-a-hand' && isSectionFour ? (
            <WhatEndsHandLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'what-is-a-call' && isSectionFive ? (
            <WhatIsCallLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'chow' && isSectionFive ? (
            <ChowLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'pung' && isSectionFive ? (
            <PungLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'concealed-kong' && isSectionFive ? (
            <ConcealedKongLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'added-kong' && isSectionFive ? (
            <AddedKongLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'big-exposed-kong' && isSectionFive ? (
            <BigExposedKongLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'supplement-tile-after-kong' && isSectionFive ? (
            <SupplementKongLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'self-draw-win' && isSectionFive ? (
            <SelfDrawWinLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'win-on-discard' && isSectionFive ? (
            <WinOnDiscardLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'robbing-a-kong' && isSectionFive ? (
            <RobbingKongLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'call-priority' && isSectionFive ? (
            <CallPriorityLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'how-calls-change-turn-flow' && isSectionFive ? (
            <CallsChangeFlowLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'open-meld-placement' && isSectionFive ? (
            <OpenMeldPlacementLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'beginner-call-decisions' && isSectionFive ? (
            <BeginnerCallDecisionsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'what-makes-a-hand-winnable' && isSectionSix ? (
            <WhatMakesHandWinnableLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'what-is-fan' && isSectionSix ? (
            <WhatIsFanLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'basic-scoring-principles' && isSectionSix ? (
            <BasicScoringPrinciplesLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'payment-basics' && isSectionSix ? (
            <PaymentBasicsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'package-payment' && isSectionSix ? (
            <PackagePaymentLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'beginner-fan' && isSectionSix ? (
            <BeginnerFanLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'intermediate-fan' && isSectionSix ? (
            <IntermediateFanLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'limit-hands' && isSectionSix ? (
            <LimitHandsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'points-conversion-table' && isSectionSix ? (
            <PointsConversionTableLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'presenting-a-winning-hand' && isSectionSix ? (
            <PresentingWinningHandLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'what-happens-after-a-hand-ends' && isSectionSeven ? (
            <AfterHandEndsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'drawn-hands' && isSectionSeven ? (
            <DrawnHandsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'passing-the-deal' && isSectionSeven ? (
            <PassingDealLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'wind-cycles-and-rounds' && isSectionSeven ? (
            <WindCyclesRoundsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'end-of-a-round' && isSectionSeven ? (
            <EndRoundLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'dead-hands-and-common-errors' && isSectionSeven ? (
            <DeadHandsErrorsLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'table-etiquette' && isSectionSeven ? (
            <TableEtiquetteLesson lessonId={lessonId} nextHref={nextHref} />
          ) : lesson.slug === 'ready-for-a-real-table' && isSectionSeven ? (
            <ReadyForRealTableLesson lessonId={lessonId} nextHref={nextHref} />
          ) : (
            <div className="learn-lesson-template">
              <div className="learn-content-card">
                <span className="eyebrow">Concept</span>
                <h3>{lesson.title}</h3>
                <p>This area will introduce the lesson idea in beginner-friendly language.</p>
              </div>
              <div className="learn-content-card">
                <span className="eyebrow">Visual example</span>
                <TileRail />
                <p>Tiles, table diagrams, or flow visuals will be inserted here for this lesson.</p>
              </div>
              <div className="learn-content-card">
                <span className="eyebrow">Rule in plain English</span>
                <h3>Simple table rule</h3>
                <p>The formal rulebook idea will be translated into practical table language.</p>
              </div>
              <LessonCompletionPanel lessonId={lessonId} nextHref={nextHref} />
              <div className="learn-content-card learn-takeaway-card">
                <span className="eyebrow">Takeaway</span>
                <h3>What the learner should remember</h3>
                <p>A concise takeaway from the PRD will go here when we build this lesson.</p>
              </div>
            </div>
          )}

          <div className="learn-prev-next">
            <Link className="learn-secondary-link" href={previousHref}>
              ← Previous
            </Link>
            <Link className="btn-primary gold" href={nextHref}>
              Next
            </Link>
          </div>
        </div>
      </section>
    </LearnShell>
  );
}
