import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { pop } from '../lib/sound.js'

// Small, subtle toggle for distraction-free full-screen play.
// Uses the Fullscreen API (with webkit fallback) and hides itself where unsupported.
function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null
}

export default function FullscreenButton() {
  const [isFs, setIsFs] = useState(false)
  const supported =
    typeof document !== 'undefined' &&
    !!(document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen)

  useEffect(() => {
    const onChange = () => setIsFs(!!fullscreenElement())
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  if (!supported) return null

  const toggle = () => {
    pop()
    const el = document.documentElement
    try {
      if (fullscreenElement()) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen
        const p = exit && exit.call(document)
        if (p && p.catch) p.catch(() => {})
      } else {
        const req = el.requestFullscreen || el.webkitRequestFullscreen
        const p = req && req.call(el)
        if (p && p.catch) p.catch(() => {}) // some browsers/iframes block it — ignore
      }
    } catch (e) {
      /* fullscreen not allowed here — no-op */
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={toggle}
      aria-label={isFs ? 'Exit full screen' : 'Full screen'}
      title={isFs ? 'Exit full screen' : 'Full screen'}
      className="flex h-10 w-10 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
      style={{
        background: 'rgba(255,255,255,0.07)',
        border: '2px solid rgba(255,255,255,0.12)',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isFs ? (
          // Compress (arrows pointing in)
          <>
            <path d="M9 3v3a2 2 0 0 1-2 2H4" />
            <path d="M15 3v3a2 2 0 0 0 2 2h3" />
            <path d="M9 21v-3a2 2 0 0 0-2-2H4" />
            <path d="M15 21v-3a2 2 0 0 1 2-2h3" />
          </>
        ) : (
          // Expand (corner brackets)
          <>
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M16 3h3a2 2 0 0 1 2 2v3" />
            <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </>
        )}
      </svg>
    </motion.button>
  )
}
