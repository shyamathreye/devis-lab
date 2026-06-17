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
import { speak, stopSpeaking } from '../lib/speech.js'
import { addScore } from '../lib/storage.js'
import { useFitTiles } from '../lib/useFitTiles.js'

// On-screen keyboard layouts. Rows keep each line short enough to fit.
const KEYBOARDS = {
  abc: ['abcdefg', 'hijklmn', 'opqrstu', 'vwxyz'],
  qwerty: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
}
const MAX_BALLOONS = 6
const TOTAL_ROUNDS = 6

export default function Hangman() {
  const { name, theme, difficulty, goLobby, copy, keyboardLayout, toggleKeyboardLayout } = useGame()
  const [speaking, setSpeaking] = useState(false)
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

  // Keep the word blanks on one line for any word length.
  const blanksFit = useFitTiles(word.length, { max: 56, min: 22, gap: 8 })
  // Keyboard: size keys so the widest row fits on one line.
  const rows = KEYBOARDS[keyboardLayout] || KEYBOARDS.abc
  const keyCols = Math.max(...rows.map((r) => r.length))
  const keyFit = useFitTiles(keyCols, { max: 46, min: 26, gap: 6, ratio: 1, fontRatio: 0.5 })

  // New session -> back to round 1.
  useEffect(() => {
    setRoundIdx(0)
    setTotalScore(0)
    setResult(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // (Re)start a round.
  useEffect(() => {
    stopSpeaking()
    setSpeaking(false)
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
      <TopBar onBack={goLobby} label={copy.t('backGames')} />

      <div className="mt-2 flex w-full items-center justify-between gap-3 px-1">
        <ProgressDots total={TOTAL_ROUNDS} done={roundIdx} current={roundIdx} />
        <ScoreBadge label={copy.t('scoreLabel')} value={totalScore} />
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
          onClick={() => setSpeaking(speak(word, () => setSpeaking(false)))}
          className="glass rounded-full px-4 py-3 text-lg font-bold"
        >
          {copy.t('hearIt')}
        </button>
        {speaking && (
          <button
            onClick={() => {
              stopSpeaking()
              setSpeaking(false)
            }}
            className="glass rounded-full px-4 py-3 text-lg font-bold"
            style={{ boxShadow: '0 0 12px var(--accent)' }}
          >
            {copy.t('stopAudio')}
          </button>
        )}
      </div>

      {/* Word blanks — sized to always stay on one line. */}
      <div
        ref={blanksFit.ref}
        className="mt-4 flex w-full max-w-xl flex-nowrap justify-center"
        style={{ gap: blanksFit.gap }}
      >
        {word.split('').map((ch, i) => {
          const shown = guessed.has(ch)
          return (
            <motion.div
              key={i}
              animate={shown ? { scale: [0.6, 1.2, 1] } : {}}
              className="flex shrink-0 items-center justify-center rounded-xl border-b-4 font-display font-bold uppercase"
              style={{
                width: blanksFit.size,
                height: blanksFit.height,
                fontSize: blanksFit.font,
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

      {/* Keyboard layout toggle (ABC ⇄ QWERTY) */}
      <div className="mt-5 flex w-full max-w-xl items-center justify-end">
        <button
          onClick={toggleKeyboardLayout}
          className="glass rounded-full px-3 py-1.5 text-xs font-bold"
          aria-label="Switch keyboard layout"
        >
          ⌨️ {keyboardLayout === 'qwerty' ? 'QWERTY' : 'ABC'}
        </button>
      </div>

      {/* Letter keyboard — rows sized to fit one line each. */}
      <div ref={keyFit.ref} className="mt-2 flex w-full max-w-xl flex-col items-center" style={{ gap: keyFit.gap }}>
        {rows.map((row, ri) => (
          <div key={ri} className="flex justify-center" style={{ gap: keyFit.gap }}>
            {row.split('').map((letter) => {
              const used = guessed.has(letter)
              const correct = used && word.includes(letter)
              return (
                <motion.button
                  key={letter}
                  whileTap={{ scale: 0.85 }}
                  disabled={used || status !== 'playing'}
                  onClick={() => guess(letter)}
                  className="flex shrink-0 items-center justify-center rounded-xl font-display font-bold uppercase disabled:opacity-40"
                  style={{
                    width: keyFit.size,
                    height: keyFit.height,
                    fontSize: keyFit.font,
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
        ))}
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
            {overlay.win ? copy.t('roundWin') : overlay.word}
          </motion.div>
          {!overlay.win && (
            <div className="text-xl font-bold opacity-90">{copy.t('roundTricky')}</div>
          )}
        </motion.div>
      )}

      {result && (
        <RoundResult
          win
          emoji={theme.critter}
          title={copy.t('wordsDone')(TOTAL_ROUNDS)}
          score={result.score}
          rank={result.rank}
          onPlayAgain={() => setSession((s) => s + 1)}
          onLobby={goLobby}
        />
      )}
    </Screen>
  )
}
