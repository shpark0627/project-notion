# ROADMAP: 등산 코스 기록 블로그

> **업데이트**: 2026-02-26
> **상태**: MVP 코드 구현 100% 완료, 환경 설정 및 데이터 입력 대기

---

## 📋 현재 상태 (Current Status)

### MVP 구현 완료 사항

| 항목 | 상태 | 파일 | 비고 |
|------|------|------|------|
| Notion 클라이언트 | ✅ | `lib/notion-client.ts` | `unstable_cache` 적용 |
| 타입 정의 | ✅ | `lib/types/trail.ts` | Trail, TrailListItem |
| 환경 변수 검증 | ✅ | `lib/env.ts` | Zod 스키마 |
| 이미지 도메인 설정 | ✅ | `next.config.ts` | Notion S3, notion.so |
| 코스 목록 페이지 | ✅ | `app/trails/page.tsx` | ISR 3600초 |
| 코스 상세 페이지 | ✅ | `app/trails/[id]/page.tsx` | generateStaticParams, generateMetadata |
| 404 처리 | ✅ | `app/trails/[id]/not-found.tsx` | 존재하지 않는 ID 처리 |
| TrailCard 컴포넌트 | ✅ | `components/trails/TrailCard.tsx` | 반응형 카드 |
| TrailGrid 컴포넌트 | ✅ | `components/trails/TrailGrid.tsx` | 그리드 레이아웃 |
| TrailDetail 컴포넌트 | ✅ | `components/trails/TrailDetail.tsx` | 상세 정보 표시 |
| TrailMeta 컴포넌트 | ✅ | `components/trails/TrailMeta.tsx` | 메타데이터 배지 |
| DifficultyFilter 컴포넌트 | ✅ | `components/trails/DifficultyFilter.tsx` | 클라이언트 사이드 필터 |
| DifficultyBadge 컴포넌트 | ✅ | `components/trails/DifficultyBadge.tsx` | 난이도 색상 배지 |

### 누락/예정 사항
- ⚠️ `app/error.tsx` (전역 에러 바운더리) - Phase 1-b
- ⚠️ `app/not-found.tsx` (루트 404) - Phase 1-b
- ⚠️ `components/layout/SiteHeader.tsx` (공통 헤더) - Phase 1-b
- ✅ `next-themes` 패키지 설치됨 (다크 모드 준비)

---

## 🚀 Phase 0: 즉시 실행 (환경 설정)

**소요 시간**: ~1시간

### 0-1. 환경 변수 설정
- [ ] `.env.local` 파일 생성 (`.env.local.example` 참고)
  ```env
  NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
  NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxx
  ```

### 0-2. Notion Integration 생성
- [ ] https://www.notion.so/my-integrations 접속
- [ ] 새 Internal Integration 생성
- [ ] **권한**: "읽기 콘텐츠"만 선택
- [ ] Integration Token 복사 → `NOTION_API_KEY`

### 0-3. Notion 데이터베이스 생성
- [ ] Notion Workspace에서 새 데이터베이스 생성
- [ ] 다음 속성 정의:

  | 속성명 | 타입 | 필수 | 예시 |
  |--------|------|------|------|
  | Name | Title | ✅ | 관악산 등산로 |
  | Mountain | Text | ✅ | 관악산 |
  | Difficulty | Select | ✅ | 초급 / 중급 / 고급 |
  | Distance | Number | - | 8.5 |
  | Duration | Number | - | 180 |
  | Season | Multi-select | - | 봄, 가을 |
  | Waypoints | Text | - | 낙성대역, 관악산역, 신림역 |
  | CoverImage | Files & media | - | [이미지 업로드] |
  | Published | Checkbox | ✅ | ☑️ |
  | Description | Rich text | - | [본문 작성] |

