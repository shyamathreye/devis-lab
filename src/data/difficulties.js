// Real gameplay parameters per difficulty. Display names/blurbs live in
// src/lib/copy.js (so they can be re-skinned per theme, e.g. pirate).
// Difficulty changes word LENGTH and SPEED, never word obscurity —
// every word stays solvable for a 5-7 year old.
export const DIFFICULTIES = [
  {
    id: 'baby',
    emoji: '🍼',
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
    emoji: '🧒',
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
    emoji: '🧑',
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
    emoji: '👴',
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
