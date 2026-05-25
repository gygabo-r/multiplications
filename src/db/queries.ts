import { db } from './index'
import type { Session, QuestionRecord } from './index'

export async function saveSession(session: Omit<Session, 'id'>): Promise<number> {
  return db.sessions.add(session)
}

export async function getSessionsByDate(date: string): Promise<Session[]> {
  return db.sessions.where('date').equals(date).toArray()
}

export async function getAllDates(): Promise<string[]> {
  const sessions = await db.sessions.toArray()
  return [...new Set(sessions.map(s => s.date))].sort()
}

export async function getAnimalCollection() {
  return db.animals.orderBy('date').toArray()
}

export async function hasAnimalToday(): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10)
  const count = await db.animals.where('date').equals(today).count()
  return count > 0
}

export async function awardAnimalToday(animal: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10)
  await db.animals.add({ date: today, animal })
}

export interface TableStats {
  table: number
  totalSessions: number
  avgTries: number
  firstTryRate: number
}

export async function getTableStats(table: number): Promise<TableStats> {
  const sessions = await db.sessions.where('table').equals(table).toArray()
  if (sessions.length === 0) return { table, totalSessions: 0, avgTries: 0, firstTryRate: 0 }

  const allQs: QuestionRecord[] = sessions.flatMap(s => s.questions)
  const avgTries = allQs.reduce((sum, q) => sum + q.tries, 0) / allQs.length
  const firstTryRate = allQs.filter(q => q.firstTryCorrect).length / allQs.length

  return { table, totalSessions: sessions.length, avgTries, firstTryRate }
}

export async function getAllTableStats(): Promise<TableStats[]> {
  return Promise.all(Array.from({ length: 10 }, (_, i) => getTableStats(i + 1)))
}

export async function getRecentSessions(limit = 20): Promise<Session[]> {
  return db.sessions.orderBy('completedAt').reverse().limit(limit).toArray()
}
