import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/useSession'
import { useDailyAnimal } from '@/hooks/useDailyAnimal'
import { QuestionCard } from '@/components/session/QuestionCard'
import { SessionProgressBar } from '@/components/session/ProgressBar'
import { FruitTray } from '@/components/session/FruitTray'
import { SummaryScreen } from '@/components/session/SummaryScreen'
import { AnimalAwardOverlay } from '@/components/animals/AnimalAwardOverlay'

function TablePicker() {
  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Melyik szorzótáblát tanulod?</h1>
        <p className="text-muted-foreground mt-1">Válassz egyet!</p>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <Card
            key={n}
            className="cursor-pointer hover:border-pink-400 hover:shadow-md transition-all border-2 active:scale-95"
            onClick={() => navigate(`/memorize/${n}`)}
          >
            <CardContent className="flex items-center justify-center h-16 text-2xl font-bold text-pink-600">
              {n}×
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SessionRunner({ table }: { table: number }) {
  const navigate = useNavigate()
  const { state, currentQuestion, submitAnswer, persistSession } = useSession(table)
  const { pendingAnimal, awardIfNew, clearPending } = useDailyAnimal()

  // Tracks whether we've already saved + awarded for this session
  const savedRef = useRef(false)

  // As soon as the phase flips to 'summary', persist + try to award — don't wait for button click
  useEffect(() => {
    if (state.phase !== 'summary' || savedRef.current) return
    savedRef.current = true

    persistSession().then(() => awardIfNew())
  }, [state.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  if (state.phase === 'summary') {
    return (
      <>
        <SummaryScreen
          table={table}
          records={state.records}
          fruits={state.fruits}
          onDone={() => navigate('/')}
        />
        {/* Overlay sits on top of summary; user dismisses it, then sees the summary */}
        <AnimalAwardOverlay animal={pendingAnimal} onDismiss={clearPending} />
      </>
    )
  }

  const total = 10
  const current = state.currentIndex

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/memorize')}>← Táblázat</Button>
        <span className="text-sm font-medium text-pink-600">{table}× szorzótábla</span>
      </div>
      <FruitTray fruits={state.fruits} />
      <SessionProgressBar current={current} total={total} phase={state.phase} />
      {currentQuestion && (
        <div className="flex flex-col items-center py-8">
          <QuestionCard
            question={currentQuestion}
            phase={state.phase}
            questionNumber={current + 1}
            total={total}
            shakeTrigger={state.shakeTrigger}
            onSubmit={submitAnswer}
          />
        </div>
      )}
    </div>
  )
}

export default function Memorize() {
  const { table } = useParams<{ table?: string }>()
  const tableNum = table ? parseInt(table, 10) : null

  if (!tableNum || isNaN(tableNum) || tableNum < 1 || tableNum > 10) {
    return <TablePicker />
  }

  return <SessionRunner table={tableNum} key={tableNum} />
}
