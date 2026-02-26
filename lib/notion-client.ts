import { Client } from '@notionhq/client'
import { unstable_cache } from 'next/cache'
import { env } from './env'
import type { Trail, TrailListItem, Difficulty, Season } from './types/trail'

const notion = new Client({
  auth: env.NOTION_API_KEY,
})

const databaseId = env.NOTION_DATABASE_ID

async function fetchTrails(): Promise<TrailListItem[]> {
  try {
    const response = await (notion as any).databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    })

    return response.results
      .map((page: any) => {
        if (page.object !== 'page') {
          return null
        }

        const properties = page.properties

        // Extract title
        const nameProperty = properties.Name
        if (nameProperty.type !== 'title' || nameProperty.title.length === 0) {
          return null
        }
        const name = nameProperty.title.map((t: any) => t.plain_text).join('')

        // Extract mountain
        const mountainProperty = properties.Mountain
        if (mountainProperty.type !== 'rich_text' || mountainProperty.rich_text.length === 0) {
          return null
        }
        const mountain = mountainProperty.rich_text.map((t: any) => t.plain_text).join('')

        // Extract difficulty
        const difficultyProperty = properties.Difficulty
        if (difficultyProperty.type !== 'select' || !difficultyProperty.select) {
          return null
        }
        const difficulty = difficultyProperty.select.name as Difficulty

        // Extract distance
        const distanceProperty = properties.Distance
        const distanceKm = distanceProperty.type === 'number' ? distanceProperty.number : null

        // Extract duration
        const durationProperty = properties.Duration
        const durationMin = durationProperty.type === 'number' ? durationProperty.number : null

        // Extract cover image
        const coverImageProperty = properties.CoverImage
        let coverImageUrl: string | null = null
        if (coverImageProperty.type === 'files' && coverImageProperty.files.length > 0) {
          const file = coverImageProperty.files[0]
          if (file.type === 'file') {
            coverImageUrl = file.file.url
          } else if (file.type === 'external') {
            coverImageUrl = file.external.url
          }
        }

        return {
          id: page.id.replace(/-/g, ''),
          name,
          mountain,
          difficulty,
          distanceKm,
          durationMin,
          coverImageUrl,
        }
      })
      .filter((item: any): item is TrailListItem => item !== null)
  } catch (error) {
    console.error('Failed to fetch trails:', error)
    return []
  }
}

async function fetchTrailById(id: string): Promise<Trail | null> {
  try {
    const page = await (notion.pages.retrieve as any)({
      page_id: id.replace(/([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/, '$1-$2-$3-$4-$5'),
    })

    if (page.object !== 'page') {
      return null
    }

    const properties = (page as any).properties

    // Extract title
    const nameProperty = properties.Name
    if (nameProperty.type !== 'title' || nameProperty.title.length === 0) {
      return null
    }
    const name = nameProperty.title.map((t: any) => t.plain_text).join('')

    // Extract mountain
    const mountainProperty = properties.Mountain
    if (mountainProperty.type !== 'rich_text' || mountainProperty.rich_text.length === 0) {
      return null
    }
    const mountain = mountainProperty.rich_text.map((t: any) => t.plain_text).join('')

    // Extract difficulty
    const difficultyProperty = properties.Difficulty
    if (difficultyProperty.type !== 'select' || !difficultyProperty.select) {
      return null
    }
    const difficulty = difficultyProperty.select.name as Difficulty

    // Extract distance
    const distanceProperty = properties.Distance
    const distanceKm = distanceProperty.type === 'number' ? distanceProperty.number : null

    // Extract duration
    const durationProperty = properties.Duration
    const durationMin = durationProperty.type === 'number' ? durationProperty.number : null

    // Extract seasons
    const seasonProperty = properties.Season
    const seasons: Season[] = seasonProperty.type === 'multi_select' ?
      seasonProperty.multi_select.map((s: any) => s.name as Season) : []

    // Extract waypoints
    const waypointsProperty = properties.Waypoints
    const waypointsText = waypointsProperty.type === 'rich_text' ?
      waypointsProperty.rich_text.map((t: any) => t.plain_text).join('') : ''
    const waypoints = waypointsText
      .split(',')
      .map((w: string) => w.trim())
      .filter((w: string) => w.length > 0)

    // Extract cover image
    const coverImageProperty = properties.CoverImage
    let coverImageUrl: string | null = null
    if (coverImageProperty.type === 'files' && coverImageProperty.files.length > 0) {
      const file = coverImageProperty.files[0]
      if (file.type === 'file') {
        coverImageUrl = (file as any).file.url
      } else if (file.type === 'external') {
        coverImageUrl = (file as any).external.url
      }
    }

    // Extract description
    const descriptionProperty = properties.Description
    const description = descriptionProperty.type === 'rich_text' ?
      descriptionProperty.rich_text.map((t: any) => t.plain_text).join('') : ''

    // Extract published status
    const publishedProperty = properties.Published
    const published = publishedProperty.type === 'checkbox' ? publishedProperty.checkbox : false

    // Get created at timestamp
    const createdAt = (page as any).created_time

    return {
      id: id.replace(/([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/, '$1-$2-$3-$4-$5'),
      name,
      mountain,
      difficulty,
      distanceKm,
      durationMin,
      seasons,
      waypoints,
      coverImageUrl,
      description,
      published,
      createdAt,
    }
  } catch (error) {
    console.error(`Failed to fetch trail ${id}:`, error)
    return null
  }
}

export const getTrails = unstable_cache(
  fetchTrails,
  ['trails'],
  { revalidate: 3600 }
)

export const getTrailById = unstable_cache(
  fetchTrailById,
  ['trail'],
  { revalidate: 3600 }
)

export async function getTrailIds(): Promise<string[]> {
  const trails = await getTrails()
  return trails.map((trail) => trail.id)
}
