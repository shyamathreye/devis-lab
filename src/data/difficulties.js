// Cute labels mapped to real gameplay parameters.
// Difficulty changes word LENGTH and SPEED, never word obscurity —
// every word stays solvable for a 5-7 year old.
export const DIFFICULTIES = [
  {
    id: 'baby',
    name: 'Baby',
    emoji: '🍼',
    blurb: '3 letters',
    paceBlurb: 'Nice & slow',
    bucket: 'baby',
    showFirstLetter: true, // hangman reveals first letter
    autoVoice: true, // speak the word automatically
    scoreMultiplier: 1,
    // whack-a-mole — slow & gentle for little ones: critters stay up a long
    // time, with big gaps between them.
    moleUpMs: 3200,
    moleGapMs: 2000,
    maxActive: 1,
    roundSec: 30,
  },
  {
    id: 'kid',
    name: 'Kid',
    emoji: '🧒',
    blurb: '4 letters',
    paceBlurb: 'A little faster',
    bucket: 'kid',
    showFirstLetter: false,
    autoVoice: true,
    scoreMultiplier: 2,
    moleUpMs: 2600,
    moleGapMs: 1600,
    maxActive: 1,
    roundSec: 30,
  },
  {
    id: 'adult',
    name: 'Adult',
    emoji: '🧑',
    blurb: '5 letters',
    paceBlurb: 'Quick!',
    bucket: 'adult',
    showFirstLetter: false,
    autoVoice: false,
    scoreMultiplier: 3,
    moleUpMs: 2000,
    moleGapMs: 1300,
    maxActive: 2,
    roundSec: 30,
  },
  {
    id: 'thatha',
    name: 'Thatha',
    emoji: '👴',
    blurb: 'Super hard!',
    paceBlurb: 'Super fast!',
    bucket: 'thatha',
    showFirstLetter: false,
    autoVoice: false,
    scoreMultiplier: 5,
    moleUpMs: 1500,
    moleGapMs: 1000,
    maxActive: 2,
    roundSec: 30,
  },
]

export const getDifficulty = (id) =>
  DIFFICULTIES.find((d) => d.id === id) || DIFFICULTIES[0]
