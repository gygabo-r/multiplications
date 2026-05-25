interface FruitTrayProps {
  fruits: string[]
}

export function FruitTray({ fruits }: FruitTrayProps) {
  if (fruits.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-white/50 rounded-xl min-h-[2.5rem]">
      {fruits.map((fruit, i) => (
        <span key={i} className="text-2xl leading-none select-none" role="img" aria-label="gyümölcs">
          {fruit}
        </span>
      ))}
    </div>
  )
}
