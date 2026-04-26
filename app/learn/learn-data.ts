export type Lesson = {
  number: string;
  slug: string;
  title: string;
  objective: string;
};

export type LearnSection = {
  number: number;
  slug: string;
  title: string;
  purpose: string;
  estimatedMinutes: number;
  goals: string[];
  lessons: Lesson[];
};

export const learnSections: LearnSection[] = [
  {
    number: 1,
    slug: 'what-is-hong-kong-mahjong',
    title: 'What Is Hong Kong Mahjong?',
    purpose: 'Build a clear mental model of the game before introducing technical rules.',
    estimatedMinutes: 12,
    goals: ['Explain what Hong Kong Mahjong is', 'Describe the objective of a hand', 'Understand the broad flow of a full hand'],
    lessons: [
      { number: '1.1', slug: 'welcome-to-the-game', title: 'Welcome to the Game', objective: 'Understand mahjong as a four-player tile game about completing a legal hand.' },
      { number: '1.2', slug: 'hk-mahjong-vs-other-styles', title: 'HK Mahjong vs Other Styles', objective: 'See how Hong Kong Mahjong fits inside the wider family of mahjong styles.' },
      { number: '1.3', slug: 'objective-of-a-hand', title: 'The Objective of a Hand', objective: 'Learn the usual target shape: four melds and one pair.' },
      { number: '1.4', slug: 'shape-of-the-game', title: 'The Shape of the Game', objective: 'Meet seats, winds, dealer, hands, and rounds.' },
      { number: '1.5', slug: 'how-a-hand-flows', title: 'How a Hand Flows', objective: 'Follow one complete hand from setup through scoring.' },
    ],
  },
  {
    number: 2,
    slug: 'tiles-melds-winning-hands',
    title: 'Tiles, Melds, and Winning Hands',
    purpose: 'Teach the tile set, basic groups, and the difference between hand shape and scoring value.',
    estimatedMinutes: 24,
    goals: ['Recognize suited and honor tiles', 'Identify pairs, chows, pungs, and kongs', 'Spot a standard winning hand shape'],
    lessons: [
      { number: '2.1', slug: 'the-tile-set', title: 'The Tile Set', objective: 'Recognize the full Hong Kong Mahjong tile set.' },
      { number: '2.2', slug: 'the-three-suits', title: 'The Three Suits', objective: 'Identify dots, bamboo, and characters from one to nine.' },
      { number: '2.3', slug: 'honor-tiles', title: 'Honor Tiles', objective: 'Recognize winds and dragons.' },
      { number: '2.4', slug: 'tile-groupings', title: 'Tile Groupings', objective: 'Understand pairs, sequences, triplets, and kongs.' },
      { number: '2.5', slug: 'open-vs-concealed', title: 'Open vs Concealed', objective: 'Distinguish exposed melds from hidden tiles.' },
      { number: '2.6', slug: 'standard-winning-shape', title: 'Standard Winning Shape', objective: 'Build the common four melds plus one pair structure.' },
      { number: '2.7', slug: 'thirteen-orphans', title: 'Special Winning Hand: Thirteen Orphans', objective: 'Recognize the special thirteen-orphans exception.' },
      { number: '2.8', slug: 'valid-shape-vs-scoring-pattern', title: 'Valid Shape vs Scoring Pattern', objective: 'Separate whether a hand is complete from whether it scores enough fan.' },
    ],
  },
  {
    number: 3,
    slug: 'setup-and-dealing',
    title: 'Setup and Dealing',
    purpose: 'Show how players sit, build the wall, open it, and deal the starting hands.',
    estimatedMinutes: 22,
    goals: ['Name seat winds and dealer role', 'Understand the wall and dead wall', 'Describe how tiles are dealt'],
    lessons: [
      { number: '3.1', slug: 'seating-and-seat-winds', title: 'Seating and Seat Winds', objective: 'Place East, South, West, and North around the table.' },
      { number: '3.2', slug: 'dealer-and-east', title: 'Dealer and the Meaning of East', objective: 'Understand why East starts and how dealer status matters.' },
      { number: '3.3', slug: 'the-wall', title: 'The Wall', objective: 'Learn how shuffled tiles become the wall.' },
      { number: '3.4', slug: 'rolling-dice-opening-wall', title: 'Rolling Dice and Opening the Wall', objective: 'See how the break point is chosen.' },
      { number: '3.5', slug: 'live-wall-vs-dead-wall', title: 'Live Wall vs Dead Wall', objective: 'Understand which tiles are drawn in normal play and after kongs.' },
      { number: '3.6', slug: 'dealing-the-tiles', title: 'Dealing the Tiles', objective: 'Follow the deal from wall to player hands.' },
      { number: '3.7', slug: 'table-areas', title: 'Table Areas', objective: 'Locate hands, walls, discards, and exposed melds.' },
      { number: '3.8', slug: 'common-setup-mistakes', title: 'Common Setup Mistakes', objective: 'Catch beginner errors before a hand begins.' },
    ],
  },
  {
    number: 4,
    slug: 'turn-flow-and-discarding',
    title: 'Turn Flow and Discarding',
    purpose: 'Teach the rhythm of a turn and how calls can interrupt normal order.',
    estimatedMinutes: 22,
    goals: ['Know who starts', 'Describe draw and discard flow', 'Understand how a hand ends'],
    lessons: [
      { number: '4.1', slug: 'dealer-starts', title: 'The Dealer Starts', objective: 'Understand East opening the hand.' },
      { number: '4.2', slug: 'anatomy-of-a-turn', title: 'Anatomy of a Turn', objective: 'Break a turn into draw, consider, discard.' },
      { number: '4.3', slug: 'drawing-a-tile', title: 'Drawing a Tile', objective: 'Learn what changes when a tile enters your hand.' },
      { number: '4.4', slug: 'arranging-your-hand', title: 'Arranging Your Hand', objective: 'Organize tiles to see possible shapes.' },
      { number: '4.5', slug: 'discarding', title: 'Discarding', objective: 'Choose a tile to release and move play forward.' },
      { number: '4.6', slug: 'the-call-window', title: 'The Call Window', objective: 'Understand the brief moment when others may claim a discard.' },
      { number: '4.7', slug: 'turn-order-around-the-table', title: 'Turn Order Around the Table', objective: 'Follow normal order and call interruptions.' },
      { number: '4.8', slug: 'what-ends-a-hand', title: 'What Ends a Hand', objective: 'Identify win and draw endings.' },
    ],
  },
  {
    number: 5,
    slug: 'calls-chow-pung-kong-win',
    title: 'Calls: Chow, Pung, Kong, and Win',
    purpose: 'Teach legal calls, call priority, and how exposed melds change the hand.',
    estimatedMinutes: 34,
    goals: ['Know when Chow, Pung, Kong, and Win are legal', 'Understand call priority', 'Place open melds clearly'],
    lessons: [
      { number: '5.1', slug: 'what-is-a-call', title: 'What Is a Call?', objective: "Understand claiming another player's discard." },
      { number: '5.2', slug: 'chow', title: 'Chow', objective: 'Learn when a sequence call is legal.' },
      { number: '5.3', slug: 'pung', title: 'Pung', objective: 'Learn when a triplet call is legal.' },
      { number: '5.4', slug: 'concealed-kong', title: 'Concealed Kong', objective: 'Learn how four hidden matching tiles become a kong.' },
      { number: '5.5', slug: 'added-kong', title: 'Added Kong', objective: 'Extend an exposed pung into a kong.' },
      { number: '5.6', slug: 'big-exposed-kong', title: 'Big Exposed Kong', objective: 'Claim a discard to complete four of a kind.' },
      { number: '5.7', slug: 'supplement-tile-after-kong', title: 'Supplement Tile After a Kong', objective: 'Understand the replacement draw after declaring kong.' },
      { number: '5.8', slug: 'self-draw-win', title: 'Self-Draw Win', objective: 'Win by drawing your own final tile.' },
      { number: '5.9', slug: 'win-on-discard', title: 'Win on Discard', objective: "Win by claiming another player's discard." },
      { number: '5.10', slug: 'robbing-a-kong', title: 'Robbing a Kong', objective: 'Understand the special win against an added kong.' },
      { number: '5.11', slug: 'call-priority', title: 'Call Priority', objective: 'Resolve multiple claims on the same discard.' },
      { number: '5.12', slug: 'how-calls-change-turn-flow', title: 'How Calls Change Turn Flow', objective: 'See how play resumes after a call.' },
      { number: '5.13', slug: 'open-meld-placement', title: 'Open Meld Placement', objective: 'Display exposed sets so the source is clear.' },
      { number: '5.14', slug: 'beginner-call-decisions', title: 'Beginner Call Decisions', objective: 'Practice deciding whether a call helps.' },
    ],
  },
  {
    number: 6,
    slug: 'scoring-and-fan',
    title: 'Scoring and Fan',
    purpose: 'Introduce fan, the three-fan minimum, payment basics, and beginner scoring patterns.',
    estimatedMinutes: 28,
    goals: ['Understand fan as scoring value', 'Know the 3-fan minimum', 'Compare self-draw and discard win payments'],
    lessons: [
      { number: '6.1', slug: 'what-makes-a-hand-winnable', title: 'What Makes a Hand Winnable', objective: 'Connect valid shape to enough scoring value.' },
      { number: '6.2', slug: 'what-is-fan', title: 'What Is Fan?', objective: 'Understand fan as the unit of hand value.' },
      { number: '6.3', slug: 'basic-scoring-principles', title: 'Basic Scoring Principles', objective: 'Learn the rules that guide common scoring.' },
      { number: '6.4', slug: 'payment-basics', title: 'Payment Basics', objective: 'See who pays after different win types.' },
      { number: '6.5', slug: 'package-payment', title: 'Package Payment', objective: 'Understand the idea of responsibility payments.' },
      { number: '6.6', slug: 'beginner-fan', title: 'Beginner Fan', objective: 'Recognize accessible beginner scoring patterns.' },
      { number: '6.7', slug: 'intermediate-fan', title: 'Intermediate Fan', objective: 'Preview more valuable common patterns.' },
      { number: '6.8', slug: 'limit-hands', title: 'Limit Hands', objective: 'Understand the idea of top-value hands.' },
      { number: '6.9', slug: 'points-conversion-table', title: 'Points Conversion Table', objective: 'Use a table to convert fan to payments.' },
      { number: '6.10', slug: 'presenting-a-winning-hand', title: 'Presenting a Winning Hand', objective: 'Show a win clearly for scoring.' },
    ],
  },
  {
    number: 7,
    slug: 'rounds-draws-table-rules',
    title: 'Rounds, Draws, and Table Rules',
    purpose: 'Wrap a single hand into a full table session with dealer movement, draws, and etiquette.',
    estimatedMinutes: 24,
    goals: ['Handle drawn hands', 'Know when the dealer passes', 'Avoid dead hands and common table errors'],
    lessons: [
      { number: '7.1', slug: 'what-happens-after-a-hand-ends', title: 'What Happens After a Hand Ends', objective: 'Move from one hand into the next.' },
      { number: '7.2', slug: 'drawn-hands', title: 'Drawn Hands', objective: 'Understand what happens when the wall runs out.' },
      { number: '7.3', slug: 'passing-the-deal', title: 'Passing the Deal', objective: 'Learn when dealership moves.' },
      { number: '7.4', slug: 'wind-cycles-and-rounds', title: 'Wind Cycles and Rounds', objective: 'Track round wind across the table.' },
      { number: '7.5', slug: 'end-of-a-round', title: 'End of a Round', objective: 'Know when a round is complete.' },
      { number: '7.6', slug: 'dead-hands-and-common-errors', title: 'Dead Hands and Common Errors', objective: 'Spot mistakes that can invalidate a hand.' },
      { number: '7.7', slug: 'table-etiquette', title: 'Table Etiquette', objective: 'Play clearly and respectfully at a real table.' },
      { number: '7.8', slug: 'ready-for-a-real-table', title: 'Ready for a Real Table', objective: 'Review the habits needed to join a game confidently.' },
    ],
  },
];

