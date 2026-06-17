import { useLayoutEffect, useRef, useState } from 'react'

// Sizes a row of `count` tiles so they ALWAYS fit on a single line, no matter
// how long the word gets. Attach the returned `ref` to the row container; the
// tile width/height/font shrink as the word grows and are capped at `max` so
// short words still look big and friendly.
//
// Returns: { ref, size, height, font, gap }
export function useFitTiles(
  count,
  { gap = 8, max = 56, min = 18, ratio = 1.16, fontRatio = 0.56 } = {},
) {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  let size = max
  if (count > 0 && width > 0) {
    const fit = Math.floor((width - gap * (count - 1)) / count)
    size = Math.max(min, Math.min(max, fit))
  }

  return {
    ref,
    gap,
    size,
    height: Math.round(size * ratio),
    font: Math.max(12, Math.round(size * fontRatio)),
  }
}
