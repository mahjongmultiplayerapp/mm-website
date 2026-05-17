'use client';

import { useEffect, useMemo, useState } from 'react';
import { MiniTile } from './components';

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
  { label: '3 Bamboo + 4 Bamboo + 5 Bamboo', tiles: ['三', '四', '五'], answer: 'Chow', explanation: 'Consecutive numbers in the same suit make a chow.' },
  { label: 'East + East', tiles: ['東', '東'], answer: 'Eyes', explanation: 'Two identical tiles make eyes.' },
  { label: 'Red + Red + Red', tiles: ['中', '中', '中'], answer: 'Pung', explanation: 'Three identical tiles make a pung.' },
  { label: '7 Dot + 7 Dot + 7 Dot + 7 Dot', tiles: ['7', '7', '7', '7'], answer: 'Kong', explanation: 'Four identical tiles can be declared as a kong.' },
  { label: '2 Dot + 3 Bamboo + 4 Character', tiles: ['2', '三', '4萬'], answer: 'Invalid', explanation: 'A chow needs one suit, not mixed suits.' },
];

const handBuilderTiles = ['中', '七', '3', '白', '一', '中', '5', '九', '二', '白', '4', '中', '八', '三'].map((tile, index) => ({
  id: `${tile}-${index}`,
  tile,
}));

const suitRank: Record<string, { suit: 'dots' | 'bamboo' | 'characters'; rank: number }> = {
  '1': { suit: 'dots', rank: 1 },
  '2': { suit: 'dots', rank: 2 },
  '3': { suit: 'dots', rank: 3 },
  '4': { suit: 'dots', rank: 4 },
  '5': { suit: 'dots', rank: 5 },
  '6': { suit: 'dots', rank: 6 },
  '7': { suit: 'dots', rank: 7 },
  '8': { suit: 'dots', rank: 8 },
  '9': { suit: 'dots', rank: 9 },
  '一': { suit: 'bamboo', rank: 1 },
  '二': { suit: 'bamboo', rank: 2 },
  '三': { suit: 'bamboo', rank: 3 },
  '四': { suit: 'bamboo', rank: 4 },
  '五': { suit: 'bamboo', rank: 5 },
  '六': { suit: 'bamboo', rank: 6 },
  '七': { suit: 'bamboo', rank: 7 },
  '八': { suit: 'bamboo', rank: 8 },
  '九': { suit: 'bamboo', rank: 9 },
  '1萬': { suit: 'characters', rank: 1 },
  '2萬': { suit: 'characters', rank: 2 },
  '3萬': { suit: 'characters', rank: 3 },
  '4萬': { suit: 'characters', rank: 4 },
  '5萬': { suit: 'characters', rank: 5 },
  '6萬': { suit: 'characters', rank: 6 },
  '7萬': { suit: 'characters', rank: 7 },
  '8萬': { suit: 'characters', rank: 8 },
  '9萬': { suit: 'characters', rank: 9 },
};

type MeldType = 'Eyes' | 'Pung' | 'Chow' | 'Kong';
type BuilderMeld = { type: MeldType; tiles: string[]; tileIds: string[] };

function isCorrectMeld(type: MeldType, tiles: string[]) {
  if (type === 'Eyes') return tiles.length === 2 && tiles.every((tile) => tile === tiles[0]);
  if (type === 'Pung') return tiles.length === 3 && tiles.every((tile) => tile === tiles[0]);
  if (type === 'Kong') return tiles.length === 4 && tiles.every((tile) => tile === tiles[0]);
  if (type !== 'Chow' || tiles.length !== 3) return false;

  const suitedTiles = tiles.map((tile) => suitRank[tile]);
  if (suitedTiles.some((tile) => !tile)) return false;

  const [firstSuit] = suitedTiles;
  const ranks = suitedTiles.map((tile) => tile.rank).sort((a, b) => a - b);
  return suitedTiles.every((tile) => tile.suit === firstSuit.suit) && ranks[0] + 1 === ranks[1] && ranks[1] + 1 === ranks[2];
}

const sectionTwoRecapItems = [
  { title: 'Tiles split into suits and honors.', body: 'Suited tiles have suit and number. Honor tiles are winds and dragons.' },
  { title: 'Groups (melds) are the building blocks.', body: 'Eyes (pairs), Chows (sequences), Pungs (triplets), and Kongs (quads) are the shapes you look for first.' },
  { title: 'Called tiles become public.', body: 'Open melds sit on the table where everyone can see them.' },
  { title: 'Shape comes before scoring.', body: 'A hand must be legally shaped before scoring matters.' },
];

