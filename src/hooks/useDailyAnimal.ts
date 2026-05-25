import { useState, useEffect } from 'react'
import { hasAnimalToday, awardAnimalToday, getAnimalCollection } from '@/db/queries'
import { pickNewAnimal } from '@/lib/animals'

export function useDailyAnimal() {
  const [pendingAnimal, setPendingAnimal] = useState<string | null>(null)
  const [hasToday, setHasToday] = useState(true)

  useEffect(() => {
    hasAnimalToday().then(setHasToday)
  }, [])

  async function awardIfNew(): Promise<string | null> {
    const already = await hasAnimalToday()
    if (already) return null
    const collection = await getAnimalCollection()
    const used = collection.map(a => a.animal)
    const animal = pickNewAnimal(used)
    await awardAnimalToday(animal)
    setHasToday(true)
    setPendingAnimal(animal)
    return animal
  }

  function clearPending() {
    setPendingAnimal(null)
  }

  return { pendingAnimal, hasToday, awardIfNew, clearPending }
}
