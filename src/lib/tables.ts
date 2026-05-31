export type Mode = 'multiply' | 'add' | 'subtract'

export interface Question {
  a: number
  b: number
  op: string
  ans: number
}

function buildQuestions(mode: Mode, n: number): Question[] {
  return Array.from({ length: 10 }, (_, i) => {
    const idx = i + 1
    if (mode === 'add') return { a: idx, b: n, op: '+', ans: idx + n }
    if (mode === 'subtract') return { a: idx + n, b: n, op: '−', ans: idx }
    return { a: idx, b: n, op: '×', ans: idx * n }
  })
}

export function buildSequentialQuestions(mode: Mode, n: number): Question[] {
  return buildQuestions(mode, n)
}

export function buildRandomQuestions(mode: Mode, n: number): Question[] {
  const qs = buildQuestions(mode, n)
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]]
  }
  return qs
}
