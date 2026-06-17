import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import TopBar from '../components/TopBar.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import RoundResult from '../components/RoundResult.jsx'
import { useGame } from '../context/GameContext.jsx'
import { pop, ding, tick, fanfare, sparkleChime } from '../lib/sound.js'
import { addScore } from '../lib/storage.js'

const HOLES = 9
const NORMAL_POINTS = 10
const GOLDEN_POINTS = 50

export default function WhackAMole() {
  const { name, theme, difficulty, goLobby, copy } = useGame()
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState('ready') // ready | playing | done
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(difficulty.roundSec)
  const [score, setScore] = useState(0)
  const [active, setActive] = useState(() => Array(HOLES).fill(null))
  const [hitFx, setHitFx] = useState({}) // holeIndex -> {points, id}
  const [result, setResult] = useState(null)

  const idRef = useRef(0)
  const timers = useRef([])
  const activeRef = useRef(active)
  activeRef.current = active

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current.forEach(clearInterval)
    timers.current = []
  }

  // Reset everything when (re)starting a round.
  useEffect(() => {
    clearTimers()
    setPhase('ready')
    setCountdown(3)
    setTimeLeft(difficulty.roundSec)
    setScore(0)
    setActive(Array(HOLES).fill(null))
    setHitFx({})
    setResult(null)
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  // "3 - 2 - 1 - GO" intro.
  useEffect(() => {
    if (phase !== 'ready') return
    if (countdown <= 0) {
      ding()
      const t = setTimeout(() => setPhase('playing'), 450) // let "GO!" flash
      return () => clearTimeout(t)
    }
    tick()
    const t = setTimeout(() => setCountdown((c) => c - 1), 700)
    return () => clearTimeout(t)
  }, [phase, countdown])

  // Game loop: countdown clock + critter spawner.
  useEffect(() => {
    if (phase !== 'playing') return
    clearTimers() // defensive: never let a prior cycle's clock/spawner survive

    const clock = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(clock)
          return 0
        }
        if (t <= 6) tick()
        return t - 1
      })
    }, 1000)

    const maxActive = difficulty.maxActive || 1
    const spawn = setInterval(() => {
      const cur = activeRef.current
      const showing = cur.filter(Boolean).length
      if (showing >= maxActive) return // keep it calm — don't crowd the board
      const empty = []
      cur.forEach((v, i) => v === null && empty.push(i))
      if (!empty.length) return
      const hole = empty[Math.floor(Math.random() * empty.length)]
      const golden = Math.random() < 0.12
      const id = ++idRef.current
      const emoji = golden
        ? '🌟'
        : theme.critters[Math.floor(Math.random() * theme.critters.length)]
      setActive((prev) => {
        const next = [...prev]
        next[hole] = { id, emoji, golden }
        return next
      })
      // Auto-hide if not tapped in time.
      const hide = setTimeout(() => {
        setActive((prev) => {
          if (prev[hole] && prev[hole].id === id) {
            const next = [...prev]
            next[hole] = null
            return next
          }
          return prev
        })
      }, difficulty.moleUpMs)
      timers.current.push(hide)
    }, difficulty.moleGapMs)

    timers.current.push(clock, spawn)
    return () => {
      clearInterval(clock)
      clearInterval(spawn)
    }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // End of round.
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0) {
      clearTimers()
      setActive(Array(HOLES).fill(null))
      setPhase('done')
    }
  }, [timeLeft, phase])

  useEffect(() => {
    if (phase !== 'done') return
    fanfare()
    // Only record a score worth celebrating — don't clutter the board with 0s.
    let rank = -1
    if (score > 0) {
      ;({ rank } = addScore('whack', {
        name,
        theme: theme.id,
        difficulty: difficulty.id,
        score,
      }))
    }
    setResult({ score, rank })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const whack = (hole) => {
    const critter = active[hole]
    if (!critter || phase !== 'playing') return
    const points = critter.golden ? GOLDEN_POINTS : NORMAL_POINTS
    if (critter.golden) sparkleChime()
    else pop()
    setScore((s) => s + points)
    setActive((prev) => {
      const next = [...prev]
      next[hole] = null
      return next
    })
    const fxId = ++idRef.current
    setHitFx((prev) => ({ ...prev, [hole]: { points, id: fxId } }))
    setTimeout(() => {
      setHitFx((prev) => {
        if (prev[hole] && prev[hole].id === fxId) {
          const next = { ...prev }
          delete next[hole]
          return next
        }
        return prev
      })
    }, 600)
  }

  return (
    <Screen>
      <TopBar onBack={goLobby} label={copy.t('backGames')} />

      <div className="mt-2 flex w-full items-center justify-center gap-4">
        <ScoreBadge label={copy.t('scoreLabel')} value={score} pulse />
        <ScoreBadge
          label="Time"
          value={`${timeLeft}s`}
          color={timeLeft <= 6 ? 'var(--neon-coral, #ff6b6b)' : 'var(--accent)'}
          pulse={timeLeft <= 6}
        />
      </div>

      <p className="mt-3 text-center text-base font-semibold opacity-85">
        {copy.t('whackInstruction')}
      </p>

      {/* Hole grid */}
      <div className="mt-4 grid w-full max-w-md grid-cols-3 gap-3 sm:gap-4">
        {active.map((critter, i) => (
          <button
            key={i}
            onClick={() => whack(i)}
            className="relative flex aspect-square items-center justify-center overflow-visible rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 65%, rgba(0,0,0,0.45), rgba(0,0,0,0.2))',
              border: '4px solid rgba(255,255,255,0.12)',
              boxShadow: 'inset 0 8px 16px rgba(0,0,0,0.5)',
            }}
          >
            <AnimatePresence>
              {critter && (
                <motion.span
                  key={critter.id}
                  initial={{ y: 36, scale: 0.4, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 30, scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  className="text-5xl drop-shadow-[0_0_12px_var(--accent)] sm:text-6xl"
                  style={critter.golden ? { filter: 'drop-shadow(0 0 16px gold)' } : {}}
                >
                  {critter.emoji}
                </motion.span>
              )}
            </AnimatePresence>

            {/* floating +points */}
            <AnimatePresence>
              {hitFx[i] && (
                <motion.span
                  key={hitFx[i].id}
                  initial={{ y: 0, opacity: 1, scale: 0.8 }}
                  animate={{ y: -48, opacity: 0, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="pointer-events-none absolute font-display text-2xl font-bold"
                  style={{ color: 'var(--accent2)' }}
                >
                  +{hitFx[i].points}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      {/* Ready countdown overlay */}
      {phase === 'ready' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            key={countdown}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="neon-text font-display text-8xl font-bold"
          >
            {countdown === 0 ? copy.t('go') : countdown}
          </motion.div>
        </div>
      )}

      {result && (
        <RoundResult
          win
          emoji={theme.critter}
          title={copy.t('timesUp')}
          score={result.score}
          rank={result.rank}
          onPlayAgain={() => setRound((r) => r + 1)}
          onLobby={goLobby}
        />
      )}
    </Screen>
  )
}
