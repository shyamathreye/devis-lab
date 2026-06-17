// Row of dots showing progress through a multi-round game.
// `total` dots, the first `done` filled, the current one highlighted.
export default function ProgressDots({ total, done, current }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const isDone = i < done
        const isCurrent = i === current
        return (
          <span
            key={i}
            className="rounded-full transition-all"
            style={{
              width: isCurrent ? 16 : 12,
              height: isCurrent ? 16 : 12,
              background: isDone || isCurrent ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
              boxShadow: isDone || isCurrent ? '0 0 8px var(--accent)' : 'none',
            }}
          />
        )
      })}
    </div>
  )
}
