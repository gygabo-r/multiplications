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
  mode: string
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
    this.version(2).stores({
      sessions: '++id, date, mode, table, completedAt',
      animals: '++id, date'
    }).upgrade(tx =>
      tx.table('sessions').toCollection().modify((s: Session) => {
        if (!s.mode) s.mode = 'multiply'
      })
    )
  }
}

export const db = new AppDB()
