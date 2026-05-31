import { Confetti } from '@/components/ui/Confetti'
import { getModeConfig } from '@/lib/modes'
import type { QuestionRecord } from '@/db/index'
import type { Mode } from '@/lib/tables'
import { useNavigate } from 'react-router-dom'

interface SummaryScreenProps {
  mode: Mode
  n: number
  records: QuestionRecord[]
  fruits: string[]
  onReplay: () => void
}

export function SummaryScreen({ mode, n, records, fruits, onReplay }: SummaryScreenProps) {
  const navigate = useNavigate()
  const cfg = getModeConfig(mode)
  const firstTry = records.filter(r => r.firstTryCorrect).length
  const total = records.length
  const rate = total > 0 ? Math.round((firstTry / total) * 100) : 0

  return (
    <div className="screen-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      padding: '40px 20px',
    }}>
      <Confetti count={50} />

      <div style={{ fontSize: 76, lineHeight: 1 }}>🎉</div>
      <h1 style={{ fontSize: 46, fontWeight: 700, color: 'var(--ink)', margin: 0, textAlign: 'center' }}>
        Szuper munka!
      </h1>
      <div style={{ fontSize: 48, lineHeight: 1 }}>🐝</div>

      {/* Stats panel */}
      <div style={{
        width: '100%',
        maxWidth: 460,
        background: 'var(--surface)',
        borderRadius: 28,
        padding: '26px 30px',
        boxShadow: '0 8px 0 var(--line)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        <Row label="Mód" value={`${cfg.symbol} ${cfg.label}`} />
        <Row label="Szám" value={String(n)} />
        <Row label="Elsőre jó" value={`${rate}%`} accent />
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          <div style={{ fontSize: 14, color: 'var(--sub)', marginBottom: 6 }}>
            Összegyűjtve ({fruits.length} db)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {fruits.map((f, i) => <span key={i} style={{ fontSize: 24 }}>{f}</span>)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button className="key" style={{ padding: '14px 28px', fontSize: 18, borderRadius: 999 }} onClick={onReplay}>
          Még egyszer
        </button>
        <button className="pbtn" onClick={() => navigate('/')}>
          Főmenü
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--sub)', fontSize: 16 }}>{label}</span>
      <span style={{
        fontWeight: 700,
        fontSize: 18,
        color: accent ? 'var(--primary)' : 'var(--ink)',
      }}>{value}</span>
    </div>
  )
}
