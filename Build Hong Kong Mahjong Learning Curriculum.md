
Below is a  **Claude Code-ready PRD**  for the full interactive  **“Learn the Game”**  curriculum. It is intentionally specific: lesson order, route structure, page components, interaction types, data model, and acceptance criteria.

It uses the 7-section curriculum you liked and aligns to the translated GGHK 13-Tile Classical Hong Kong Mahjong rulebook, which covers tile composition, objective, winning hand shapes, dealing, turn sequence, calls, scoring, drawn hands, rounds, and fouls.

----------

# **PRD: Interactive Hong Kong Mahjong Learning Curriculum**

## **Product**

**Learn Hong Kong Mahjong**

## **Website context**

This is a learning section for a website/app that teaches users how to play Hong Kong Mahjong interactively. The curriculum should take a beginner from zero knowledge to being able to sit down and play a full round confidently.

## **Primary objective**

Build an interactive, mobile-friendly learning flow for  **Part 1: Learn the Game**, consisting of 7 sections:

1.  What Is Hong Kong Mahjong?
2.  Tiles, Melds, and Winning Hands
3.  Setup and Dealing
4.  Turn Flow and Discarding
5.  Calls: Chow, Pung, Kong, and Win
6.  Scoring and Fan
7.  Rounds, Draws, and Table Rules

## **Target learner**

A beginner who:

-   may have heard of mahjong but does not know the rules
-   wants to learn visually and interactively
-   wants practical knowledge, not a dense rulebook
-   may eventually play online, with friends, or at a real table

## **Learning promise**

By the end of the curriculum, the learner should be able to:

-   recognize the tile set
-   understand sequences, triplets, kongs, pairs, open melds, and concealed tiles
-   recognize a basic winning hand shape
-   understand how a hand is set up and dealt
-   understand the flow of a turn
-   know when Chow, Pung, Kong, and Win are legal
-   know the basic scoring idea of fan
-   understand the 3-fan minimum
-   understand self-draw vs discard win payments
-   understand rounds, dealer movement, drawn hands, and common table mistakes

----------

# **1. Technical implementation requirements**

## **Recommended stack**

Use the existing project stack if already defined. Otherwise assume:

-   Next.js App Router
-   TypeScript
-   Tailwind CSS
-   shadcn/ui components
-   localStorage for MVP progress persistence
-   optional Supabase progress persistence later
-   no backend required for MVP

## **Primary route**

```txt
/learn
```

## **Section route pattern**

```txt
/learn/[sectionSlug]
```

## **Lesson route pattern**

```txt
/learn/[sectionSlug]/[lessonSlug]
```

## **Example**

```txt
/learn/what-is-hong-kong-mahjong
/learn/what-is-hong-kong-mahjong/welcome-to-the-game
```

----------

# **2. Required page types**

## **2.1 Learn landing page**

Route:

```txt
/learn
```

Purpose:

-   introduce the curriculum
-   show all 7 sections
-   show progress
-   let user continue where they left off

Required components:

-   Hero section
-   “Start learning” CTA
-   “Continue where you left off” CTA if progress exists
-   7-section curriculum map
-   estimated time per section
-   progress rings or completion states
-   final “ready for a real table” outcome card

Hero copy:

```txt
Learn Hong Kong Mahjong interactively

Start with the tiles, then learn how to set up, play, call, win, score, and complete a full round.
```

Section card fields:

-   section number
-   section title
-   short description
-   estimated duration
-   completion state
-   CTA: Start / Continue / Review

----------

## **2.2 Section overview page**

Route example:

```txt
/learn/tiles-melds-winning-hands
```

Purpose:

-   introduce the section
-   list lessons in order
-   show learning goals
-   show section checkpoint

Required components:

-   Section title
-   Section purpose
-   “By the end, you’ll be able to…” bullets
-   ordered lesson list
-   section progress
-   CTA to first incomplete lesson
-   locked/unlocked checkpoint quiz

----------

## **2.3 Lesson page**

Route example:

```txt
/learn/tiles-melds-winning-hands/the-three-suits
```

Each lesson page must follow this structure:

1.  **Concept**
2.  **Visual example**
3.  **Rule in plain English**
4.  **Interactive check**
5.  **Takeaway**

Required components:

-   top progress bar
-   breadcrumb
-   lesson title
-   lesson objective
-   visual lesson body
-   interaction card
-   immediate feedback
-   takeaway card
-   previous / next navigation

Lesson completion:

-   user completes the interactive check
-   then “Continue” becomes active

----------

## **2.4 Section recap page**

Route pattern:

```txt
/learn/[sectionSlug]/recap
```

Purpose:

-   summarize the section
-   reinforce key concepts
-   prepare user for checkpoint

Required components:

-   “You learned…” list
-   key rule cards
-   3–5 visual flashcards
-   CTA to checkpoint quiz

----------

## **2.5 Section checkpoint quiz**

Route pattern:

```txt
/learn/[sectionSlug]/checkpoint
```

Purpose:

-   ensure learner absorbed the section

Requirements:

-   5 questions for shorter sections
-   8 questions for complex sections
-   pass threshold: 80%
-   show explanations after each answer
-   allow retry
-   mark section complete after pass

----------

## **2.6 Final readiness test**

Route:

```txt
/learn/final-readiness-test
```

Purpose:

-   assess whether user is ready to play a real hand

Requirements:

-   20 questions
-   scenario-based
-   covers all 7 sections
-   pass threshold: 85%
-   show “Ready for a real table” completion screen
-   suggest weak areas if failed

----------

# **3. Design system requirements**

## **Visual style**

Use a polished game-learning aesthetic:

-   elegant green table felt background accents
-   cream / ivory cards
-   dark green primary color
-   gold accent
-   rounded cards
-   subtle tile shadows
-   mobile-first

Suggested tokens:

```ts
const theme = {
  colors: {
    background: "#F7F3EA",
    felt: "#0F5A43",
    feltDark: "#083B2E",
    ivory: "#FFFDF7",
    gold: "#C9A24A",
    ink: "#1E1B16",
    muted: "#6F6A5F",
    border: "#E5DDCC",
    success: "#15803D",
    error: "#B91C1C"
  },
  radius: {
    card: "24px",
    button: "999px",
    tile: "10px"
  }
}
```

## **Tile rendering**

Create reusable tile components.

### **`MahjongTile`**

Props:

```ts
type MahjongTileProps = {
  suit: "dots" | "bamboo" | "characters" | "wind" | "dragon" | "back" | "flower";
  value?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  honor?: "east" | "south" | "west" | "north" | "red" | "green" | "white";
  faceDown?: boolean;
  selected?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}
```

### **Tile display approach**

For MVP:

-   use stylized text/emoji/Unicode/labels inside tile cards
-   do not require custom tile image assets
-   make tiles visually consistent and readable

Example labels:

-   Dots: `1 Dot`, `2 Dot`
-   Bamboo: `1 Bam`, `2 Bam`
-   Characters: `1 Char`, `2 Char`
-   Winds: `East`, `South`, `West`, `North`
-   Dragons: `Red`, `Green`, `White`

----------

# **4. Data model**

Create a curriculum data file:

```txt
/src/data/learnCurriculum.ts
```

Recommended structure:

```ts
export type InteractionType =
  | "clickThrough"
  | "cardCarousel"
  | "multipleChoice"
  | "dragSort"
  | "tileClassifier"
  | "handValidator"
  | "tableMap"
  | "sequenceBuilder"
  | "turnOrderSimulator"
  | "callDecision"
  | "priorityQuiz"
  | "paymentSimulator"
  | "fanSelector"
  | "mistakeSpotter"
  | "finalQuiz";

export type Lesson = {
  id: string;
  sectionId: string;
  slug: string;
  title: string;
  shortTitle?: string;
  objective: string;
  estimatedMinutes: number;
  concept: string;
  visualSpec: string;
  plainEnglishRule: string;
  examples: string[];
  interaction: {
    type: InteractionType;
    title: string;
    prompt: string;
    dataKey: string;
  };
  takeaway: string;
};

export type Section = {
  id: string;
  number: number;
  slug: string;
  title: string;
  purpose: string;
  learningGoals: string[];
  estimatedMinutes: number;
  lessons: Lesson[];
  checkpoint: {
    title: string;
    questionCount: number;
    passThreshold: number;
  };
};
```

Progress model:

```ts
type LearnProgress = {
  completedLessons: string[];
  completedSections: string[];
  checkpointScores: Record<string, number>;
  lastVisitedLessonId?: string;
  finalReadinessScore?: number;
}
```

Store in localStorage key:

```txt
hk-mahjong-learn-progress
```

----------

# **5. Interaction component library**

Build these reusable components.

## **5.1**

**`ClickThroughFlow`**

Used for simple step-by-step explanations.

Props:

```ts
steps: {
  title: string;
  description: string;
  visual?: ReactNode;
}[]
```

## **5.2**

**`CardCarousel`**

Used for variants, fan categories, mistakes, etc.

Props:

```ts
cards: {
  title: string;
  description: string;
  tag?: string;
  visual?: ReactNode;
}[]
```

## **5.3**

**`MultipleChoiceCheck`**

Props:

```ts
question: string;
options: {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
}[]
```

## **5.4**

**`DragSortTiles`**

Used for sorting tiles into suits/honors.

Props:

```ts
items: MahjongTile[];
categories: {
  id: string;
  label: string;
  accepts: string[];
}[]
```

## **5.5**

**`TileGroupingClassifier`**

Used for pair / sequence / triplet / kong.

