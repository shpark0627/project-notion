# Development Guidelines - 등산 코스 기록 블로그

## 프로젝트 개요

- **프로젝트**: Notion을 CMS로 활용한 등산 코스 기록 블로그
- **특징**: Notion 데이터베이스에서 콘텐츠 관리, 웹사이트 자동 게시 (빌드 없이 ISR로 업데이트)
- **기술 스택**:
  - **프레임워크**: Next.js 16.1.6 (App Router)
  - **언어**: TypeScript 5 (strict mode)
  - **UI**: React 19.2.3 + Tailwind CSS 4 + shadcn/ui
  - **데이터 소스**: Notion API (@notionhq/client 5.9.0)
  - **검증**: Zod 4.3.6
  - **아이콘**: lucide-react

---

## 프로젝트 아키텍처

### 디렉토리 구조 및 역할

```
app/
├── layout.tsx              (루트 레이아웃 - 전역 메타데이터, 글꼴, 스타일)
├── page.tsx                (/trails로 리다이렉트 또는 랜딩 페이지)
├── globals.css             (전역 스타일)
├── trails/
│   ├── page.tsx            (코스 목록 페이지 - RSC + ISR revalidate 3600)
│   └── [id]/
│       ├── page.tsx        (코스 상세 페이지 - RSC + ISR + generateMetadata)
│       └── not-found.tsx   (404 페이지)
└── (error.tsx)             (전역 에러 바운더리 - 필요시 추가)

components/
├── ui/                     (shadcn/ui 자동 생성 컴포넌트 - 수정 금지)
└── trails/
    ├── TrailCard.tsx       (코스 카드 - 목록용 프리젠테이션)
    ├── TrailGrid.tsx       (카드 그리드 래퍼 - 레이아웃)
    ├── TrailDetail.tsx     (코스 상세 정보 레이아웃)
    ├── TrailMeta.tsx       (메타데이터 배지 모음 - 난이도, 거리, 시간)
    ├── DifficultyBadge.tsx (난이도 배지 - 색상 맵핑)
    ├── DifficultyFilter.tsx (난이도 필터 - use client, useState 사용)
    └── FilteredTrailsContent.tsx (필터링 로직 래퍼)

lib/
├── env.ts                  (Zod 환경변수 검증)
├── notion-client.ts        (Notion API 래퍼 + unstable_cache)
├── types/
│   └── trail.ts            (Trail, TrailListItem, Difficulty, Season 타입)
└── utils.ts                (cn() 유틸리티)

docs/
└── PRD.md                  (제품 요구사항)
```

---

## Notion 통합 규칙

### 환경 변수 설정

**파일**: `lib/env.ts`

```typescript
// 필수 환경변수:
// NOTION_API_KEY=secret_xxxxxxxxxxxxx
// NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx

// Zod 스키마로 검증:
const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_DATABASE_ID: z.string().min(1),
})
export const env = envSchema.parse(process.env)
```

**규칙**:
- `NOTION_API_KEY`는 반드시 내부 Integration Token
- `NOTION_DATABASE_ID`는 `-` 포함한 UUID 형식 (코드에서 자동 제거)
- `.env.local` 파일은 `.gitignore`에 포함되어 커밋되지 않음
- `NEXT_PUBLIC_` 접두어 절대 사용 금지 (서버 사이드만 사용)

### Notion 클라이언트 (`lib/notion-client.ts`)

**핵심 함수**:
- `getTrails()`: 발행된 코스 전체 목록 조회
  - 캐싱: `unstable_cache(['trails'], { revalidate: 3600 })`
  - 필터: `Published: true`인 항목만
  - 반환: `TrailListItem[]`

- `getTrailById(id)`: 특정 코스 상세 조회
  - 캐싱: `unstable_cache(['trail'], { revalidate: 3600 })`
  - 입력: ID는 하이픈 제거된 형식 → 정규식으로 복원 후 조회
  - 반환: `Trail | null`

- `getTrailIds()`: 정적 파라미터 생성용
  - `getTrails()` 결과에서 ID 배열 추출

