// Helpers for the Unscramble game.

// Fisher-Yates shuffle (returns a new array).
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Turn a word into shuffled letter tiles with stable ids, ensuring the
// shuffle isn't accidentally already in the correct order (for words > 1 letter).
export function scrambleWord(word) {
  const letters = word.split('').map((ch, i) => ({ id: i, ch }))
  if (letters.length < 2) return letters
  let out = shuffle(letters)
  let guard = 0
  while (out.map((l) => l.ch).join('') === word && guard < 20) {
    out = shuffle(letters)
    guard++
  }
  return out
}
