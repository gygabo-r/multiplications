import { useEffect } from 'react'

interface KeypadProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function Keypad({ value, onChange, onSubmit, disabled }: KeypadProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (disabled) return
      if (e.key >= '0' && e.key <= '9') {
        onChange(value + e.key)
      } else if (e.key === 'Backspace') {
        onChange(value.slice(0, -1))
      } else if (e.key === 'Enter') {
        onSubmit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [value, onChange, onSubmit, disabled])

  function press(digit: string) {
    if (disabled) return
    onChange(value + digit)
  }

  function backspace() {
    if (disabled) return
    onChange(value.slice(0, -1))
  }

  const keys: Array<{ label: string; action: () => void; bg?: string; color?: string }> = [
    { label: '1', action: () => press('1') },
    { label: '2', action: () => press('2') },
    { label: '3', action: () => press('3') },
    { label: '4', action: () => press('4') },
    { label: '5', action: () => press('5') },
    { label: '6', action: () => press('6') },
    { label: '7', action: () => press('7') },
    { label: '8', action: () => press('8') },
    { label: '9', action: () => press('9') },
    { label: '⌫', action: backspace, bg: 'var(--ring-color)', color: 'var(--ink)' },
    { label: '0', action: () => press('0') },
    { label: '✓', action: onSubmit, bg: 'var(--primary)', color: 'var(--primary-ink)' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 320, width: '100%' }}>
      {keys.map(k => (
        <button
          key={k.label}
          className="key"
          style={{
            height: 72,
            fontSize: 28,
            fontWeight: 700,
            background: k.bg ?? 'var(--key-bg)',
            color: k.color ?? 'var(--key-ink)',
            boxShadow: `0 5px 0 ${k.bg ? 'rgba(0,0,0,0.15)' : 'var(--key-shadow)'}`,
            touchAction: 'none',
          }}
          onPointerDown={e => {
            e.preventDefault()
            if (!disabled) k.action()
          }}
          disabled={disabled}
        >
          {k.label}
        </button>
      ))}
    </div>
  )
}
