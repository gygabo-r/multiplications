import { useNavigate } from 'react-router-dom'
import { ModeCard } from '@/components/modes/ModeCard'

const MODES = [
  {
    icon: '📖',
    title: 'Memorizálás',
    description: 'Először sorrendben, majd keverve – 20 kérdés egy táblából.',
    available: true,
    path: '/memorize',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Üdvözöllek! 👋</h1>
        <p className="text-muted-foreground mt-1">Válassz egy tanulási módot!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODES.map(mode => (
          <ModeCard
            key={mode.title}
            icon={mode.icon}
            title={mode.title}
            description={mode.description}
            available={mode.available}
            onClick={mode.path ? () => navigate(mode.path!) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
