import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Módok', icon: '🎮' },
  { to: '/stats', label: 'Statisztikák', icon: '📊' },
  { to: '/animals', label: 'Állataim', icon: '🐾' },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-52 min-h-screen bg-white border-r border-gray-100 p-4 gap-2">
      <div className="mb-4 px-2">
        <h1 className="text-xl font-bold text-indigo-600">Szorzótábla</h1>
        <p className="text-xs text-muted-foreground">Tanuljuk együtt!</p>
      </div>
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            )
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </aside>
  )
}
