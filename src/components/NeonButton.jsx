import { motion } from 'framer-motion'
import { pop, unlockAudio } from '../lib/sound.js'

// Big, bouncy, neon-glowing button. Huge tap target by default.
export default function NeonButton({
  children,
  onClick,
  color = 'var(--accent)',
  className = '',
  silent = false,
  type = 'button',
  ...rest
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      onClick={(e) => {
        unlockAudio()
        if (!silent) pop()
        onClick && onClick(e)
      }}
      className={`relative rounded-3xl px-7 py-4 text-xl font-bold text-white min-h-[64px] ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 55%, #000))`,
        boxShadow: `0 0 14px ${color}, 0 6px 0 color-mix(in srgb, ${color} 45%, #000)`,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
