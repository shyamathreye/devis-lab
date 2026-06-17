import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import TopBar from '../components/TopBar.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import Sparkles from '../components/Sparkles.jsx'
import RoundResult from '../components/RoundResult.jsx'
import { useGame } from '../context/GameContext.jsx'
import { getRounds } from '../data/words.js'
import { ding, buzz, fanfare, sad } from '../lib/sound.js'
import { speak } from '../lib/speech.js'
import { addScore } from '../lib/storage.js'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const MAX_BALLOONS = 6
const TOTAL_ROUNDS = 6

export default function Hangman() {
  const { name, theme, difficulty, goLobby } = useGame()
  const [session, setSession] = useState(0) // bump to start a brand-new 6-word game
  const words = useMemo(
    () => getRounds(theme.id, difficulty.bucket, TOTAL_ROUNDS),
    [theme.id, difficulty.bucket, session],
  )

  const [roundIdx, setRoundIdx] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [guessed, setGuessed] = useState(() => new Set())
  const [balloons, setBalloons] = useState(MAX_BALLOONS)
  const [status, setStatus] = useState('playing') // playing | won | lost
  const [overlay, setOverlay] = useState(null) // between-round celebration {win, word}
  const [result, setResult] = useState(null)

  const entry = words[roundIdx]
  const word = entry.word

  // New session -> back to round 1.
  useEffect(() => {
    setRoundIdx(0)
    setTotalScore(0)
    setResult(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // (Re)start a round.
  useEffect(() => {
    const seed = new Set()
    if (difficulty.showFirstLetter) seed.add(word[0])
    setGuessed(seed)
    setBalloons(MAX_BALLOONS)
    setStatus('playing')
    setOverlay(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, session])

  const revealed = useMemo(
    () => word.split('').every((ch) => guessed.has(ch)),
    [word, guessed],
  )

  // Move to the next word, or finish the game.
  const advance = (newTotal) => {
    setTimeout(() => {
      if (roundIdx + 1 < TOTAL_ROUNDS) {
        setRoundIdx((r) => r + 1)
      } else {
        let rank = -1
        if (newTotal > 0) {
          ;({ rank } = addScore('hangman', {
            name,
            theme: theme.id,
            difficulty: difficulty.id,
            score: newTotal,
          }))
        }
        setResult({ score: newTotal, rank })
      }
    }, 1600)
  }

  // Detect win / loss for the current word.
  useEffect(() => {
    if (status !== 'playing') return
    if (revealed) {
      setStatus('won')
      fanfare()
      const roundScore = balloons * 10 * difficulty.scoreMultiplier
      const newTotal = totalScore + roundScore
      setTotalScore(newTotal)
      setOverlay({ win: true, word })
      advance(newTotal)
    } else if (balloons <= 0) {
      setStatus('lost')
      sad()
      setOverlay({ win: false, word })
      advance(totalScore)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, balloons, status])

  const guess = (letter) => {
    if (status !== 'playing' || guessed.has(letter)) return
    const next = new Set(guessed)
    next.add(letter)
    setGuessed(next)
    if (word.includes(letter)) {
      ding()
    } else {
      buzz()
      setBalloons((b) => b - 1)
    }
  }

  return (
    <Screen>
      <TopBar onBack={goLobby} label="Games" />

      <div className="mt-2 flex w-full items-center justify-between gap-3 px-1">
        <ProgressDots total={TOTAL_ROUNDS} done={roundIdx} current={roundIdx} />
        <ScoreBadge label="Score" value={totalScore} />
      </div>

      {/* Balloons (your lives) */}
      <div className="mt-4 flex items-end justify-center gap-1">
        <AnimatePresence>
          {Array.from({ length: balloons }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: [0, -6, 0] }}
              exit={{ scale: [1, 1.4, 0], opacity: 0, transition: { duration: 0.3 } }}
              transition={{ y: { duration: 2 + i * 0.2, repeat: Infinity }, scale: { duration: 0.3 } }}
              className="text-4xl"
            >
              🎈
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-2">
        <ScoreBadge label="Balloons" value={`${balloons}/${MAX_BALLOONS}`} />
      </div>

      {/* Picture hint — the ONLY emoji on screen, so it clearly stands for the word. */}
      <div className="mt-4 flex items-center gap-3">
        <motion.span
          key={word}
          initial={{ scale: 0.6, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-6xl drop-shadow-[0_0_14px_var(--accent)]"
        >
          {entry.emoji}
        </motion.span>
        <button
          onClick={() => speak(word)}
          className="glass rounded-full px-4 py-3 text-lg font-bold"
        >
          🔊 Hear it
        </button>
      </div>

      {/* Word blanks */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {word.split('').map((ch, i) => {
          const shown = guessed.has(ch)
          return (
            <motion.div
              key={i}
              animate={shown ? { scale: [0.6, 1.2, 1] } : {}}
              className="flex h-14 w-12 items-center justify-center rounded-xl border-b-4 font-display text-3xl font-bold uppercase sm:h-16 sm:w-14"
              style={{
                borderColor: 'var(--accent)',
                background: shown ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                color: shown ? 'var(--accent)' : 'transparent',
                boxShadow: shown ? '0 0 12px var(--accent)' : 'none',
              }}
            >
              {shown ? ch : '_'}
            </motion.div>
          )
        })}
      </div>

      {/* Letter keyboard */}
      <div className="mt-5 grid w-full max-w-xl grid-cols-7 gap-2 sm:grid-cols-9">
        {ALPHABET.map((letter) => {
          const used = guessed.has(letter)
          const correct = used && word.includes(letter)
          return (
            <motion.button
              key={letter}
              whileTap={{ scale: 0.85 }}
              disabled={used || status !== 'playing'}
              onClick={() => guess(letter)}
              className="flex aspect-square items-center justify-center rounded-xl font-display text-xl font-bold uppercase disabled:opacity-40"
              style={{
                background: correct
                  ? 'var(--accent)'
                  : used
                    ? 'rgba(255,80,80,0.35)'
                    : 'rgba(255,255,255,0.12)',
                boxShadow: used ? 'none' : '0 0 8px rgba(255,255,255,0.15)',
                color: '#fff',
              }}
            >
              {letter}
            </motion.button>
          )
        })}
      </div>

      {/* Between-word overlay — full screen so it stands out. */}
      {overlay && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-black/55 px-6 text-center backdrop-blur-sm"
        >
          {overlay.win && <Sparkles count={20} />}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 15 }}
            className="neon-text font-display text-5xl font-bold uppercase"
          >
            {overlay.win ? 'Yay! ⭐' : overlay.word}
          </motion.div>
          {!overlay.win && (
            <div className="text-xl font-bold opacity-90">That one was tricky! 🤗</div>
          )}
        </motion.div>
      )}

      {result && (
        <RoundResult
          win
          emoji={theme.critter}
          title={`${TOTAL_ROUNDS} words done!`}
          score={result.score}
          rank={result.rank}
          onPlayAgain={() => setSession((s) => s + 1)}
          onLobby={goLobby}
        />
      )}
    </Screen>
  )
}
