import { useState, useCallback } from 'react'
import { randomFruit } from '@/lib/fruits'
import { buildSequentialQuestions, buildRandomQuestions, type Question, type Mode } from '@/lib/tables'
import { saveSession } from '@/db/queries'
import type { QuestionRecord } from '@/db/index'

type Phase = 'sequential' | 'random' | 'summary'

export interface SessionState {
  phase: Phase
  questions: Question[]
  currentIndex: number
  tries: number
  fruits: string[]
  records: QuestionRecord[]
  shakeTrigger: number
  flashTrigger: number
  lastWasCorrect: boolean
}

export function useSession(mode: Mode, n: number) {
  const [state, setState] = useState<SessionState>(() => ({
    phase: 'sequential',
    questions: buildSequentialQuestions(mode, n),
    currentIndex: 0,
    tries: 0,
    fruits: [],
    records: [],
    shakeTrigger: 0,
    flashTrigger: 0,
    lastWasCorrect: false,
  }))

  const currentQuestion = state.questions[state.currentIndex] ?? null

  const submitAnswer = useCallback((answer: number): boolean => {
    if (!currentQuestion) return false
    const correct = answer === currentQuestion.ans

    if (correct) {
      const newFruit = randomFruit()
      setState(prev => {
        const record: QuestionRecord = {
          a: prev.questions[prev.currentIndex].a,
          b: prev.questions[prev.currentIndex].b,
          tries: prev.tries + 1,
          firstTryCorrect: prev.tries === 0,
        }
        const newRecords = [...prev.records, record]
        const nextIndex = prev.currentIndex + 1

        if (nextIndex >= prev.questions.length) {
          if (prev.phase === 'sequential') {
            return {
              ...prev,
              phase: 'random',
              questions: buildRandomQuestions(mode, n),
              currentIndex: 0,
              tries: 0,
              fruits: [...prev.fruits, newFruit],
              records: newRecords,
              flashTrigger: prev.flashTrigger + 1,
              lastWasCorrect: true,
            }
          } else {
            return {
              ...prev,
              phase: 'summary',
              currentIndex: nextIndex,
              tries: 0,
              fruits: [...prev.fruits, newFruit],
              records: newRecords,
              flashTrigger: prev.flashTrigger + 1,
              lastWasCorrect: true,
            }
          }
        }

        return {
          ...prev,
          currentIndex: nextIndex,
          tries: 0,
          fruits: [...prev.fruits, newFruit],
          records: newRecords,
          flashTrigger: prev.flashTrigger + 1,
          lastWasCorrect: true,
        }
      })
      return true
    } else {
      setState(prev => ({
        ...prev,
        tries: prev.tries + 1,
        shakeTrigger: prev.shakeTrigger + 1,
        lastWasCorrect: false,
      }))
      return false
    }
  }, [currentQuestion, mode, n])

  async function persistSession() {
    const today = new Date().toISOString().slice(0, 10)
    await saveSession({
      date: today,
      mode,
      table: n,
      completedAt: Date.now(),
      questions: state.records,
      fruitsEarned: state.fruits,
    })
  }

  return { state, currentQuestion, submitAnswer, persistSession }
}
