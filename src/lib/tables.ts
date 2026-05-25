export interface Question {
  a: number
  b: number
}

/** Returns questions for table b, sequential order 1×b … 10×b */
export function buildSequentialQuestions(table: number): Question[] {
  return Array.from({ length: 10 }, (_, i) => ({ a: i + 1, b: table }))
}

/** Returns questions for table b, random order */
export function buildRandomQuestions(table: number): Question[] {
  const qs = buildSequentialQuestions(table)
  // Fisher-Yates
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]]
  }
  return qs
}
