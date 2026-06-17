// Tiny Web Audio synth — bright, fuzzy, cheerful effects with no asset files.
// All sounds are generated on the fly so the app works fully offline.

let ctx = null
let muted = false

const MUTE_KEY = 'devislab.muted'
try {
  muted = localStorage.getItem(MUTE_KEY) === '1'
} catch (e) {
  /* ignore */
}

function audio() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  // Browsers suspend audio until a user gesture; resume on demand.
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function isMuted() {
  return muted
}

export function toggleMute() {
  muted = !muted
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch (e) {
    /* ignore */
  }
  return muted
}

// Play a single tone. type: 'sine'|'square'|'triangle'|'sawtooth'.
function tone(freq, dur, { type = 'sine', gain = 0.25, delay = 0, slideTo } = {}) {
  const ac = audio()
  if (!ac || muted) return
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

// A short bubbly "pop" for taps / correct letters.
export function pop() {
  tone(420, 0.16, { type: 'triangle', gain: 0.3, slideTo: 760 })
}

// Bright confirming "ding".
export function ding() {
  tone(880, 0.18, { type: 'sine', gain: 0.28 })
  tone(1320, 0.22, { type: 'sine', gain: 0.18, delay: 0.04 })
}

// Gentle, non-scary "try again" wobble.
export function buzz() {
  tone(300, 0.18, { type: 'square', gain: 0.18, slideTo: 200 })
}

// Happy little arpeggio for wins.
export function fanfare() {
  const notes = [523, 659, 784, 1047, 1319] // C E G C E
  notes.forEach((f, i) =>
    tone(f, 0.25, { type: 'triangle', gain: 0.26, delay: i * 0.09 }),
  )
}

// Countdown tick.
export function tick() {
  tone(660, 0.07, { type: 'square', gain: 0.12 })
}

// Whoosh for screen transitions.
export function whoosh() {
  tone(200, 0.25, { type: 'sawtooth', gain: 0.12, slideTo: 700 })
}

// "Aww" descending tones when a round ends without a win.
export function sad() {
  tone(440, 0.2, { type: 'triangle', gain: 0.2, slideTo: 330 })
  tone(330, 0.3, { type: 'triangle', gain: 0.2, delay: 0.18, slideTo: 247 })
}

// Sparkly bonus chime (golden critter).
export function sparkleChime() {
  ;[1047, 1319, 1568].forEach((f, i) =>
    tone(f, 0.18, { type: 'sine', gain: 0.22, delay: i * 0.05 }),
  )
}

// Prime the audio context from a user gesture (call on first tap).
export function unlockAudio() {
  audio()
}
