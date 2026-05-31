import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getModeConfig, RAINBOW } from '@/lib/modes'
import { getAllMasteryStats, type TableStats } from '@/db/queries'
import { Stars } from '@/components/ui/Stars'
import type { Mode } from '@/lib/tables'

export default function NumberPicker() {
  const { mode } = useParams<{ mode: string }>()
  const navigate = useNavigate()
  const cfg = getModeConfig((mode as Mode) ?? 'multiply')
  const [stats, setStats] = useState<TableStats[]>([])

  useEffect(() => {
    getAllMasteryStats(cfg.id).then(setStats)
  }, [cfg.id])

  return (
    <div className="screen-in" style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          className="key"
          style={{ width: 54, height: 54, fontSize: 22, borderRadius: 18, flexShrink: 0 }}
          onClick={() => navigate('/')}
        >
          ←
        </button>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            {cfg.symbol} {cfg.label}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--sub)', fontWeight: 600, margin: '2px 0 0' }}>
            Koppints egy szintre!
          </p>
        </div>
      </div>

      {/* Number grid: 5 cols × 2 rows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const n = i + 1
          const stat = stats.find(s => s.table === n)
          const color = RAINBOW[i % RAINBOW.length]
          return (
            <div
              key={n}
              className="tile-pop"
              onClick={() => navigate(`/play/${cfg.id}/${n}`)}
            >
              <span style={{ fontSize: 40, fontWeight: 700, color, lineHeight: 1 }}>{n}</span>
              {stat && stat.totalSessions > 0 && (
                <Stars rate={stat.firstTryRate} className="mt-1" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
