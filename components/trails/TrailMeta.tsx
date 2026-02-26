import { Mountain, Clock, Ruler } from 'lucide-react'
import type { Trail } from '@/lib/types/trail'

interface TrailMetaProps {
  trail: Trail
}

export function TrailMeta({ trail }: TrailMetaProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Mountain className="w-5 h-5" />
        <span className="font-medium">{trail.mountain}</span>
      </div>

      {trail.distanceKm !== null && (
        <div className="flex items-center gap-2 text-gray-700">
          <Ruler className="w-5 h-5" />
          <span>{trail.distanceKm} km</span>
        </div>
      )}

      {trail.durationMin !== null && (
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-5 h-5" />
          <span>{Math.floor(trail.durationMin / 60)}시간 {trail.durationMin % 60}분</span>
        </div>
      )}

      {trail.seasons.length > 0 && (
        <div className="pt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">추천 계절</p>
          <div className="flex gap-2 flex-wrap">
            {trail.seasons.map((season) => (
              <span key={season} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {season}
              </span>
            ))}
          </div>
        </div>
      )}

      {trail.waypoints.length > 0 && (
        <div className="pt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">주요 경유지</p>
          <ul className="list-disc list-inside space-y-1">
            {trail.waypoints.map((waypoint, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                {waypoint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
