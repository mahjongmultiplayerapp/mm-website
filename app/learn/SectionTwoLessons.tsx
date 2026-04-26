'use client';

import { useEffect, useMemo, useState } from 'react';

type LessonRuntimeProps = {
  lessonId: string;
  nextHref: string;
};

type Tile = {
  label: string;
  suit?: 'dots' | 'bamboo' | 'characters' | 'wind' | 'dragon';
  red?: boolean;
};

type ChoiceQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const storageKey = 'mahjong-multiplayer-learn-progress';

const suitTiles: Record<'dots' | 'bamboo' | 'characters', Tile[]> = {
  dots: ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((label) => ({ label, suit: 'dots' })),
  bamboo: ['一', '二', '三', '四', '五', '六', '七', '八', '九'].map((label) => ({ label, suit: 'bamboo' })),
  characters: ['1萬', '2萬', '3萬', '4萬', '5萬', '6萬', '7萬', '8萬', '9萬'].map((label) => ({ label, suit: 'characters' })),
};

const windTiles: Tile[] = ['東', '南', '西', '北'].map((label) => ({ label, suit: 'wind' }));
const dragonTiles: Tile[] = [
  { label: '中', suit: 'dragon', red: true },
  { label: '發', suit: 'dragon' },
  { label: '白', suit: 'dragon' },
];

const groupingScenarios = [
  { label: '3 Bamboo + 4 Bamboo + 5 Bamboo', tiles: ['三', '四', '五'], answer: 'Sequence', explanation: 'Consecutive numbers in the same suit make a sequence.' },
  { label: 'East + East', tiles: ['東', '東'], answer: 'Pair', explanation: 'Two identical tiles make a pair.' },
  { label: 'Red + Red + Red', tiles: ['中', '中', '中'], answer: 'Triplet', explanation: 'Three identical tiles make a triplet.' },
  { label: '7 Dot + 7 Dot + 7 Dot + 7 Dot', tiles: ['7', '7', '7', '7'], answer: 'Kong', explanation: 'Four identical tiles can be declared as a kong.' },
  { label: '2 Dot + 3 Bamboo + 4 Character', tiles: ['2', '三', '4萬'], answer: 'Invalid', explanation: 'A sequence needs one suit, not mixed suits.' },
];

const handShapeScenarios = [
  { title: 'Four sequences plus a pair', valid: true, groups: [['一', '二', '三'], ['四', '五', '六'], ['2', '3', '4'], ['6萬', '7萬', '8萬'], ['東', '東']] },
  { title: 'Three sequences, a triplet, and a pair', valid: true, groups: [['一', '二', '三'], ['3', '4', '5'], ['七', '八', '九'], ['中', '中', '中'], ['白', '白']] },
  { title: 'No pair', valid: false, groups: [['一', '二', '三'], ['四', '五', '六'], ['2', '3', '4'], ['6萬', '7萬', '8萬'], ['東', '南']] },
  { title: 'Broken group', valid: false, groups: [['一', '二', '三'], ['4', '5', '6'], ['中', '中', '中'], ['東', '南', '西'], ['白', '白']] },
];

const sectionTwoRecapItems = [
  { title: 'Tiles split into suits and honors.', body: 'Suited tiles have suit and number. Honor tiles are winds and dragons.' },
  { title: 'Groups are the building blocks.', body: 'Pairs, sequences, triplets, and kongs are the shapes you look for first.' },
  { title: 'Called tiles become public.', body: 'Open melds sit on the table where everyone can see them.' },
  { title: 'Shape comes before scoring.', body: 'A hand must be legally shaped before fan matters.' },
];

