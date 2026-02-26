# PRD: Notion 기반 등산 코스 기록 블로그

> 작성일: 2026-02-26
> 작성 기준: Solo 개발자 1인, MVP 범위

---

## 1. 문서 개요 (Document Overview)

### 제품 설명
Notion을 CMS로 활용하는 등산 코스 기록 블로그. 개발자가 Notion 데이터베이스에 코스 정보를 입력하면 웹사이트에 자동으로 게시된다.

### 핵심 가치
- Notion에서만 콘텐츠를 관리하면 된다. 별도의 CMS 어드민이 없다.
- 코스 목록 → 상세 페이지 구조의 심플한 블로그 형태.
- 빌드 없이 콘텐츠 업데이트 가능 (ISR 적용).

### 개발 예상 시간
- Phase 1 (MVP): 약 12~16시간 (주말 기준 1.5일)
- Phase 2 이후: 별도 산정

### MVP 범위 (In Scope)
- Notion 데이터베이스 연동
- 코스 목록 페이지
- 코스 상세 페이지
- 난이도 / 거리 / 소요시간 등 메타데이터 표시
- Notion에 업로드된 이미지 표시
- ISR(Incremental Static Regeneration)로 캐싱

---

## 2. 사용자 스토리 (User Stories)

### US-01. 코스 목록 탐색
**"블로그 방문자로서, 등록된 등산 코스 목록을 한눈에 보고 싶다. 왜냐하면 어떤 코스가 있는지 파악하고 관심 있는 코스를 빠르게 찾고 싶기 때문이다."**

수락 기준 (Acceptance Criteria):
- 목록 페이지(`/trails`)에서 모든 코스 카드를 볼 수 있다.
- 각 카드에는 코스명, 대표 이미지, 난이도, 거리, 소요시간이 표시된다.
- 카드 클릭 시 해당 코스 상세 페이지로 이동한다.
- 이미지 미등록 시 기본 플레이스홀더 이미지가 표시된다.

### US-02. 코스 상세 정보 확인
**"블로그 방문자로서, 특정 등산 코스의 상세 정보를 확인하고 싶다. 왜냐하면 산행 전 코스 특성, 주의사항, 이미지 등을 미리 파악하고 싶기 때문이다."**

수락 기준 (Acceptance Criteria):
- 상세 페이지(`/trails/[id]`)에서 코스 전체 정보를 확인할 수 있다.
- 코스명, 산 이름, 난이도, 거리, 소요시간, 계절, 주요 경유지, 설명 본문이 표시된다.
- Notion에 첨부된 이미지가 렌더링된다.
- 존재하지 않는 코스 접근 시 404 페이지로 이동한다.

### US-03. 코스 필터링 (Should Have)
**"블로그 방문자로서, 난이도나 거리 기준으로 코스를 필터링하고 싶다. 왜냐하면 내 체력에 맞는 코스만 골라 보고 싶기 때문이다."**

수락 기준 (Acceptance Criteria):
- 목록 페이지에서 난이도(초급/중급/고급) 필터 버튼이 제공된다.
- 필터 선택 시 해당 난이도 코스만 표시된다.
- 필터는 클라이언트 사이드에서 동작한다 (API 재요청 없음).

### US-04. 콘텐츠 관리 (개발자/운영자)
**"블로그 운영자로서, Notion에서 코스 정보를 추가/수정하면 웹사이트에 반영되길 원한다. 왜냐하면 별도 배포 없이 콘텐츠를 업데이트하고 싶기 때문이다."**

수락 기준 (Acceptance Criteria):
- Notion에 새 코스를 추가하면 최대 1시간 내로 웹사이트에 반영된다 (ISR revalidate 3600초).
- Notion에서 코스 정보 수정 시 웹사이트에 동일하게 반영된다.
- Notion에서 코스를 삭제(또는 Published 상태 해제)하면 목록에서 제거된다.

---

## 3. 핵심 기능 요구사항 (Feature Requirements)

### F-01. Notion 데이터 연동 [Must Have]
- **설명**: `@notionhq/client` SDK로 Notion 데이터베이스를 조회하여 코스 데이터를 가져온다.
- **입력**: Notion Database ID, Notion API Key
- **출력**: `Trail[]` 타입의 코스 데이터 배열
- **예외 처리**:
  - API Key 미설정 시 빌드 단계에서 에러 발생 (Zod 환경변수 검증)
  - Notion API 응답 실패 시 빈 배열 반환 + 에러 로깅

### F-02. 코스 목록 페이지 [Must Have]
- **설명**: 전체 등산 코스를 카드 그리드 형태로 표시한다.
- **입력**: Notion 코스 데이터 전체
- **출력**: 카드 그리드 UI (반응형: 모바일 1열, 태블릿 2열, 데스크탑 3열)
- **예외 처리**: 코스가 0개일 때 "등록된 코스가 없습니다" 메시지 표시

