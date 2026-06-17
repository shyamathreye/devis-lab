import { useState } from 'react'
import { motion } from 'framer-motion'
import Screen from '../components/Screen.jsx'
import NeonButton from '../components/NeonButton.jsx'
import FullscreenButton from '../components/FullscreenButton.jsx'
import { useGame } from '../context/GameContext.jsx'
import { unlockAudio, ding } from '../lib/sound.js'

export default function Welcome() {
  const { setName, goTheme } = useGame()
  const [value, setValue] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const clean = value.trim().slice(0, 14)
    if (!clean) return
    unlockAudio()
    ding()
    setName(clean)
    goTheme()
  }

  return (
    <Screen className="justify-center text-center">
      <div className="fixed right-3 top-3 z-50">
        <FullscreenButton />
      </div>
      <motion.div
        className="text-7xl"
        animate={{ rotate: [0, -10, 10, 0], y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        🦄
      </motion.div>

      <h1 className="neon-text mt-3 font-display text-5xl font-bold sm:text-6xl">
        Devi Jones
      </h1>
      <p className="mt-2 text-lg font-semibold opacity-90">
        ✨ Games, words & giggles ✨
      </p>

      <form onSubmit={submit} className="mt-10 flex w-full max-w-sm flex-col items-center gap-5">
        <label className="text-xl font-bold">Hi! What's your name?</label>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here…"
          maxLength={14}
          className="w-full rounded-2xl border-4 border-white/20 bg-white/10 px-5 py-4 text-center font-display text-2xl text-white placeholder-white/40 outline-none focus:border-white/50"
          style={{ boxShadow: '0 0 16px var(--accent)' }}
        />
        <NeonButton type="submit" silent className="w-full text-2xl" onClick={() => {}}>
          Let's Play! 🎉
        </NeonButton>
      </form>
    </Screen>
  )
}
