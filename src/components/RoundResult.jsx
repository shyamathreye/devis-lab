import { useState } from 'react'
import { motion } from 'framer-motion'
import Sparkles from './Sparkles.jsx'
import NeonButton from './NeonButton.jsx'
import { useGame } from '../context/GameContext.jsx'
import { randomPhrase } from '../lib/phrases.js'

// Full-screen celebratory (or gentle) overlay shown when a round ends.
export default function RoundResult({
  win = true,
  title,
  emoji,
  score,
  rank,
  onPlayAgain,
  onLobby,
}) {
  const { copy } = useGame()
  // One silly catchphrase per results screen (persists until dismissed).
  const [phrase] = useState(() => randomPhrase(copy.isPirate))
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/55 px-6 text-center backdrop-blur-sm"
    >
      {win && <Sparkles count={20} />}
      <motion.div
        initial={{ scale: 0.6, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className="glass relative z-50 flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl p-7"
        style={{ boxShadow: '0 0 26px var(--accent)' }}
      >
        <motion.span
          className="text-7xl"
          animate={win ? { rotate: [0, -12, 12, 0], y: [0, -10, 0] } : { y: [0, 6, 0] }}
          transition={{ duration: 0.8, repeat: win ? 2 : 0 }}
        >
          {emoji}
        </motion.span>
        <h2 className="neon-text font-display text-3xl font-bold">{title}</h2>

        {/* Silly family catchphrase — bounces in, then wiggles once for attention. */}
        <motion.div
          initial={{ scale: 0, y: -28, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 340, damping: 11 }}
          className="rounded-2xl px-4 py-2 font-display text-xl font-bold"
          style={{
            color: 'var(--accent)',
            background: 'rgba(255,255,255,0.08)',
            boxShadow: '0 0 14px var(--accent)',
          }}
        >
          <motion.span
            className="inline-block"
            animate={{ rotate: [0, -5, 5, -4, 4, -2, 0], scale: [1, 1.08, 1] }}
            transition={{ delay: 1, duration: 0.9 }}
          >
            {phrase}
          </motion.span>
        </motion.div>

        {typeof score === 'number' && (
          <div
            className="mt-1 rounded-2xl px-6 py-2"
            style={{ boxShadow: '0 0 14px var(--accent2)' }}
          >
            <span className="text-sm font-bold uppercase tracking-wide opacity-80">{copy.t('scoreLabel')}</span>
            <div className="font-display text-4xl font-bold" style={{ color: 'var(--accent2)' }}>
              {score}
            </div>
          </div>
        )}

        {rank === 0 && (
          <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
            {copy.t('newTopScore')}
          </p>
        )}
        {rank > 0 && (
          <p className="text-base font-semibold opacity-90">
            {copy.t('madeLeaderboard')(rank)}
          </p>
        )}

        <div className="mt-3 flex w-full flex-col gap-3">
          <NeonButton className="w-full" onClick={onPlayAgain}>
            {copy.t('playAgain')}
          </NeonButton>
          <button
            onClick={onLobby}
            className="glass w-full rounded-2xl px-5 py-3 text-lg font-bold"
          >
            {copy.t('home')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
