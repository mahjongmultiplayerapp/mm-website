export type Option = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
};

export type InteractionData =
  | {
      type: 'clickThrough';
      title: string;
      prompt: string;
      steps: { title: string; description: string }[];
    }
  | {
      type: 'multipleChoice';
      title: string;
      prompt: string;
      question: string;
      options: Option[];
    }
  | {
      type: 'tileClassifier';
      title: string;
      prompt: string;
      tiles: { id: string; label: string; category: 'suit' | 'honor' }[];
    }
  | {
      type: 'handValidator';
      title: string;
      prompt: string;
      hands: { id: string; label: string; isWinningShape: boolean; explanation: string }[];
    }
  | {
      type: 'turnOrderSimulator';
      title: string;
      prompt: string;
      scenario: { action: string; choices: string[]; correctChoice: string; explanation: string };
    }
  | {
      type: 'callDecision';
      title: string;
      prompt: string;
      scenario: { discarder: 'left' | 'across' | 'right'; discardedTile: string; choices: Option[] };
    }
  | {
      type: 'paymentSimulator';
      title: string;
      prompt: string;
      scenario: { fan: number; winType: 'selfDraw' | 'discard'; payments: { player: string; amount: number }[] };
    }
  | {
      type: 'fanSelector';
      title: string;
      prompt: string;
      question: string;
      options: Option[];
    };

export type Lesson = {
  id: string;
  sectionId: string;
  slug: string;
  title: string;
  objective: string;
  estimatedMinutes: number;
  concept: string;
  visualSpec: string;
  plainEnglishRule: string;
  takeaway: string;
  interaction: InteractionData;
};

export type Section = {
  id: string;
  number: number;
  slug: string;
  title: string;
  description: string;
  purpose: string;
  learningGoals: string[];
  estimatedMinutes: number;
  lessons: Lesson[];
  recap: string[];
  checkpoint: {
    title: string;
    passThreshold: number;
    questions: { id: string; question: string; options: Option[] }[];
  };
};

const mc = (q: string, opts: Option[]): InteractionData => ({
  type: 'multipleChoice',
  title: 'Knowledge check',
  prompt: 'Choose the best answer to continue.',
  question: q,
  options: opts,
});

