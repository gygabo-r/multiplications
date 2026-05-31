import { useEffect, useState } from 'react'
import { getAllDates, getAllMasteryStats, getRecentSessions, type TableStats } from '@/db/queries'
import type { Session } from '@/db/index'
import { Stars } from '@/components/ui/Stars'
import { MODES, RAINBOW } from '@/lib/modes'
import type { Mode } from '@/lib/tables'

function CalendarHeatmap({ dates }: { dates: string[] }) {
  const dateSet = new Set(dates)
  const today = new Date()
  const cells: { date: string; active: boolean }[] = []
  for (let i = 69; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    cells.push({ date: iso, active: dateSet.has(iso) })
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6 }}>
        {cells.map(cell => (
          <div
            key={cell.date}
            title={cell.date}
            style={{
              aspectRatio: '1',
              borderRadius: 6,
              background: cell.active ? RAINBOW[3] : 'var(--line)',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 12, color: 'var(--sub)', marginTop: 6 }}>
        {dates.length} aktív nap az utolsó 70-ből
      </p>
    </div>
  )
}

export default function Stats() {
  const [dates, setDates] = useState<string[]>([])
  const [activeMode, setActiveMode] = useState<Mode>('multiply')
  const [tableStats, setTableStats] = useState<TableStats[]>([])
  const [recent, setRecent] = useState<Session[]>([])

  useEffect(() => {
    getAllDates().then(setDates)
    getRecentSessions(10).then(setRecent)
  }, [])

  useEffect(() => {
    getAllMasteryStats(activeMode).then(setTableStats)
  }, [activeMode])

  return (
    <div className="screen-in" style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>Hogy megy? 📊</h1>

      {/* Heatmap + recent sessions side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Panel title="Aktív napok">
          <CalendarHeatmap dates={dates} />
        </Panel>

        <Panel title="Legutóbbi körök">
          {recent.length === 0
            ? <p style={{ color: 'var(--sub)', fontSize: 14 }}>Még nincs befejezett kör.</p>
            : recent.slice(0, 6).map(s => {
              const modeCfg = MODES.find(m => m.id === s.mode)
              const firstTry = s.questions.filter(q => q.firstTryCorrect).length
              return (
                <div key={s.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--line)',
                }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      {modeCfg?.symbol ?? '×'} {s.table}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--sub)', marginLeft: 8 }}>{s.date.slice(5)}</span>
                  </div>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    {firstTry}/{s.questions.length}
                  </span>
                </div>
              )
            })
          }
        </Panel>
      </div>

      {/* Mode toggle */}
      <Panel title="">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {MODES.map(m => (
            <button
              key={m.id}
              className="key"
              style={{
                flex: 1,
                height: 44,
                fontSize: 16,
                borderRadius: 999,
                background: activeMode === m.id ? RAINBOW[0] : 'var(--key-bg)',
                color: activeMode === m.id ? '#fff' : 'var(--ink)',
                boxShadow: `0 4px 0 ${activeMode === m.id ? 'rgba(255,111,145,0.3)' : 'var(--key-shadow)'}`,
              }}
              onClick={() => setActiveMode(m.id)}
            >
              {m.symbol} {m.label}
            </button>
          ))}
        </div>

        {/* Mastery grid 5 cols */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {tableStats.map(s => (
            <div key={s.table} style={{
              background: 'var(--surface)',
              borderRadius: 16,
              padding: '12px 8px',
              textAlign: 'center',
              border: '2px solid var(--line)',
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: RAINBOW[s.table % RAINBOW.length] }}>
                {s.table}
              </div>
              {s.totalSessions === 0
                ? <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 4 }}>Nincs adat</div>
                : <>
                  <Stars rate={s.firstTryRate} className="justify-center mt-1" />
                  <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 2 }}>
                    {Math.round(s.firstTryRate * 100)}%
                  </div>
                </>
              }
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 28,
      padding: '20px 24px',
      boxShadow: '0 6px 0 var(--line)',
    }}>
      {title && <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginTop: 0, marginBottom: 12 }}>{title}</h2>}
      {children}
    </div>
  )
}
