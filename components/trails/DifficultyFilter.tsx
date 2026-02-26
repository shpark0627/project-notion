'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Difficulty } from '@/lib/types/trail'

interface DifficultyFilterProps {
  onFilterChange: (difficulty: Difficulty | null) => void
}

const difficulties: Difficulty[] = ['초급', '중급', '고급']

export function DifficultyFilter({ onFilterChange }: DifficultyFilterProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)

  const handleFilterClick = (difficulty: Difficulty) => {
    const newDifficulty = selectedDifficulty === difficulty ? null : difficulty
    setSelectedDifficulty(newDifficulty)
    onFilterChange(newDifficulty)
  }

  return (
    <div className="flex gap-2 mb-6">
      <span className="self-center text-sm font-medium">난이도:</span>
      {difficulties.map((difficulty) => (
        <Button
          key={difficulty}
          onClick={() => handleFilterClick(difficulty)}
          variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
          size="sm"
        >
          {difficulty}
        </Button>
      ))}
    </div>
  )
}
