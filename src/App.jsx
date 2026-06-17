import { AnimatePresence } from 'framer-motion'
import { useGame } from './context/GameContext.jsx'
import Welcome from './screens/Welcome.jsx'
import ThemePicker from './screens/ThemePicker.jsx'
import Lobby from './screens/Lobby.jsx'
import DifficultyPicker from './screens/DifficultyPicker.jsx'
import Leaderboard from './screens/Leaderboard.jsx'
import Hangman from './games/Hangman.jsx'
import Unscramble from './games/Unscramble.jsx'
import WhackAMole from './games/WhackAMole.jsx'

export default function App() {
  const { screen, game, theme, difficultyId } = useGame()

  let content
  if (screen === 'welcome') content = <Welcome />
  else if (screen === 'theme') content = <ThemePicker />
  else if (screen === 'lobby') content = <Lobby />
  else if (screen === 'difficulty') content = <DifficultyPicker />
  else if (screen === 'leaderboard') content = <Leaderboard />
  else if (screen === 'game') {
    // Re-key games by game+difficulty so a fresh mount resets all state.
    const key = `${game}-${difficultyId}`
    if (game === 'hangman') content = <Hangman key={key} />
    else if (game === 'unscramble') content = <Unscramble key={key} />
    else if (game === 'whack') content = <WhackAMole key={key} />
  }

  // Guard: if somehow on a themed screen without a theme, fall back gracefully.
  if (screen !== 'welcome' && screen !== 'theme' && !theme) {
    content = <Welcome />
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <div
          key={screen + (screen === 'game' ? game : '')}
          className="h-full w-full overflow-y-auto overflow-x-hidden"
        >
          {content}
        </div>
      </AnimatePresence>
    </div>
  )
}
