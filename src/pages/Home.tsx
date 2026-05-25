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
  {
    icon: '⏱️',
    title: 'Gyorsasági kihívás',
    description: 'Minél több helyes válasz 60 másodperc alatt!',
    available: false,
  },
  {
    icon: '🌐',
    title: 'Vegyes kör',
    description: 'Véletlenszerű kérdések az összes szorzótáblából.',
    available: false,
  },
  {
    icon: '🔲',
    title: 'Táblázat-kitöltés',
    description: 'Töltsd ki a 10×10-es szorzótáblát!',
    available: false,
  },
  {
    icon: '🔍',
    title: 'Nyomozó mód',
    description: 'Az eredményből találd ki a szorzókat!',
    available: false,
  },
  {
    icon: '🔥',
    title: 'Sorozat mód',
    description: 'Egy hibával vége – meddig bírod?',
    available: false,
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
