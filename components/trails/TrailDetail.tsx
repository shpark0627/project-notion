import Image from 'next/image'
import { DifficultyBadge } from './DifficultyBadge'
import { TrailMeta } from './TrailMeta'
import type { Trail } from '@/lib/types/trail'

interface TrailDetailProps {
  trail: Trail
}

export function TrailDetail({ trail }: TrailDetailProps) {
  return (
    <article className="space-y-8">
      {/* Header with title and difficulty */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{trail.name}</h1>
        <DifficultyBadge difficulty={trail.difficulty} />
      </div>

      {/* Cover image */}
      {trail.coverImageUrl && (
        <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={trail.coverImageUrl}
            alt={trail.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Metadata */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">코스 정보</h2>
        <TrailMeta trail={trail} />
      </section>

      {/* Description */}
      {trail.description && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold">코스 설명</h2>
          <div className="prose prose-sm max-w-none">
            {trail.description.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