const checkpointQuestions: ChoiceQuestion[] = [
  { prompt: 'Which tile is a suited tile?', options: ['East', 'Red Dragon', '5 Bamboo', 'White Dragon'], answer: 2, explanation: '5 Bamboo has both a suit and a number.' },
  { prompt: 'Which tile is a wind?', options: ['East', 'Red', 'Green', '5 Dot'], answer: 0, explanation: 'East is one of the four wind tiles.' },
  { prompt: 'Which tile is a dragon?', options: ['South', 'North', 'White', '9 Character'], answer: 2, explanation: 'White is one of the dragon tiles.' },
  { prompt: 'What is 3 Bamboo + 4 Bamboo + 5 Bamboo?', options: ['Pair', 'Sequence', 'Triplet', 'Invalid'], answer: 1, explanation: 'They are consecutive numbers in the same suit.' },
  { prompt: 'What is Red + Red + Red?', options: ['Pair', 'Sequence', 'Triplet', 'Invalid'], answer: 2, explanation: 'Three identical tiles make a triplet.' },
  { prompt: 'What is four identical declared tiles?', options: ['Pair', 'Sequence', 'Triplet', 'Kong'], answer: 3, explanation: 'A declared four-of-a-kind is a kong.' },
  { prompt: 'Which hand shape is usually valid?', options: ['Four melds + one pair', 'Three pairs + one tile', 'Any 14 honors', 'Five unrelated groups'], answer: 0, explanation: 'Most winning hands use four melds and one pair.' },
  { prompt: 'Why is a scoring pattern alone not enough?', options: ['Fan is ignored in Hong Kong Mahjong', 'The hand must first have a legal shape', 'Only honor tiles can win', 'You always need Thirteen Orphans'], answer: 1, explanation: 'Shape comes first. Scoring comes second.' },
];

function readProgress() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return { completedLessons: [] as string[], completedSections: [] as string[], lastVisitedPath: undefined as string | undefined };
    const parsed = JSON.parse(stored) as { completedLessons?: string[]; completedSections?: string[]; lastVisitedPath?: string };
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedSections: Array.isArray(parsed.completedSections) ? parsed.completedSections : [],
      lastVisitedPath: typeof parsed.lastVisitedPath === 'string' ? parsed.lastVisitedPath : undefined,
    };
  } catch {
    return { completedLessons: [] as string[], completedSections: [] as string[], lastVisitedPath: undefined as string | undefined };
  }
}

function saveProgress(progress: ReturnType<typeof readProgress>) {
  window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

function completeLesson(lessonId: string, nextHref: string) {
  const progress = readProgress();
  saveProgress({
    ...progress,
    completedLessons: progress.completedLessons.includes(lessonId) ? progress.completedLessons : [...progress.completedLessons, lessonId],
    lastVisitedPath: nextHref,
  });
}

function completeSection(sectionId: string) {
  const progress = readProgress();
  saveProgress({
    ...progress,
    completedSections: progress.completedSections.includes(sectionId) ? progress.completedSections : [...progress.completedSections, sectionId],
  });
}

function useCompletion(lessonId: string) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(readProgress().completedLessons.includes(lessonId));
  }, [lessonId]);

  return { isComplete, setIsComplete };
}

function CompleteButton({ lessonId, nextHref, ready = true }: LessonRuntimeProps & { ready?: boolean }) {
  const { isComplete, setIsComplete } = useCompletion(lessonId);

  const onComplete = () => {
    if (!ready) return;
    completeLesson(lessonId, nextHref);
    setIsComplete(true);
  };

  return (
    <div className="section-one-complete">
      <button type="button" className={`btn-primary ${ready || isComplete ? 'gold' : ''}`} disabled={!ready} onClick={onComplete}>
        {isComplete ? 'Completed' : 'Mark complete'}
      </button>
      {isComplete ? (
        <a className="learn-secondary-link" href={nextHref}>
          Continue
        </a>
      ) : null}
    </div>
  );
}

function TileFace({ tile }: { tile: Tile | string }) {
  const label = typeof tile === 'string' ? tile : tile.label;
  const red = typeof tile === 'string' ? tile === '中' : tile.red;
  return <span className={`mini-tile ${red ? 'red' : ''}`}>{label}</span>;
}

function TileRail({ tiles }: { tiles: (Tile | string)[] }) {
  return (
    <div className="learn-tile-rail">
      {tiles.map((tile, index) => (
        <TileFace tile={tile} key={`${typeof tile === 'string' ? tile : tile.label}-${index}`} />
      ))}
    </div>
  );
}

function TileGroup({ label, tiles }: { label: string; tiles: string[] }) {
  return (
    <div className="section-one-tile-group">
      <TileRail tiles={tiles} />
      <small>{label}</small>
    </div>
  );
}