- [ ] Integration 연결: 데이터베이스 우측 상단 `...` → "연결 추가" → 생성한 Integration
- [ ] 데이터베이스 URL에서 ID 추출
  ```
  https://www.notion.so/{workspace}/{DATABASE_ID}?v=...
  DATABASE_ID = 32글자 영문숫자
  ```

### 0-4. 테스트 데이터 입력
- [ ] 등산 코스 3개 이상 등록
- [ ] 각 코스마다:
  - 코스명 (필수)
  - 산 이름 (필수)
  - 난이도: 초급 또는 중급 또는 고급 (필수)
  - 거리(km) (권장)
  - 소요시간(분) (권장)
  - 대표 이미지 (선택 - 없으면 플레이스홀더)
  - 설명 (선택)

### 0-5. 로컬 실행 확인
```bash
npm run dev
# http://localhost:3000/trails 접속
# - 코스 목록 표시 확인
# - 카드 클릭 → 상세 페이지 이동 확인
# - 난이도 필터 동작 확인
```

---

## 📦 Phase 1-b: 단기 (코드 품질 보완)

**소요 시간**: ~2~3시간
**의존성**: Phase 0 완료 필요

### 1-1. 전역 에러 바운더리 구현
- [ ] `app/error.tsx` 생성
  ```typescript
  'use client'

  interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
  }

  export default function Error({ error, reset }: ErrorProps) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">문제가 발생했습니다</h1>
        <p className="text-gray-600 mb-8">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          다시 시도
        </button>
      </div>
    )
  }
  ```

### 1-2. 루트 404 페이지 구현
- [ ] `app/not-found.tsx` 생성
  ```typescript
  export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
        <a href="/trails" className="text-blue-600 hover:underline">
          코스 목록으로 돌아가기
        </a>
      </div>
    )
  }
  ```

### 1-3. 공통 헤더 컴포넌트 구현
- [ ] `components/layout/SiteHeader.tsx` 생성
  ```typescript
  import Link from 'next/link'

  export function SiteHeader() {
    return (
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/trails" className="text-2xl font-bold">
            🏔️ 등산 코스 기록
          </Link>
          <nav className="space-x-6">
            {/* 필요에 따라 추가 */}
          </nav>
        </div>
      </header>
    )
  }
  ```

### 1-4. 목록 페이지 메타데이터 추가
- [ ] `app/trails/page.tsx`에 `generateMetadata` 추가
  ```typescript
  export const metadata: Metadata = {
    title: '등산 코스 기록 - 코스 목록',
    description: '전국 등산 코스 정보를 확인하세요',
  }
  ```

### 1-5. 빌드/린트 완전 통과
- [ ] `npm run build` 성공 (에러 0, 경고 0)
- [ ] `npm run lint` 통과
- [ ] TypeScript 컴파일 에러 0개
  ```bash
  npm run build
  npm run lint
  ```

---

## 🎨 Phase 2: 중기 (사용성 향상)

**소요 시간**: 각 기능별 2~6시간
**의존성**: Phase 1 완료

### 2-1. 다크 모드 (추천 우선순위: 1순위)
**소요 시간**: ~2시간

- [ ] `next-themes` 설치 확인 (이미 설치됨)
- [ ] `app/layout.tsx`에 ThemeProvider 적용 확인
- [ ] `lib/utils.ts`에서 `cn()` 사용 확인
- [ ] Tailwind CSS `darkMode` 설정 (`tailwind.config.ts`)
  ```typescript
  // tailwind.config.ts (v4 문법 주의!)
  export default {
    darkMode: 'class',
    // ...
  }
  ```
- [ ] 각 컴포넌트에 다크 모드 클래스 추가
  ```typescript
  // 예시
  <div className="bg-white dark:bg-slate-950 text-black dark:text-white">
  ```
- [ ] 테마 토글 버튼 추가 (헤더 또는 푸터)

### 2-2. 텍스트 검색 (우선순위: 2순위)
**소요 시간**: ~3시간

