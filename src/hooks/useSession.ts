import { useState, useCallback } from 'react'
import { randomFruit } from '@/lib/fruits'
import { buildSequentialQuestions, buildRandomQuestions, type Question } from '@/lib/tables'
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
}

export function useSession(table: number) {
  const [state, setState] = useState<SessionState>(() => ({
    phase: 'sequential',
    questions: buildSequentialQuestions(table),
    currentIndex: 0,
    tries: 0,
    fruits: [],
    records: [],
    shakeTrigger: 0,
  }))

  const currentQuestion = state.questions[state.currentIndex] ?? null

  const submitAnswer = useCallback((answer: number): boolean => {
    if (!currentQuestion) return false
    const correct = answer === currentQuestion.a * currentQuestion.b

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
          // End of current phase
          if (prev.phase === 'sequential') {
            // Move to random phase
            return {
              ...prev,
              phase: 'random',
              questions: buildRandomQuestions(table),
              currentIndex: 0,
              tries: 0,
              fruits: [...prev.fruits, newFruit],
              records: newRecords,
            }
          } else {
            // End of session
            return {
              ...prev,
              phase: 'summary',
              currentIndex: nextIndex,
              tries: 0,
              fruits: [...prev.fruits, newFruit],
              records: newRecords,
            }
          }
        }

        return {
          ...prev,
          currentIndex: nextIndex,
          tries: 0,
          fruits: [...prev.fruits, newFruit],
          records: newRecords,
        }
      })
      return true
    } else {
      setState(prev => ({
        ...prev,
        tries: prev.tries + 1,
        shakeTrigger: prev.shakeTrigger + 1,
      }))
      return false
    }
  }, [currentQuestion, table])

  async function persistSession() {
    const today = new Date().toISOString().slice(0, 10)
    await saveSession({
      date: today,
      table,
      completedAt: Date.now(),
      questions: state.records,
      fruitsEarned: state.fruits,
    })
  }

  return { state, currentQuestion, submitAnswer, persistSession }
}