Props:

```ts
groups: {
  id: string;
  tiles: MahjongTile[];
  correctType: "pair" | "sequence" | "triplet" | "kong" | "invalid";
}[]
```

## **5.6**

**`HandShapeValidator`**

Used for “is this a winning hand?”

Props:

```ts
hands: {
  id: string;
  tiles: MahjongTile[];
  isWinningShape: boolean;
  explanation: string;
}[]
```

## **5.7**

**`TableMapInteractive`**

Used for table areas and seating.

Props:

```ts
hotspots: {
  id: string;
  label: string;
  description: string;
  position: { x: number; y: number };
}[]
```

## **5.8**

**`TurnOrderSimulator`**

Used for turn flow and calls.

Props:

```ts
scenario: {
  currentPlayer: "East" | "South" | "West" | "North";
  action: string;
  possibleNextActions: string[];
  correctNextAction: string;
  explanation: string;
}
```

## **5.9**

**`CallDecisionDrill`**

Used for Chow/Pung/Kong/Win legality.

Props:

```ts
scenario: {
  discarder: "left" | "across" | "right";
  discardedTile: MahjongTile;
  playerHand: MahjongTile[];
  legalCalls: ("Chow" | "Pung" | "Kong" | "Win" | "Pass")[];
  explanation: string;
}
```

## **5.10**

**`CallPriorityQuiz`**

Used for priority rules.

Props:

```ts
scenario: {
  discard: MahjongTile;
  claims: {
    player: "East" | "South" | "West" | "North";
    call: "Chow" | "Pung" | "Kong" | "Win";
  }[];
  correctWinner: string;
  explanation: string;
}
```

## **5.11**

**`PaymentSimulator`**

Used for self-draw vs discard win.

Props:

```ts
scenario: {
  winType: "selfDraw" | "discard";
  fan: number;
  discarder?: string;
  payments: {
    player: string;
    amount: number;
  }[];
}
```

## **5.12**

**`FanSelector`**

Used for “which fan apply?”

Props:

```ts
scenario: {
  hand: MahjongTile[];
  context: {
    selfDraw?: boolean;
    seatWind?: string;
    roundWind?: string;
    finalTile?: boolean;
  };
  possibleFan: string[];
  correctFan: string[];
  explanation: string;
}
```

## **5.13**

**`MistakeSpotter`**

Used for fouls/common errors.

Props:

```ts
scenario: {
  description: string;
  visual?: ReactNode;
  options: string[];
  correctMistake: string;
  explanation: string;
}
```

----------

# **6. Full curriculum map**

----------

# **Section 1: What Is Hong Kong Mahjong?**

## **Section metadata**

```ts
{
  id: "section-1",
  number: 1,
  slug: "what-is-hong-kong-mahjong",
  title: "What Is Hong Kong Mahjong?",
  purpose: "Give the learner a clear mental model of the game before introducing technical rules.",
  estimatedMinutes: 12
}
```

## **Learning goals**

By the end of this section, the learner can:

-   explain what Hong Kong Mahjong is
-   understand that HK Mahjong is one ruleset among many
-   describe the objective of a hand
-   describe the broad flow of a hand
-   understand that a full game is made of many hands

----------

## **Lesson 1.1 — Welcome to the Game**

Slug:

```txt
welcome-to-the-game
```

Objective:  
Introduce mahjong as a four-player tile game about building a complete hand before others do.

Content:

-   Mahjong is a four-player tile game.
-   Players draw, discard, and sometimes call tiles.
-   The goal is to complete a legal winning hand.
-   Hong Kong Mahjong is one of several mahjong styles.

Visual:

-   Four-player table.
-   Each player has a hand, wall, and discard area.
-   Center text: “Draw → Discard → Call → Complete a Hand.”

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Tap through the basic life cycle of a mahjong hand.
```

Steps:

1.  Four players sit around the table.
2.  Tiles are shuffled and dealt.
3.  Players draw and discard.
4.  Players may call useful discards.
5.  Someone completes a hand or the wall runs out.

Takeaway:

```txt
Hong Kong Mahjong is a race to complete a legal hand through drawing, discarding, and calling tiles.
```

----------

## **Lesson 1.2 — HK Mahjong vs Other Styles**

Slug:

```txt
hk-mahjong-vs-other-styles
```

Objective:  
Explain that mahjong has many variants and this course teaches Hong Kong Mahjong.

Content:

-   Mahjong is a family of games.
-   Hong Kong Mahjong differs from Riichi, Taiwanese, and other Chinese styles.
-   Rules vary by tile count, scoring, calls, and table conventions.
-   This site focuses on 13-tile Classical Hong Kong Mahjong.

Visual:

-   Carousel cards comparing:
    -   Hong Kong Mahjong
    -   Riichi / Japanese Mahjong
    -   Taiwanese / 16-tile Mahjong
    -   Other Chinese family styles

Interactive component:  
`CardCarousel`

Prompt:

```txt
Swipe through common mahjong styles and notice how this course focuses on Hong Kong Mahjong.
```

Cards:

-   Hong Kong Mahjong: fast, call-friendly, fan-based scoring
-   Riichi: Japanese style with riichi declaration and different scoring
-   Taiwanese: often 16-tile hands
-   Other Chinese styles: regional differences in scoring and allowed hands

Takeaway:

```txt
Mahjong is not one universal ruleset. This course teaches Hong Kong Mahjong specifically.
```

----------

## **Lesson 1.3 — The Objective of a Hand**

Slug:

```txt
objective-of-a-hand
```

Objective:  
Teach the basic goal: complete a legal winning hand.

Content:

-   Your goal is to complete a winning hand.
-   Most winning hands are 4 melds + 1 pair.
-   A hand can end by someone winning or by a draw if the wall runs out.
-   Wins can happen by self-draw or by claiming another player’s discard.

Visual:

-   Winning hand skeleton:
    -   Meld 1
    -   Meld 2
    -   Meld 3
    -   Meld 4
    -   Pair

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
What is the usual shape of a standard winning hand?
```

Options:

-   3 melds + 2 pairs
-   4 melds + 1 pair — correct
-   5 pairs
-   Any 14 tiles with the same suit

Takeaway:

```txt
The standard winning shape is four melds plus one pair.
```

Rule source:  
The translated rulebook states the standard winning hand shape is four melds plus one pair, with Thirteen Orphans as a special winning shape.

----------

## **Lesson 1.4 — The Shape of the Game**

Slug:

```txt
shape-of-the-game
```

Objective:  
Introduce seats, winds, dealer, hands, and rounds.

Content:

-   Four players sit at the table.
-   Seats are East, South, West, and North.
-   East is the dealer.
-   A game is made of many hands.
-   Dealership passes as hands finish.
-   Round winds give structure to the match.

Visual:

-   Table with East, South, West, North.
-   Dealer badge on East.

Interactive component:  
`TableMapInteractive`

Prompt:

```txt
Tap each seat to learn its role.
```

Hotspots:

-   East: dealer, starts the hand
-   South: next seat in order
-   West: across from East
-   North: fourth seat

Takeaway:

```txt
Every hand has a dealer, and every player has a seat wind.
```

----------

## **Lesson 1.5 — How a Hand Flows**

Slug:

```txt
how-a-hand-flows
```

Objective:  
Give a simple end-to-end overview of one hand.

Content:

-   Build the wall.
-   Deal tiles.
-   Players draw and discard.
-   Players can call certain discards.
-   Someone wins or the hand draws.
-   Scoring happens after a win.

Visual:

-   Horizontal timeline:
    -   Setup
    -   Deal
    -   Play
    -   Calls
    -   Win / Draw
    -   Score

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Tap through one complete hand from setup to scoring.
```

Steps:

1.  Shuffle and build the wall.
2.  Open the wall and deal.
3.  East begins.
4.  Players draw and discard.
5.  Players may call.
6.  Someone wins or the wall runs out.
7.  Score the hand.

Takeaway:

```txt
A hand is a repeated cycle of setup, play, win or draw, then scoring.
```

----------

## **Section 1 checkpoint**

Title:

```txt
Checkpoint: Do You Understand the Big Picture?
```

Question count:  
5

Question types:

-   multiple choice
-   sequence ordering
-   table seat identification

Required questions:

1.  What is the goal of a hand?
2.  What is the usual winning shape?
3.  How many players are at a table?
4.  Which seat is dealer?
5.  Put these in order: deal, play, score, setup.

Pass threshold:  
80%

----------

# **Section 2: Tiles, Melds, and Winning Hands**

## **Section metadata**

```ts
{
  id: "section-2",
  number: 2,
  slug: "tiles-melds-winning-hands",
  title: "Tiles, Melds, and Winning Hands",
  purpose: "Teach the learner the building blocks of the game.",
  estimatedMinutes: 25
}
```

## **Learning goals**

By the end, the learner can:

-   recognize suits and honors
-   identify pairs, sequences, triplets, and kongs
-   understand open vs concealed tiles
-   recognize a standard winning hand shape
-   understand that valid shape and scoring pattern are separate ideas

----------

## **Lesson 2.1 — The Tile Set**

Slug:

```txt
the-tile-set
```

Objective:  
Introduce the 136-tile set and the major categories.

Content:

-   HK Mahjong uses a standard 136-tile set.
-   Tiles are divided into suited tiles and honor tiles.
-   Some rules use flower tiles, but this beginner path focuses first on the core 136 tiles.

Visual:

-   Tile grid grouped into:
    -   Suits
    -   Honors
    -   Optional flowers as small note

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
What are the two main categories of core mahjong tiles?
```

