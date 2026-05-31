import { RAINBOW } from '@/lib/modes'

interface ProgressTrackProps {
  current: number
  total: number
}

export function ProgressTrack({ current, total }: ProgressTrackProps) {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
      {/* Rail */}
      <div style={{
        width: '100%',
        height: 10,
        borderRadius: 999,
        background: 'var(--line)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${RAINBOW[3]}, ${RAINBOW[0]})`,
          borderRadius: 999,
          transition: 'width 0.45s cubic-bezier(.2,.9,.3,1.1)',
        }} />
      </div>
      {/* Travelling bee avatar */}
      <div style={{
        position: 'absolute',
        left: `calc(${pct}% - 16px)`,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 28,
        transition: 'left 0.45s cubic-bezier(.2,.9,.3,1.1)',
        lineHeight: 1,
        pointerEvents: 'none',
      }}>
        🐝
      </div>
    </div>
  )
}