function ChoiceCheck({ question, onCorrect }: { question: ChoiceQuestion; onCorrect: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === question.answer;

  useEffect(() => {
    if (correct) onCorrect();
  }, [correct, onCorrect]);

  return (
    <div>
      <h3>{question.prompt}</h3>
      <div className="section-one-answer-grid">
        {question.options.map((option, index) => (
          <button type="button" className={selected === index ? (correct ? 'correct' : 'incorrect') : ''} onClick={() => setSelected(index)} key={option}>
            {option}
          </button>
        ))}
      </div>
      {selected !== null ? <p className="section-one-feedback">{correct ? question.explanation : 'Not quite. Check the tile family or shape again.'}</p> : null}
    </div>
  );
}

function Sorter({ items, options, getAnswer, onComplete }: { items: Tile[]; options: string[]; getAnswer: (tile: Tile) => string; onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const allAnswered = items.every((tile) => answers[tile.label]);
  const allCorrect = allAnswered && items.every((tile) => answers[tile.label] === getAnswer(tile));

  useEffect(() => {
    if (allCorrect) onComplete();
  }, [allCorrect, onComplete]);

  return (
    <div className="section-two-sorter">
      {items.map((tile) => {
        const answer = answers[tile.label];
        const correct = answer === getAnswer(tile);
        return (
          <div className="section-two-sort-card" key={tile.label}>
            <TileFace tile={tile} />
            <div className="section-one-tabs">
              {options.map((option) => (
                <button
                  type="button"
                  className={answer === option ? (correct ? 'correct' : 'incorrect') : ''}
                  onClick={() => setAnswers((current) => ({ ...current, [tile.label]: option }))}
                  key={option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TileSetLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  const question = {
    prompt: 'What are the two main categories of core mahjong tiles?',
    options: ['Flowers and seasons', 'Suits and honors', 'Rounds and winds', 'Pairs and kongs'],
    answer: 1,
    explanation: 'Exactly. The core tile set is made of suited tiles and honor tiles.',
  };

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Start by sorting the tile universe.</h3>
        <p>Hong Kong Mahjong uses a core set of 136 tiles. The easiest way to learn them is to split them into two big families: suited tiles and honor tiles.</p>
        <p>Suited tiles have a suit and a number. Honor tiles do not have numbers; they represent winds and dragons.</p>
      </article>
      <section className="learn-content-card section-two-tile-grid-card">
        <span className="eyebrow">Visual example</span>
        <div className="section-two-family-grid">
          <TileGroup label="Suits" tiles={['1', '二', '3萬', '8', '九']} />
          <TileGroup label="Honors" tiles={['東', '南', '中', '發', '白']} />
          <TileGroup label="Later note" tiles={['春', '夏']} />
        </div>
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Two big buckets first.</h3>
        <p>Do not try to memorize everything at once. First, ask: is this suited, or is this an honor?</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <ChoiceCheck question={question} onCorrect={() => setReady(true)} />
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={ready} />
      </section>
      <Takeaway title="The core tile set is made of suited tiles and honor tiles." body="That split makes every later tile lesson easier." />
    </div>
  );
}

export function ThreeSuitsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  const drillTiles: Tile[] = [
    { label: '3', suit: 'dots' },
    { label: '七', suit: 'bamboo' },
    { label: '5萬', suit: 'characters' },
  ];

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Every suited tile has two facts.</h3>
        <p>The three suits are Dots, Bamboos, and Characters. Each suit runs from 1 through 9, and there are four copies of each tile.</p>
        <p>A 3 Bamboo is different from a 3 Dot. The habit to build is reading both the number and the suit.</p>
      </article>
      <section className="learn-content-card section-two-suits-card">
        <span className="eyebrow">Visual example</span>
        <div className="section-two-suit-rows">
          <TileGroup label="Dots" tiles={suitTiles.dots.map((tile) => tile.label)} />
          <TileGroup label="Bamboos" tiles={suitTiles.bamboo.map((tile) => tile.label)} />
          <TileGroup label="Characters" tiles={suitTiles.characters.map((tile) => tile.label)} />
        </div>
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Same number is not enough.</h3>
        <p>A sequence needs consecutive numbers in the same suit.</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <h3>Sort each tile into the correct suit.</h3>
          <Sorter items={drillTiles} options={['Dots', 'Bamboos', 'Characters']} getAnswer={(tile) => (tile.suit === 'dots' ? 'Dots' : tile.suit === 'bamboo' ? 'Bamboos' : 'Characters')} onComplete={() => setReady(true)} />
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={ready} />
      </section>
      <Takeaway title="Suited tiles have both a suit and a number." body="Always read both before deciding whether tiles work together." />
    </div>
  );
}

export function HonorTilesLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  const drillTiles = [windTiles[0], windTiles[3], dragonTiles[0], dragonTiles[2]];

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Honors match, but they do not run.</h3>
        <p>Honor tiles are the winds and dragons. The winds are East, South, West, and North. The dragons are Red, Green, and White.</p>
        <p>You can make pairs, triplets, and kongs with honor tiles, but you cannot make East-South-West as a sequence.</p>
      </article>
      <section className="learn-content-card">
        <span className="eyebrow">Visual example</span>
        <div className="section-two-family-grid">
          <TileGroup label="Winds" tiles={windTiles.map((tile) => tile.label)} />
          <TileGroup label="Dragons" tiles={dragonTiles.map((tile) => tile.label)} />
        </div>
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>No honor sequences.</h3>
        <p>East, South, and West are all winds, but they are not numbers and cannot form a run.</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <h3>Sort the honor tiles into winds and dragons.</h3>
          <Sorter items={drillTiles} options={['Winds', 'Dragons']} getAnswer={(tile) => (tile.suit === 'wind' ? 'Winds' : 'Dragons')} onComplete={() => setReady(true)} />
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={ready} />
      </section>
      <Takeaway title="Honor tiles are winds and dragons." body="Honors can match, but they do not run." />
    </div>
  );
}

export function TileGroupingsLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<Record<number, boolean>>({});
  const scenario = groupingScenarios[index];
  const complete = groupingScenarios.every((_, scenarioIndex) => answered[scenarioIndex]);

  const choose = (answer: string) => {
    if (answer === scenario.answer) {
      setAnswered((current) => ({ ...current, [index]: true }));
    }
  };

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Hands are built from small groups.</h3>
        <p>A pair is two identical tiles. A sequence is three consecutive numbers in the same suit. A triplet is three identical tiles. A kong is four identical tiles declared as a kong.</p>
        <p>Classify groups quickly before trying to read a full hand.</p>
      </article>
      <section className="learn-content-card section-two-group-examples">
        <span className="eyebrow">Visual example</span>
        <TileGroup label="Pair" tiles={['東', '東']} />
        <TileGroup label="Sequence" tiles={['三', '四', '五']} />
        <TileGroup label="Triplet" tiles={['中', '中', '中']} />
        <TileGroup label="Kong" tiles={['7', '7', '7', '7']} />
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Close is not always valid.</h3>
        <p>Mixed suits do not make a sequence. Honors do not sequence at all.</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <h3>{scenario.label}</h3>
          <TileRail tiles={scenario.tiles} />
          <div className="section-one-answer-grid">
            {['Pair', 'Sequence', 'Triplet', 'Kong', 'Invalid'].map((answer) => (
              <button type="button" className={answered[index] && answer === scenario.answer ? 'correct' : ''} onClick={() => choose(answer)} key={answer}>
                {answer}
              </button>
            ))}
          </div>
          {answered[index] ? <p className="section-one-feedback">{scenario.explanation}</p> : null}
          <div className="section-two-pager">
            {groupingScenarios.map((item, scenarioIndex) => (
              <button type="button" className={scenarioIndex === index ? 'active' : ''} onClick={() => setIndex(scenarioIndex)} key={item.label}>
                {scenarioIndex + 1}
              </button>
            ))}
          </div>
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={complete} />
      </section>
      <Takeaway title="Winning hands are built from pairs, sequences, triplets, and kongs." body="Name the group first, then decide how it helps the hand." />
    </div>
  );
}

export function OpenVsConcealedLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [active, setActive] = useState('Concealed hand');
  const [visited, setVisited] = useState(() => new Set(['Concealed hand']));
  const complete = visited.size === 4;
  const descriptions: Record<string, string> = {
    'Concealed hand': 'Private tiles only you can see.',
    'Open meld area': 'Called sets become visible here.',
    River: 'Discarded tiles collect in the center area.',
    Wall: 'The supply of drawable tiles for the hand.',
  };

  const choose = (area: string) => {
    setActive(area);
    setVisited((current) => new Set([...current, area]));
  };

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Called tiles become public.</h3>
        <p>Tiles in your hand are concealed: only you can see them. When you call another player&apos;s discard, the set you make becomes open and visible to everyone.</p>
        <p>Concealed tiles give flexibility. Open melds give speed but reveal information.</p>
      </article>
      <section className="learn-content-card">
        <span className="eyebrow">Visual example</span>
        <div className="section-two-table-map">
          {Object.keys(descriptions).map((area) => (
            <button type="button" className={active === area ? 'active' : ''} onClick={() => choose(area)} key={area}>
              {area}
            </button>
          ))}
        </div>
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>{active}</h3>
        <p>{descriptions[active]}</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <h3>Tap the concealed hand and open meld area.</h3>
          <p>{complete ? 'You visited all table areas. The key idea: called tiles become public.' : 'Tap each table area to see what belongs there.'}</p>
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={complete} />
      </section>
      <Takeaway title="A called set becomes open and visible to everyone." body="Open vs concealed matters for table clarity and later scoring." />
    </div>
  );
}

export function StandardWinningShapeLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected !== null && handShapeScenarios[selected].valid;

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Show me the four groups and the pair.</h3>
        <p>Most winning hands use the standard structure: four melds plus one pair. A meld can be a sequence, triplet, or declared kong. The pair is often called the eyes.</p>
        <p>Do not look at all fourteen tiles as a messy pile. Break them into groups.</p>
      </article>
      <section className="learn-content-card section-two-hand-options">
        <span className="eyebrow">Visual example</span>
        {handShapeScenarios.map((hand, handIndex) => (
          <button type="button" className={selected === handIndex ? (hand.valid ? 'correct' : 'incorrect') : ''} onClick={() => setSelected(handIndex)} key={hand.title}>
            <strong>{hand.title}</strong>
            <div>
              {hand.groups.map((group, groupIndex) => (
                <TileRail tiles={group} key={groupIndex} />
              ))}
            </div>
          </button>
        ))}
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Structure before style.</h3>
        <p>If you cannot divide the hand into four melds and a pair, it is usually not a standard win.</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <h3>Which hand has a valid standard winning shape?</h3>
          {selected !== null ? <p className="section-one-feedback">{correct ? 'Exactly. This hand can be split into four melds and a pair.' : 'Not quite. Look for the missing pair or broken group.'}</p> : <p>Pick one of the sample hands.</p>}
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={correct} />
      </section>
      <Takeaway title="A normal winning hand is four melds plus one pair." body="Break the hand apart before thinking about scoring." />
    </div>
  );
}