Correct answer:

```txt
Suits and honors.
```

Takeaway:

```txt
The core tile set is made of suited tiles and honor tiles.
```

Rule source:  
The translated rulebook describes the 136 tiles as divided into suited tiles and honor tiles.

----------

## **Lesson 2.2 — The Three Suits**

Slug:

```txt
the-three-suits
```

Objective:  
Teach Dots, Bamboos, and Characters.

Content:

-   The three suits are Dots, Bamboos, and Characters.
-   Each suit has numbers 1 through 9.
-   There are four copies of each tile.

Visual:

-   Three rows:
    -   1–9 Dots
    -   1–9 Bamboos
    -   1–9 Characters

Interactive component:  
`DragSortTiles`

Prompt:

```txt
Sort each tile into the correct suit.
```

Categories:

-   Dots
-   Bamboos
-   Characters

Takeaway:

```txt
Suited tiles have both a suit and a number.
```

----------

## **Lesson 2.3 — Honor Tiles**

Slug:

```txt
honor-tiles
```

Objective:  
Teach wind and dragon tiles.

Content:

-   Honor tiles do not have numbers.
-   Winds: East, South, West, North.
-   Dragons: Red, Green, White.
-   There are four copies of each.

Visual:

-   Wind tile row
-   Dragon tile row

Interactive component:  
`DragSortTiles`

Prompt:

```txt
Sort the honor tiles into winds and dragons.
```

Categories:

-   Winds
-   Dragons

Takeaway:

```txt
Honor tiles are winds and dragons.
```

Rule source:  
The translated rulebook lists wind tiles as East, South, West, North, and dragon tiles as Red, Green, and White.

----------

## **Lesson 2.4 — Tile Groupings**

Slug:

```txt
tile-groupings
```

Objective:  
Teach pair, sequence, triplet, and kong.

Content:

-   Pair: two identical tiles.
-   Sequence: three consecutive tiles in the same suit.
-   Triplet: three identical tiles.
-   Kong: four identical tiles declared as a kong.
-   Four identical concealed tiles are not a kong unless declared.

Visual:

-   Four example groups:
    -   Pair
    -   Sequence
    -   Triplet
    -   Kong

Interactive component:  
`TileGroupingClassifier`

Prompt:

```txt
Classify each group as a pair, sequence, triplet, kong, or invalid.
```

Example groups:

-   3 Bamboo + 4 Bamboo + 5 Bamboo = sequence
-   East + East = pair
-   Red + Red + Red = triplet
-   7 Dot + 7 Dot + 7 Dot + 7 Dot = kong
-   2 Dot + 3 Bamboo + 4 Character = invalid

Takeaway:

```txt
Winning hands are built from pairs, sequences, triplets, and kongs.
```

Rule source:  
The translated rulebook defines sequences, triplets, kongs, and pairs in its tile grouping section.

----------

## **Lesson 2.5 — Open vs Concealed**

Slug:

```txt
open-vs-concealed
```

Objective:  
Teach the distinction between concealed hand tiles and exposed melds.

Content:

-   Concealed tiles are private in your hand.
-   Open melds are exposed after calls.
-   Concealed kongs are special: they are declared and placed on the table.
-   Open vs concealed matters for scoring and table clarity.

Visual:

-   Split screen:
    -   concealed hand row
    -   open meld area

Interactive component:  
`TableMapInteractive`

Prompt:

```txt
Tap the concealed hand and open meld area.
```

Hotspots:

-   Concealed hand
-   Open meld area
-   River
-   Wall

Takeaway:

```txt
A called set becomes open and visible to everyone.
```

----------

## **Lesson 2.6 — Standard Winning Shape**

Slug:

```txt
standard-winning-shape
```

Objective:  
Teach 4 melds + 1 pair deeply.

Content:

-   A standard winning hand has 4 melds and 1 pair.
-   Melds can be sequences, triplets, or declared kongs.
-   The pair is often called the eyes.
-   The hand must be structurally valid before scoring matters.

Visual:

-   Several sample hands decomposed into:
    -   Meld
    -   Meld
    -   Meld
    -   Meld
    -   Pair

Interactive component:  
`HandShapeValidator`

Prompt:

```txt
Which of these hands has a valid standard winning shape?
```

Scenarios:

-   valid 4 sequences + pair
-   valid 3 sequences + triplet + pair
-   invalid missing pair
-   invalid group that is not a sequence/triplet

Takeaway:

```txt
A normal winning hand is four melds plus one pair.
```

----------

## **Lesson 2.7 — Special Winning Hand: Thirteen Orphans**

Slug:

```txt
thirteen-orphans
```

Objective:  
Introduce Thirteen Orphans as the main special hand exception.

Content:

-   Thirteen Orphans does not follow the standard 4 melds + 1 pair structure.
-   It uses terminal and honor tiles.
-   It is rare and advanced, but important to know as an exception.

Visual:

-   1 and 9 of each suit
-   East, South, West, North
-   Red, Green, White
-   one duplicate as the pair

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
Why is Thirteen Orphans special?
```

Correct answer:

```txt
It is a legal special winning shape that does not use the usual four melds plus one pair structure.
```

Takeaway:

```txt
Most hands use four melds plus one pair, but Thirteen Orphans is a special exception.
```

----------

## **Lesson 2.8 — Valid Shape vs Scoring Pattern**

Slug:

```txt
valid-shape-vs-scoring-pattern
```

Objective:  
Teach that scoring patterns alone do not create a legal win.

Content:

-   A hand needs a legal winning shape.
-   A scoring pattern, or fan, is not enough by itself.
-   If the shape is invalid, the hand cannot win.
-   Later, scoring determines whether a legal hand has enough fan to declare a win.

Visual:

-   Two-column comparison:
    -   Valid shape + enough fan = can win
    -   Fan-looking tiles but invalid shape = cannot win

Interactive component:  
`HandShapeValidator`

Prompt:

```txt
These hands look valuable. Which ones are actually legal shapes?
```

Takeaway:

```txt
Shape comes first. Scoring comes second.
```

Rule source:  
The translated rulebook explicitly states that meeting scoring pattern conditions alone is not enough if the hand shape is invalid.

----------

## **Section 2 checkpoint**

Question count:  
8

Required question topics:

1.  Identify a suit tile.
2.  Identify a wind.
3.  Identify a dragon.
4.  Classify a sequence.
5.  Classify a triplet.
6.  Classify a kong.
7.  Pick the valid winning hand.
8.  Explain why scoring pattern alone is not enough.

Pass threshold:  
80%

----------

# **Section 3: Setup and Dealing**

## **Section metadata**

```ts
{
  id: "section-3",
  number: 3,
  slug: "setup-and-dealing",
  title: "Setup and Dealing",
  purpose: "Teach the learner how to physically start a hand correctly.",
  estimatedMinutes: 25
}
```

## **Learning goals**

By the end, the learner can:

-   identify East/dealer and seat order
-   explain the wall
-   understand opening the wall
-   distinguish live wall from dead wall
-   understand how tiles are dealt
-   identify table areas

----------

## **Lesson 3.1 — Seating and Seat Winds**

Slug:

```txt
seating-and-seat-winds
```

Objective:  
Teach the four seats and counterclockwise order.

Content:

-   Seats are East, South, West, North.
-   Seat order starts from East.
-   Seat winds change when the deal passes.
-   Seat wind can matter for scoring.

Visual:

-   Four-player table labelled East, South, West, North.
-   Arrow showing counterclockwise order.

Interactive component:  
`TableMapInteractive`

Prompt:

```txt
Place the four winds around the table in order.
```

Takeaway:

```txt
Each player has a seat wind, and East is the dealer.
```

Rule source:  
The translated rulebook states that the four seats are East, South, West, and North in counterclockwise order starting from the dealer.

----------

## **Lesson 3.2 — Dealer and the Meaning of East**

Slug:

```txt
dealer-and-east
```

Objective:  
Explain that East is the dealer and starts the hand.

Content:

-   East is the dealer.
-   The dealer begins the hand.
-   Other players are non-dealers.
-   The deal can pass after a hand ends.

Visual:

-   East seat highlighted with dealer badge.
-   Other seats labeled non-dealer.

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
Which seat is the dealer?
```

Correct answer:

```txt
East.
```

Takeaway:

```txt
East is always the dealer for the current hand.
```

----------

## **Lesson 3.3 — The Wall**

Slug:

```txt
the-wall
```

Objective:  
Teach how the wall is built.

Content:

-   Tiles are shuffled face down.
-   Each player builds a wall in front of them.
-   Tiles are stacked in two-tile stacks.
-   The four walls form the square around the table.

Visual:

-   Animated wall build.
-   Four rows of face-down tile stacks.

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Build the wall step by step.
```

Steps:

1.  Shuffle all tiles face down.
2.  Stack tiles in pairs.
3.  Each player builds a wall.
4.  Push the four walls together.

Takeaway:

```txt
The wall is the face-down supply of tiles used during the hand.
```

----------

## **Lesson 3.4 — Rolling Dice and Opening the Wall**

Slug:

```txt
rolling-dice-opening-wall
```

Objective:  
Teach the wall-opening concept at beginner level.

Content:

-   Dealer rolls dice.
-   Dice determine which wall is opened.
-   The total also determines where the wall is broken.
-   Some stacks are set aside as the dead wall / kong tail.
-   The rest becomes the live wall.

Visual:

-   Dice roll.
-   Highlight selected wall.
-   Break point animation.

Interactive component:  
`TableMapInteractive`

Prompt:

```txt
The dice selected this wall. Tap where the live wall begins.
```

Takeaway:

```txt
The dice decide where the wall opens and where drawing begins.
```

Rule source:  
The translated rulebook describes using dice to select the wall opener and opening number, then separating the dead wall / kong tail from the live wall.

----------

## **Lesson 3.5 — Live Wall vs Dead Wall**

Slug:

```txt
live-wall-vs-dead-wall
```

Objective:  
Teach the difference between normal draw tiles and supplement tiles.

Content:

-   Live wall: normal draws.
-   Dead wall / kong tail: supplement tiles after kongs.
-   Players should not draw from the wrong area.
-   This distinction becomes important when learning kongs.

Visual:

-   Wall split into green “Live Wall” and gold “Dead Wall.”

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
After declaring a kong, where does the supplement tile come from?
```

