import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DifficultyBadge } from './DifficultyBadge'
import type { TrailListItem } from '@/lib/types/trail'

interface TrailCardProps {
  trail: TrailListItem
}

export function TrailCard({ trail }: TrailCardProps) {
  return (
    <Link href={`/trails/${trail.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden rounded-t-lg">
          {trail.coverImageUrl ? (
            <Image
              src={trail.coverImageUrl}
              alt={trail.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              <span className="text-gray-600 text-sm">이미지 없음</span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2">{trail.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">{trail.mountain}</p>

          <DifficultyBadge difficulty={trail.difficulty} />

          <div className="pt-2 space-y-1 text-xs text-gray-600">
            {trail.distanceKm !== null && (
              <p>거리: {trail.distanceKm} km</p>
            )}
            {trail.durationMin !== null && (
              <p>
                소요시간: {Math.floor(trail.durationMin / 60)}시간{' '}
                {trail.durationMin % 60}분
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