const checkpointQuestions: ChoiceQuestion[] = [
  { prompt: 'Which tile is a suited tile?', options: ['East', 'Red Dragon', '5 Bamboo', 'White Dragon'], answer: 2, explanation: '5 Bamboo has both a suit and a number.' },
  { prompt: 'Which tile is a wind?', options: ['East', 'Red', 'Green', '5 Dot'], answer: 0, explanation: 'East is one of the four wind tiles.' },
  { prompt: 'Which tile is a dragon?', options: ['South', 'North', 'White', '9 Character'], answer: 2, explanation: 'White is one of the dragon tiles.' },
  { prompt: 'What is 3 Bamboo + 4 Bamboo + 5 Bamboo?', options: ['Eyes', 'Chow', 'Pung', 'Invalid'], answer: 1, explanation: 'They are consecutive numbers in the same suit, which makes a chow.' },
  { prompt: 'What is Red + Red + Red?', options: ['Eyes', 'Chow', 'Pung', 'Invalid'], answer: 2, explanation: 'Three identical tiles make a pung.' },
  { prompt: 'What is four identical declared tiles?', options: ['Eyes', 'Chow', 'Pung', 'Kong'], answer: 3, explanation: 'A declared four-of-a-kind is a kong.' },
  { prompt: 'Which hand shape is usually valid?', options: ['Four melds + one pair', 'Three pairs + one tile', 'Any 14 honors', 'Five unrelated groups'], answer: 0, explanation: 'Most winning hands use four melds and one pair.' },
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
  window.dispatchEvent(new Event('learn-progress-updated'));
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

  useEffect(() => {
    if (!ready || isComplete) return;
    completeLesson(lessonId, nextHref);
    setIsComplete(true);
  }, [isComplete, lessonId, nextHref, ready, setIsComplete]);

  return (
    <span className={`lesson-status-pill ${isComplete ? 'complete' : ''}`}>{isComplete ? 'Completed' : 'Not complete'}</span>
  );
}