**ID 포맷 규칙**:
- 저장된 형식: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (32글자, 하이픈 제거)
- Notion API 요청: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (36글자, 하이픈 포함)
- 변환 함수: `id.replace(/([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/, '$1-$2-$3-$4-$5')`

**에러 처리**:
- Notion API 실패 → 빈 배열 또는 `null` 반환
- 콘솔에 에러 로깅
- ISR 재검증 중 실패 → 캐시된 이전 버전 제공

### Notion 데이터베이스 스키마

**필수 속성** (Notion 데이터베이스에 정의할 것):

| 속성명 | Notion 타입 | 코드 매핑 | 필수 |
|--------|-----------|---------|------|
| Name | Title | `trail.name` | ✓ |
| Mountain | Rich text | `trail.mountain` | ✓ |
| Difficulty | Select | `trail.difficulty` (초급/중급/고급) | ✓ |
| Distance | Number | `trail.distanceKm` | 선택 |
| Duration | Number | `trail.durationMin` | 선택 |
| Season | Multi-select | `trail.seasons[]` | 선택 |
| Waypoints | Rich text | `trail.waypoints[]` (쉼표 구분) | 선택 |
| CoverImage | Files & media | `trail.coverImageUrl` | 선택 |
| Published | Checkbox | 필터 조건 (true만 조회) | ✓ |
| Description | Rich text | `trail.description` | 선택 |

**필터 조건**: `Published: true`인 항목만 웹사이트에 표시

### 이미지 처리 규칙

**파일**: `next.config.ts` - `remotePatterns` 설정

```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com', // Notion 파일 첨부
  },
  {
    protocol: 'https',
    hostname: '*.notion.so', // Notion 인라인 이미지
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com', // Notion 커버 기본값
  },
]
```

**주의**:
- Notion 이미지 URL은 만료 서명 URL (보통 1시간)
- ISR revalidate = 3600초 → 이미지 만료 시간과 동일 선택
- 이미지 깨짐 방지: ISR 주기를 이미지 만료 시간보다 짧게 설정 필요

---

## 페이지 및 라우팅 규칙

### 코스 목록 페이지 (`app/trails/page.tsx`)

**구조**:
```typescript
// Server Component (RSC)
export const revalidate = 3600 // ISR 설정

export const metadata: Metadata = {
  title: '등산 코스 목록',
  description: '...',
}

export default async function TrailsPage() {
  const trails = await getTrails()
  return (
    <main>
      <FilteredTrailsContent trails={trails} />
    </main>
  )
}
```

**규칙**:
- RSC (React Server Component)로 구현
- `revalidate = 3600` (1시간마다 재생성)
- `getTrails()` 호출 후 `<FilteredTrailsContent>` 클라이언트 컴포넌트로 전달
- `<FilteredTrailsContent>`에서만 `'use client'` 지시문 사용
- 필터링은 클라이언트 사이드 (재요청 없음)

### 코스 상세 페이지 (`app/trails/[id]/page.tsx`)

**구조**:
```typescript
// Server Component (RSC)
export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trail = await getTrailById(params.id)
  return {
    title: trail?.name,
    description: trail?.description,
  }
}

export async function generateStaticParams() {
  const ids = await getTrailIds()
  return ids.map((id) => ({ id }))
}

export default async function TrailPage({ params }: Props) {
  const trail = await getTrailById(params.id)
  if (!trail) notFound()
  return <TrailDetail trail={trail} />
}
```

**규칙**:
- `generateMetadata()` 구현 필수
- `generateStaticParams()` 구현 필수 (빌드 시 정적 경로 생성)
- 데이터 없음 → `notFound()` 호출 (404 페이지로)
- `revalidate = 3600` ISR 설정

### 404 페이지 (`app/trails/[id]/not-found.tsx`)

**구조**:
```typescript
export default function NotFound() {
  return <div>등록되지 않은 코스입니다.</div>
}
```

**언제 표시**:
- 존재하지 않는 `[id]` 접근 시
- `notFound()` 함수 호출 시

---

## 컴포넌트 구조 규칙

