import { useEffect, useState } from 'react'
import { getAnimalCollection } from '@/db/queries'
import type { DailyAnimal } from '@/db/index'
import { Card, CardContent } from '@/components/ui/card'
import { AnimalAwardOverlay } from '@/components/animals/AnimalAwardOverlay'

export default function Animals() {
  const [animals, setAnimals] = useState<DailyAnimal[]>([])
  const [replayAnimal, setReplayAnimal] = useState<string | null>(null)

  useEffect(() => {
    getAnimalCollection().then(setAnimals)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Állatgyűjtemény 🐾</h1>
        <p className="text-muted-foreground mt-1">
          Minden nap kapsz egy új állatot, ha tanulsz! Eddig: <strong>{animals.length}</strong>
        </p>
      </div>

      {animals.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground py-12">
            <p className="text-4xl mb-3">🔒</p>
            <p className="font-medium">Még nincs állatod</p>
            <p className="text-sm mt-1">Fejezz be egy kört, hogy megkapd az első állatodat!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {animals.map(a => (
            <div
              key={a.id}
              title={a.date}
              onClick={() => setReplayAnimal(a.animal)}
              className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-4xl">{a.animal}</span>
              <span className="text-[10px] text-muted-foreground">{a.date.slice(5)}</span>
            </div>
          ))}
        </div>
      )}

      <AnimalAwardOverlay animal={replayAnimal} onDismiss={() => setReplayAnimal(null)} />
    </div>
  )
}
