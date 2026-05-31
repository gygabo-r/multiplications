interface FruitTrayProps {
  fruits: string[]
}

export function FruitTray({ fruits }: FruitTrayProps) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      minHeight: 46,
      padding: '6px 10px',
      background: 'var(--surface)',
      borderRadius: 16,
      alignItems: 'center',
    }}>
      {fruits.length === 0
        ? <span style={{ fontSize: 22, opacity: 0.4 }}>🧺</span>
        : fruits.map((fruit, i) => (
          <span
            key={i}
            style={{ fontSize: 26, lineHeight: 1 }}
            className={i === fruits.length - 1 ? 'animate-tray-in' : ''}
          >
            {fruit}
          </span>
        ))
      }
    </div>
  )
}