export const sections: Section[] = [
  {
    id: 'section-1',
    number: 1,
    slug: 'what-is-hong-kong-mahjong',
    title: 'What Is Hong Kong Mahjong?',
    description: 'Build a mental model of the game, objective, and flow.',
    purpose: 'Give beginners a clear overview before details.',
    estimatedMinutes: 14,
    learningGoals: [
      'Explain what Hong Kong Mahjong is.',
      'Describe the objective: complete a legal winning hand.',
      'Understand seats, winds, and hand flow.',
    ],
    lessons: [
      {
        id: 's1-l1',
        sectionId: 'section-1',
        slug: 'welcome-to-the-game',
        title: 'Welcome to the Game',
        objective: 'Understand what makes Mahjong a four-player strategy race.',
        estimatedMinutes: 4,
        concept: 'Players draw and discard tiles to form a legal winning hand first.',
        visualSpec: 'Table lifecycle: Draw → Discard → Call → Win or Draw.',
        plainEnglishRule: 'Every turn, you usually draw one tile then discard one tile.',
        takeaway: 'Hong Kong Mahjong is a race to a legal hand through draw/discard decisions.',
        interaction: {
          type: 'clickThrough',
          title: 'Hand lifecycle',
          prompt: 'Tap through the lifecycle of one hand.',
          steps: [
            { title: 'Seat players', description: 'East, South, West, and North sit around the table.' },
            { title: 'Deal tiles', description: 'Players receive tiles; East begins with 14, others 13.' },
            { title: 'Draw and discard', description: 'On your turn, draw from wall and discard one.' },
            { title: 'Calls and win', description: 'Players may claim discards when legal to improve hand.' },
          ],
        },
      },
      {
        id: 's1-l2',
        sectionId: 'section-1',
        slug: 'objective-of-a-hand',
        title: 'The Objective of a Hand',
        objective: 'Recognize the standard winning shape.',
        estimatedMinutes: 5,
        concept: 'Most winning hands are four melds and one pair.',
        visualSpec: 'Skeleton: Meld + Meld + Meld + Meld + Pair.',
        plainEnglishRule: 'A legal standard hand usually uses 14 tiles in 4 groups plus a pair.',
        takeaway: 'If your tiles can be arranged as 4 melds + 1 pair, you are close to winning.',
        interaction: mc('What is the standard winning hand structure?', [
          { id: 'a', label: '3 melds + 2 pairs', correct: false, explanation: 'Close, but not standard.' },
          { id: 'b', label: '4 melds + 1 pair', correct: true, explanation: 'Correct: this is the classical shape.' },
          { id: 'c', label: '7 random tiles', correct: false, explanation: 'A legal hand must match winning patterns.' },
        ]),
      },
      {
        id: 's1-l3',
        sectionId: 'section-1',
        slug: 'shape-of-the-game',
        title: 'The Shape of the Game',
        objective: 'Understand seat winds and dealer role.',
        estimatedMinutes: 5,
        concept: 'Seat wind matters and East starts as dealer.',
        visualSpec: 'Compass seating map with East highlighted.',
        plainEnglishRule: 'Seat and round winds can affect scoring and flow.',
        takeaway: 'Remember your seat; it impacts both play order and scoring.',
        interaction: mc('Who is the dealer at the start of a hand?', [
          { id: 'a', label: 'East', correct: true, explanation: 'Correct. East is dealer.' },
          { id: 'b', label: 'North', correct: false, explanation: 'North is a seat but not initial dealer.' },
          { id: 'c', label: 'Any player', correct: false, explanation: 'Dealer is a specific seat for each hand.' },
        ]),
      },
    ],
    recap: ['Mahjong is a 4-player tile game.', 'Standard target shape is 4 melds + 1 pair.', 'East is dealer and seat winds matter.'],
    checkpoint: {
      title: 'Section 1 checkpoint',
      passThreshold: 80,
      questions: [
        { id: 'q1', question: 'How many players are at a standard table?', options: [
          { id: 'a', label: '4', correct: true, explanation: 'Correct.' },
          { id: 'b', label: '3', correct: false, explanation: 'Standard HK Mahjong uses 4.' },
          { id: 'c', label: '5', correct: false, explanation: 'Not standard.' },
        ]},
        { id: 'q2', question: 'Typical winning shape?', options: [
          { id: 'a', label: '4 melds + 1 pair', correct: true, explanation: 'Correct.' },
          { id: 'b', label: '2 melds + 4 pairs', correct: false, explanation: 'Not the standard shape.' },
        ]},
        { id: 'q3', question: 'Which seat is dealer?', options: [
          { id: 'a', label: 'East', correct: true, explanation: 'Correct.' },
          { id: 'b', label: 'South', correct: false, explanation: 'South is next in order.' },
        ]},
        { id: 'q4', question: 'A hand can end in…', options: [
          { id: 'a', label: 'Win or draw', correct: true, explanation: 'Correct.' },
          { id: 'b', label: 'Only self-draw', correct: false, explanation: 'Discard wins are also possible.' },
        ]},
        { id: 'q5', question: 'Turns generally follow?', options: [
          { id: 'a', label: 'Draw then discard', correct: true, explanation: 'Correct.' },
          { id: 'b', label: 'Discard then draw', correct: false, explanation: 'Usually draw first.' },
        ]},
      ],
    },
  },
  {
    id: 'section-2',
    number: 2,
    slug: 'tiles-melds-and-winning-hands',
    title: 'Tiles, Melds, and Winning Hands',
    description: 'Learn suits, honors, and hand building.',
    purpose: 'Teach tile recognition and grouping.',
    estimatedMinutes: 20,
    learningGoals: ['Identify suits/honors.', 'Classify pairs, sequences, triplets, and kongs.', 'Validate basic winning shape.'],
    lessons: [
      {
        id: 's2-l1', sectionId: 'section-2', slug: 'tile-families', title: 'Tile Families', objective: 'Identify suits and honors.', estimatedMinutes: 7,
        concept: 'Tiles are suited (dots, bamboo, characters) and honor (winds, dragons).', visualSpec: 'Label cards for each tile family.', plainEnglishRule: 'Suited tiles can form sequences; honors cannot.', takeaway: 'Knowing tile family helps legal-move decisions.',
        interaction: {
          type: 'tileClassifier', title: 'Sort the tiles', prompt: 'Tap each tile to classify it as suit or honor.',
          tiles: [
            { id: 't1', label: '1 Dot', category: 'suit' },
            { id: 't2', label: '7 Bamboo', category: 'suit' },
            { id: 't3', label: 'East Wind', category: 'honor' },
            { id: 't4', label: 'Red Dragon', category: 'honor' },
          ],
        }
      },
      {
        id: 's2-l2', sectionId: 'section-2', slug: 'meld-types', title: 'Meld Types', objective: 'Differentiate pair, chow, pung, and kong.', estimatedMinutes: 6,
        concept: 'Melds are legal sets of tiles used in winning hands.', visualSpec: 'Example groups side-by-side.', plainEnglishRule: 'Chow = suited sequence of 3; pung = 3 identical; kong = 4 identical; pair = 2 identical.', takeaway: 'You need four melds and one pair in standard hands.',
        interaction: mc('Which group is a chow?', [
          { id: 'a', label: '3-4-5 Bamboo', correct: true, explanation: 'Correct: suited sequence.' },
          { id: 'b', label: 'East-East-East', correct: false, explanation: 'That is a pung.' },
          { id: 'c', label: 'Red-Red', correct: false, explanation: 'That is a pair.' },
        ])
      },
      {
        id: 's2-l3', sectionId: 'section-2', slug: 'winning-shape-checker', title: 'Winning Shape Checker', objective: 'Spot valid hand shapes.', estimatedMinutes: 7,
        concept: 'Not every near-complete set is a winning shape.', visualSpec: 'Three candidate 14-tile layouts.', plainEnglishRule: 'A valid standard win needs complete groups plus exactly one pair.', takeaway: 'Count groups carefully before declaring win.',
        interaction: {
          type: 'handValidator', title: 'Winning hand drill', prompt: 'Choose each hand that is a legal standard win.',
          hands: [
            { id: 'h1', label: '4 melds + 1 pair', isWinningShape: true, explanation: 'Correct standard structure.' },
            { id: 'h2', label: '3 melds + 2 pairs + 1 stray tile', isWinningShape: false, explanation: 'Incomplete structure.' },
            { id: 'h3', label: '4 melds but no pair', isWinningShape: false, explanation: 'Pair is required.' },
          ],
        }
      },
    ],
    recap: ['Suits and honors behave differently.', 'Meld types each have specific structure.', 'Winning declarations require legal shape.'],
    checkpoint: {
      title: 'Section 2 checkpoint', passThreshold: 80,
      questions: [
        { id: 'q1', question: 'Can honors form chow?', options: [
          { id: 'a', label: 'No', correct: true, explanation: 'Correct.' }, { id: 'b', label: 'Yes', correct: false, explanation: 'Only suited tiles can chow.' }
        ]},
        { id: 'q2', question: 'Pung means?', options: [
          { id: 'a', label: '3 identical tiles', correct: true, explanation: 'Correct.' }, { id: 'b', label: '4 identical tiles', correct: false, explanation: 'That is kong.' }
        ]},
        { id: 'q3', question: 'Kong means?', options: [
          { id: 'a', label: '4 identical tiles', correct: true, explanation: 'Correct.' }, { id: 'b', label: '3 in sequence', correct: false, explanation: 'That is chow.' }
        ]},
        { id: 'q4', question: 'Standard win needs?', options: [
          { id: 'a', label: '4 melds + 1 pair', correct: true, explanation: 'Correct.' }, { id: 'b', label: '5 pairs', correct: false, explanation: 'Not standard.' }
        ]},
        { id: 'q5', question: '1 Dot is a…', options: [
          { id: 'a', label: 'Suit tile', correct: true, explanation: 'Correct.' }, { id: 'b', label: 'Honor tile', correct: false, explanation: 'Not honor.' }
        ]},
      ]
    }
  },
];

