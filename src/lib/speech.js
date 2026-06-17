// Browser Text-to-Speech wrapper. Reads words aloud and praises the player.
// Degrades gracefully where speechSynthesis is unavailable.

import { isMuted } from './sound.js'

function synth() {
  if (typeof window === 'undefined') return null
  return window.speechSynthesis || null
}

// Prefer a friendly, higher-pitched English voice if one exists.
function pickVoice() {
  const s = synth()
  if (!s) return null
  const voices = s.getVoices() || []
  if (!voices.length) return null
  const prefer = [
    'Samantha',
    'Google US English',
    'Karen',
    'Tessa',
    'Microsoft Zira',
    'Victoria',
  ]
  for (const name of prefer) {
    const v = voices.find((vo) => vo.name === name)
    if (v) return v
  }
  return voices.find((v) => /en[-_]/i.test(v.lang)) || voices[0]
}

function utter(text, { rate = 0.95, pitch = 1.35, gap = 0 } = {}) {
  const s = synth()
  if (!s || isMuted() || !text) return
  const u = new SpeechSynthesisUtterance(text)
  const v = pickVoice()
  if (v) u.voice = v
  u.rate = rate
  u.pitch = pitch
  u.volume = 1
  if (gap) u.text = text
  s.speak(u)
}

// Cancel anything currently being spoken.
export function stopSpeaking() {
  const s = synth()
  if (s) s.cancel()
}

// Say a whole word.
export function speak(word) {
  stopSpeaking()
  utter(word, { rate: 0.9, pitch: 1.35 })
}

// Spell a word letter by letter, then say the whole word.
export function spell(word) {
  const s = synth()
  if (!s || isMuted() || !word) return
  stopSpeaking()
  for (const ch of word.toUpperCase()) {
    const u = new SpeechSynthesisUtterance(ch)
    const v = pickVoice()
    if (v) u.voice = v
    u.rate = 0.7
    u.pitch = 1.3
    s.speak(u)
  }
  const w = new SpeechSynthesisUtterance(word)
  const v = pickVoice()
  if (v) w.voice = v
  w.rate = 0.85
  w.pitch = 1.35
  s.speak(w)
}

const PRAISES = [
  'Yay! Great job',
  'Woohoo! You did it',
  'Amazing work',
  'Super star',
  'You are so clever',
  'Brilliant',
  'Hooray',
]

// Encourage the player by name.
export function praise(name) {
  const phrase = PRAISES[Math.floor(Math.random() * PRAISES.length)]
  const who = name ? `, ${name}!` : '!'
  utter(phrase + who, { rate: 0.95, pitch: 1.4 })
}

// Gentle nudge on a wrong guess.
export function encourage() {
  const phrases = ['Try again!', 'Almost!', 'You can do it!', 'Keep going!']
  utter(phrases[Math.floor(Math.random() * phrases.length)], { pitch: 1.35 })
}

// Some engines load voices async; warm them up.
export function warmUpVoices() {
  const s = synth()
  if (s && s.getVoices) s.getVoices()
}
