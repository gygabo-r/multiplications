import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Módok', icon: '🎮' },
  { to: '/stats', label: 'Statisztikák', icon: '📊' },
  { to: '/animals', label: 'Állataim', icon: '🐾' },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-40">
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors',
              isActive ? 'text-pink-600' : 'text-gray-400'
            )
          }
        >
          <span className="text-2xl">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