const baseTemplate = [
  {
    slug: 'setup-and-dealing',
    title: 'Setup and Dealing',
    description: 'Prepare table, walls, and opening hand.',
  },
  {
    slug: 'turn-flow-and-discarding',
    title: 'Turn Flow and Discarding',
    description: 'Understand legal turn sequence and discard logic.',
  },
  {
    slug: 'calls-chow-pung-kong-win',
    title: 'Calls: Chow, Pung, Kong, and Win',
    description: 'Learn call legality and priority.',
  },
  {
    slug: 'scoring-and-fan',
    title: 'Scoring and Fan',
    description: 'Learn fan basics, thresholds, and payments.',
  },
  {
    slug: 'rounds-draws-and-table-rules',
    title: 'Rounds, Draws, and Table Rules',
    description: 'Understand full-round flow and common mistakes.',
  },
] as const;

baseTemplate.forEach((template, idx) => {
  const number = idx + 3;
  const sectionId = `section-${number}`;
  sections.push({
    id: sectionId,
    number,
    slug: template.slug,
    title: template.title,
    description: template.description,
    purpose: template.description,
    estimatedMinutes: 16,
    learningGoals: ['Build confidence in real-table decisions.', 'Practice with interactive scenarios.', 'Pass a checkpoint before advancing.'],
    lessons: [
      {
        id: `${sectionId}-l1`,
        sectionId,
        slug: 'core-concepts',
        title: `${template.title}: Core Concepts`,
        objective: 'Understand the central rule set for this section.',
        estimatedMinutes: 5,
        concept: `Core rules for ${template.title.toLowerCase()}.`,
        visualSpec: 'Annotated examples and table prompts.',
        plainEnglishRule: 'Follow legal timing, structure, and declarations.',
        takeaway: `You can describe the key rules in ${template.title.toLowerCase()}.`,
        interaction: {
          type: 'clickThrough',
          title: 'Guided walkthrough',
          prompt: 'Step through the core flow and checkpoints.',
          steps: [
            { title: 'Observe', description: 'Review the table state and available actions.' },
            { title: 'Apply', description: 'Pick legal and efficient decisions.' },
            { title: 'Resolve', description: 'See resulting board state and why it matters.' },
          ],
        },
      },
      {
        id: `${sectionId}-l2`,
        sectionId,
        slug: 'interactive-drill',
        title: `${template.title}: Interactive Drill`,
        objective: 'Practice making legal decisions in context.',
        estimatedMinutes: 6,
        concept: 'Decision-making under realistic hand conditions.',
        visualSpec: 'Scenario panel with outcomes.',
        plainEnglishRule: 'Choose only legal actions based on turn state and claims.',
        takeaway: 'Rules become easier with repeated scenario practice.',
        interaction:
          template.slug === 'scoring-and-fan'
            ? {
                type: 'paymentSimulator',
                title: 'Payment simulator',
                prompt: 'Review how points move for self-draw and discard wins.',
                scenario: {
                  fan: 3,
                  winType: 'selfDraw',
                  payments: [
                    { player: 'East', amount: -3 },
                    { player: 'South', amount: -3 },
                    { player: 'West', amount: -3 },
                    { player: 'North (Winner)', amount: 9 },
                  ],
                },
              }
            : template.slug === 'calls-chow-pung-kong-win'
              ? {
                  type: 'callDecision',
                  title: 'Call decision drill',
                  prompt: 'Select all legal calls for this discard.',
                  scenario: {
                    discarder: 'left',
                    discardedTile: '4 Bamboo',
                    choices: [
                      { id: 'a', label: 'Chow', correct: true, explanation: 'Left player discard can be used for chow if sequence completes.' },
                      { id: 'b', label: 'Pung', correct: false, explanation: 'Need two matching tiles in hand.' },
                      { id: 'c', label: 'Pass', correct: true, explanation: 'Pass is always legal.' },
                    ],
                  },
                }
              : {
                  type: 'turnOrderSimulator',
                  title: 'Turn simulator',
                  prompt: 'Pick the correct next action.',
                  scenario: {
                    action: 'You drew from wall and no one called the previous discard.',
                    choices: ['Discard one tile', 'Declare game over', 'Take extra draw'],
                    correctChoice: 'Discard one tile',
                    explanation: 'Normal turn flow requires discarding after a draw.',
                  },
                },
      },
      {
        id: `${sectionId}-l3`,
        sectionId,
        slug: 'knowledge-check',
        title: `${template.title}: Knowledge Check`,
        objective: 'Verify readiness for checkpoint quiz.',
        estimatedMinutes: 5,
        concept: 'A short confidence check before section completion.',
        visualSpec: 'Multiple-choice drill with explanations.',
        plainEnglishRule: 'Read every option and use strict legality logic.',
        takeaway: 'You are ready for the section checkpoint.',
        interaction:
          template.slug === 'scoring-and-fan'
            ? {
                type: 'fanSelector',
                title: 'Fan selector',
                prompt: 'Choose the best scoring interpretation.',
                question: 'What is the minimum fan requirement in this curriculum?',
                options: [
                  { id: 'a', label: '1 fan', correct: false, explanation: 'Too low for this ruleset target.' },
                  { id: 'b', label: '3 fan', correct: true, explanation: 'Correct minimum in this course.' },
                  { id: 'c', label: '8 fan', correct: false, explanation: 'Higher than required baseline.' },
                ],
              }
            : mc('Which answer best matches the section rule focus?', [
                { id: 'a', label: 'Follow legal turn timing and declarations', correct: true, explanation: 'Correct.' },
                { id: 'b', label: 'Ignore tile structure', correct: false, explanation: 'Tile structure always matters.' },
                { id: 'c', label: 'Skip priority rules', correct: false, explanation: 'Priority rules are critical.' },
              ]),
      },
    ],
    recap: ['Core concept learned.', 'Interactive decision drill completed.', 'Ready for checkpoint assessment.'],
    checkpoint: {
      title: `${template.title} checkpoint`,
      passThreshold: 80,
      questions: Array.from({ length: template.slug === 'scoring-and-fan' || template.slug === 'calls-chow-pung-kong-win' ? 8 : 5 }).map((_, i) => ({
        id: `q${i + 1}`,
        question: `Checkpoint question ${i + 1} for ${template.title}`,
        options: [
          { id: 'a', label: 'Correct rule-based choice', correct: true, explanation: 'Matches legal play.' },
          { id: 'b', label: 'Illegal/incorrect choice', correct: false, explanation: 'Conflicts with section rules.' },
          { id: 'c', label: 'Distractor', correct: false, explanation: 'Not the best answer.' },
        ],
      })),
    },
  });
});

