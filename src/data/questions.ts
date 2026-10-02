export interface QuestionOption {
  letter: string;
  text: string;
  primary: "suntzu" | "marcus" | "curie" | "leonardo" | "alexander" | "cleopatra";
  secondary: "suntzu" | "marcus" | "curie" | "leonardo" | "alexander" | "cleopatra";
}

export interface Question {
  id: number;
  theme: string;
  title: string;
  context: string;
  options: QuestionOption[];
}

export const TRAIT_KEYS = [
  "strategy",
  "composure",
  "inquiry",
  "creativity",
  "boldness",
  "diplomacy",
] as const;

export type TraitKey = typeof TRAIT_KEYS[number];

export const ARCHETYPE_TO_TRAIT: Record<string, TraitKey> = {
  suntzu: "strategy",
  marcus: "composure",
  curie: "inquiry",
  leonardo: "creativity",
  alexander: "boldness",
  cleopatra: "diplomacy",
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    theme: "Crisis & Adversity",
    title: "Your organization or domain faces an unexpected crisis with conflicting reports. What is your immediate initial action?",
    context: "Select the response that matches your unfiltered instinctive first move under pressure.",
    options: [
      {
        letter: "A",
        text: "Withdraw into stillness to master internal alarm, journaling to separate what is under your control from what is not.",
        primary: "marcus",
        secondary: "suntzu",
      },
      {
        letter: "B",
        text: "Quietly map the power dynamics and human factions involved, assessing who stands to gain and where diplomatic leverage lies.",
        primary: "cleopatra",
        secondary: "suntzu",
      },
      {
        letter: "C",
        text: "Dissect the empirical evidence, setting up immediate controlled experiments and diagramming the breakdown chain.",
        primary: "curie",
        secondary: "leonardo",
      },
      {
        letter: "D",
        text: "Take the offensive immediately with bold personal presence, rallying your core team before paralysis can set in.",
        primary: "alexander",
        secondary: "cleopatra",
      },
    ],
  },
  {
    id: 2,
    theme: "Ambition & Legacy",
    title: "When you envision your life's definitive triumph, what does it genuinely look like?",
    context: "What accomplishment would bring you true peace and vindication?",
    options: [
      {
        letter: "A",
        text: "Having discharged your duties with pure virtue and justice, preserving an unblemished conscience for the common good.",
        primary: "marcus",
        secondary: "curie",
      },
      {
        letter: "B",
        text: "Securing lasting sovereignty for your people, outsmarting colossal empires through cultural brilliance and alliance.",
        primary: "cleopatra",
        secondary: "alexander",
      },
      {
        letter: "C",
        text: "Pushing past the furthest known boundaries of your field, executing an audacious conquest that enters legendary lore.",
        primary: "alexander",
        secondary: "suntzu",
      },
      {
        letter: "D",
        text: "Creating an interconnected masterwork of art, invention, and scientific observation that endures across centuries.",
        primary: "leonardo",
        secondary: "curie",
      },
    ],
  },
  {
    id: 3,
    theme: "Conflict & Adversaries",
    title: "A formidable rival launches a public challenge against your domain. How do you counter them?",
    context: "Examine how you engage with hostile competition.",
    options: [
      {
        letter: "A",
        text: "Refuse direct battle. Maneuver behind the scenes, cutting their supply of allies and forcing their capitulation without bloodshed.",
        primary: "suntzu",
        secondary: "cleopatra",
      },
      {
        letter: "B",
        text: "Flatter their ego or exploit their vanity in private discussions, turning their challenge into a partnership that benefits you.",
        primary: "cleopatra",
        secondary: "marcus",
      },
      {
        letter: "C",
        text: "Charge head-on at their strongest point with superior speed, shattering their confidence through sheer audacity.",
        primary: "alexander",
        secondary: "curie",
      },
      {
        letter: "D",
        text: "Regard their attacks as harmless external noise. Keep your poise, act strictly with fairness, and let time vindicate you.",
        primary: "marcus",
        secondary: "leonardo",
      },
    ],
  },
  {
    id: 4,
    theme: "Daily Discipline & Focus",
    title: "What philosophy governs your daily ritual and cognitive energy?",
    context: "How do you organize your mind and workspace to produce meaningful output?",
    options: [
      {
        letter: "A",
        text: "Relentless, solitary empirical discipline—repeating trials and refining calculations late into the night without distraction.",
        primary: "curie",
        secondary: "marcus",
      },
      {
        letter: "B",
        text: "Morning contemplation on duty and mortality, followed by disciplined governance of mind against vanity and petulance.",
        primary: "marcus",
        secondary: "suntzu",
      },
      {
        letter: "C",
        text: "Boundaryless exploration—sketching observations, testing mechanical designs, and shifting between multiple passions.",
        primary: "leonardo",
        secondary: "cleopatra",
      },
      {
        letter: "D",
        text: "Strategic economy—calculating timing, gathering foreknowledge, and striking only during peak leverage while conserving energy.",
        primary: "suntzu",
        secondary: "alexander",
      },
    ],
  },
  {
    id: 5,
    theme: "Setbacks & Failure",
    title: "A major enterprise or campaign collapses entirely. What is your mental pivot?",
    context: "Where do you turn when your best-laid plans are reduced to ashes?",
    options: [
      {
        letter: "A",
        text: "Isolate the experimental anomaly without grief; every failure is pure empirical data that narrows the path to fundamental truth.",
        primary: "curie",
        secondary: "leonardo",
      },
      {
        letter: "B",
        text: "The impediment to action advances action. What stands in the way becomes the way. Accept fate and practice virtue.",
        primary: "marcus",
        secondary: "suntzu",
      },
      {
        letter: "C",
        text: "Fade into the shadows, reposition your remaining assets patiently, and wait until the enemy makes their inevitable error.",
        primary: "suntzu",
        secondary: "cleopatra",
      },
      {
        letter: "D",
        text: "Refuse to be demoralized. Regroup the inner vanguard, inspire morale with a fiery rally, and launch the next expedition.",
        primary: "alexander",
        secondary: "leonardo",
      },
    ],
  },
  {
    id: 6,
    theme: "Intellectual Pursuit",
    title: "How do you define true wisdom and intellectual mastery?",
    context: "What kind of understanding is most potent in the real world?",
    options: [
      {
        letter: "A",
        text: "Seeing the hidden harmony connecting disparate fields—how the flight of birds informs geometry, hydraulics, and anatomy.",
        primary: "leonardo",
        secondary: "curie",
      },
      {
        letter: "B",
        text: "Uncompromising scientific truth derived from painstaking observation and rigorous lab measurement, free from folklore.",
        primary: "curie",
        secondary: "marcus",
      },
      {
        letter: "C",
        text: "Foreknowledge of human psychology, terrain, and environmental timing that allows you to calculate victory before action.",
        primary: "suntzu",
        secondary: "alexander",
      },
      {
        letter: "D",
        text: "Mastery of languages, rhetoric, cultural psychology, and the unspoken desires that drive human decision-makers.",
        primary: "cleopatra",
        secondary: "leonardo",
      },
    ],
  },
  {
    id: 7,
    theme: "High-Stakes Decision",
    title: "You must make a critical decision with incomplete data and ticking time. What guides your judgment?",
    context: "When logic runs out of data, how do you cut the Gordian knot?",
    options: [
      {
        letter: "A",
        text: "Locate where the opponent or problem is overextended and empty; advance along the path of least resistance.",
        primary: "suntzu",
        secondary: "cleopatra",
      },
      {
        letter: "B",
        text: "Bold instinct and decisive speed. Hesitation is more fatal than an imperfect maneuver executed with absolute velocity.",
        primary: "alexander",
        secondary: "suntzu",
      },
      {
        letter: "C",
        text: "Isolate the core physical first principles from rumors; strip away assumptions and make the most testable choice.",
        primary: "curie",
        secondary: "leonardo",
      },
      {
        letter: "D",
        text: "Sketch multiple unorthodox solutions that integrate seemingly opposing angles, choosing the most elegant design.",
        primary: "leonardo",
        secondary: "marcus",
      },
    ],
  },
  {
    id: 8,
    theme: "Supreme Value",
    title: "If history remembers you by a single sentence, which would you desire most?",
    context: "Your North Star philosophy summarized.",
    options: [
      {
        letter: "A",
        text: "'They held imperial power and wealth, yet lived as an incorruptible servant of justice, humility, and reason.'",
        primary: "marcus",
        secondary: "curie",
      },
      {
        letter: "B",
        text: "'They shattered old kingdoms and expanded civilization's horizon across the world with fearless martial audacity.'",
        primary: "alexander",
        secondary: "suntzu",
      },
      {
        letter: "C",
        text: "'Through sheer personal sacrifice, they uncovered the fundamental laws of nature and illuminated human knowledge.'",
        primary: "curie",
        secondary: "leonardo",
      },
      {
        letter: "D",
        text: "'A master of statecraft who defended her civilization with magnetic dignity, intelligence, and diplomatic prowess.'",
        primary: "cleopatra",
        secondary: "suntzu",
      },
    ],
  },
];
