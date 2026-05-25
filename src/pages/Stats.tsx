import { useEffect, useState } from 'react'
import { getAllDates, getAllTableStats, getRecentSessions, type TableStats } from '@/db/queries'
import type { Session } from '@/db/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function CalendarHeatmap({ dates }: { dates: string[] }) {
  const dateSet = new Set(dates)
  const today = new Date()
  // Show last 70 days
  const cells: { date: string; active: boolean }[] = []
  for (let i = 69; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    cells.push({ date: iso, active: dateSet.has(iso) })
  }

  return (
    <div>
      <div className="grid grid-cols-10 gap-1">
        {cells.map(cell => (
          <div
            key={cell.date}
            title={cell.date}
            className={`w-6 h-6 rounded-sm ${cell.active ? 'bg-indigo-500' : 'bg-gray-100'}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-1">Utolsó 70 nap</p>
    </div>
  )
}

function TableGrid({ stats }: { stats: TableStats[] }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {stats.map(s => (
        <Card key={s.table} className="text-center">
          <CardContent className="pt-3 pb-2 px-2">
            <div className="text-lg font-bold text-indigo-600">{s.table}×</div>
            {s.totalSessions === 0 ? (
              <div className="text-xs text-muted-foreground mt-1">Nincs adat</div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground">{s.totalSessions} kör</div>
                <div className="text-xs mt-1">
                  <span className="text-green-600 font-semibold">
                    {Math.round(s.firstTryRate * 100)}%
                  </span>
                  <span className="text-muted-foreground"> első</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function Stats() {
  const [dates, setDates] = useState<string[]>([])
  const [tableStats, setTableStats] = useState<TableStats[]>([])
  const [recent, setRecent] = useState<Session[]>([])

  useEffect(() => {
    getAllDates().then(setDates)
    getAllTableStats().then(setTableStats)
    getRecentSessions(10).then(setRecent)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statisztikák 📊</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Aktív napok</CardTitle></CardHeader>
        <CardContent>
          <CalendarHeatmap dates={dates} />
          <p className="text-sm mt-2 text-muted-foreground">
            Összesen <strong>{dates.length}</strong> nap volt aktív
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Szorzótáblák áttekintése</CardTitle></CardHeader>
        <CardContent>
          <TableGrid stats={tableStats} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Legutóbbi körök</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">Még nincs befejezett kör.</p>
          )}
          {recent.map(s => {
            const firstTry = s.questions.filter(q => q.firstTryCorrect).length
            return (
              <div key={s.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                <div>
                  <span className="font-medium">{s.table}× szorzótábla</span>
                  <span className="text-xs text-muted-foreground ml-2">{s.date}</span>
                </div>
                <div className="text-sm text-right">
                  <span className="text-green-600 font-semibold">{firstTry}/{s.questions.length}</span>
                  <span className="text-muted-foreground"> első</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
