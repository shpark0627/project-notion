# 등산 코스 기록 블로그 (Hiking Trails Blog)

Notion을 CMS로 활용한 등산 코스 기록 블로그입니다. 개발자가 Notion에서 등산 코스 정보를 입력하면 자동으로 웹사이트에 게시되는 시스템입니다.

**특징:**
- ✨ **Notion CMS 연동**: 별도의 어드민 페이지 없이 Notion에서만 콘텐츠 관리
- 🚀 **ISR 캐싱**: 빌드 없이 주기적으로 콘텐츠 자동 업데이트 (1시간 주기)
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- 🎨 **최신 기술 스택**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- 🔍 **SEO 최적화**: 동적 메타데이터 자동 생성
- ⚡ **성능 최적화**: Next.js Image 컴포넌트로 이미지 자동 최적화

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18.0 이상
- **npm** (또는 yarn, pnpm)
- **Notion 계정** (데이터베이스 생성 필요)

### 1단계: 저장소 클론

```bash
git clone https://github.com/shpark0627/project-notion.git
cd project-notion
```

### 2단계: 패키지 설치

```bash
npm install @notionhq/client zod
npm install
```

### 3단계: 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 값을 입력하세요:

```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

**Notion 설정 방법:**
1. https://www.notion.so/my-integrations 에서 새 Integration 생성
2. "Internal Integration Token" 복사 → `NOTION_API_KEY` 입력
3. Notion 데이터베이스의 URL에서 ID 추출 → `NOTION_DATABASE_ID` 입력
4. 데이터베이스에 Integration 접근 권한 부여

자세한 가이드는 [docs/PRD.md](./docs/PRD.md) 부록 참고.

### 4단계: 개발 서버 시작

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📦 기술 스택

### 프레임워크 & 언어
- **Next.js 16** (App Router): 풀스택 React 프레임워크
- **React 19**: UI 라이브러리
- **TypeScript**: Strict mode 타입 안정성

### CMS & 데이터
- **Notion API** (`@notionhq/client`): 콘텐츠 관리 시스템
- **Zod**: 환경 변수 및 데이터 검증

### 스타일링 & UI
- **Tailwind CSS v4**: Utility-first CSS
- **shadcn/ui** (New York, neutral): UI 컴포넌트 라이브러리
- **lucide-react**: 아이콘

### 개발 도구
- **ESLint**: 코드 품질 검사
- **TypeScript 5.x**: 컴파일

## 📁 프로젝트 구조

```
project-notion/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈 페이지
│   ├── globals.css              # 전역 스타일 & Tailwind 설정
│   ├── trails/                  # 등산 코스 페이지
│   │   ├── page.tsx             # 코스 목록 (RSC + ISR)
│   │   └── [id]/
│   │       ├── page.tsx         # 코스 상세 (RSC + ISR)
│   │       └── not-found.tsx    # 404 페이지
│   ├── error.tsx                # 에러 바운더리
│   └── not-found.tsx            # 전역 404
├── components/                   # React 컴포넌트
│   ├── ui/                      # shadcn/ui 컴포넌트
│   └── trails/                  # 등산 코스 컴포넌트
│       ├── TrailCard.tsx        # 코스 카드
│       ├── TrailGrid.tsx        # 카드 그리드
│       ├── TrailDetail.tsx      # 상세 정보
│       ├── TrailMeta.tsx        # 메타데이터 배지
│       ├── DifficultyBadge.tsx  # 난이도 배지
│       └── DifficultyFilter.tsx # 난이도 필터 (use client)
├── lib/                          # 유틸리티 & 클라이언트
│   ├── utils.ts                 # cn() 함수
│   ├── env.ts                   # 환경 변수 검증 (Zod)
│   ├── notion-client.ts         # Notion API 클라이언트
│   └── types/
│       └── trail.ts             # 코스 데이터 타입
├── docs/                         # 문서
│   └── PRD.md                   # 제품 요구사항 명세서
├── public/                       # 정적 자산
├── .env.example                 # 환경 변수 템플릿
├── tsconfig.json                # TypeScript 설정
├── next.config.ts               # Next.js 설정
└── package.json                 # 의존성
```

## 🎯 주요 커맨드

```bash
# 개발 서버 실행 (핫 리로드 활성화)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사 (코드 품질 확인)
npm run lint
```

## 🎨 주요 페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| **홈** | `/` | 프로젝트 소개 또는 `/trails`로 리다이렉트 |
| **코스 목록** | `/trails` | 등산 코스 카드 그리드 (반응형: 1~3열) |
| **코스 상세** | `/trails/[id]` | 개별 코스 정보 (난이도, 거리, 소요시간, 이미지, 설명) |

### 사용자 흐름

```
홈(/) → 코스 목록(/trails)
  ↓ [난이도 필터 선택]
  필터링된 목록
  ↓ [카드 클릭]
코스 상세(/trails/[id])
  ↓ [뒤로가기]
