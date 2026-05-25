import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { QuestionRecord } from '@/db/index'
import { useNavigate } from 'react-router-dom'

interface SummaryScreenProps {
  table: number
  records: QuestionRecord[]
  fruits: string[]
  onDone: () => void
}

export function SummaryScreen({ table, records, fruits, onDone }: SummaryScreenProps) {
  const navigate = useNavigate()
  const firstTry = records.filter(r => r.firstTryCorrect).length
  const total = records.length

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-5xl">🎉</div>
      <h2 className="text-2xl font-bold">Kész! Remek munka!</h2>
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Szorzótábla</span>
            <span className="font-semibold">{table}×</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kérdések száma</span>
            <span className="font-semibold">{total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Első próbára helyes</span>
            <span className="font-semibold">{firstTry}/{total}</span>
          </div>
          <div className="pt-2">
            <div className="text-sm text-muted-foreground mb-1">Összegyűjtött gyümölcsök</div>
            <div className="flex flex-wrap gap-1">
              {fruits.map((f, i) => <span key={i} className="text-xl">{f}</span>)}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/memorize')}>
          Újra
        </Button>
        <Button onClick={onDone}>
          Főmenü
        </Button>
      </div>
    </div>
  )
}
