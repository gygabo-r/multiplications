interface StarsProps {
  rate: number
  className?: string
}

export function Stars({ rate, className = '' }: StarsProps) {
  const filled = rate >= 0.9 ? 3 : rate >= 0.7 ? 2 : rate > 0 ? 1 : 0
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ fontSize: 14, opacity: i < filled ? 1 : 0.2 }}>⭐</span>
      ))}
    </div>
  )
}