### F-03. 코스 상세 페이지 [Must Have]
- **설명**: 특정 코스의 상세 정보를 표시한다.
- **입력**: 코스 ID (URL 파라미터)
- **출력**: 코스 메타데이터 + 본문 텍스트 + 이미지
- **예외 처리**: 존재하지 않는 ID → `notFound()` 호출로 404 처리

### F-04. 이미지 처리 [Must Have]
- **설명**: Notion에 업로드된 이미지를 `next/image`로 최적화하여 표시한다.
- **입력**: Notion 이미지 URL (만료 가능한 S3 서명 URL)
- **출력**: 최적화된 이미지 렌더링
- **예외 처리**:
  - 이미지 없을 때 플레이스홀더 표시
  - `next.config.ts`에 Notion 이미지 도메인 허용 설정 필수

### F-05. ISR 캐싱 [Must Have]
- **설명**: 빌드 시 정적 생성 + 주기적 재검증으로 콘텐츠를 최신 상태로 유지한다.
- **구현**: `revalidate = 3600` (1시간)
- **예외 처리**: 재검증 실패 시 캐시된 이전 버전 제공 (기본 동작)

### F-06. 난이도 필터 [Should Have]
- **설명**: 클라이언트 사이드에서 난이도별로 코스를 필터링한다.
- **입력**: 필터 버튼 클릭 이벤트
- **출력**: 필터링된 카드 목록
- **구현**: Zustand 없이 `useState`로 충분 (단순 필터 상태)

### F-07. 메타데이터 / SEO [Should Have]
- **설명**: 각 페이지에 적절한 `<title>`, `<description>` 메타태그를 삽입한다.
- **구현**: Next.js `generateMetadata()` 함수 사용
- **입력**: 코스명, 설명 텍스트
- **출력**: `<head>` 메타태그 자동 생성

---

## 4. 기술 스펙 (Technical Specifications)

### 4-1. 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.x |
| 언어 | TypeScript (strict) | 5.x |
| UI | React | 19.x |
| 스타일링 | Tailwind CSS | v4 |
| 컴포넌트 | shadcn/ui (New York, neutral) | latest |
| CMS | Notion API | v1 |
| 검증 | Zod | latest |
| 이미지 | next/image | 내장 |

### 4-2. 설치 필요 패키지

```bash
npm install @notionhq/client zod
```

> `zustand`, `react-hook-form`은 이 프로젝트에서 불필요. 설치하지 않는다.

### 4-3. 환경 변수

```env
# .env.local
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

환경 변수 검증 (`lib/env.ts`):
```typescript
import { z } from 'zod'

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_DATABASE_ID: z.string().min(1),
})

export const env = envSchema.parse(process.env)
```

### 4-4. Notion 데이터베이스 스키마

Notion 데이터베이스에 다음 속성을 정의해야 한다:

| 속성명 | Notion 타입 | 필수 | 설명 |
|--------|------------|------|------|
| Name | Title | 필수 | 코스명 (기본 제목 필드) |
| Mountain | Text | 필수 | 산 이름 |
| Difficulty | Select | 필수 | 초급 / 중급 / 고급 |
| Distance | Number | 권장 | 거리 (km) |
| Duration | Number | 권장 | 소요시간 (분) |
| Season | Multi-select | 선택 | 봄 / 여름 / 가을 / 겨울 |
| Waypoints | Text | 선택 | 주요 경유지 (쉼표 구분) |
| CoverImage | Files & media | 선택 | 대표 이미지 |
| Published | Checkbox | 필수 | 공개 여부 |
| Description | Rich text | 선택 | 코스 설명 본문 |

### 4-5. 타입 정의 (`lib/types/trail.ts`)

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

### 4-6. Notion 클라이언트 (`lib/notion-client.ts`)

```typescript
// 주요 함수 목록
getTrails(): Promise<TrailListItem[]>
getTrailById(id: string): Promise<Trail | null>
```

- `Published: true`인 항목만 조회
- Notion 페이지 속성 → `Trail` 타입 변환 로직 포함
- ISR과 함께 사용: Next.js `fetch` 대신 SDK 사용이므로 `unstable_cache` 적용

### 4-7. 파일 구조

```
app/
├── layout.tsx                    # 루트 레이아웃 (기존)
├── page.tsx                      # 홈 → /trails로 redirect 또는 간단 랜딩
├── globals.css                   # 전역 스타일 (기존)
├── trails/
│   ├── page.tsx                  # 코스 목록 (RSC + ISR)
│   └── [id]/
│       ├── page.tsx              # 코스 상세 (RSC + ISR)
│       └── not-found.tsx         # 404 처리
├── error.tsx                     # 전역 에러 바운더리
└── not-found.tsx                 # 전역 404
components/
├── ui/                           # shadcn/ui 자동 생성 컴포넌트
└── trails/
    ├── TrailCard.tsx             # 코스 카드 (목록용)
    ├── TrailGrid.tsx             # 카드 그리드 래퍼
    ├── TrailDetail.tsx           # 코스 상세 레이아웃
    ├── TrailMeta.tsx             # 메타데이터 배지 모음
    ├── DifficultyFilter.tsx      # 난이도 필터 버튼 (use client)
    └── DifficultyBadge.tsx       # 난이도 색상 배지
