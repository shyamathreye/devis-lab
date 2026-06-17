import { useState } from 'react'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import TopBar from '../components/TopBar.jsx'
import { useGame } from '../context/GameContext.jsx'
import { getBoard, clearBoard } from '../lib/storage.js'
import { DIFFICULTIES } from '../data/difficulties.js'
import { THEMES } from '../data/themes.js'
import { pop } from '../lib/sound.js'

const GAME_IDS = ['hangman', 'unscramble', 'whack']

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { name, goLobby, copy } = useGame()
  const [game, setGame] = useState('hangman')
  const [diff, setDiff] = useState('all')
  const [version, setVersion] = useState(0) // bump to re-read after clearing

  const games = GAME_IDS.map((id) => ({ id, name: copy.gameShort(id), emoji: copy.game(id).emoji }))

  let rows = getBoard(game)
  if (diff !== 'all') rows = rows.filter((r) => r.difficulty === diff)
  rows = [...rows].sort((a, b) => b.score - a.score).slice(0, 10)

  const clear = () => {
    if (window.confirm(copy.t('clearConfirm'))) {
      clearBoard(game)
      setVersion((v) => v + 1)
    }
  }

  return (
    <Screen>
      <TopBar onBack={goLobby} label={copy.t('backHome')} />
      <h1 className="neon-text mt-2 font-display text-4xl font-bold">{copy.t('leaderboardTitle')}</h1>

      {/* Game tabs */}
      <div className="mt-4 flex w-full justify-center gap-2">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              pop()
              setGame(g.id)
            }}
            className="flex-1 rounded-2xl px-2 py-3 text-base font-bold"
            style={{
              background: game === g.id ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
              boxShadow: game === g.id ? '0 0 12px var(--accent)' : 'none',
            }}
          >
            <span className="text-xl">{g.emoji}</span>
            <div className="text-sm">{g.name}</div>
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Chip active={diff === 'all'} onClick={() => setDiff('all')}>
          {copy.t('filterAll')}
        </Chip>
        {DIFFICULTIES.map((d) => (
          <Chip key={d.id} active={diff === d.id} onClick={() => setDiff(d.id)}>
            {d.emoji} {copy.diff(d.id).name}
          </Chip>
        ))}
      </div>

      {/* Rows */}
      <div className="mt-5 flex w-full flex-col gap-2" key={version}>
        {rows.length === 0 && (
          <p className="mt-6 text-center text-lg opacity-75">
            {copy.t('noScores')}
          </p>
        )}
        {rows.map((r, i) => {
          const isMe = r.name === name
          return (
            <motion.div
              key={r.ts + '' + i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{
                background: isMe ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                border: isMe ? '2px solid var(--accent)' : '2px solid transparent',
                boxShadow: isMe ? '0 0 12px var(--accent)' : 'none',
              }}
            >
              <span className="w-8 text-center text-2xl font-bold">
                {MEDALS[i] || i + 1}
              </span>
              <span className="text-2xl">{THEMES[r.theme]?.emoji || '⭐'}</span>
              <span className="flex-1 truncate font-display text-xl font-bold">
                {r.name}
                {isMe && <span className="ml-1 text-sm opacity-70">(you)</span>}
              </span>
              <span className="text-xs opacity-70">
                {copy.diff(r.difficulty)?.name}
              </span>
              <span className="font-display text-2xl font-bold" style={{ color: 'var(--accent2)' }}>
                {r.score}
              </span>
            </motion.div>
          )
        })}
      </div>

      {rows.length > 0 && (
        <button
          onClick={clear}
          className="mt-6 rounded-full px-5 py-2 text-sm font-bold opacity-60 underline"
        >
          {copy.t('clearScores')}
        </button>
      )}
    </Screen>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={() => {
        pop()
        onClick()
      }}
      className="rounded-full px-3 py-2 text-sm font-bold"
      style={{
        background: active ? 'var(--accent2)' : 'rgba(255,255,255,0.1)',
        boxShadow: active ? '0 0 10px var(--accent2)' : 'none',
      }}
    >
      {children}
    </button>
  )
}
