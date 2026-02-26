import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-gray-600 text-lg">요청하신 등산 코스를 찾을 수 없습니다.</p>
        <Link href="/trails">
          <Button>코스 목록으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  )
}
