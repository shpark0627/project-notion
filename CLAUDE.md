# 프로젝트 가이드

## 프로젝트 개요
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript (strict mode)
- **UI 프레임워크**: React 19
- **스타일링**: Tailwind CSS v4 (설정 파일 없이 CSS에서 import 방식 사용)
- **컴포넌트 라이브러리**: shadcn/ui (New York 스타일, neutral 색상, CSS Variables)
- **패키지 매니저**: npm (package-lock.json 있음)

## 개발 환경 설정

### 필수 커맨드
```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# Linting 검사
npm run lint
```

### shadcn/ui 컴포넌트 추가
```bash
npx shadcn@latest add [component-name]
```

## 프로젝트 구조

```
project1/
├── app/                          # Next.js App Router 페이지 & 레이아웃
│   ├── layout.tsx               # 루트 레이아웃 (Geist 폰트 설정)
│   ├── page.tsx                 # 홈 페이지
│   ├── globals.css              # 전역 스타일 (Tailwind v4 설정)
│   └── favicon.ico
├── lib/
│   └── utils.ts                 # cn() 유틸리티 함수 (clsx + tailwind-merge)
├── public/                       # 정적 자산
├── components/                   # (생성 예정) 재사용 가능한 React 컴포넌트
│   └── ui/                      # shadcn/ui 컴포넌트
├── components.json              # shadcn/ui 설정 파일
├── tsconfig.json                # TypeScript 설정 (경로 alias: @/*)
├── tailwind.config.ts           # (없음) Tailwind CSS v4는 CSS에서 직접 import
├── next.config.ts               # Next.js 설정 (현재 비어있음)
├── postcss.config.mjs           # PostCSS 설정 (@tailwindcss/postcss 사용)
├── eslint.config.mjs            # ESLint 설정
├── package.json                 # 프로젝트 의존성
└── README.md                     # 프로젝트 설명
```

## 아키텍처 & 컨벤션

### Tailwind CSS v4 특징
- `tailwind.config.ts` 파일이 없음 (최신 방식)
- 스타일은 `app/globals.css`에서 import:
  ```css
  @import "tailwindcss";
  @import "tw-animate-css";
  @import "shadcn/tailwind.css";
  @theme inline { /* CSS 변수 정의 */ }
  ```
- CSS 변수를 이용한 다이나믹 테마 지원

### shadcn/ui 설정 (components.json)
- **스타일**: New York
- **아이콘**: lucide-react
- **색상**: neutral (회색 기반 중립 색상)
- **CSS Variables**: 활성화 (다크 모드 지원)
- **별칭**:
  - `@/components` → components 폴더
  - `@/lib` → lib 폴더
  - `@/hooks` → hooks 폴더
  - `@/ui` → components/ui 폴더

### TypeScript 경로 별칭 (tsconfig.json)
```json
"paths": {
  "@/*": ["./*"]
}
```
모든 import가 프로젝트 루트부터 시작됨.

### 유틸리티
- **cn()** (`lib/utils.ts`): clsx + tailwind-merge 조합
  - Tailwind 클래스명 충돌 자동 해결
  - 조건부 스타일 처리에 사용

## 설치되지 않은 패키지

다음 패키지들은 `global CLAUDE.md`에 명시되었으나 아직 설치되지 않았습니다:
- **zustand** - 상태 관리
- **react-hook-form** - 폼 상태 관리
- **zod** - 데이터 검증

필요시 설치:
```bash
npm install zustand react-hook-form zod
```

## 주요 파일

| 파일 | 설명 |
|------|------|
| `app/layout.tsx` | 루트 레이아웃, Geist 폰트 로드 |
| `app/globals.css` | Tailwind v4 import, CSS 변수, 색상 정의 |
| `components.json` | shadcn/ui 컴포넌트 생성 설정 |
| `lib/utils.ts` | cn() 유틸리티 함수 |
| `tsconfig.json` | TypeScript strict mode, 경로 별칭 설정 |
| `next.config.ts` | Next.js 설정 (현재 기본값) |

## 개발 팁

1. **새 컴포넌트 추가**: `components/` 디렉토리 생성 후 React 컴포넌트 작성
2. **shadcn/ui 컴포넌트 설치**: `npx shadcn@latest add [name]` (자동으로 `components/ui/`에 생성)
3. **스타일링**: Tailwind 클래스 직접 사용 또는 `cn()` 함수로 조건부 스타일 적용
4. **다크 모드**: `globals.css`의 `.dark` 클래스 활용
5. **타입 안정성**: TypeScript strict mode 사용 중 (any 금지)
