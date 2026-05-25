import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ModeCardProps {
  icon: string
  title: string
  description: string
  available: boolean
  onClick?: () => void
}

export function ModeCard({ icon, title, description, available, onClick }: ModeCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all border-2',
        available
          ? 'hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
          : 'opacity-60 cursor-not-allowed'
      )}
      onClick={available ? onClick : undefined}
    >
      <CardContent className="pt-5 pb-4 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <span className="text-4xl">{icon}</span>
          {!available && (
            <Badge variant="secondary" className="text-xs">Hamarosan</Badge>
          )}
        </div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground leading-snug">{description}</p>
      </CardContent>
    </Card>
  )
}
