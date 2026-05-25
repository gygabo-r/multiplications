import { useState, useEffect, useRef } from 'react'
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

  function handleClear() {
    setValue('')
    inputRef.current?.focus()
  }

  const phaseLabel = phase === 'sequential' ? '1. kör – sorrendben' : '2. kör – keverve'

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-sm text-muted-foreground font-medium">
        {phaseLabel} · {questionNumber}/{total}
      </div>

      <div className="text-6xl font-bold tracking-tight text-center">
        {question.a} × {question.b} = ?
      </div>

      <form
        onSubmit={handleSubmit}
        className={`w-full flex gap-3 ${isShaking ? 'animate-shake' : ''}`}
      >
        {/* Input wrapper with clear button inside */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
            className="w-full h-20 rounded-2xl border-2 border-pink-200 bg-white text-center font-bold text-6xl outline-none transition-colors focus:border-pink-400 focus:ring-4 focus:ring-pink-200 pr-14"
          />
          {value !== '' && (
            <button
              type="button"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Törlés"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 text-pink-500 hover:text-pink-700 transition-colors text-xl font-bold leading-none"
            >
              ✕
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="h-20 px-8 rounded-2xl bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm"
        >
          <span className="text-4xl leading-none">✓</span>
        </Button>
      </form>
    </div>
  )
}