lib/
├── utils.ts                      # cn() 유틸리티 (기존)
├── env.ts                        # 환경 변수 Zod 검증
├── notion-client.ts              # Notion API 래퍼
└── types/
    └── trail.ts                  # 타입 정의
docs/
└── PRD.md                        # 이 문서
```

### 4-8. next.config.ts 설정 (이미지 도메인)

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.notion.so',
      },
    ],
  },
}
```

---

## 5. UI/UX 고려사항 (UI/UX Considerations)

### 5-1. 주요 페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 홈 | `/` | `/trails`로 redirect 또는 간단 소개 |
| 코스 목록 | `/trails` | 전체 코스 카드 그리드 |
| 코스 상세 | `/trails/[id]` | 개별 코스 정보 |

### 5-2. 사용자 플로우

```
홈 페이지(/) → 코스 목록(/trails)
  ↓ [난이도 필터 선택]
  필터링된 목록
  ↓ [카드 클릭]
코스 상세(/trails/[id])
  ↓ [뒤로가기]
코스 목록(/trails)
```

### 5-3. 반응형 디자인

- **모바일 (< 768px)**: 1열 카드 그리드
- **태블릿 (768px ~ 1024px)**: 2열 카드 그리드
- **데스크탑 (> 1024px)**: 3열 카드 그리드
- Tailwind 기본 브레이크포인트(`md:`, `lg:`) 사용

### 5-4. 접근성 요구사항 (기본)

- 이미지에 `alt` 속성 필수 (코스명 사용)
- 난이도 배지 색상에 텍스트 레이블 병기 (색맹 대응)
- `<nav>`, `<main>`, `<article>` 시맨틱 태그 사용

### 5-5. 난이도 색상 기준

| 난이도 | 배지 색상 |
|--------|----------|
| 초급 | 초록 (green) |
| 중급 | 주황 (orange) |
| 고급 | 빨강 (red) |

---

## 6. 구현 로드맵 (Implementation Roadmap)

### Phase 1 - MVP (약 12~16시간)

**Step 1. 환경 설정 (1시간)**
- [ ] `@notionhq/client`, `zod` 설치
- [ ] `.env.local` 생성 및 환경 변수 입력
- [ ] `lib/env.ts` 작성 (Zod 검증)
- [ ] `next.config.ts` 이미지 도메인 설정

**Step 2. Notion 연동 (2~3시간)**
- [ ] Notion 데이터베이스 생성 및 속성 정의 (위 스키마 참고)
- [ ] Notion Integration 생성 → 데이터베이스에 공유
- [ ] `lib/types/trail.ts` 타입 정의
- [ ] `lib/notion-client.ts` 구현 (`getTrails`, `getTrailById`)
- [ ] 연결 테스트 (간단한 스크립트 또는 `console.log`)

**Step 3. 코스 목록 페이지 (3~4시간)**
- [ ] `components/trails/TrailCard.tsx` 구현
- [ ] `components/trails/TrailGrid.tsx` 구현
- [ ] `components/trails/DifficultyBadge.tsx` 구현
- [ ] `components/trails/DifficultyFilter.tsx` 구현 (use client)
- [ ] `app/trails/page.tsx` 구현 (RSC, ISR revalidate 3600)

**Step 4. 코스 상세 페이지 (3~4시간)**
- [ ] `components/trails/TrailDetail.tsx` 구현
- [ ] `components/trails/TrailMeta.tsx` 구현
- [ ] `app/trails/[id]/page.tsx` 구현 (RSC, ISR, generateMetadata)
- [ ] `app/trails/[id]/not-found.tsx` 구현
- [ ] `generateStaticParams()` 구현

**Step 5. 마무리 (2~3시간)**
- [ ] 홈 페이지 → `/trails` 리다이렉트 처리
- [ ] `app/error.tsx` 에러 바운더리 구현
- [ ] 반응형 검증 (모바일/태블릿/데스크탑)
- [ ] 실제 Notion 데이터로 E2E 확인
- [ ] `npm run build` 성공 확인

---

### Phase 2 - 품질 향상 (MVP 이후, 각 4~6시간)

