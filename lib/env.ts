import { z } from 'zod'

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
})

export const env = envSchema.parse(process.env)
