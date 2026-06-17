import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import TopBar from '../components/TopBar.jsx'
import { useGame } from '../context/GameContext.jsx'
import { THEME_LIST, applyTheme } from '../data/themes.js'
import { ding } from '../lib/sound.js'

export default function ThemePicker() {
  const { name, setThemeId, setScreen, goLobby, copy } = useGame()

  const choose = (theme) => {
    applyTheme(theme)
    ding()
    setThemeId(theme.id)
    goLobby()
  }

  return (
    <Screen>
      <TopBar onBack={() => setScreen('welcome')} label={copy.t('backBack')} />
      <h2 className="neon-text mt-4 text-center font-display text-3xl font-bold sm:text-4xl">
        {copy.t('pickWorld')(name)}
      </h2>
      <p className="mt-1 text-center text-base opacity-85">{copy.t('pickWorldHint')}</p>

      <div className="mt-7 grid w-full grid-cols-2 gap-4 sm:gap-5">
        {THEME_LIST.map((theme, i) => (
          <motion.button
            key={theme.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => choose(theme)}
            className="flex flex-col items-center gap-2 rounded-3xl border-4 p-5 text-center"
            style={{
              borderColor: theme.accent,
              background: `linear-gradient(150deg, ${theme.bgTo}, ${theme.bgFrom})`,
              boxShadow: `0 0 18px ${theme.accent}`,
            }}
          >
            <span className="text-6xl drop-shadow-lg">{theme.emoji}</span>
            <span className="font-display text-2xl font-bold" style={{ color: theme.accent }}>
              {theme.name}
            </span>
            <span className="text-sm opacity-80">{theme.blurb}</span>
          </motion.button>
        ))}
      </div>
    </Screen>
  )
}
