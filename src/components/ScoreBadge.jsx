import { motion } from 'framer-motion'

// A glowing pill showing a label + value (score, time, etc.).
export default function ScoreBadge({ label, value, color = 'var(--accent2)', pulse = false }) {
  return (
    <motion.div
      className="glass flex flex-col items-center rounded-2xl px-5 py-2 min-w-[88px]"
      animate={pulse ? { scale: [1, 1.12, 1] } : {}}
      transition={{ duration: 0.3 }}
      style={{ boxShadow: `0 0 12px ${color}` }}
    >
      <span className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</span>
      <span className="font-display text-2xl font-bold" style={{ color }}>
        {value}
      </span>
    </motion.div>
  )
}
