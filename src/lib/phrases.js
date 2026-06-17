// Silly catchphrases shown when a game ends.
// Picked at random but avoiding the most recent few, so the same one
// doesn't keep popping up. In pirate mode the pool mixes the family
// favourites with pirate hollers.

const FAMILY = [
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

const PIRATE = [
  'Yo ho ho!',
  'Shiver me timbers!',
  'Arrr, treasure!',
  'Land ho, matey!',
  'X marks the spot!',
  'Booty for Devi!',
  'Hoist the sails!',
  'Squawk! says the parrot!',
  'Yer a fine sailor!',
  'Anchors aweigh!',
]

// Remember the last few so we don't repeat them too soon.
let recent = []

export function randomPhrase(isPirate = false) {
  const pirateMix = [...FAMILY, ...PIRATE]
  const PHRASES = isPirate ? pirateMix : FAMILY
  const memory = Math.min(5, PHRASES.length - 1)
  const available = PHRASES.filter((p) => !recent.includes(p))
  const pool = available.length ? available : PHRASES
  const pick = pool[Math.floor(Math.random() * pool.length)]
  recent.push(pick)
  if (recent.length > memory) recent.shift()
  return pick
}
