export type Difficulty = '초급' | '중급' | '고급'
export type Season = '봄' | '여름' | '가을' | '겨울'

export interface Trail {
  id: string
  name: string
  mountain: string
  difficulty: Difficulty
  distanceKm: number | null
  durationMin: number | null
  seasons: Season[]
  waypoints: string[]
  coverImageUrl: string | null
  description: string
  published: boolean
  createdAt: string
}

export interface TrailListItem {
  id: string
  name: string
  mountain: string
  difficulty: Difficulty
  distanceKm: number | null
  durationMin: number | null
  coverImageUrl: string | null
}