코스 목록(/trails)
```

## 🔄 캐싱 전략

### ISR (Incremental Static Regeneration)
- **재검증 주기**: 1시간 (3600초)
- **동작**: 빌드 후 정적으로 생성된 페이지를 주기적으로 갱신
- **이점**: Notion 데이터 변경 후 최대 1시간 내 웹사이트에 자동 반영

### `unstable_cache` 적용
```typescript
// lib/notion-client.ts
import { unstable_cache } from 'next/cache'

export const getTrails = unstable_cache(
  async () => { /* Notion API 호출 */ },
  ['trails'],
  { revalidate: 3600 }
)
```

> **주의**: Notion 이미지 URL은 약 1시간 후 만료됩니다. Phase 2에서 Cloudinary 같은 이미지 호스팅 서비스 도입을 권장합니다.

## 📱 반응형 디자인

Tailwind CSS 브레이크포인트 사용:

| 화면 크기 | 너비 | 카드 그리드 |
|----------|------|-----------|
| 모바일 | < 768px | 1열 |
| 태블릿 | 768px ~ 1024px | 2열 |
| 데스크톱 | > 1024px | 3열 |

- `sm`: 640px 이상
- `md`: 768px 이상
- `lg`: 1024px 이상
- `xl`: 1280px 이상

## 🔧 Notion 데이터베이스 설정

### 필수 속성 (Properties)

| 속성명 | Notion 타입 | 필수 | 설명 |
|--------|------------|------|------|
| **Name** | Title | ✓ | 코스명 |
| **Mountain** | Text | ✓ | 산 이름 |
| **Difficulty** | Select | ✓ | 초급 / 중급 / 고급 |
| **Distance** | Number | - | 거리 (km) |
| **Duration** | Number | - | 소요시간 (분) |
| **Season** | Multi-select | - | 봄 / 여름 / 가을 / 겨울 |
| **Waypoints** | Text | - | 주요 경유지 (쉼표 구분) |
| **CoverImage** | Files & media | - | 대표 이미지 |
| **Published** | Checkbox | ✓ | 공개 여부 |
| **Description** | Rich text | - | 코스 설명 |

> 자세한 설정 방법은 [docs/PRD.md](./docs/PRD.md) 참고

## 🎨 커스터마이징

### 새로운 shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add [component-name]
npx shadcn@latest add dialog
npx shadcn@latest add form
```

## 📝 TypeScript 설정

프로젝트는 **TypeScript Strict Mode**로 설정되어 있으므로:

- `any` 타입 사용 불가
- 모든 함수의 반환 타입 명시 필수
- Null 안정성 검사 활성화

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## 🚢 배포 (Vercel 권장)

### 자동 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshpark0627%2Fproject-notion)

위 버튼 클릭 후 환경 변수 설정:
- `NOTION_API_KEY`
- `NOTION_DATABASE_ID`

### 수동 배포

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 배포
vercel
```

### 배포 후 확인

1. ✓ Vercel 빌드 성공
2. ✓ `/trails` 페이지 접근 가능
3. ✓ 이미지 정상 렌더링
4. ✓ Notion 수정 후 1시간 내 반영

## 📋 MVP 체크리스트

### 개발 완료 기준
- [ ] `npm run build` 에러 없이 성공
- [ ] `npm run lint` 경고 없음
- [ ] TypeScript 컴파일 에러 0개
- [ ] Notion 데이터 3개 이상 등록 후 목록 페이지 확인
- [ ] 코스 상세 페이지 정상 접근
- [ ] 존재하지 않는 ID 접근 시 404 페이지 표시
- [ ] 난이도 필터 동작 확인
- [ ] 모바일(375px) 레이아웃 깨짐 없음

### 배포 체크리스트
- [ ] Vercel 환경 변수 등록
- [ ] 배포 URL에서 코스 목록 조회 확인
- [ ] 이미지 정상 렌더링
- [ ] ISR 재검증 동작 확인 (Notion 수정 후 1시간 내 반영)

## 📚 문서

- **[docs/PRD.md](./docs/PRD.md)**: 상세 제품 요구사항 명세서 (기술 사양, 로드맵, 스키마 정의)
- **[Next.js 공식 문서](https://nextjs.org/docs)**
- **[Notion API 문서](https://developers.notion.com)**
- **[Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)**
- **[shadcn/ui](https://ui.shadcn.com)**

## 🎯 개발 로드맵

### Phase 1 - MVP (약 12~16시간)
1. 환경 설정 (Notion API 연동)
2. Notion 클라이언트 구현
3. 코스 목록 페이지
4. 코스 상세 페이지
5. 이미지 최적화 및 배포

### Phase 2 이후 (선택사항)
- 검색 기능
- 지도 연동
- 댓글 시스템
- 다크 모드
- Notion Webhook 자동 배포
- RSS 피드
- Cloudinary 이미지 호스팅

자세한 내용은 [docs/PRD.md](./docs/PRD.md) 참고.

## 📄 라이선스

MIT 라이선스

---

**Happy coding! 🎉**
