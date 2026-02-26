import { getTrails } from '@/lib/notion-client'
import { FilteredTrailsContent } from '@/components/trails/FilteredTrailsContent'

export default async function TrailsPage() {
  const trails = await getTrails()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">등산 코스</h1>
            <p className="text-gray-600">등산 코스 목록을 확인하세요</p>
          </div>

          <FilteredTrailsContent trails={trails} />
        </div>
      </div>
    </div>
  )
}

export const revalidate = 3600 // ISR: revalidate every hour