export function ThirteenOrphansLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [ready, setReady] = useState(false);
  const question = {
    prompt: 'Why is Thirteen Orphans special?',
    options: ['It uses only sequences', 'It is a legal special shape outside four melds plus one pair', 'It has no honor tiles', 'It is the only hand that can score'],
    answer: 1,
    explanation: 'Exactly. It is a named exception to the usual winning shape.',
  };

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>The big named exception.</h3>
        <p>Thirteen Orphans does not use four melds plus a pair. It uses the terminal tiles, the 1s and 9s of each suit, plus all seven honor tiles, with one duplicate to make a pair.</p>
        <p>Beginners do not need to chase it, but should know it exists.</p>
      </article>
      <section className="learn-content-card">
        <span className="eyebrow">Visual example</span>
        <div className="section-two-orphans">
          <TileGroup label="Terminals" tiles={['1', '9', '一', '九', '1萬', '9萬']} />
          <TileGroup label="Honors" tiles={['東', '南', '西', '北', '中', '發', '白']} />
          <TileGroup label="Duplicate pair" tiles={['東', '東']} />
        </div>
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Exception, not the default.</h3>
        <p>Most hands use standard shape. Thirteen Orphans is a special named hand.</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <ChoiceCheck question={question} onCorrect={() => setReady(true)} />
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={ready} />
      </section>
      <Takeaway title="Most hands use four melds plus one pair, but Thirteen Orphans is a special exception." body="Know it exists. Do not let it confuse the standard hand shape." />
    </div>
  );
}

