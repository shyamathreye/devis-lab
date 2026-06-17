import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import TopBar from '../components/TopBar.jsx'
import { useGame } from '../context/GameContext.jsx'
import { DIFFICULTIES } from '../data/difficulties.js'
import { ding } from '../lib/sound.js'

const GAME_TITLES = {
  hangman: 'Save the Balloons 🎈',
  unscramble: 'Mix-Up Magic 🔤',
  whack: 'Tap the Critter 👆',
}

export default function DifficultyPicker() {
  const { game, goLobby, playWithDifficulty } = useGame()

  return (
    <Screen>
      <TopBar onBack={goLobby} label="Games" />
      <h2 className="mt-4 text-center font-display text-2xl font-bold opacity-90">
        {GAME_TITLES[game]}
      </h2>
      <h3 className="neon-text mt-1 text-center font-display text-3xl font-bold">
        How hard?
      </h3>

      <div className="mt-7 grid w-full grid-cols-2 gap-4">
        {DIFFICULTIES.map((d, i) => (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              ding()
              playWithDifficulty(d.id)
            }}
            className="glass neon-box flex flex-col items-center gap-1 rounded-3xl p-5"
          >
            <span className="text-5xl">{d.emoji}</span>
            <span className="font-display text-2xl font-bold" style={{ color: 'var(--accent)' }}>
              {d.name}
            </span>
            <span className="text-sm opacity-80">
              {game === 'whack' ? d.paceBlurb : d.blurb}
            </span>
          </motion.button>
        ))}
      </div>
    </Screen>
  )
}