### 프리젠테이션 vs 비즈니스 로직 분리

**프리젠테이션 컴포넌트** (RSC 가능):
- `TrailCard.tsx`: 코스 카드 UI
- `TrailGrid.tsx`: 그리드 레이아웃
- `TrailDetail.tsx`: 상세 정보 레이아웃
- `TrailMeta.tsx`: 메타데이터 배지
- `DifficultyBadge.tsx`: 난이도 배지

**클라이언트 컴포넌트** (`'use client'`):
- `DifficultyFilter.tsx`: 필터 버튼 + `useState` 상태 관리
- `FilteredTrailsContent.tsx`: 필터링 로직 래퍼

**규칙**:
- 상태 관리가 필요한 경우만 `'use client'` 사용
- 부모가 RSC인 경우 클라이언트 컴포넌트를 `export default`로 보내기 (자식 클라이언트 컴포넌트 가능)
- `DifficultyFilter`의 필터값 변경 → 클라이언트에서만 상태 업데이트 (서버 재요청 없음)

### 컴포넌트 Props 예시

**TrailCard**:
```typescript
interface TrailCardProps {
  id: string
  name: string
  mountain: string
  difficulty: Difficulty
  distanceKm: number | null
  durationMin: number | null
  coverImageUrl: string | null
}
```

**TrailDetail**:
```typescript
interface TrailDetailProps {
  trail: Trail
}
```

**DifficultyFilter**:
```typescript
interface DifficultyFilterProps {
  onDifficultyChange: (difficulty: Difficulty | null) => void
}
```

---

## 타입 시스템 규칙

### 타입 정의 (`lib/types/trail.ts`)

**필수 타입**:

```typescript
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
```

**규칙**:
- 이 타입들은 고정 (Notion 스키마 변경 시에만 수정)
- Notion 응답 데이터는 runtime에 매핑
- 타입 안전성 우선 (any 사용 최소화)

### 환경변수 검증 (Zod)

**파일**: `lib/env.ts`

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
})

