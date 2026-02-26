'use client'

import { useState } from 'react'
import { DifficultyFilter } from './DifficultyFilter'
import { TrailGrid } from './TrailGrid'
import type { TrailListItem, Difficulty } from '@/lib/types/trail'

interface FilteredTrailsContentProps {
  trails: TrailListItem[]
}

export function FilteredTrailsContent({ trails }: FilteredTrailsContentProps) {
  const [filteredDifficulty, setFilteredDifficulty] = useState<Difficulty | null>(null)

  const filteredTrails = filteredDifficulty
    ? trails.filter((trail) => trail.difficulty === filteredDifficulty)
    : trails

  return (
    <>
      <DifficultyFilter onFilterChange={setFilteredDifficulty} />
      <TrailGrid trails={filteredTrails} />
    </>
  )
}
