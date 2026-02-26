import { TrailCard } from './TrailCard'
import type { TrailListItem } from '@/lib/types/trail'

interface TrailGridProps {
  trails: TrailListItem[]
}

export function TrailGrid({ trails }: TrailGridProps) {
  if (trails.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-500 text-lg">등록된 코스가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trails.map((trail) => (
        <TrailCard key={trail.id} trail={trail} />
      ))}
    </div>
  )
}