export function ShapeVsScoringLesson({ lessonId, nextHref }: LessonRuntimeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === 0;

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Shape first, fan second.</h3>
        <p>A hand must first be legally shaped. Scoring patterns, called fan, come after that. A beginner mistake is to see valuable-looking tiles and assume they can win.</p>
        <p>If the tiles cannot be arranged into a legal winning shape, the hand is not a win.</p>
      </article>
      <section className="learn-content-card section-two-comparison">
        <span className="eyebrow">Visual example</span>
        <button type="button" className={selected === 0 ? 'correct' : ''} onClick={() => setSelected(0)}>
          <strong>Valid shape + enough fan</strong>
          <TileRail tiles={['一', '二', '三', '中', '中', '中', '東', '東']} />
          <span>Can win when rules allow.</span>
        </button>
        <button type="button" className={selected === 1 ? 'incorrect' : ''} onClick={() => setSelected(1)}>
          <strong>Fan-looking tiles, broken shape</strong>
          <TileRail tiles={['中', '發', '白', '東', '南', '西', '4萬']} />
          <span>Cannot win if the shape is invalid.</span>
        </button>
      </section>
      <section className="learn-content-card welcome-rule-card">
        <span className="eyebrow">Rule in plain English</span>
        <h3>Legal shape unlocks scoring.</h3>
        <p>Later you will check whether the legal hand has enough fan. But first, prove the shape.</p>
      </section>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <h3>Which one can be a legal win?</h3>
          {selected !== null ? <p className="section-one-feedback">{correct ? 'Exactly. Shape comes first, scoring comes second.' : 'Not quite. Valuable tiles do not matter if the hand shape is broken.'}</p> : <p>Choose the side that can actually win.</p>}
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={correct} />
      </section>
      <Takeaway title="Shape comes first. Scoring comes second." body="That order prevents a lot of beginner mistakes." />
    </div>
  );
}