Correct answer:

```txt
The dead wall / kong tail.
```

Takeaway:

```txt
Normal turns draw from the live wall. Kong supplements come from the dead wall.
```

----------

## **Lesson 3.6 — Dealing the Tiles**

Slug:

```txt
dealing-the-tiles
```

Objective:  
Teach the basic dealing flow.

Content:

-   After opening the wall, dealing begins.
-   East takes first.
-   Players take tiles in order.
-   Continue until everyone has the required starting hand.
-   East begins with the extra starting tile and discards first.
-   Mention flower replacement only as optional/advanced.

Visual:

-   Dealing animation from live wall to each player.

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Tap through the dealing sequence.
```

Steps:

1.  East takes first.
2.  South takes next.
3.  West takes next.
4.  North takes next.
5.  Repeat until hands are dealt.
6.  East starts the hand.

Takeaway:

```txt
Dealing starts with East and proceeds around the table.
```

----------

## **Lesson 3.7 — Table Areas**

Slug:

```txt
table-areas
```

Objective:  
Teach where tiles belong during play.

Content:

-   Wall: face-down supply.
-   River / discard pool: face-up discarded tiles.
-   Concealed hand: private hand tiles.
-   Open meld area: called melds and declared kongs.

Visual:

-   Top-down table map with labeled hotspots.

Interactive component:  
`TableMapInteractive`

Prompt:

```txt
Tap each area of the table to learn what belongs there.
```

Hotspots:

-   Wall
-   River
-   Concealed hand
-   Open meld area

Takeaway:

```txt
Knowing the table areas helps you follow the game and avoid mistakes.
```

Rule source:  
The translated rulebook defines the wall, river/discard pool, concealed hand, and open tiles/exposed melds area.

----------

## **Lesson 3.8 — Common Setup Mistakes**

Slug:

```txt
common-setup-mistakes
```

Objective:  
Help beginners avoid setup errors without diving too deeply into penalties.

Content:

-   Wrong dealer.
-   Wrong tile count.
-   Looking too early before deal is confirmed.
-   Pulling from the wrong part of the wall.
-   Mixing up live wall and dead wall.

Visual:

-   Mistake cards.

Interactive component:  
`MistakeSpotter`

Prompt:

```txt
Spot the setup mistake.
```

Scenarios:

1.  South starts dealing instead of East.
2.  A player looks at tiles before the deal is confirmed.
3.  A player draws from the dead wall on a normal turn.
4.  A player has too many tiles after the deal.

Takeaway:

```txt
Most setup mistakes come from wrong dealer, wrong count, or wrong wall area.
```

----------

## **Section 3 checkpoint**

Question count:  
8

Required topics:

1.  Identify East/dealer.
2.  Seat order.
3.  What is the wall?
4.  What does dice opening determine?
5.  Identify live wall.
6.  Identify dead wall.
7.  Who deals first?
8.  Identify table areas.

Pass threshold:  
80%

----------

# **Section 4: Turn Flow and Discarding**

## **Section metadata**

```ts
{
  id: "section-4",
  number: 4,
  slug: "turn-flow-and-discarding",
  title: "Turn Flow and Discarding",
  purpose: "Teach the rhythm of actual gameplay turn by turn.",
  estimatedMinutes: 22
}
```

## **Learning goals**

By the end, the learner can:

-   describe a turn
-   understand draw → arrange → discard → call window
-   know what happens after a discard
-   understand when normal turn order is interrupted
-   know how a hand ends

----------

## **Lesson 4.1 — The Dealer Starts**

Slug:

```txt
dealer-starts
```

Objective:  
Teach that East begins the play phase.

Content:

-   After dealing is complete, East begins.
-   Beginner simplification: East starts by discarding first.
-   Then if no one calls, play passes to the player on East’s right.

Visual:

-   East highlighted.
-   Arrow moving to next player.

Interactive component:  
`TurnOrderSimulator`

Prompt:

```txt
East discards and nobody calls. Who acts next?
```

Correct:

```txt
The player on East’s right.
```

Takeaway:

```txt
East starts the hand, then play continues around the table unless interrupted.
```

Rule source:  
The translated rulebook states that after dealing, East draws and discards first, and if no one calls, the turn passes to the player on East’s right.

----------

## **Lesson 4.2 — Anatomy of a Turn**

Slug:

```txt
anatomy-of-a-turn
```

Objective:  
Teach the four stages of a turn.

Content:  
A turn consists of:

1.  Draw stage
2.  Arrangement stage
3.  Discard stage
4.  Call stage

Visual:

-   Four-stage vertical timeline.

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Tap through the four stages of a turn.
```

Steps:

1.  Draw a tile from the live wall.
2.  Decide whether to win, kong, or continue.
3.  Discard one tile.
4.  Other players may call.

Takeaway:

```txt
Every normal turn follows draw, arrange, discard, then call window.
```

Rule source:  
The translated rulebook breaks a turn into draw stage, arrangement stage, discard stage, and call stage.

----------

## **Lesson 4.3 — Drawing a Tile**

Slug:

```txt
drawing-a-tile
```

Objective:  
Teach correct drawing behavior.

Content:

-   Draw from the live wall.
-   Draw only on your turn.
-   Do not draw early.
-   Wait until the previous discard is clearly placed and released.

Visual:

-   Player reaches for live wall after discard is visible.

Interactive component:  
`MistakeSpotter`

Prompt:

```txt
What is wrong in this situation?
```

Scenario:

```txt
A player reaches to draw before the previous player has discarded.
```

Correct:

```txt
They are drawing too early.
```

Takeaway:

```txt
Wait for the previous discard before drawing.
```

----------

## **Lesson 4.4 — Arranging Your Hand**

Slug:

```txt
arranging-your-hand
```

Objective:  
Teach the decision stage after drawing.

Content:

-   After drawing, choose what to do.
-   You may:
    -   declare self-draw if you have won
    -   declare kong if applicable
    -   choose a discard
-   This is the thinking moment of your turn.

Visual:

-   Drawn tile added beside hand.
-   Choices appear as buttons:
    -   Win?
    -   Kong?
    -   Discard?

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
You draw a tile that completes your hand. What can you declare?
```

Correct:

```txt
Self-draw.
```

Takeaway:

```txt
The arrangement stage is where you decide whether to win, kong, or discard.
```

----------

## **Lesson 4.5 — Discarding**

Slug:

```txt
discarding
```

Objective:  
Teach how discards work.

Content:

-   Choose one tile to discard.
-   Place it clearly face up in the river.
-   Once a tile clearly enters the river, it cannot be taken back into your concealed hand.
-   Discards should be visible and orderly.

Visual:

-   Tile moves from hand into river.

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Place the tile into the river.
```

Interaction:

-   User selects one tile from a mock hand.
-   User taps/clicks discard area.
-   Feedback confirms discard.

Takeaway:

```txt
A discard must be clear, face up, and visible to everyone.
```

Rule source:  
The translated rulebook states a tile may be called only after it is clearly discarded into the river, and once clearly in the river it may not be taken back into the concealed hand.

----------

## **Lesson 4.6 — The Call Window**

Slug:

```txt
the-call-window
```

Objective:  
Teach that other players may react after a discard.

Content:

-   After a discard, opponents may call.
-   If no one calls, the next player draws.
-   Once the next player touches the live wall, that player has passed on calling.
-   Other players may still retain call rights briefly depending on the situation.

Visual:

-   Discard appears.
-   Three opponents get reaction buttons:
    -   Call
    -   Pass

Interactive component:  
`TurnOrderSimulator`

Prompt:

```txt
A tile is discarded. Nobody calls. What happens next?
```

Correct:

```txt
The next player draws from the live wall.
```

Takeaway:

```txt
After every discard, there is a brief chance for opponents to call.
```

----------

## **Lesson 4.7 — Turn Order Around the Table**

Slug:

```txt
turn-order-around-the-table
```

Objective:  
Teach normal turn order and how calls interrupt it.

Content:

-   Normal play proceeds around the table.
-   Calls can interrupt normal order.
-   A caller skips their draw and goes directly to discard after exposing the meld.

Visual:

-   Circular table with animated turn arrow.
-   Then call interruption jumps to caller.

Interactive component:  
`TurnOrderSimulator`

Prompt:

```txt
South discards. West calls Pung. Who discards next?
```

Correct:

```txt
West discards next.
```

Takeaway:

```txt
Calls interrupt turn order and move play to the caller.
```

Rule source:  
The translated rulebook states that when a call is made, play goes directly to the caller’s discard stage.

----------

## **Lesson 4.8 — What Ends a Hand**

Slug:

```txt
what-ends-a-hand
```

Objective:  
Teach the two basic endings: win or draw.

