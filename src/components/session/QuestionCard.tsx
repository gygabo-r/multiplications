import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Question } from '@/lib/tables'

interface QuestionCardProps {
  question: Question
  phase: 'sequential' | 'random'
  questionNumber: number
  total: number
  shakeTrigger: number
  onSubmit: (answer: number) => boolean
}

export function QuestionCard({ question, phase, questionNumber, total, shakeTrigger, onSubmit }: QuestionCardProps) {
  const [value, setValue] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue('')
    inputRef.current?.focus()
  }, [question])

  useEffect(() => {
    if (shakeTrigger === 0) return
    setIsShaking(true)
    setValue('')
    const t = setTimeout(() => {
      setIsShaking(false)
      inputRef.current?.focus()
    }, 420)
    return () => clearTimeout(t)
  }, [shakeTrigger])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = parseInt(value, 10)
    if (isNaN(num)) return
    onSubmit(num)
  }

  const phaseLabel = phase === 'sequential' ? '1. kör – sorrendben' : '2. kör – keverve'

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-muted-foreground font-medium">
        {phaseLabel} · {questionNumber}/{total}
      </div>
      <div className="text-6xl font-bold tracking-tight text-center">
        {question.a} × {question.b} = ?
      </div>
      <form onSubmit={handleSubmit} className={`flex gap-3 ${isShaking ? 'animate-shake' : ''}`}>
        <Input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="text-center text-2xl w-28 h-14"
          placeholder="?"
          autoFocus
        />
        <Button type="submit" size="lg" className="h-14 px-6">
          ✓
        </Button>
      </form>
    </div>
  )
}
