import { motion } from 'framer-motion'

// The theme creature, reacting to game state.
// mood: 'happy' | 'cheer' | 'sad' | 'idle'
export default function Mascot({ emoji, mood = 'idle', size = 'text-7xl' }) {
  const animate =
    mood === 'cheer'
      ? { y: [0, -22, 0], rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] }
      : mood === 'sad'
        ? { rotate: [0, -6, 6, 0], y: [0, 4, 0] }
        : { y: [0, -10, 0] }

  const transition =
    mood === 'cheer'
      ? { duration: 0.7, repeat: 2 }
      : mood === 'sad'
        ? { duration: 1.2 }
        : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }

  return (
    <motion.div
      className={`${size} drop-shadow-[0_0_18px_var(--accent)] select-none`}
      animate={animate}
      transition={transition}
      style={{ filter: mood === 'sad' ? 'grayscale(0.4)' : 'none' }}
    >
      {emoji}
    </motion.div>
  )
}