function Takeaway({ title, body }: { title: string; body: string }) {
  return (
    <section className="learn-content-card learn-takeaway-card">
      <span className="eyebrow">Takeaway</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </section>
  );
}

export function SectionTwoRecap() {
  return (
    <div className="section-one-recap">
      <div className="learn-content-grid">
        {sectionTwoRecapItems.map((item) => (
          <div className="learn-content-card" key={item.title}>
            <span className="eyebrow">Remember</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
      <div className="learn-complete-card section-one-recap-flow">
        <div>
          <span className="eyebrow">Section 2 shape</span>
          <h3>Read tiles, classify groups, then check the hand.</h3>
          <p>That sequence takes you from raw tiles to a possible winning hand.</p>
        </div>
        <TileRail tiles={['一', '二', '三', '東', '東', '中', '中', '中']} />
      </div>
    </div>
  );
}

export function SectionTwoCheckpoint() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => checkpointQuestions.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0), [answers]);
  const answeredCount = Object.keys(answers).length;
  const passed = score >= 7;

  const submit = () => {
    setSubmitted(true);
    if (score >= 7) completeSection('section-2');
  };

  return (
    <div className="section-one-checkpoint">
      <div className="learn-content-card section-one-checkpoint-intro">
        <span className="eyebrow">Checkpoint quiz</span>
        <h3>Can you read tiles and hand shapes?</h3>
        <p>Answer all eight questions. A passing score is 7 out of 8.</p>
      </div>
      <div className="section-one-question-list">
        {checkpointQuestions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const isCorrect = selected === question.answer;
          return (
            <section className="learn-content-card section-one-question-card" key={question.prompt}>
              <span className="eyebrow">Question {questionIndex + 1}</span>
              <h3>{question.prompt}</h3>
              <div className="section-one-answer-grid">
                {question.options.map((option, optionIndex) => (
                  <button
                    type="button"
                    className={selected === optionIndex && submitted ? (isCorrect ? 'correct' : 'incorrect') : selected === optionIndex ? 'active' : ''}
                    onClick={() => {
                      setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
                      setSubmitted(false);
                    }}
                    key={option}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {submitted && selected !== undefined ? <p className="section-one-feedback">{isCorrect ? question.explanation : 'Not quite. Review the tile family or hand shape, then try again.'}</p> : null}
            </section>
          );
        })}
      </div>
      <div className="learn-complete-card section-one-score-card">
        <div>
          <span className="eyebrow">Score</span>
          <h3>{submitted ? `${score} / ${checkpointQuestions.length}` : `${answeredCount} / ${checkpointQuestions.length} answered`}</h3>
          <p>{submitted ? (passed ? 'Passed. You can recognize the building blocks of a Hong Kong Mahjong hand.' : 'Almost. Review the missed ideas, then submit again.') : 'Submit when every question has an answer.'}</p>
        </div>
        <button type="button" className="btn-primary gold" disabled={answeredCount < checkpointQuestions.length} onClick={submit}>
          {submitted ? 'Resubmit' : 'Submit checkpoint'}
        </button>
      </div>
    </div>
  );
}
