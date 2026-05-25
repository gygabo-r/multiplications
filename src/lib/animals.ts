export const ANIMALS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
  '🦁','🐸','🐵','🦄','🐙','🦋','🦜','🐳','🦒','🦓',
  '🦘','🦩','🦚','🐊','🦕','🦖','🐞','🦀','🦑','🦔',
  '🐿️','🦫','🦦','🦥','🐆','🐘','🦛','🦏','🐪','🦙'
]

export function pickNewAnimal(usedAnimals: string[]): string {
  const usedSet = new Set(usedAnimals)
  const available = ANIMALS.filter(a => !usedSet.has(a))
  const pool = available.length > 0 ? available : ANIMALS
  return pool[Math.floor(Math.random() * pool.length)]
}