> MVP 완성 후 필요성이 확인되면 추가. In Scope 아님.

- **검색 기능**: 코스명, 산 이름으로 텍스트 검색
- **지도 연동**: 카카오맵 또는 Naver Map API로 경로 표시
- **댓글 기능**: Giscus (GitHub Discussions 기반) 연동
- **다크 모드**: `globals.css` `.dark` 클래스 활성화
- **태그 기반 필터**: 계절, 산 이름 등 다중 필터 조합
- **조회수 통계**: Vercel Analytics 또는 간단한 카운터
- **Notion Webhook**: 콘텐츠 변경 즉시 ISR 재검증 (`revalidatePath`)
- **RSS 피드**: `/feed.xml` 생성

---

## 7. 의존성 및 주의사항 (Dependencies & Considerations)

### 7-1. 필요 패키지

```bash
# 신규 설치
npm install @notionhq/client zod
```

이미 설치된 패키지: `next`, `react`, `tailwindcss`, `shadcn/ui`, `lucide-react`

### 7-2. 외부 서비스

| 서비스 | 용도 | 비용 |
|--------|------|------|
| Notion | CMS (데이터베이스) | 무료 (개인 플랜) |
| Notion API | 데이터 조회 | 무료 |
| Vercel | 배포 (권장) | 무료 (Hobby 플랜) |

### 7-3. 성능 고려사항

- **ISR revalidate**: 3600초(1시간) 권장. 더 자주 업데이트 필요하면 600초로 조정.
- **이미지 최적화**: Notion 이미지 URL은 만료 시간이 있는 서명 URL. ISR 주기보다 만료 시간이 짧으면 이미지 깨짐 발생 가능. Notion 이미지 URL 만료는 보통 1시간 → ISR 주기와 동일하므로 주의.
  - 대안: 이미지를 Cloudinary 등 외부 서비스에 별도 업로드 (Phase 2 고려)
- **`unstable_cache`**: Notion SDK는 `fetch` API를 직접 사용하지 않으므로 Next.js 자동 캐싱이 적용되지 않는다. `unstable_cache`로 명시적 캐싱 적용 필요.

```typescript
import { unstable_cache } from 'next/cache'

export const getTrails = unstable_cache(
  async () => { /* Notion API 호출 */ },
  ['trails'],
  { revalidate: 3600 }
)
```

### 7-4. 보안 고려사항

- `NOTION_API_KEY`는 반드시 서버 사이드에서만 사용. `NEXT_PUBLIC_` 접두어 사용 금지.
- `.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 않는다.
- Notion API는 읽기 전용 Integration으로 제한 (쓰기 권한 불필요).

### 7-5. Notion 이미지 도메인 목록 (next.config.ts)

Notion 이미지는 다음 도메인에서 제공된다:
- `prod-files-secure.s3.us-west-2.amazonaws.com` (파일 첨부)
- `www.notion.so` (인라인 이미지 일부)
- `images.unsplash.com` (Notion 커버 이미지 기본값)

---

## 8. 성공 기준 (Definition of Done)

### 8-1. 개발 완료 기준

- [ ] `npm run build` 에러 없이 성공
- [ ] `npm run lint` 경고 없이 통과
- [ ] TypeScript 컴파일 에러 0개
- [ ] Notion 데이터베이스에 코스 3개 이상 등록하여 목록 페이지 정상 렌더링 확인
- [ ] 코스 상세 페이지 정상 접근 확인
- [ ] 존재하지 않는 코스 ID 접근 시 404 페이지 표시 확인
- [ ] 난이도 필터 동작 확인
- [ ] 모바일(375px) 레이아웃 깨짐 없음 확인

### 8-2. 배포 체크리스트 (Vercel 기준)

- [ ] Vercel 환경 변수에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 등록
- [ ] Vercel 빌드 성공 확인
- [ ] 배포된 URL에서 코스 목록 정상 조회 확인
- [ ] 이미지 정상 렌더링 확인 (`next/image` 도메인 설정)
- [ ] ISR 재검증 동작 확인 (Notion 수정 후 1시간 내 반영)

---

## 부록: Notion Integration 생성 방법

1. `https://www.notion.so/my-integrations` 접속
2. "새 Integration" 생성
3. 이름 입력, 워크스페이스 선택, 권한은 "읽기 콘텐츠"만 선택
4. "Internal Integration Token" 복사 → `NOTION_API_KEY`로 사용
5. 등산 코스 데이터베이스 페이지 열기 → 우측 상단 `...` → "연결 추가" → 생성한 Integration 선택
6. 데이터베이스 URL에서 ID 추출 → `NOTION_DATABASE_ID`로 사용
   - URL 형식: `https://www.notion.so/{workspace}/{DATABASE_ID}?v=...`
