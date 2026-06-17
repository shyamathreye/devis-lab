# Devi Jones ✨

A bright, neon, sound-rich mini-games site for Devi (age 5). Three games, four
themes, kid-friendly difficulty levels, voice readout, and a local leaderboard.
Runs entirely in the browser — no backend, works offline.

## Games

- **Save the Balloons** 🎈 — a friendly hangman. Tap letters to guess the word;
  wrong guesses pop a balloon (gentle, never scary).
- **Mix-Up Magic** 🔤 — unscramble the jumbled letters by tapping tiles into place.
- **Tap the Critter** 👆 — whack-a-mole reflex game; tap critters before they hide.
  The golden 🌟 is worth lots!

## How it works

1. Type your name.
2. Pick a world: 🦄 Unicorns, 🐶 Animals, 🐠 Ocean, or 🚀 Space.
3. Pick a game, then a difficulty: 🍼 Baby · 🧒 Kid · 🧑 Adult · 👴 Thatha.
4. Play! Scores are saved to a local leaderboard on this device.

Name + theme are remembered, so returning players go straight to the games.
Use **Switch player** on the home screen to start a new profile.

## Run it

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
```

## Build & share

```bash
npm run build    # outputs a static site to dist/
```

Deploy `dist/` to any static host (Netlify, Vercel, GitHub Pages) — drag-and-drop
to Netlify works great. It's fully self-contained and runs offline.

## Tech

React + Vite, Tailwind CSS, Framer Motion. Sounds are synthesized with the Web
Audio API (no audio files); words are read aloud with the browser's built-in
text-to-speech. There's a 🔊/🔇 mute toggle on every screen for quiet time.

## Customizing

- **Words:** `src/data/words.js` — per theme + difficulty, each with an emoji hint.
- **Themes / colors:** `src/data/themes.js`.
- **Difficulty (lengths, speeds, timers):** `src/data/difficulties.js`.