export const finalReadinessQuestions = Array.from({ length: 20 }).map((_, i) => ({
  id: `final-${i + 1}`,
  question: `Scenario ${i + 1}: What is the best legal action?`,
  options: [
    { id: 'a', label: 'Legal and strategic choice', correct: true, explanation: 'Correct. This follows rules and flow.' },
    { id: 'b', label: 'Illegal call timing', correct: false, explanation: 'Timing and legality are violated.' },
    { id: 'c', label: 'Misread winning shape', correct: false, explanation: 'Hand does not satisfy legal win state.' },
    { id: 'd', label: 'Scoring error', correct: false, explanation: 'Fan/payment interpretation is incorrect.' },
  ],
}));

export const curriculumTitle = 'Learn Hong Kong Mahjong interactively';
export const curriculumDescription =
  'Start with the tiles, then learn how to set up, play, call, win, score, and complete a full round.';

export const getSectionBySlug = (slug: string) => sections.find((s) => s.slug === slug);
export const getLessonBySlug = (sectionSlug: string, lessonSlug: string) => {
  const section = getSectionBySlug(sectionSlug);
  return section?.lessons.find((lesson) => lesson.slug === lessonSlug);
};

export const flattenLessons = () =>
  sections.flatMap((section) =>
    section.lessons.map((lesson) => ({
      ...lesson,
      sectionSlug: section.slug,
      sectionTitle: section.title,
      sectionNumber: section.number,
    })),
  );
