// Silly family catchphrases shown when a game ends.
// Picked at random but avoiding the most recent few, so the same one
// doesn't keep popping up.

const PHRASES = [
  'Mosaranna Party!',
  'Amma Pickyyy!',
  'Shyam uncle got scared of a tree!',
  'Vanti Party!',
  "Amma's Luru Mag!",
  "Let's trouble Bhargu Mama!",
  "Appa's Red Car!",
  'Madhavi aunty vanti!',
  'Guggu Dolls!',
  'Chachi Party!',
]

// Remember the last few so we don't repeat them too soon.
let recent = []
const MEMORY = Math.min(5, PHRASES.length - 1)

export function randomPhrase() {
  const available = PHRASES.filter((p) => !recent.includes(p))
  const pool = available.length ? available : PHRASES
  const pick = pool[Math.floor(Math.random() * pool.length)]
  recent.push(pick)
  if (recent.length > MEMORY) recent.shift()
  return pick
}
