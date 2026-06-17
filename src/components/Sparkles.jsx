import { motion } from 'framer-motion'

// A celebratory burst of sparkle emojis radiating outward. Mount it (e.g. with
// a changing `key`) to replay the burst on a win.
const BITS = ['✨', '⭐', '🌟', '💫', '🎉', '💖']

export default function Sparkles({ count = 16 }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const dist = 90 + (i % 4) * 28
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      emoji: BITS[i % BITS.length],
      delay: (i % 5) * 0.03,
    }
  })

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute text-3xl"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1.3, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 1, delay: p.delay, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  )
}