function TileFace({ tile }: { tile: Tile | string }) {
  const label = typeof tile === 'string' ? tile : tile.label;
  return <MiniTile tile={label} />;
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

function TileFamilyGroup({ label, tiles }: { label: string; tiles: { tile: string; name: string }[] }) {
  return (
    <div className="section-one-tile-group section-two-family-group">
      <div className="section-two-captioned-tiles">
        {tiles.map((tile) => (
          <div className="section-two-captioned-tile" key={`${label}-${tile.tile}`}>
            <MiniTile tile={tile.tile} />
            <span>{tile.name}</span>
          </div>
        ))}
      </div>
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
          <TileFamilyGroup
            label="Suit Tiles"
            tiles={[
              { tile: '9-dot', name: 'Dot' },
              { tile: '9-bam', name: 'Bam' },
              { tile: '9-crak', name: 'Char' },
            ]}
          />
          <TileFamilyGroup
            label="Honor Tiles"
            tiles={[
              { tile: 'east-wind', name: 'Wind' },
              { tile: 'dragon-red-chun', name: 'Dragon' },
            ]}
          />
          <TileFamilyGroup
            label="Bonus Tiles (Optional, not core tiles)"
            tiles={[
              { tile: 'flower-1-spring', name: 'Season' },
              { tile: 'flower-8-nobility', name: 'Flower' },
            ]}
          />
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
        <p>A pair ("Eyes") is two identical tiles. A sequence ("Chow") is three consecutive numbers in the same suit. A triplet ("Pung") is three identical tiles. A quad ("Kong") is four identical tiles declared as a kong.</p>
        <p>Classify groups quickly before trying to read a full hand.</p>
      </article>
      <section className="learn-content-card section-two-group-examples">
        <span className="eyebrow">Visual example</span>
        <TileGroup label="Eyes (a Pair)" tiles={['東', '東']} />
        <TileGroup label="Chow (a Sequence)" tiles={['三', '四', '五']} />
        <TileGroup label="Pung (a Triplet)" tiles={['中', '中', '中']} />
        <TileGroup label="Kong (a Quad)" tiles={['7', '7', '7', '7']} />
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
            {['Eyes', 'Chow', 'Pung', 'Kong', 'Invalid'].map((answer) => (
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
      <Takeaway title="Winning hands are built from pairs, sequences, triplets, and quads." body="Name the group first, then decide how it helps the hand." />
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
        <p>Your melds (Eyes, Chow, Pung, Kong) can either be made directly in your hand (concealed) or by revealing your meld's tiles when you call another player's discarded tile. Tiles in your hand all start as concealed: only you can see them. When you call another player&apos;s discard, the set you make becomes open and visible to everyone.</p>
        <p>Building your winning hand with concealed tiles prevents other players from knowing your tiles. Building public "open" melds lets you utilize other player's discarded tiles but reveals information. You'll learn more about this in later sections.</p>
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
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [lockedMelds, setLockedMelds] = useState<BuilderMeld[]>([]);
  const [feedback, setFeedback] = useState('Select tiles, then choose the meld they form.');
  const committedTileIds = useMemo(() => new Set(lockedMelds.flatMap((meld) => meld.tileIds)), [lockedMelds]);
  const complete = committedTileIds.size === handBuilderTiles.length;

  const selectedTiles = handBuilderTiles.filter((tile) => selectedTileIds.includes(tile.id)).map((tile) => tile.tile);

  const toggleTile = (tileId: string) => {
    if (committedTileIds.has(tileId)) return;
    setSelectedTileIds((current) => (current.includes(tileId) ? current.filter((id) => id !== tileId) : [...current, tileId]));
  };

  const lockMeld = (type: MeldType) => {
    if (!isCorrectMeld(type, selectedTiles)) {
      setFeedback(`That selection is not a valid ${type}.`);
      return;
    }

    setLockedMelds((current) => [...current, { type, tiles: selectedTiles, tileIds: selectedTileIds }]);
    setSelectedTileIds([]);
    setFeedback(`${type} locked in.`);
  };

  const resetBuilder = () => {
    setSelectedTileIds([]);
    setLockedMelds([]);
    setFeedback('Select tiles, then choose the meld they form.');
  };

  return (
    <div className="learn-lesson-template section-one-lesson section-two-lesson">
      <article className="learn-content-card welcome-copy-card">
        <span className="eyebrow">Concept</span>
        <h3>Show me the four groups and the pair.</h3>
        <p>Most winning hands use the standard structure: four melds plus one pair. A meld can be a sequence, triplet, or declared kong. The pair is often called the eyes.</p>
      </article>
      <section className="learn-complete-card">
        <div>
          <span className="eyebrow">Interactive check</span>
          <h3>Build four melds and the eyes.</h3>
          <p className="section-one-feedback">{complete ? 'Exactly. This hand splits into three chows, one pung, and eyes.' : feedback}</p>
        </div>
        <CompleteButton lessonId={lessonId} nextHref={nextHref} ready={complete} />
      </section>
      <section className="learn-content-card section-two-hand-builder">
        <span className="eyebrow">Hand builder</span>
        <div className="section-two-builder-tiles">
          {handBuilderTiles.map((tile) => {
            const isCommitted = committedTileIds.has(tile.id);
            return (
              <button
                type="button"
                className={`${selectedTileIds.includes(tile.id) ? 'selected' : ''} ${isCommitted ? 'locked' : ''}`}
                onClick={() => toggleTile(tile.id)}
                disabled={isCommitted}
                key={tile.id}
              >
                <MiniTile tile={tile.tile} />
              </button>
            );
          })}
        </div>
        <div className="section-two-builder-actions">
          {(['Eyes', 'Pung', 'Chow', 'Kong'] as MeldType[]).map((type) => (
            <button type="button" onClick={() => lockMeld(type)} key={type}>
              {type}
            </button>
          ))}
          <button type="button" onClick={resetBuilder}>
            Reset
          </button>
        </div>
        <div className="section-two-locked-melds">
          {lockedMelds.length ? (
            lockedMelds.map((meld, index) => (
              <div className="section-one-tile-group" key={`${meld.type}-${index}`}>
                <TileRail tiles={meld.tiles} />
                <small>{meld.type}</small>
              </div>
            ))
          ) : (
            <p>No melds locked yet.</p>
          )}
        </div>
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
        <h3>A rare alternative winning hand.</h3>
        <p>Thirteen Orphans does not use four melds plus a pair. It uses the terminal tiles, the 1s and 9s of each suit, plus all seven honor tiles, with one duplicate to make a pair.</p>
        <p>It's helpful to be aware of this winning hand, but it's definitely less common.</p>
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

  const submit = () => {
    setSubmitted(true);
    completeLesson('tiles-melds-winning-hands/checkpoint', '/learn/setup-and-dealing');
    completeSection('section-2');
  };

  return (
    <div className="section-one-checkpoint">
      <div className="learn-content-card section-one-checkpoint-intro">
        <span className="eyebrow">Checkpoint quiz</span>
        <h3>Can you read tiles and hand shapes?</h3>
        <p>Answer all eight questions, then submit to see your score.</p>
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
          <h3>{submitted ? `${score}/${checkpointQuestions.length} Correct` : `${answeredCount} / ${checkpointQuestions.length} answered`}</h3>
          <p>{submitted ? 'Score recorded. Keep moving while the ideas are fresh.' : 'Submit when every question has an answer.'}</p>
        </div>
        {submitted ? (
          <a className="btn-primary gold" href="/learn/setup-and-dealing">
            Continue to next section
          </a>
        ) : (
          <button type="button" className="btn-primary gold" disabled={answeredCount < checkpointQuestions.length} onClick={submit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