- [ ] 검색 input 컴포넌트 추가 (`app/trails/page.tsx`)
- [ ] `useState`로 검색어 관리
- [ ] 코스명 + 산 이름 기준 필터링
  ```typescript
  const filtered = trails.filter(trail =>
    trail.name.includes(query) || trail.mountain.includes(query)
  )
  ```
- [ ] 검색 결과 0개 시 메시지 표시

### 2-3. 댓글 기능 (우선순위: 3순위)
**소요 시간**: ~4시간

- [ ] Giscus 설정 (https://giscus.app)
  - GitHub 저장소 연결 (public)
  - Discussions 카테고리 설정
  - GISCUS_REPO, GISCUS_REPO_ID 등록
- [ ] `components/trails/GiscusComments.tsx` 컴포넌트 생성
- [ ] `app/trails/[id]/page.tsx`에 댓글 섹션 추가

### 2-4. RSS 피드 (우선순위: 4순위)
**소요 시간**: ~3시간

- [ ] `app/feed.xml/route.ts` 생성
  ```typescript
  export async function GET() {
    const trails = await getTrails()
    const rss = generateRSSFeed(trails)
    return new Response(rss, {
      headers: { 'Content-Type': 'application/rss+xml' },
    })
  }
  ```
- [ ] `app/layout.tsx`에 RSS 링크 추가
  ```typescript
  <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
  ```

### 2-5. 태그 기반 다중 필터 (우선순위: 5순위)
**소요 시간**: ~4~6시간

⚠️ **주의**: `useSearchParams` + `useRouter` 사용 시 Suspense boundary 필수

- [ ] `app/trails/layout.tsx`에 `<Suspense>` 래퍼 추가
- [ ] `components/trails/TrailFilters.tsx` 구현
  ```typescript
  'use client'

  import { useSearchParams, useRouter } from 'next/navigation'

  export function TrailFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSeasonChange = (season: string) => {
      const params = new URLSearchParams(searchParams)
      if (params.has(season)) {
        params.delete(season)
      } else {
        params.append('season', season)
      }
      router.push(`?${params.toString()}`)
    }

    return (
      <div>
        {/* 필터 버튼들 */}
      </div>
    )
  }
  ```
- [ ] 계절, 산 이름 등 다중 필터 지원
- [ ] URL Query String으로 필터 상태 유지

---

## 🔧 Phase 3: 장기 (고급 기능)

**소요 시간**: 각 기능별 4~10시간
**의존성**: Phase 1 완료

### 3-1. Notion Webhook + 즉시 ISR 재검증
**소요 시간**: ~6~8시간

⚠️ **주의**: Notion 공식 API는 Webhook을 지원하지 않음. 다음 대안 중 선택:

1. **Zapier 또는 Make 활용** (권장)
   - Notion DB 변경 감지 → HTTP POST → `/api/revalidate` 호출
   - `revalidatePath('/trails')` 실행

2. **폴링 방식** (간단)
   - 백그라운드 작업으로 5분마다 변경 사항 확인
   - Vercel Cron Jobs 활용

- [ ] `app/api/revalidate/route.ts` 생성
  ```typescript
  import { revalidatePath, revalidateTag } from 'next/cache'

  export async function POST(request: Request) {
    const secret = request.headers.get('x-revalidate-secret')
    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response('Unauthorized', { status: 401 })
    }

    revalidatePath('/trails')
    revalidateTag('trails')
    return new Response('Revalidated', { status: 200 })
  }
  ```

- [ ] Zapier/Make에서 트리거 설정
- [ ] REVALIDATE_SECRET 환경 변수 추가

### 3-2. 지도 연동 (카카오맵 또는 Naver Map)
**소요 시간**: ~6~8시간

⚠️ **주의**: Map 컴포넌트는 클라이언트 사이드 렌더링 필요 → `dynamic import` + `ssr: false`

- [ ] 카카오맵 API 키 등록
- [ ] `components/trails/TrailMap.tsx` 생성
  ```typescript
  'use client'

  import dynamic from 'next/dynamic'

  const KakaoMap = dynamic(() => import('./KakaoMapComponent'), {
    ssr: false,
    loading: () => <div>지도 로드 중...</div>,
  })

  export function TrailMap({ waypoints }: Props) {
    return <KakaoMap waypoints={waypoints} />
  }
  ```

- [ ] 지도에 경유지 마커 표시
- [ ] 상세 페이지에 지도 섹션 추가

### 3-3. 조회수 통계
**소요 시간**: ~4~6시간

**권장 방식**: Vercel Analytics 또는 간단한 서버 카운터

- [ ] Vercel Analytics 설정 (권장)
  ```typescript
  // app/layout.tsx
  import { Analytics } from '@vercel/analytics/react'

  export default function RootLayout() {
    return (
      <html>
        <body>
          {/* ... */}
          <Analytics />
        </body>
      </html>
    )
  }
  ```

- [ ] 또는 간단한 조회수 카운터 (선택)
  - Supabase 또는 Firebase 사용
  - `app/api/views/route.ts`로 조회수 기록

### 3-4. 이미지 영구화 (Cloudinary 또는 S3)
**소요 시간**: ~6~10시간

⚠️ **배경**: Notion 이미지 URL은 ~1시간 후 만료됨 → ISR 주기와 동일하므로 깨질 가능성 높음

- [ ] Cloudinary 계정 생성 (https://cloudinary.com)
- [ ] 환경 변수 등록
  ```env
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
  CLOUDINARY_API_KEY=xxxxx
  CLOUDINARY_API_SECRET=xxxxx
  ```

- [ ] Notion 데이터 읽을 때 이미지 Cloudinary에 업로드
  ```typescript
  // lib/notion-client.ts
  const cloudinaryUrl = await uploadToCloudinary(notionImageUrl)
  ```

- [ ] `next.config.ts`에 Cloudinary 도메인 추가
- [ ] `next/image`에서 Cloudinary URL 사용

---

## ✅ 배포 체크리스트 (Vercel 배포)

### 최초 배포 단계

- [ ] **GitHub 저장소 연결**
  - Vercel 대시보드 → "New Project" → GitHub 선택
  - 저장소 선택 및 빌드 설정 확인

- [ ] **환경 변수 등록**
  ```
  Project Settings → Environment Variables
  - NOTION_API_KEY
  - NOTION_DATABASE_ID
  - 필요시 추가 변수 (REVALIDATE_SECRET, GISCUS_REPO_ID 등)
  ```

- [ ] **빌드 및 배포 확인**
  ```bash
  npm run build  # 로컬에서 미리 확인
  # Vercel 자동 배포 확인
  ```

- [ ] **도메인 설정** (필요시)
  - Vercel 제공 도메인 사용 또는 커스텀 도메인 연결

### 운영 중 점검 사항

- [ ] **ISR 재검증 모니터링**
  - Notion 수정 후 1시간 내 웹사이트 반영 확인
  - Vercel 함수 로그에서 재검증 기록 확인

- [ ] **이미지 로딩 확인**
  - Notion 이미지가 제대로 표시되는지 주기적 확인
  - 만료된 이미지 URL은 `next/image` 최적화 캐시 활용

- [ ] **에러 모니터링**
  - Vercel Analytics에서 에러 추적
  - 4xx, 5xx 에러 모니터링

---

## ⚠️ 기술 제약사항 요약

### 금지 사항
| 항목 | 이유 | 대안 |
|------|------|------|
| `Zustand` | 이 프로젝트 스코프에서 불필요 | `useState` 사용 |
| `react-hook-form` | 복잡한 폼이 없음 | `useState` + 기본 validation |
| 상대 경로 import | 복잡한 구조에서 혼동 유발 | `@/` 절대 경로 사용 |

### 주의 사항

#### 1. **Next.js 16에서 `params` Promise 타입**
```typescript
// ❌ 잘못된 코드
export async function generateStaticParams() {
  const trails = await getTrails()
  return trails.map(trail => ({
    id: trail.id  // trail.id가 Promise가 아님
  }))
}

// ✅ 올바른 코드 (Promise로 감싸기 필요 없음)
export async function generateStaticParams() {
  const trails = await getTrails()
  return trails.map(trail => ({
    id: trail.id
  }))
}

// 하지만 page component에서는 Promise 처리 필요
export default async function Page(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const trail = await getTrailById(params.id)
}
```

#### 2. **Tailwind CSS v4 문법 변경**
```css
/* ❌ v3 문법 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ v4 문법 */
@import "tailwindcss";
```

#### 3. **`useSearchParams` Suspense 경계**
```typescript
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SearchContent() {
  const searchParams = useSearchParams()
  // useSearchParams 호출 가능
  return <div>{searchParams.get('q')}</div>
}

export default function Page() {
  return (
    <Suspense fallback={<div>로드 중...</div>}>
      <SearchContent />
    </Suspense>
  )
}
```

#### 4. **Notion 이미지 URL 만료**
- Notion이 반환하는 이미지 URL은 만료 시간이 ~1시간 설정됨
- ISR `revalidate` 주기와 동일하므로 주의
- Phase 3에서 Cloudinary 등으로 영구화 권장

#### 5. **`unstable_cache` 주의**
```typescript
// lib/notion-client.ts
import { unstable_cache } from 'next/cache'

// Notion SDK는 fetch API를 직접 사용하지 않으므로
// 명시적으로 unstable_cache 적용 필요
export const getTrails = unstable_cache(
  async () => {
    const response = await notion.databases.query({
      database_id: env.NOTION_DATABASE_ID,
    })
    return parseTrails(response.results)
  },
  ['trails'],  // 캐시 키
  { revalidate: 3600 }  // 1시간
)
```

---

## 🎯 기능 우선순위 요약

```
Phase 0 (즉시)
  └─ 환경 설정
     ├─ .env.local 생성
     ├─ Notion Integration 생성
     ├─ DB 스키마 정의
     └─ 테스트 데이터 입력

Phase 1-b (단기, 2~3시간)
  └─ 코드 품질 보완
     ├─ app/error.tsx
     ├─ app/not-found.tsx
     ├─ SiteHeader 컴포넌트
     ├─ 목록 페이지 메타데이터
     └─ 빌드/린트 통과

Phase 2 (중기, 각 2~6시간)
  ├─ 🔥 다크 모드 (2시간) ← 1순위
  ├─ 텍스트 검색 (3시간) ← 2순위
  ├─ Giscus 댓글 (4시간) ← 3순위
  ├─ RSS 피드 (3시간) ← 4순위
  └─ 태그 다중 필터 (4~6시간) ← 5순위

Phase 3 (장기, 각 4~10시간)
  ├─ Webhook + 즉시 ISR (6~8시간)
  ├─ 지도 연동 (6~8시간)
  ├─ 조회수 통계 (4~6시간)
  └─ 이미지 영구화 (6~10시간)

배포 (Vercel)
  ├─ GitHub 연결
  ├─ 환경 변수 등록
  ├─ 빌드/배포 확인
  └─ 모니터링 설정
```

---

## 📊 진행 상황 추적

현재까지 완료된 항목: **14개 파일**
다음 단계: **Phase 0 환경 설정** (~1시간)

```
[████████████████████████░░░░░░░░░░░░░░░░░]
MVP 코드  14/14  100%
Phase 0   0/5    0%
Phase 1-b 0/5    0%
Phase 2   0/5    0%
Phase 3   0/4    0%
```

---

## 참고 자료

- [Notion API 문서](https://developers.notion.com/)
- [Next.js 16 App Router](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Giscus](https://giscus.app)
- [Vercel Deployment](https://vercel.com/docs)
