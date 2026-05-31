import { db } from './index'
import type { Session, QuestionRecord } from './index'
import type { Mode } from '@/lib/tables'

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
  mode: Mode
  totalSessions: number
  firstTryRate: number
  stars: number
}

export async function getMasteryStats(mode: Mode, n: number): Promise<TableStats> {
  const sessions = await db.sessions
    .where('mode').equals(mode)
    .filter(s => s.table === n)
    .toArray()

  if (sessions.length === 0) return { table: n, mode, totalSessions: 0, firstTryRate: 0, stars: 0 }

  const allQs: QuestionRecord[] = sessions.flatMap(s => s.questions)
  const firstTryRate = allQs.filter(q => q.firstTryCorrect).length / allQs.length
  const stars = firstTryRate >= 0.9 ? 3 : firstTryRate >= 0.7 ? 2 : firstTryRate > 0 ? 1 : 0

  return { table: n, mode, totalSessions: sessions.length, firstTryRate, stars }
}

export async function getAllMasteryStats(mode: Mode): Promise<TableStats[]> {
  return Promise.all(Array.from({ length: 10 }, (_, i) => getMasteryStats(mode, i + 1)))
}

export async function getStreak(): Promise<number> {
  const dates = await getAllDates()
  if (dates.length === 0) return 0

  const today = new Date().toISOString().slice(0, 10)
  const dateSet = new Set(dates)
  let streak = 0
  const cur = new Date(today)

  while (dateSet.has(cur.toISOString().slice(0, 10))) {
    streak++
    cur.setDate(cur.getDate() - 1)
  }
  return streak
}

export async function getTotalStars(): Promise<number> {
  const modes: Mode[] = ['multiply', 'add', 'subtract']
  const allStats = await Promise.all(modes.map(m => getAllMasteryStats(m)))
  return allStats.flat().reduce((sum, s) => sum + s.stars, 0)
}

export async function getRecentSessions(limit = 20): Promise<Session[]> {
  return db.sessions.orderBy('completedAt').reverse().limit(limit).toArray()
}

export async function getTableStats(table: number): Promise<TableStats> {
  return getMasteryStats('multiply', table)
}

export async function getAllTableStats(): Promise<TableStats[]> {
  return getAllMasteryStats('multiply')
}
