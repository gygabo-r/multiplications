import { Outlet, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Játék', icon: '🎮', end: true },
  { to: '/collection', label: 'Gyűjtemény', icon: '🐾', end: false },
  { to: '/stats', label: 'Statok', icon: '📊', end: false },
]

function NavItem({ to, label, icon, end }: typeof NAV_ITEMS[0]) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-sm font-semibold transition-all',
          isActive
            ? 'text-[var(--primary-ink)] bg-[var(--primary)]'
            : 'text-[var(--sub)] hover:text-[var(--ink)]'
        )
      }
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 13 }}>{label}</span>
    </NavLink>
  )
}

export function AppLayout() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'sticky',
        bottom: 0,
        background: 'var(--surface)',
        borderTop: '2px solid var(--line)',
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        padding: '8px 16px',
        zIndex: 40,
      }}>
        {NAV_ITEMS.map(item => <NavItem key={item.to} {...item} />)}
      </nav>
    </div>
  )
}
