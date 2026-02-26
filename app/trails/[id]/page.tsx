import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TrailDetail } from '@/components/trails/TrailDetail'
import { Button } from '@/components/ui/button'
import { getTrailById, getTrailIds } from '@/lib/notion-client'

interface TrailDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata(
  { params }: TrailDetailPageProps
): Promise<Metadata> {
  const trail = await getTrailById(params.id)

  if (!trail) {
    return {
      title: '코스를 찾을 수 없습니다',
      description: '요청하신 등산 코스를 찾을 수 없습니다.',
    }
  }

  return {
    title: `${trail.name} - 등산 코스 기록 블로그`,
    description: trail.description.substring(0, 160),
    openGraph: {
      title: trail.name,
      description: trail.description.substring(0, 160),
    },
  }
}

export async function generateStaticParams() {
  const trailIds = await getTrailIds()
  return trailIds.map((id) => ({
    id,
  }))
}

export default async function TrailPage({ params }: TrailDetailPageProps) {
  const trail = await getTrailById(params.id)

  if (!trail || !trail.published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/trails">
          <Button variant="ghost" className="mb-6 -ml-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </Link>

        <TrailDetail trail={trail} />
      </div>
    </div>
  )
}

export const revalidate = 3600 // ISR: revalidate every hour
