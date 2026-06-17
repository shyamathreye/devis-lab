// Central source of truth for all user-facing copy.
// Static values are strings; interpolated ones are functions.
// The `pirate` variant only overrides what changes — anything missing
// falls back to `default`. Game words/answers are NOT copy and live in words.js.

const COPY = {
  default: {
    // Welcome
    appTitle: 'Devi Jones',
    appTagline: '✨ Games, words & giggles ✨',
    namePrompt: "Hi! What's your name?",
    namePlaceholder: 'Type here…',
    playCta: "Let's Play! 🎉",

    // ThemePicker
    pickWorld: (name) => `${name}, pick your world!`,
    pickWorldHint: 'Tap one to start ✨',

    // Lobby — greeting wraps a highlighted name: `${hi} <name>${pick}`
    lobbyHi: 'Hi',
    lobbyPick: '! Pick a game 🎮',
    leaderboardBtn: '🏆 Leaderboard',
    changeWorldBtn: 'Change world',
    switchPlayer: (name) => `Not ${name}? Switch player`,

    // DifficultyPicker
    howHard: 'How hard?',

    // Leaderboard
    leaderboardTitle: '🏆 Top Stars',
    filterAll: 'All',
    noScores: 'No scores yet — go play! 🎮',
    clearScores: 'Clear scores',
    clearConfirm: 'Clear all scores for this game?',

    // TopBar back labels
    backBack: 'Back',
    backGames: 'Games',
    backHome: 'Home',

    // Hangman
    hearIt: '🔊 Hear it',
    roundWin: 'Yay! ⭐',
    roundTricky: 'That one was tricky! 🤗',
    wordsDone: (n) => `${n} words done!`,

    // Unscramble
    spellWord: 'Spell the word!',
    hintClue: '💡 Clue',
    hintSay: '🔊 Say it',
    hintSpell: '🔡 Spell it',
    hintHelp: 'Tap for a clue → hear it → spell it',
    allDone: 'All done! 🎉',

    // WhackAMole
    whackInstruction: 'Tap the critters! 🌟 is worth lots!',
    go: 'GO!',
    timesUp: "Time's up!",

    // RoundResult
    scoreLabel: 'Score',
    newTopScore: '🥇 New top score!',
    madeLeaderboard: (rank) => `🏆 You made the leaderboard — #${rank + 1}!`,
    playAgain: 'Play again 🔁',
    home: '🏠 Home',

    // Per-game meta (titles, blurbs, short tab names)
    games: {
      hangman: { name: 'Save the Balloons', emoji: '🎈', blurb: 'Guess the word', short: 'Balloons' },
      unscramble: { name: 'Mix-Up Magic', emoji: '🔤', blurb: 'Fix the jumble', short: 'Mix-Up' },
      whack: { name: 'Tap the Critter', emoji: '👆', blurb: 'Fastest finger!', short: 'Critters' },
    },

    // Per-difficulty display copy (gameplay params stay in difficulties.js)
    difficulties: {
      baby: { name: 'Baby', blurb: '3 letters', paceBlurb: 'Nice & slow' },
      kid: { name: 'Kid', blurb: '4 letters', paceBlurb: 'A little faster' },
      adult: { name: 'Adult', blurb: '5 letters', paceBlurb: 'Quick!' },
      thatha: { name: 'Thatha', blurb: 'Super hard!', paceBlurb: 'Super fast!' },
    },
  },

  pirate: {
    appTitle: 'Devi Jones',
    appTagline: '☠️ Games, words & arrr-giggles ☠️',
    namePrompt: 'Ahoy! What be yer name, matey?',
    namePlaceholder: 'Scribble it here…',
    playCta: 'Set Sail! 🏴‍☠️',

    pickWorld: (name) => `${name}, pick yer world, matey!`,
    pickWorldHint: 'Tap one to set sail ☠️',

    lobbyHi: 'Ahoy',
    lobbyPick: '! Pick a game, matey ⚓',
    leaderboardBtn: '🏆 Treasure Board',
    changeWorldBtn: 'New seas',
    switchPlayer: (name) => `Not ${name}? Swap sailor`,

    howHard: 'How tough, matey?',

    leaderboardTitle: '🏆 Top Sailors',
    filterAll: 'All',
    noScores: 'No loot yet — go play, matey! 🏴‍☠️',
    clearScores: 'Dump the loot',
    clearConfirm: 'Toss all the loot for this game overboard?',

    backBack: 'Back',
    backGames: 'Games',
    backHome: 'Ship',

    hearIt: '🔊 Hear it, matey',
    roundWin: 'Arrr! ⭐',
    roundTricky: 'That be a tricky one! 🤗',
    wordsDone: (n) => `${n} words done, matey!`,

    spellWord: 'Spell the loot!',
    hintClue: '💡 Clue',
    hintSay: '🔊 Say it',
    hintSpell: '🔡 Spell it',
    hintHelp: 'Tap for a clue → hear it → spell it',
    allDone: 'All done, matey! 🏴‍☠️',

    whackInstruction: "Tap the critters! 🌟 be worth lots o' loot!",
    go: 'GO!',
    timesUp: 'Time be up!',

    scoreLabel: 'Loot',
    newTopScore: '🥇 Best haul yet!',
    madeLeaderboard: (rank) => `🏆 Ye made the board — #${rank + 1}!`,
    playAgain: 'Sail again 🔁',
    home: '⚓ Ship',

    games: {
      hangman: { blurb: 'Guess the word, matey' },
      unscramble: { blurb: 'Fix the jumbled loot' },
      whack: { blurb: 'Quickest hook wins!' },
    },

    difficulties: {
      baby: { name: 'Wee One', paceBlurb: 'Gentle seas' },
      kid: { name: 'Sailor', paceBlurb: 'A bit faster' },
      adult: { name: 'Captain', paceBlurb: 'Choppy!' },
      thatha: { name: 'Sea Dog', paceBlurb: 'Stormy fast!' },
    },
  },
}

// Build a copy helper bound to the active theme id.
// Missing keys/fields fall back to the default variant.
export function makeCopy(themeId) {
  const base = COPY.default
  const variant = themeId === 'pirate' ? COPY.pirate : base
  return {
    isPirate: themeId === 'pirate',
    t: (key) => (variant[key] !== undefined ? variant[key] : base[key]),
    game: (id) => ({ ...base.games[id], ...(variant.games?.[id] || {}) }),
    gameShort: (id) => (variant.games?.[id]?.short ?? base.games[id].short),
    diff: (id) => ({ ...base.difficulties[id], ...(variant.difficulties?.[id] || {}) }),
  }
}
