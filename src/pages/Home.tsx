import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MODES } from '@/lib/modes'
import { getStreak, getTotalStars } from '@/db/queries'

export default function Home() {
  const navigate = useNavigate()
  const [streak, setStreak] = useState(0)
  const [stars, setStars] = useState(0)

  useEffect(() => {
    getStreak().then(setStreak)
    getTotalStars().then(setStars)
  }, [])

  return (
    <div className="screen-in" style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--sub)', margin: 0 }}>Mit tanulunk ma?</p>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: 'var(--ink)', margin: '4px 0 0' }}>
            Szia Gvendolin! 👋
          </h1>
        </div>
        <div className="animate-bob" style={{ fontSize: 86, lineHeight: 1 }}>🐝</div>
      </div>

      {/* Stat chips */}
      <div style={{ display: 'flex', gap: 12 }}>
        <Chip icon="🔥" value={streak} label="napos sorozat" />
        <Chip icon="⭐" value={stars} label="csillag összesen" />
      </div>

      {/* Mode cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {MODES.map(mode => (
          <div
            key={mode.id}
            className="mode-card"
            onClick={() => navigate(`/play/${mode.id}`)}
          >
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: mode.badgeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 14,
              textShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}>
              {mode.symbol}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>{mode.label}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--sub)', marginTop: 4 }}>{mode.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Chip({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 20,
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: '0 4px 0 var(--line)',
      flex: 1,
    }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--sub)', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  )
}
