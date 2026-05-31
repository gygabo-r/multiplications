import { useMemo } from 'react'
import { RAINBOW } from '@/lib/modes'

interface ConfettiProps {
  count?: number
}

export function Confetti({ count = 50 }: ConfettiProps) {
  const pieces = useMemo(() => (
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: RAINBOW[Math.floor(Math.random() * RAINBOW.length)],
      delay: `${Math.random() * 0.8}s`,
      duration: `${1.4 + Math.random() * 1.2}s`,
      size: `${8 + Math.random() * 8}px`,
      shape: Math.random() > 0.5 ? '50%' : '2px',
    }))
  ), [count])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map(p => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape,
            animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}
