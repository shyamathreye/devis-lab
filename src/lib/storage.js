// localStorage helpers for the player profile and the local leaderboard.

const PROFILE_KEY = 'devislab.profile'
const BOARD_PREFIX = 'devislab.board.'
const KEYBOARD_KEY = 'devislab.keyboard'
const MAX_PER_BOARD = 10

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    /* ignore */
  }
}

// ---- Player profile (name + chosen theme) ----
export function loadProfile() {
  return read(PROFILE_KEY, null)
}

export function saveProfile(profile) {
  write(PROFILE_KEY, profile)
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY)
  } catch (e) {
    /* ignore */
  }
}

// ---- On-screen keyboard layout preference ('abc' | 'qwerty') ----
export function loadKeyboardLayout() {
  const v = read(KEYBOARD_KEY, 'abc')
  return v === 'qwerty' ? 'qwerty' : 'abc'
}

export function saveKeyboardLayout(layout) {
  write(KEYBOARD_KEY, layout === 'qwerty' ? 'qwerty' : 'abc')
}

// ---- Leaderboard (per game) ----
export function getBoard(game) {
  return read(BOARD_PREFIX + game, [])
}

// Add a score and return the trimmed, sorted board plus the new entry's rank.
export function addScore(game, entry) {
  const board = getBoard(game)
  const record = { ...entry, ts: Date.now() }
  board.push(record)
  board.sort((a, b) => b.score - a.score || a.ts - b.ts)
  const trimmed = board.slice(0, MAX_PER_BOARD)
  write(BOARD_PREFIX + game, trimmed)
  const rank = trimmed.indexOf(record) // -1 if it didn't make the cut
  return { board: trimmed, rank, madeBoard: rank !== -1 }
}

export function clearBoard(game) {
  write(BOARD_PREFIX + game, [])
}

export function isHighScore(game, score) {
  const board = getBoard(game)
  if (board.length < MAX_PER_BOARD) return true
  return score > board[board.length - 1].score
}