Content:

-   A hand ends when someone wins.
-   A hand also ends if the wall runs out and no one wins.
-   After a win, settlement/scoring happens.
-   After a draw, the next hand begins according to round rules.

Visual:

-   Branch diagram:
    -   Someone wins → scoring
    -   Wall runs out → draw

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
Which two events can end a hand?
```

Correct:

```txt
A player wins, or the wall runs out with no winner.
```

Takeaway:

```txt
Every hand ends in either a win or a draw.
```

----------

## **Section 4 checkpoint**

Question count:  
8

Required topics:

1.  Who starts?
2.  Four stages of a turn.
3.  Where to draw from.
4.  When not to draw.
5.  Where to discard.
6.  What happens after discard.
7.  How calls interrupt turn order.
8.  How a hand ends.

Pass threshold:  
80%

----------

# **Section 5: Calls — Chow, Pung, Kong, and Win**

## **Section metadata**

```ts
{
  id: "section-5",
  number: 5,
  slug: "calls-chow-pung-kong-win",
  title: "Calls: Chow, Pung, Kong, and Win",
  purpose: "Teach the most important interactive decisions during live play.",
  estimatedMinutes: 35
}
```

## **Learning goals**

By the end, the learner can:

-   explain what a call is
-   know when Chow is legal
-   know when Pung is legal
-   distinguish the three types of Kong
-   understand supplement tiles
-   distinguish self-draw and win on discard
-   understand robbing a kong
-   state call priority
-   understand how calls change turn flow

----------

## **Lesson 5.1 — What Is a Call?**

Slug:

```txt
what-is-a-call
```

Objective:  
Introduce calls as reactions to the most recent discard.

Content:

-   A call means taking another player’s most recent discard.
-   Calls can complete a set or win.
-   The main calls are:
    -   Chow
    -   Pung
    -   Kong
    -   Win
-   Calls must be spoken clearly.

Visual:

-   Discard in river.
-   Opponents have call buttons.

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
Which tile can you call?
```

Correct:

```txt
Only the most recently discarded tile.
```

Takeaway:

```txt
A call is a clear declaration to take the latest discard.
```

Rule source:  
The translated rulebook states that only the most recently discarded tile can be called and that calls include win on discard, Chow, Pung, and big exposed kong.

----------

## **Lesson 5.2 — Chow**

Slug:

```txt
chow
```

Objective:  
Teach when Chow is legal.

Content:

-   Chow uses a discard to complete a sequence.
-   You may Chow only from the player on your left.
-   The completed sequence becomes open.
-   After Chow, you discard.
-   Chow has lowest call priority.

Visual:

-   Player on left discards 5 Bamboo.
-   Learner has 3 Bamboo and 4 Bamboo, or 4 Bamboo and 6 Bamboo.

Interactive component:  
`CallDecisionDrill`

Prompt:

```txt
Can you Chow this discard?
```

Scenarios:

1.  Left player discards 5 Bamboo; learner has 3/4 Bamboo = legal Chow.
2.  Across player discards 5 Bamboo; learner has 4/6 Bamboo = cannot Chow because not from left.
3.  Left player discards East; learner has South/West = cannot Chow honors.

Takeaway:

```txt
Chow completes a sequence, but only from the player on your left.
```

Rule source:  
The translated rulebook states Chow is allowed only on the discard of the player on your left.

----------

## **Lesson 5.3 — Pung**

Slug:

```txt
pung
```

Objective:  
Teach when Pung is legal.

Content:

-   Pung uses a discard to complete a triplet.
-   You need two matching tiles in your hand.
-   You may Pung from any player’s discard.
-   The triplet becomes open.
-   After Pung, you discard.

Visual:

-   Opponent discards Red Dragon.
-   Learner has two Red Dragons.

Interactive component:  
`CallDecisionDrill`

Prompt:

```txt
Can you Pung this discard?
```

Scenarios:

1.  Any player discards East; learner has East/East = legal.
2.  Any player discards 7 Dot; learner has only one 7 Dot = not legal.
3.  Any player discards Red; learner has Red/Red = legal.

Takeaway:

```txt
Pung completes a triplet and can be called from any player.
```

Rule source:  
The translated rulebook states that if another player discards a tile identical to a pair in your hand, you may call Pung to form an open triplet.

----------

## **Lesson 5.4 — Concealed Kong**

Slug:

```txt
concealed-kong
```

Objective:  
Teach the first type of kong.

Content:

-   A concealed kong uses four identical tiles in your concealed hand.
-   You declare it on your own turn.
-   You expose/declare the kong.
-   Then you draw a supplement tile from the dead wall.

Visual:

-   Learner has four 8 Dots concealed.
-   They declare Kong.

Interactive component:  
`TileGroupingClassifier`

Prompt:

```txt
Which group can be declared as a concealed kong?
```

Correct:

```txt
Four identical concealed tiles.
```

Takeaway:

```txt
A concealed kong starts from four identical tiles in your own hand.
```

----------

## **Lesson 5.5 — Added Kong**

Slug:

```txt
added-kong
```

Objective:  
Teach upgrading an open triplet into a kong.

Content:

-   You already have an open triplet.
-   You draw or hold the fourth matching tile.
-   On your turn, you add it to the triplet and declare Kong.
-   Then draw a supplement tile.

Visual:

-   Open triplet: 5 Characters.
-   Concealed hand includes fourth 5 Character.
-   Tile moves to open meld.

Interactive component:  
`CallDecisionDrill`

Prompt:

```txt
Can this player declare an added kong?
```

Scenarios:

1.  Open triplet + matching concealed tile = yes.
2.  Open sequence + matching tile = no.
3.  Open triplet but already discarded matching tile = no.

Takeaway:

```txt
An added kong upgrades your existing open triplet with the fourth tile.
```

----------

## **Lesson 5.6 — Big Exposed Kong**

Slug:

```txt
big-exposed-kong
```

Objective:  
Teach calling a discard to make a kong from a concealed triplet.

Content:

-   You have a concealed triplet.
-   Another player discards the fourth matching tile.
-   You call Kong.
-   The kong becomes open.
-   Then you draw a supplement tile.

Visual:

-   Learner has 9 Bamboo x3.
-   Opponent discards 9 Bamboo.
-   Learner calls Kong.

Interactive component:  
`CallDecisionDrill`

Prompt:

```txt
Can you call Kong on this discard?
```

Correct scenario:

-   Learner has three identical concealed tiles and another player discards the fourth.

Takeaway:

```txt
A big exposed kong uses another player’s discard to complete four of a kind.
```

Rule source:  
The translated rulebook defines concealed kong, added kong, and big exposed kong.

----------

## **Lesson 5.7 — Supplement Tile After a Kong**

Slug:

```txt
supplement-tile-after-kong
```

Objective:  
Connect kong declaration to the dead wall.

Content:

-   A kong uses four tiles but counts as one set.
-   After declaring kong, draw one supplement tile.
-   The supplement tile comes from the dead wall / kong tail.
-   You must expose the kong before drawing the supplement.

Visual:

-   Kong shown in open meld area.
-   Dead wall highlighted.
-   Supplement tile drawn.

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
What must happen before drawing a kong supplement tile?
```

Correct:

```txt
The kong must be clearly exposed and confirmed.
```

Takeaway:

```txt
Declare and expose the kong first, then draw the supplement tile from the dead wall.
```

Rule source:  
The translated rulebook states that after declaring a kong, the player draws a supplement tile from the dead wall and must expose the kong before drawing it.

----------

## **Lesson 5.8 — Self-Draw Win**

Slug:

```txt
self-draw-win
```

Objective:  
Teach winning by drawing your own winning tile.

Content:

-   If you draw the tile that completes your hand, you may declare self-draw.
-   This happens on your own turn.
-   You expose your hand for verification.
-   Self-draw affects payment later.

Visual:

-   Learner draws final tile.
-   Hand completes.
-   “Self-Draw” badge.

Interactive component:  
`HandShapeValidator`

Prompt:

```txt
You drew this tile. Does it complete your hand?
```

Takeaway:

```txt
Self-draw means you draw your own winning tile.
```

----------

## **Lesson 5.9 — Win on Discard**

Slug:

```txt
win-on-discard
```

Objective:  
Teach winning from another player’s discard.

Content:

-   If another player discards your winning tile, you may call Win.
-   The discarder is said to have dealt in.
-   This happens during the call stage.
-   The full hand must be exposed for verification.

Visual:

-   Opponent discards tile.
-   Learner’s hand completes.
-   “Win” call appears.

Interactive component:  
`CallDecisionDrill`

Prompt:

```txt
Can you win on this discard?
```

Scenarios:

-   discard completes valid hand
-   discard does not complete valid hand
-   discard completes shape but insufficient fan, preview for later

Takeaway:

```txt
Win on discard means another player throws the tile that completes your hand.
```

Rule source:  
The translated rulebook defines self-draw and win on discard in the Winning section.

----------

## **Lesson 5.10 — Robbing a Kong**

Slug:

```txt
robbing-a-kong
```

Objective:  
Teach the special case of winning on an added kong.

Content:

-   If an opponent makes an added kong using your winning tile, you may call Win.
-   This is called robbing a kong.
-   Usually only added kongs can be robbed.
-   Thirteen Orphans has a special exception for concealed kong.

Visual:

-   Opponent adds fourth tile to open triplet.
-   Learner wins on that tile.

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Watch how robbing a kong works.
```

Steps:

