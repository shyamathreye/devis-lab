import { useState } from 'react'
import { motion } from 'framer-motion'
import { isMuted, toggleMute, pop } from '../lib/sound.js'
import { stopSpeaking } from '../lib/speech.js'

// A back arrow on the left and a mute toggle on the right.
export default function TopBar({ onBack, label = 'Back' }) {
  const [muted, setMuted] = useState(isMuted())

  return (
    <div className="flex w-full items-center justify-between gap-3">
      {onBack ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            pop()
            stopSpeaking()
            onBack()
          }}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 text-base font-bold text-white"
        >
          <span className="text-xl">←</span> {label}
        </motion.button>
      ) : (
        <span />
      )}

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => {
          const m = toggleMute()
          setMuted(m)
          if (m) stopSpeaking()
          else pop()
        }}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="glass flex h-12 w-12 items-center justify-center rounded-full text-2xl"
      >
        {muted ? '🔇' : '🔊'}
      </motion.button>
    </div>
  )
}