export const totalLessonCount = learnSections.reduce((sum, section) => sum + section.lessons.length, 0);

export function getSection(sectionSlug: string) {
  return learnSections.find((section) => section.slug === sectionSlug);
}

export function getLesson(sectionSlug: string, lessonSlug: string) {
  const section = getSection(sectionSlug);
  return {
    section,
    lesson: section?.lessons.find((item) => item.slug === lessonSlug),
  };
}

export function getLessonPath(sectionSlug: string, lessonSlug: string) {
  return `/learn/${sectionSlug}/${lessonSlug}`;
}

export function getFirstLessonPath(section: LearnSection) {
  return getLessonPath(section.slug, section.lessons[0].slug);
}

export function getNextLessonPath(sectionSlug: string, lessonSlug: string) {
  const sectionIndex = learnSections.findIndex((section) => section.slug === sectionSlug);
  const section = learnSections[sectionIndex];
  if (!section) return '/learn';

  const lessonIndex = section.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  const nextLesson = section.lessons[lessonIndex + 1];
  if (nextLesson) return getLessonPath(section.slug, nextLesson.slug);

  return `/learn/${section.slug}/recap`;
}

export function getPreviousLessonPath(sectionSlug: string, lessonSlug: string) {
  const sectionIndex = learnSections.findIndex((section) => section.slug === sectionSlug);
  const section = learnSections[sectionIndex];
  if (!section) return '/learn';

  const lessonIndex = section.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  const previousLesson = section.lessons[lessonIndex - 1];
  if (previousLesson) return getLessonPath(section.slug, previousLesson.slug);

  return `/learn/${section.slug}`;
}
