import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  current: number
  total: number
  phase: 'sequential' | 'random'
}

export function SessionProgressBar({ current, total, phase }: ProgressBarProps) {
  const offset = phase === 'random' ? total : 0
  const overall = offset + current
  const totalQuestions = total * 2
  const pct = Math.round((overall / totalQuestions) * 100)

  return (
    <div className="w-full space-y-1">
      <Progress value={pct} className="h-3" />
      <div className="text-xs text-muted-foreground text-right">{overall}/{totalQuestions}</div>
    </div>
  )
}
