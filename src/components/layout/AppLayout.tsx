import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Játék', icon: '🎮', end: true },
  { to: '/collection', label: 'Gyűjtemény', icon: '🐾', end: false },
  { to: '/stats', label: 'Statok', icon: '📊', end: false },
]

function isPlayRoute(pathname: string) {
  return pathname.includes('/play/')
}

export function AppLayout() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const hideMenu = isPlayRoute(location.pathname)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', position: 'relative' }}>
      <main>
        <Outlet />
      </main>

      {/* Backdrop */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onPointerDown={() => setOpen(false)}
        />
      )}

      {/* Nav drawer */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          background: 'var(--surface)',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(67,53,46,0.18)',
          padding: '8px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          minWidth: 180,
        }}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all',
                  isActive
                    ? 'text-[var(--primary-ink)] bg-[var(--primary)]'
                    : 'text-[var(--ink)]'
                )
              }
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Floating hamburger button */}
      {!hideMenu && (
        <button
          className="key"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 18,
            fontSize: 22,
            zIndex: 50,
            background: open ? 'var(--primary)' : 'var(--surface)',
            color: open ? 'var(--primary-ink)' : 'var(--ink)',
            boxShadow: open
              ? '0 5px 0 var(--primary-shadow)'
              : '0 5px 0 var(--key-shadow)',
            touchAction: 'none',
          }}
          onPointerDown={e => { e.preventDefault(); setOpen(o => !o) }}
          aria-label="Menü"
        >
          {open ? '✕' : '☰'}
        </button>
      )}
    </div>
  )
}
