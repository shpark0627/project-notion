import { Badge } from '@/components/ui/badge'
import type { Difficulty } from '@/lib/types/trail'

interface DifficultyBadgeProps {
  difficulty: Difficulty
}

const difficultyStyles: Record<Difficulty, { bg: string; text: string; label: string }> = {
  초급: { bg: 'bg-green-100', text: 'text-green-800', label: '초급' },
  중급: { bg: 'bg-orange-100', text: 'text-orange-800', label: '중급' },
  고급: { bg: 'bg-red-100', text: 'text-red-800', label: '고급' },
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const style = difficultyStyles[difficulty]
  return (
    <Badge className={`${style.bg} ${style.text}`} variant="outline">
      {style.label}
    </Badge>
  )
}
