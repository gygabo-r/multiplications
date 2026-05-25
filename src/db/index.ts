import Dexie, { type Table } from 'dexie'

export interface QuestionRecord {
  a: number
  b: number
  tries: number
  firstTryCorrect: boolean
}

export interface Session {
  id?: number
  date: string
  table: number
  completedAt: number
  questions: QuestionRecord[]
  fruitsEarned: string[]
}

export interface DailyAnimal {
  id?: number
  date: string
  animal: string
}

class AppDB extends Dexie {
  sessions!: Table<Session>
  animals!: Table<DailyAnimal>

  constructor() {
    super('SzorzotablaDB')
    this.version(1).stores({
      sessions: '++id, date, table, completedAt',
      animals: '++id, date'
    })
  }
}

export const db = new AppDB()