1.  Opponent has an open triplet.
2.  Opponent adds the fourth tile.
3.  That tile is your winning tile.
4.  You immediately call Win.
5.  The kong is robbed.

Takeaway:

```txt
Robbing a kong lets you win on the tile another player uses for an added kong.
```

Rule source:  
The translated rulebook explains that if an opponent makes an added kong using the tile you are waiting on, you may call win and take that tile.

----------

## **Lesson 5.11 — Call Priority**

Slug:

```txt
call-priority
```

Objective:  
Teach the priority order between competing calls.

Content:  
Priority from highest to lowest:

1.  Win
2.  Pung or Kong
3.  Chow

Visual:

-   Priority ladder.

Interactive component:  
`CallPriorityQuiz`

Prompt:

```txt
Multiple players want the same discard. Who gets it?
```

Scenarios:

1.  One player Chows, another Pungs → Pung wins.
2.  One player Pungs, another Wins → Win wins.
3.  One player Chows, another Wins → Win wins.
4.  Two players Win → simultaneous wins allowed.

Takeaway:

```txt
Call priority is Win > Pung/Kong > Chow.
```

Rule source:  
The translated rulebook states the priority order as win > Pung or Kong > Chow.

----------

## **Lesson 5.12 — How Calls Change Turn Flow**

Slug:

```txt
how-calls-change-turn-flow
```

Objective:  
Teach what happens after a call.

Content:

-   A caller skips the normal draw stage.
-   The called meld is exposed.
-   The caller discards.
-   Play continues from the caller.

Visual:

-   Normal turn arrow interrupted by call jump.

Interactive component:  
`TurnOrderSimulator`

Prompt:

```txt
North discards. South calls Pung. What happens next?
```

Correct:

```txt
South exposes the triplet and discards.
```

Takeaway:

```txt
After a call, the caller exposes the set and discards immediately.
```

----------

## **Lesson 5.13 — Open Meld Placement**

Slug:

```txt
open-meld-placement
```

Objective:  
Teach where called melds are placed.

Content:

-   Called sets go in the open meld area.
-   Open melds should be visible.
-   They should be arranged in call order.
-   Concealed kongs are also placed in this area.

Visual:

-   Table with open meld area highlighted.

Interactive component:  
`TableMapInteractive`

Prompt:

```txt
Tap where this called Pung should be placed.
```

Correct:

```txt
Open meld area.
```

Takeaway:

```txt
Called melds must be exposed clearly in the open meld area.
```

Rule source:  
The translated rulebook states that open melds and concealed kongs must be placed in the open-meld area and arranged in the order called.

----------

## **Lesson 5.14 — Beginner Call Decisions**

Slug:

```txt
beginner-call-decisions
```

Objective:  
Give basic, non-strategy-heavy decision guidance.

Content:

-   First learn if a call is legal.
-   Legal does not always mean good.
-   Ask:
    1.  Can I call?
    2.  What set does it make?
    3.  Does it expose my hand?
    4.  Whose turn comes next?
-   Strategy comes later.

Visual:

-   Decision tree.

Interactive component:  
`CallDecisionDrill`

Prompt:

```txt
For each discard, choose: Chow, Pung, Kong, Win, or Pass.
```

Takeaway:

```txt
Before thinking strategy, learn call legality and turn consequences.
```

----------

## **Section 5 checkpoint**

Question count:  
10

Required topics:

1.  Define a call.
2.  Chow legality.
3.  Pung legality.
4.  Concealed kong.
5.  Added kong.
6.  Big exposed kong.
7.  Supplement tile source.
8.  Self-draw vs win on discard.
9.  Robbing a kong.
10.  Call priority.

Pass threshold:  
80%

----------

# **Section 6: Scoring and Fan**

## **Section metadata**

```ts
{
  id: "section-6",
  number: 6,
  slug: "scoring-and-fan",
  title: "Scoring and Fan",
  purpose: "Teach what makes a winning hand score and how payment works.",
  estimatedMinutes: 35
}
```

## **Learning goals**

By the end, the learner can:

-   explain fan
-   understand 3-fan minimum
-   identify common scoring patterns
-   understand self-draw vs discard payment
-   understand the 10-fan cap
-   read the points table
-   present a winning hand for scoring

----------

## **Lesson 6.1 — What Makes a Hand Winnable**

Slug:

```txt
what-makes-a-hand-winnable
```

Objective:  
Teach that winning requires both valid shape and enough fan.

Content:

-   A hand must have a valid winning shape.
-   It must also meet the minimum fan requirement.
-   In this ruleset, a hand must have at least 3 fan.
-   You must declare the win at the correct time.

Visual:

-   Checklist:
    -   valid shape
    -   3+ fan
    -   correct declaration

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
Which hand can legally win?
```

Options:

-   Valid shape, 1 fan
-   Invalid shape, 5 fan-looking pattern
-   Valid shape, 3 fan — correct
-   Random 14 tiles

Takeaway:

```txt
To win, you need a valid shape and at least 3 fan.
```

Rule source:  
The translated rulebook states that the minimum winning threshold is 3 fan.

----------

## **Lesson 6.2 — What Is Fan?**

Slug:

```txt
what-is-fan
```

Objective:  
Introduce fan as the scoring unit.

Content:

-   Fan is the scoring value of patterns in your hand.
-   Different patterns are worth different fan.
-   Multiple fan patterns usually add together.
-   The hand is scored using the highest valid interpretation.

Visual:

-   Fan badges:
    -   1 fan
    -   3 fan
    -   5 fan
    -   7 fan
    -   10 fan limit

Interactive component:  
`CardCarousel`

Prompt:

```txt
Swipe through examples of fan values.
```

Takeaway:

```txt
Fan measures how valuable your winning hand is.
```

----------

## **Lesson 6.3 — Basic Scoring Principles**

Slug:

```txt
basic-scoring-principles
```

Objective:  
Teach the core scoring rules.

Content:

-   Only a winning hand scores.
-   Fan patterns generally add together.
-   Minimum is 3 fan.
-   Maximum is 10 fan.
-   Limit hands count as 10 fan.

Visual:

-   Rules card stack.

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
What is the maximum fan counted in this ruleset?
```

Correct:

```txt
10 fan.
```

Takeaway:

```txt
Only the winner scores, patterns add, and 10 fan is the cap.
```

Rule source:  
The translated rulebook states that only a winning hand scores, fan patterns generally add, and 10 fan is the cap.

----------

## **Lesson 6.4 — Payment Basics**

Slug:

```txt
payment-basics
```

Objective:  
Teach discard payment vs self-draw payment.

Content:

-   Win on discard: discarder pays the full amount.
-   Self-draw: all three opponents pay.
-   This is separate from calculating fan.

Visual:

-   Scenario A: one discarder pays.
-   Scenario B: three opponents pay.

Interactive component:  
`PaymentSimulator`

Prompt:

```txt
Choose who pays in each scenario.
```

Scenarios:

1.  You win on East’s discard → East pays.
2.  You self-draw → all three opponents pay.

Takeaway:

```txt
Discard wins are paid by the discarder. Self-draw wins are paid by all three opponents.
```

Rule source:  
The translated rulebook describes full payment on discard and self-draw payment structure.

----------

## **Lesson 6.5 — Package Payment**

Slug:

```txt
package-payment
```

Objective:  
Introduce package payment in a beginner-friendly way.

Content:

-   Package payment is a liability rule for dangerous exposed hands.
-   It makes one player pay for everyone in certain situations.
-   Two key examples:
    -   12 open tiles
    -   Big Three Dragons
-   Teach lightly; avoid overcomplication.

Visual:

