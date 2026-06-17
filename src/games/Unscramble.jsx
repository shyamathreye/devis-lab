import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import TopBar from '../components/TopBar.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import Sparkles from '../components/Sparkles.jsx'
import RoundResult from '../components/RoundResult.jsx'
import { useGame } from '../context/GameContext.jsx'
import { getRounds } from '../data/words.js'
import { scrambleWord } from '../lib/scramble.js'
import { pop, ding, buzz, fanfare } from '../lib/sound.js'
import { speak, spell, stopSpeaking } from '../lib/speech.js'
import { addScore } from '../lib/storage.js'
import { useFitTiles } from '../lib/useFitTiles.js'

const TOTAL_ROUNDS = 6

export default function Unscramble() {
  const { name, theme, difficulty, goLobby, copy } = useGame()
  const [speaking, setSpeaking] = useState(false)
  const [session, setSession] = useState(0) // bump to start a brand-new 6-word game
  // Fixed list of words for this game session.
  const words = useMemo(
    () => getRounds(theme.id, difficulty.bucket, TOTAL_ROUNDS),
    [theme.id, difficulty.bucket, session],
  )

  const [roundIdx, setRoundIdx] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [trayTiles, setTrayTiles] = useState([]) // FIXED order — never reorders
  const [placedSlots, setPlacedSlots] = useState([]) // answer slots: tileId | null
  const [wrong, setWrong] = useState(false)
  const [solved, setSolved] = useState(false) // brief celebration between words
  const [startAt, setStartAt] = useState(0)
  const [hintStage, setHintStage] = useState(0) // 0 none, 1 clue, 2 say, 3 spell
  const [result, setResult] = useState(null)

  const entry = words[roundIdx]
  const word = entry.word

  // Keep the answer slots and the letter tray on one line for any word length.
  const slotsFit = useFitTiles(word.length, { max: 56, min: 22, gap: 8, ratio: 1.14 })
  const trayFit = useFitTiles(word.length, { max: 56, min: 22, gap: 8, ratio: 1.14 })

  const tileById = useMemo(() => {
    const m = {}
    trayTiles.forEach((t) => (m[t.id] = t))
    return m
  }, [trayTiles])
  const placedIds = useMemo(() => new Set(placedSlots.filter((x) => x !== null)), [placedSlots])

  // (Re)initialise the current round. No automatic speech.
  useEffect(() => {
    stopSpeaking()
    setSpeaking(false)
    setTrayTiles(scrambleWord(word))
    setPlacedSlots(Array(word.length).fill(null))
    setWrong(false)
    setSolved(false)
    setHintStage(0)
    setStartAt(Date.now())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, session])

  // Reset to the first round when a new session starts.
  useEffect(() => {
    setRoundIdx(0)
    setTotalScore(0)
    setResult(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const placeTile = (tile) => {
    if (solved || result || placedIds.has(tile.id)) return
    const idx = placedSlots.findIndex((s) => s === null)
    if (idx === -1) return
    pop()
    const next = [...placedSlots]
    next[idx] = tile.id
    setPlacedSlots(next)
    setWrong(false)
    if (idx === next.length - 1) checkAnswer(next)
  }

  const removeSlot = (idx) => {
    if (solved || result || placedSlots[idx] === null) return
    pop()
    const next = [...placedSlots]
    next[idx] = null
    setPlacedSlots(next)
    setWrong(false)
  }

  // 3-stage hint: 1) show a text clue, 2) say the word, 3) spell it out.
  const useHint = () => {
    pop()
    const stage = Math.min(hintStage + 1, 3)
    setHintStage(stage)
    if (stage === 2) setSpeaking(speak(word, () => setSpeaking(false)))
    else if (stage === 3) setSpeaking(spell(word, () => setSpeaking(false)))
  }
  const hintLabel = [
    copy.t('hintClue'),
    copy.t('hintSay'),
    copy.t('hintSpell'),
    copy.t('hintSpell'),
  ][hintStage]

  const checkAnswer = (slots) => {
    const attempt = slots.map((id) => tileById[id]?.ch).join('')
    if (attempt === word) {
      stopSpeaking()
      setSpeaking(false)
      fanfare()
      const elapsed = (Date.now() - startAt) / 1000
      const speedBonus = Math.max(0, 30 - Math.floor(elapsed))
      const roundScore = (40 + speedBonus) * difficulty.scoreMultiplier
      const newTotal = totalScore + roundScore
      setTotalScore(newTotal)
      setSolved(true)
      // Move on after a short celebration.
      setTimeout(() => {
        if (roundIdx + 1 < TOTAL_ROUNDS) {
          setRoundIdx((r) => r + 1)
        } else {
          const { rank } = addScore('unscramble', {
            name,
            theme: theme.id,
            difficulty: difficulty.id,
            score: newTotal,
          })
          setResult({ score: newTotal, rank })
        }
      }, 1200)
    } else {
      buzz()
      setWrong(true)
    }
  }

  return (
    <Screen>
      <TopBar onBack={goLobby} label={copy.t('backGames')} />

      <div className="mt-2 flex w-full items-center justify-between gap-3 px-1">
        <ProgressDots total={TOTAL_ROUNDS} done={roundIdx} current={roundIdx} />
        <ScoreBadge label={copy.t('scoreLabel')} value={totalScore} />
      </div>

      <h2 className="neon-text mt-3 text-center font-display text-2xl font-bold">
        {copy.t('spellWord')}
      </h2>

      {/* Picture hint */}
      <motion.span
        key={word + roundIdx}
        initial={{ scale: 0.6, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        className="mt-3 text-7xl drop-shadow-[0_0_16px_var(--accent)]"
      >
        {entry.emoji}
      </motion.span>

      {/* Hint #1: a text clue (shown once the Hint button is tapped). */}
      {hintStage >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mt-3 max-w-sm rounded-2xl px-5 py-3 text-center text-base font-semibold"
        >
          💭 {entry.clue}
        </motion.div>
      )}

      {/* Answer slots (fixed) — sized to stay on one line. */}
      <motion.div
        ref={slotsFit.ref}
        className="mt-5 flex w-full max-w-xl flex-nowrap justify-center"
        style={{ gap: slotsFit.gap }}
        animate={wrong ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.45 }}
      >
        {placedSlots.map((tileId, i) => {
          const tile = tileId !== null ? tileById[tileId] : null
          return (
            <button
              key={i}
              onClick={() => removeSlot(i)}
              className="flex shrink-0 items-center justify-center rounded-2xl border-4 font-display font-bold uppercase"
              style={{
                width: slotsFit.size,
                height: slotsFit.height,
                fontSize: slotsFit.font,
                borderColor: solved ? 'var(--accent2)' : 'var(--accent)',
                background: tile
                  ? solved
                    ? 'var(--accent2)'
                    : 'var(--accent)'
                  : 'rgba(255,255,255,0.05)',
                color: '#fff',
                boxShadow: tile ? '0 0 12px var(--accent)' : 'none',
              }}
            >
              {tile ? tile.ch : ''}
            </button>
          )
        })}
      </motion.div>

      {/* Letter tray — FIXED positions, one line. A placed tile leaves an empty
          hole behind, so nothing ever shifts around. */}
      <div
        ref={trayFit.ref}
        className="mt-7 flex w-full max-w-xl flex-nowrap justify-center"
        style={{ gap: trayFit.gap, minHeight: trayFit.height }}
      >
        {trayTiles.map((tile) => {
          const used = placedIds.has(tile.id)
          if (used) {
            // Empty placeholder keeps this slot's position reserved.
            return (
              <div
                key={tile.id}
                className="shrink-0 rounded-2xl border-2 border-dashed"
                style={{
                  width: trayFit.size,
                  height: trayFit.height,
                  borderColor: 'rgba(255,255,255,0.18)',
                }}
              />
            )
          }
          return (
            <motion.button
              key={tile.id}
              whileTap={{ scale: 0.85 }}
              onClick={() => placeTile(tile)}
              className="flex shrink-0 items-center justify-center rounded-2xl font-display font-bold uppercase text-white"
              style={{
                width: trayFit.size,
                height: trayFit.height,
                fontSize: trayFit.font,
                background: 'rgba(255,255,255,0.16)',
                boxShadow: '0 0 10px rgba(255,255,255,0.25)',
              }}
            >
              {tile.ch}
            </motion.button>
          )
        })}
      </div>

      {/* Hint — taps cycle: show clue, then say the word, then spell it.
          Voice only ever fires here, on an explicit tap. */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={useHint}
            className="glass rounded-full px-6 py-3 text-lg font-bold"
            style={{ boxShadow: '0 0 12px var(--accent)' }}
          >
            {hintLabel}
          </button>
          {speaking && (
            <button
              onClick={() => {
                stopSpeaking()
                setSpeaking(false)
              }}
              className="glass rounded-full px-5 py-3 text-lg font-bold"
              style={{ boxShadow: '0 0 12px var(--accent)' }}
            >
              {copy.t('stopAudio')}
            </button>
          )}
        </div>
        <span className="text-xs font-semibold opacity-60">
          {copy.t('hintHelp')}
        </span>
      </div>

      {/* Between-word celebration — full-screen overlay so it really pops. */}
      {solved && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm"
        >
          <Sparkles count={20} />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 15 }}
            className="neon-text text-center font-display text-6xl font-bold"
          >
            {roundIdx + 1 < TOTAL_ROUNDS ? copy.t('roundWin') : copy.t('allDone')}
          </motion.div>
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