export const env = envSchema.parse(process.env)
```

**규칙**:
- 모든 환경변수는 Zod로 검증
- 빌드 시 검증 (런타임이 아님)
- 필수 변수 누락 → 빌드 실패

---

## 파일 수정 규칙 (Multi-file Coordination)

### 새 코스 속성 추가 시

**수정할 파일**:
1. `lib/types/trail.ts` - 타입에 속성 추가
2. `lib/notion-client.ts` - `fetchTrails()`, `fetchTrailById()` 데이터 추출 로직 추가
3. `components/trails/TrailCard.tsx` - 목록 표시 업데이트 (필요시)
4. `components/trails/TrailDetail.tsx` - 상세 표시 업데이트 (필요시)
5. `components/trails/TrailMeta.tsx` - 메타데이터 배지 추가 (필요시)

### 난이도 값 추가 시 (초급/중급/고급 → 초급/중급/고급/전문가 등)

**수정할 파일**:
1. `lib/types/trail.ts` - `Difficulty` 타입 수정
2. `components/trails/DifficultyBadge.tsx` - 색상 맵핑 추가
3. `components/trails/DifficultyFilter.tsx` - 필터 버튼 옵션 추가
4. Notion 데이터베이스 - Select 옵션 추가

### ISR revalidate 값 변경 시

**수정할 파일**:
1. `app/trails/page.tsx`
2. `app/trails/[id]/page.tsx`

(두 파일 모두 동일한 값으로 유지)

---

## 금지 사항 (Prohibited Actions)

### ❌ 절대 하지 말 것

1. **환경변수 노출**
   - `NEXT_PUBLIC_NOTION_API_KEY` 사용 금지
   - 서버 환경변수만 사용

2. **클라이언트에서 Notion API 직접 호출**
   - 클라이언트 컴포넌트에서 `notion.databases.query()` 호출 금지
   - `getTrails()`, `getTrailById()` 서버 함수 사용

3. **상태 관리 라이브러리 추가**
   - `zustand`, `redux`, `recoil` 설치 금지
   - `useState` + props drilling로 충분

4. **shadcn/ui 컴포넌트 수정**
   - `components/ui/` 폴더 컴포넌트 수정 금지
   - 스타일 커스터마이징이 필요하면 새 컴포넌트 생성

5. **Notion ID 포맷 혼용**
   - 데이터베이스: 하이픈 제거 형식만 사용 (`xxxxxxxx...`)
   - API 요청: 자동 변환 로직 유지

6. **ISR revalidate 값 불일치**
   - `/trails` 페이지와 `/trails/[id]` 페이지의 revalidate 값 반드시 동일
   - (현재 3600초로 고정)

7. **`'use client'` 남용**
   - 상태가 필요 없으면 RSC 유지
   - 불필요한 하이드레이션 방지

8. **이미지 도메인 임의 추가**
   - `next.config.ts` 수정 시 보안 검토 필수
   - Notion 관련 도메인만 허용

---

## AI 의사결정 기준 (Decision Trees)

### 새로운 페이지/라우트 추가 시

```
새 페이지가 필요한가?
├─ YES: 정적 데이터 (블로그 포스트 등) → RSC + generateMetadata
├─ YES: 동적 라우트 → [id] 폴더 + generateStaticParams + generateMetadata
├─ YES: 필터/정렬 필요 → RSC + FilteredContent 클라이언트 컴포넌트
└─ NO: 기존 페이지 수정
```

### 새로운 컴포넌트 생성 시

```
상태(state) 관리가 필요한가?
├─ YES: 'use client' 지시문 + useState 사용
│   └─ Props로 부모와 통신
├─ NO: RSC로 구현 (기본값)
│   └─ Props로 데이터 받기만 함
└─ 조건부: 부모가 RSC면 자식 클라이언트 컴포넌트 가능
```

### 데이터 페칭 위치 결정

```
데이터를 어디서 페치할까?
├─ 페이지에서만 사용 → 페이지 컴포넌트에서 페치
├─ 여러 컴포넌트에서 사용 → 부모 페이지에서 페치 → props 전달
├─ 반복 페칭 필요 → lib/notion-client.ts에 함수 추가
└─ 클라이언트 이벤트 기반 → 클라이언트 컴포넌트 + useState
```

### 필터 구현 방식 결정

```
필터가 필요한가?
├─ 클라이언트 사이드 (페이지 새로고침 없음)
│   └─ DifficultyFilter 스타일 구현 (useState + 클라이언트 컴포넌트)
├─ 서버 사이드 (페이지 재생성)
│   └─ URL searchParams + generateStaticParams (Phase 2)
└─ 서버+클라이언트 혼합 (고급)
    └─ 나중에 고려
```

### 오류 시 처리

```
API 호출 실패 시
├─ Notion API 다운 → 캐시된 이전 데이터 제공 (ISR 기본 동작)
├─ 잘못된 환경변수 → 빌드 실패 (Zod 검증)
├─ 존재하지 않는 ID → notFound() 호출 → 404 페이지
└─ 예상치 못한 에러 → console.error + null 반환
```

---

## 검증 체크리스트

### 새 기능 구현 후

- [ ] TypeScript 컴파일 에러 없음
- [ ] 관련 파일들 모두 수정 (위 Multi-file Coordination 참고)
- [ ] 환경변수 노출 확인
- [ ] `'use client'` 필요성 재확인
- [ ] Notion 속성명 일치 확인 (대소문자 포함)
- [ ] ISR revalidate 값 일치 여부 확인

### 배포 전

- [ ] `npm run build` 성공
- [ ] `npm run lint` 통과
- [ ] Notion 테스트 데이터 확인 (최소 3개 코스)
- [ ] 404 페이지 동작 확인
- [ ] 모바일/태블릿/데스크톱 레이아웃 확인
- [ ] 이미지 렌더링 확인

---

## 추가 참고

- **PRD**: `docs/PRD.md` - 전체 요구사항 및 Notion 스키마
- **메모리**: 프로젝트 진행 상황 및 체크리스트는 자동 메모리 파일 참고
