import { motion } from 'framer-motion'

// Centered, scrollable, animated page container shared by all screens.
export default function Screen({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className={`relative z-10 mx-auto flex min-h-full w-full max-w-3xl flex-col items-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] ${className}`}
    >
      {children}
    </motion.div>
  )
}
