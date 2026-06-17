import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { THEMES, applyTheme } from '../data/themes.js'
import { getDifficulty } from '../data/difficulties.js'
import { loadProfile, saveProfile, clearProfile } from '../lib/storage.js'
import { warmUpVoices } from '../lib/speech.js'

const GameContext = createContext(null)

// Screens: welcome -> theme -> lobby -> difficulty -> game -> leaderboard
export function GameProvider({ children }) {
  const [name, setName] = useState('')
  const [themeId, setThemeId] = useState(null)
  const [screen, setScreen] = useState('welcome')
  const [game, setGame] = useState(null) // 'hangman' | 'unscramble' | 'whack'
  const [difficultyId, setDifficultyId] = useState('baby')

  // Restore a saved player on first load so returning kids skip straight to the lobby.
  useEffect(() => {
    warmUpVoices()
    const p = loadProfile()
    if (p && p.name && p.themeId && THEMES[p.themeId]) {
      setName(p.name)
      setThemeId(p.themeId)
      setScreen('lobby')
    }
  }, [])

  const theme = themeId ? THEMES[themeId] : null
  const difficulty = getDifficulty(difficultyId)

  // Keep the page's CSS theme variables in sync.
  useEffect(() => {
    if (theme) applyTheme(theme)
  }, [theme])

  // Persist the profile whenever name + theme are both known.
  useEffect(() => {
    if (name && themeId) saveProfile({ name, themeId })
  }, [name, themeId])

  const value = useMemo(
    () => ({
      name,
      setName,
      theme,
      themeId,
      setThemeId,
      screen,
      setScreen,
      game,
      setGame,
      difficulty,
      difficultyId,
      setDifficultyId,
      // Navigation helpers
      goTheme: () => setScreen('theme'),
      goLobby: () => {
        setGame(null)
        setScreen('lobby')
      },
      goLeaderboard: () => setScreen('leaderboard'),
      startGame: (g) => {
        setGame(g)
        setScreen('difficulty')
      },
      playWithDifficulty: (id) => {
        setDifficultyId(id)
        setScreen('game')
      },
      switchPlayer: () => {
        clearProfile()
        setName('')
        setThemeId(null)
        setGame(null)
        setScreen('welcome')
      },
    }),
    [name, theme, themeId, screen, game, difficulty, difficultyId],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
