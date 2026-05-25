export const FRUITS = [
  '🍎','🍊','🍋','🍇','🍓','🫐','🍒','🍑','🥭','🍍',
  '🥝','🍅','🍈','🥥','🍌','🍐','🍏','🍉','🍆','🌽'
]

export function randomFruit(): string {
  return FRUITS[Math.floor(Math.random() * FRUITS.length)]
}