-   Dangerous hand warning card.
-   One liable player highlighted.

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
In package payment, who pays?
```

Correct:

```txt
The liable player pays the amount that would otherwise be paid by all three opponents on a self-draw.
```

Takeaway:

```txt
Package payment punishes the player who enables certain dangerous exposed hands.
```

Rule source:  
The translated rulebook defines package payment, including 12-open-tiles and Big Three Dragons package payment.

----------

## **Lesson 6.6 — Beginner Fan**

Slug:

```txt
beginner-fan
```

Objective:  
Teach the most beginner-friendly fan.

Content:  
Tier A fan:

-   Self-Draw
-   Concealed Hand
-   All Sequences
-   Dragon Pung
-   Wind Pung
-   Under the Sea
-   Robbing a Kong
-   Kong-on-Self-Draw

Visual:

-   Fan cards with tile examples.

Interactive component:  
`FanSelector`

Prompt:

```txt
Which fan apply to this hand?
```

Scenarios:

1.  Self-drawn winning hand → Self-Draw.
2.  Triplet of Red Dragons → Dragon Pung.
3.  Triplet of seat wind → Wind Pung.
4.  Four sequences → All Sequences.

Takeaway:

```txt
Start by learning the common 1-fan patterns you’ll see often.
```

Rule source:  
The translated rulebook lists these as 1-fan patterns.

----------

## **Lesson 6.7 — Intermediate Fan**

Slug:

```txt
intermediate-fan
```

Objective:  
Teach common mid-level patterns.

Content:

-   Half Flush
-   All Triplets
-   Little Three Dragons
-   Big Three Dragons
-   Full Flush

Visual:

-   Pattern comparison:
    -   one suit + honors
    -   all triplets
    -   dragon examples
    -   one suit only

Interactive component:  
`FanSelector`

Prompt:

```txt
Select the scoring pattern shown by this hand.
```

Takeaway:

```txt
Intermediate fan often come from suit concentration, triplets, or dragon patterns.
```

Rule source:  
The translated rulebook lists Half Flush, All Triplets, Little Three Dragons, Big Three Dragons, and Full Flush in the fan list.

----------

## **Lesson 6.8 — Limit Hands**

Slug:

```txt
limit-hands
```

Objective:  
Introduce 10-fan limit hands as memorable rare hands.

Content:  
Limit hands:

-   All Honors
-   Little Four Winds
-   Big Four Winds
-   Four Concealed Triplets
-   Eighteen Arhats
-   Pure Terminals
-   Heavenly Hand
-   Earthly Hand
-   Thirteen Orphans
-   Kong-on-Kong Self-Draw
-   Nine Gates

Visual:

-   Gallery of rare hand cards.

Interactive component:  
`CardCarousel`

Prompt:

```txt
Swipe through the rare 10-fan limit hands.
```

Takeaway:

```txt
Limit hands are rare, memorable hands that count as 10 fan.
```

Rule source:  
The translated rulebook lists these as limit hands counted as 10 fan.

----------

## **Lesson 6.9 — Points Conversion Table**

Slug:

```txt
points-conversion-table
```

Objective:  
Teach how fan converts to points.

  

Content:  
Use this table:

**Fan**

**Total Points**

**Self-Draw Payment**

3

32

16 × 3

4

64

32 × 3

5

96

48 × 3

6

128

64 × 3

7

192

96 × 3

8

256

128 × 3

9

384

192 × 3

10

512

256 × 3

Visual:

-   Interactive table.
-   Fan selector slider from 3 to 10.

Interactive component:  
`PaymentSimulator`

Prompt:

```txt
Choose a fan value and see how the payment changes.
```

Takeaway:

```txt
Once fan is known, the points table tells you the payment.
```

Rule source:  
The translated rulebook includes the points conversion table from 3 fan to 10 fan.

----------

## **Lesson 6.10 — Presenting a Winning Hand**

Slug:

```txt
presenting-a-winning-hand
```

Objective:  
Teach how to arrange tiles after a win.

Content:

-   After winning, expose the full hand.
-   Arrange four melds and pair clearly.
-   For Thirteen Orphans, arrange terminal and honor tiles clearly.
-   For self-draw, place the winning tile sideways beside the hand.
-   Do not disturb tiles before verification.

Visual:

-   Correctly arranged winning hand.
-   Incorrect messy hand.

Interactive component:  
`HandShapeValidator`

Prompt:

```txt
Arrange this winning hand into clear melds and a pair.
```

Takeaway:

```txt
A winning hand should be displayed clearly so everyone can verify and score it.
```

Rule source:  
The translated rulebook explains how the winner should arrange tiles for verification after winning.

----------

## **Section 6 checkpoint**

Question count:  
10

Required topics:

1.  3-fan minimum.
2.  Meaning of fan.
3.  10-fan cap.
4.  Who pays on discard win.
5.  Who pays on self-draw.
6.  Package payment concept.
7.  Identify simple fan.
8.  Identify intermediate fan.
9.  Recognize a limit hand.
10.  Read points table.

Pass threshold:  
80%

----------

# **Section 7: Rounds, Draws, and Table Rules**

## **Section metadata**

```ts
{
  id: "section-7",
  number: 7,
  slug: "rounds-draws-table-rules",
  title: "Rounds, Draws, and Table Rules",
  purpose: "Teach how a full game session works and prepare the learner for real table play.",
  estimatedMinutes: 25
}
```

## **Learning goals**

By the end, the learner can:

-   explain what happens after a hand ends
-   understand drawn hands
-   understand deal passing
-   understand wind cycles and rounds
-   identify common beginner fouls
-   know basic table etiquette
-   assess whether they are ready for a real table

----------

## **Lesson 7.1 — What Happens After a Hand Ends**

Slug:

```txt
what-happens-after-a-hand-ends
```

Objective:  
Teach the post-hand flow.

Content:

-   If someone wins, scoring happens.
-   If no one wins before the wall is exhausted, the hand is a draw.
-   After settlement, the next hand begins.
-   Dealer movement depends on the result.

Visual:

-   End-of-hand flowchart.

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Tap through what happens after a hand ends.
```

Steps:

1.  Hand ends by win or draw.
2.  If win, score the hand.
3.  Confirm settlement.
4.  Determine next dealer.
5.  Start next hand.

Takeaway:

```txt
Every hand ends with settlement, then the table prepares for the next hand.
```

----------

## **Lesson 7.2 — Drawn Hands**

Slug:

```txt
drawn-hands
```

Objective:  
Teach what a draw is.

Content:

-   A hand is drawn if the final live-wall tile is drawn and discarded with no win.
-   No one wins the hand.
-   In these tournament rules, dealer does not continue on a draw.
-   Other home/social variants may differ.

Visual:

-   Live wall reaches zero.
-   “Drawn Hand” badge.

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
When is a hand drawn?
```

Correct:

```txt
When the live wall runs out and no one wins.
```

Takeaway:

```txt
A drawn hand means the wall ran out before anyone won.
```

Rule source:  
The translated rulebook states that if the final live-wall tile is drawn and discarded with no win, the hand is a draw, and under these tournament rules the dealer does not continue.

----------

## **Lesson 7.3 — Passing the Deal**

Slug:

```txt
passing-the-deal
```

Objective:  
Teach dealer movement.

Content:

-   East is the dealer.
-   If East wins, East may remain dealer.
-   Otherwise, the deal passes.
-   The previous South becomes the next dealer.
-   Dealer rotation gives everyone a chance to be East.

Visual:

-   Dealer badge moves around table.

Interactive component:  
`TurnOrderSimulator`

Prompt:

```txt
East does not win the hand. Who becomes the next dealer?
```

Correct:

```txt
The previous South becomes East.
```

Takeaway:

```txt
The deal usually passes forward unless East wins or specific continuation rules apply.
```

Rule source:  
The translated rulebook describes passing the deal and states that otherwise the previous South becomes the next dealer.

----------

## **Lesson 7.4 — Wind Cycles and Rounds**

Slug:

```txt
wind-cycles-and-rounds
```

Objective:  
Teach full-game structure.

Content:

-   Each player gets a chance to be dealer in a wind cycle.
-   After the dealership has passed four times and the original dealer becomes dealer again, one wind round has been completed.
-   Round winds progress: East round, South round, etc.
-   Round wind and seat wind can both matter for scoring.

Visual:

-   Four dealer positions complete one cycle.
-   Round wind badge changes from East to South.

Interactive component:  
`ClickThroughFlow`

Prompt:

```txt
Follow the dealer badge through one wind cycle.
```

Takeaway:

```txt
Wind cycles and round winds give structure to the full game.
```

Rule source:  
The translated rulebook explains wind cycles and round winds.

----------

## **Lesson 7.5 — End of a Round**

Slug:

```txt
end-of-a-round
```

Objective:  
Explain round ending at a beginner level.

Content:

-   A round has a defined endpoint.
-   In the tournament rulebook, one round consists of four complete wind cycles.
-   There may also be time and hand-count limits.
-   Scores are verified at the end.

Visual:

-   Round progress tracker.

Interactive component:  
`MultipleChoiceCheck`

Prompt:

```txt
What should players do at the end of a formal round?
```

Correct:

```txt
Verify the scores before ending the round.
```

Takeaway:

```txt
A full round has a structure, endpoint, and final score confirmation.
```

Rule source:  
The translated rulebook defines end-of-round conditions and score verification requirements.

----------

## **Lesson 7.6 — Dead Hands and Common Errors**

Slug:

```txt
dead-hands-and-common-errors
```

Objective:  
Teach practical mistakes to avoid.

Content:  
Beginner mistakes:

-   wrong number of tiles
-   drawing too early
-   discard before draw
-   drawing from the wrong wall
-   invalid call
-   exposing too many tiles
-   false win

Explain:

-   A dead hand means you lose the right to win that hand.
-   Too few tiles = small dead hand.
-   Too many tiles = major dead hand.

Visual:

-   “Avoid these mistakes” card grid.

Interactive component:  
`MistakeSpotter`

Prompt:

```txt
Spot the mistake in each scenario.
```

Scenarios:

1.  Player has too many tiles.
2.  Player draws before prior discard.
3.  Player calls Chow from the wrong player.
4.  Player declares win with invalid shape.

Takeaway:

```txt
Most beginner fouls come from wrong tile count, wrong timing, or invalid calls.
```

Rule source:  
The translated rulebook explains dead hand / xianggong and common drawing/play fouls.

----------

## **Lesson 7.7 — Table Etiquette**

Slug:

```txt
table-etiquette
```

Objective:  
Teach practical table behavior.

Content:

-   Make calls clearly.
-   Keep discards orderly.
-   Do not touch tiles too early.
-   Do not disturb the table before score confirmation.
-   Avoid table talk that affects play.
-   Do not mix tiles before a win is verified.

Visual:

-   Etiquette checklist.

Interactive component:  
`MistakeSpotter`

Prompt:

```txt
Which behavior is good table etiquette?
```

Scenarios:

-   speaking clearly to call Pung
-   saying “wait” without calling
-   mixing tiles before score is confirmed
-   touching the wall early

Takeaway:

```txt
Clear calls, neat discards, and patient hands make the game fair and smooth.
```

----------

## **Lesson 7.8 — Ready for a Real Table**

Slug:

```txt
ready-for-a-real-table
```

Objective:  
Give final practical readiness summary before final test.

Content:  
Before joining a real table, know:

-   the tile set
-   the standard winning shape
-   how to set up and deal
-   turn flow
-   Chow / Pung / Kong / Win
-   call priority
-   3-fan minimum
-   self-draw vs discard win
-   dealer and round flow
-   common mistakes to avoid

Visual:

-   Readiness checklist with progress states.

Interactive component:  
`MultipleChoiceCheck`  plus checklist

Prompt:

```txt
Which topics do you feel confident about?
```

Interaction:

-   user checks confidence areas
-   page suggests review links for unchecked areas

Takeaway:

```txt
You now know the core rules needed to start playing Hong Kong Mahjong.
```

----------

## **Section 7 checkpoint**

Question count:  
8

Required topics:

1.  What happens after a hand ends.
2.  What is a drawn hand.
3.  Whether dealer continues on draw under this ruleset.
4.  Passing the deal.
5.  Wind cycles.
6.  End of round.
7.  Dead hand.
8.  Table etiquette.

Pass threshold:  
80%

----------

# **7. Final readiness test**

Route:

```txt
/learn/final-readiness-test
```

Title:

```txt
Are You Ready to Play Hong Kong Mahjong?
```

Question count:  
20

Pass threshold:  
85%

Question mix:

-   5 tile / meld / hand shape questions
-   3 setup / dealing questions
-   3 turn flow questions
-   4 call legality / priority questions
-   3 scoring questions
-   2 round / etiquette questions

Required scenario examples:

1.  Identify a sequence.
2.  Identify an invalid sequence.
3.  Identify a standard winning hand.
4.  Identify a non-winning near miss.
5.  Sort honors vs suits.
6.  Find East/dealer.
7.  Identify live wall vs dead wall.
8.  Determine who acts after East discards.
9.  Identify the four stages of a turn.
10.  Determine whether Chow is legal.
11.  Determine whether Pung is legal.
12.  Determine whether Kong is legal.
13.  Resolve call priority.
14.  Distinguish self-draw vs discard win.
15.  Explain 3-fan minimum.
16.  Identify Dragon Pung.
17.  Determine who pays on discard win.
18.  Determine who pays on self-draw.
19.  Explain drawn hand.
20.  Spot a beginner foul.

Completion result states:

### **Passed**

Show:

```txt
You’re ready for your first Hong Kong Mahjong table.
```

CTA:

-   Start practice drills
-   Review scoring
-   Play a guided hand

### **Failed**

Show:

```txt
You’re close. Review these areas first.
```

Dynamically recommend sections based on missed categories.

----------

# **8. Exact lesson tree for implementation**

```txt
/learn

