import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import TopBar from '../components/TopBar.jsx'
import Mascot from '../components/Mascot.jsx'
import { useGame } from '../context/GameContext.jsx'
import { ding } from '../lib/sound.js'

const GAMES = [
  {
    id: 'hangman',
    name: 'Save the Balloons',
    emoji: '🎈',
    blurb: 'Guess the word',
  },
  {
    id: 'unscramble',
    name: 'Mix-Up Magic',
    emoji: '🔤',
    blurb: 'Fix the jumble',
  },
  {
    id: 'whack',
    name: 'Tap the Critter',
    emoji: '👆',
    blurb: 'Fastest finger!',
  },
]

export default function Lobby() {
  const { name, theme, startGame, goLeaderboard, goTheme, switchPlayer } = useGame()

  return (
    <Screen>
      <TopBar />
      <div className="mt-1 flex flex-col items-center">
        <Mascot emoji={theme?.critter || '🦄'} mood="idle" size="text-6xl" />
        <h1 className="neon-text mt-1 font-display text-4xl font-bold sm:text-5xl">
          Devi Jones
        </h1>
        <p className="mt-1 text-lg font-semibold">
          Hi <span style={{ color: 'var(--accent)' }}>{name}</span>! Pick a game 🎮
        </p>
      </div>

      <div className="mt-6 flex w-full flex-col gap-4">
        {GAMES.map((g, i) => (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              ding()
              startGame(g.id)
            }}
            className="glass neon-box flex items-center gap-4 rounded-3xl p-5 text-left"
          >
            <span className="text-5xl">{g.emoji}</span>
            <span className="flex flex-col">
              <span className="font-display text-2xl font-bold">{g.name}</span>
              <span className="text-base opacity-80">{g.blurb}</span>
            </span>
            <span className="ml-auto text-3xl" style={{ color: 'var(--accent)' }}>
              ▶
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={goLeaderboard}
          className="glass rounded-full px-5 py-3 text-lg font-bold"
        >
          🏆 Leaderboard
        </button>
        <button
          onClick={goTheme}
          className="glass rounded-full px-5 py-3 text-lg font-bold"
        >
          {theme?.emoji} Change world
        </button>
        <button
          onClick={switchPlayer}
          className="rounded-full px-4 py-3 text-sm font-bold opacity-70 underline"
        >
          Not {name}? Switch player
        </button>
      </div>
    </Screen>
  )
}