1. /learn/what-is-hong-kong-mahjong
   1.1 /welcome-to-the-game
   1.2 /hk-mahjong-vs-other-styles
   1.3 /objective-of-a-hand
   1.4 /shape-of-the-game
   1.5 /how-a-hand-flows
   /recap
   /checkpoint

2. /learn/tiles-melds-winning-hands
   2.1 /the-tile-set
   2.2 /the-three-suits
   2.3 /honor-tiles
   2.4 /tile-groupings
   2.5 /open-vs-concealed
   2.6 /standard-winning-shape
   2.7 /thirteen-orphans
   2.8 /valid-shape-vs-scoring-pattern
   /recap
   /checkpoint

3. /learn/setup-and-dealing
   3.1 /seating-and-seat-winds
   3.2 /dealer-and-east
   3.3 /the-wall
   3.4 /rolling-dice-opening-wall
   3.5 /live-wall-vs-dead-wall
   3.6 /dealing-the-tiles
   3.7 /table-areas
   3.8 /common-setup-mistakes
   /recap
   /checkpoint

4. /learn/turn-flow-and-discarding
   4.1 /dealer-starts
   4.2 /anatomy-of-a-turn
   4.3 /drawing-a-tile
   4.4 /arranging-your-hand
   4.5 /discarding
   4.6 /the-call-window
   4.7 /turn-order-around-the-table
   4.8 /what-ends-a-hand
   /recap
   /checkpoint

5. /learn/calls-chow-pung-kong-win
   5.1 /what-is-a-call
   5.2 /chow
   5.3 /pung
   5.4 /concealed-kong
   5.5 /added-kong
   5.6 /big-exposed-kong
   5.7 /supplement-tile-after-kong
   5.8 /self-draw-win
   5.9 /win-on-discard
   5.10 /robbing-a-kong
   5.11 /call-priority
   5.12 /how-calls-change-turn-flow
   5.13 /open-meld-placement
   5.14 /beginner-call-decisions
   /recap
   /checkpoint

6. /learn/scoring-and-fan
   6.1 /what-makes-a-hand-winnable
   6.2 /what-is-fan
   6.3 /basic-scoring-principles
   6.4 /payment-basics
   6.5 /package-payment
   6.6 /beginner-fan
   6.7 /intermediate-fan
   6.8 /limit-hands
   6.9 /points-conversion-table
   6.10 /presenting-a-winning-hand
   /recap
   /checkpoint

7. /learn/rounds-draws-table-rules
   7.1 /what-happens-after-a-hand-ends
   7.2 /drawn-hands
   7.3 /passing-the-deal
   7.4 /wind-cycles-and-rounds
   7.5 /end-of-a-round
   7.6 /dead-hands-and-common-errors
   7.7 /table-etiquette
   7.8 /ready-for-a-real-table
   /recap
   /checkpoint

/learn/final-readiness-test
```

----------

# **9. MVP build priority**

## **Phase 1: Build the learning shell**

Build:

-   `/learn` landing page
-   section overview pages
-   lesson page template
-   progress persistence
-   navigation
-   simple tile components

## **Phase 2: Build core interactions**

Build:

-   `MultipleChoiceCheck`
-   `ClickThroughFlow`
-   `CardCarousel`
-   `TableMapInteractive`
-   `TileGroupingClassifier`
-   `HandShapeValidator`

## **Phase 3: Build gameplay interactions**

Build:

-   `TurnOrderSimulator`
-   `CallDecisionDrill`
-   `CallPriorityQuiz`
-   `PaymentSimulator`
-   `FanSelector`
-   `MistakeSpotter`

## **Phase 4: Fill all curriculum content**

Implement all lessons from the map above.

## **Phase 5: Add checkpoint quizzes and final readiness test**

Implement:

-   section checkpoint pages
-   pass/fail logic
-   final readiness test
-   recommended review paths

----------

# **10. Acceptance criteria**

## **General acceptance criteria**

The build is complete when:

-   `/learn`  shows all 7 curriculum sections.
-   Each section has an overview, ordered lesson pages, recap, and checkpoint.
-   Every lesson has a unique route.
-   Every lesson includes:
    -   concept
    -   visual example
    -   plain-English rule
    -   interactive check
    -   takeaway
-   Progress is saved locally.
-   Users can resume from last lesson.
-   Section checkpoints require 80% to pass.
-   Final readiness test requires 85% to pass.
-   Mobile layout is excellent.
-   Tile visuals are clear and consistent.
-   All interaction feedback is immediate.
-   User never gets stuck without a next action.

## **Content acceptance criteria**

The curriculum should accurately teach:

-   136 core tiles, suits, honors
-   pair, sequence, triplet, kong
-   standard winning hand: 4 melds + 1 pair
-   Thirteen Orphans as special hand
-   seating, dealer, winds
-   live wall vs dead wall
-   table areas
-   turn stages
-   Chow, Pung, Kong, Win
-   self-draw vs win on discard
-   robbing a kong
-   call priority: Win > Pung/Kong > Chow
-   3-fan minimum
-   10-fan cap
-   payment basics
-   points table
-   dealer passing and drawn hands
-   common dead hand / foul concepts

----------

# **11. Important implementation note for Claude Code**

Do not build this as static blog posts. Build it as a structured interactive curriculum powered by data.

Recommended file structure:

```txt
/src/app/learn/page.tsx
/src/app/learn/[sectionSlug]/page.tsx
/src/app/learn/[sectionSlug]/[lessonSlug]/page.tsx
/src/app/learn/[sectionSlug]/recap/page.tsx
/src/app/learn/[sectionSlug]/checkpoint/page.tsx
/src/app/learn/final-readiness-test/page.tsx

/src/data/learnCurriculum.ts
/src/data/quizData.ts
/src/data/tileData.ts

/src/components/learn/LearnLayout.tsx
/src/components/learn/LearnProgress.tsx
/src/components/learn/SectionCard.tsx
/src/components/learn/LessonPage.tsx
/src/components/learn/TakeawayCard.tsx
/src/components/learn/MahjongTile.tsx
/src/components/learn/MahjongHand.tsx

/src/components/learn/interactions/ClickThroughFlow.tsx
/src/components/learn/interactions/CardCarousel.tsx
/src/components/learn/interactions/MultipleChoiceCheck.tsx
/src/components/learn/interactions/DragSortTiles.tsx
/src/components/learn/interactions/TileGroupingClassifier.tsx
/src/components/learn/interactions/HandShapeValidator.tsx
/src/components/learn/interactions/TableMapInteractive.tsx
/src/components/learn/interactions/TurnOrderSimulator.tsx
/src/components/learn/interactions/CallDecisionDrill.tsx
/src/components/learn/interactions/CallPriorityQuiz.tsx
/src/components/learn/interactions/PaymentSimulator.tsx
/src/components/learn/interactions/FanSelector.tsx
/src/components/learn/interactions/MistakeSpotter.tsx

/src/lib/learnProgress.ts
/src/lib/mahjongRules.ts
```

Build the first version with hardcoded curriculum data, reusable components, and localStorage progress. Keep the architecture ready for Supabase/user accounts later.
