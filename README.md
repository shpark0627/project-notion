# Modern Web Starter Kit

현대적인 웹 개발의 모범 사례를 담은 **완전한 스타터 킷**입니다. Next.js 16, React 19, TypeScript, Tailwind CSS v4를 포함한 최신 기술 스택으로 프로덕션 수준의 웹사이트를 빠르게 구축할 수 있습니다.

## ✨ 주요 특징

- **최신 기술 스택**: Next.js 16 (App Router) + React 19 + TypeScript (Strict Mode)
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화된 UI
- **Dark Mode 지원**: CSS 변수 기반의 자동 테마 전환
- **프로덕션 준비**: 성능 최적화, SEO, 접근성 (a11y) 고려
- **개발자 경험**: TypeScript strict mode, ESLint, 명확한 프로젝트 구조
- **UI 컴포넌트**: shadcn/ui 기반 재사용 가능한 컴포넌트

## 🚀 시작하기

### 요구 사항

- Node.js 18.0 이상
- npm (또는 yarn, pnpm)

### 1단계: 저장소 클론

```bash
git clone https://github.com/shpark0627/modern-web-starter-kit.git
cd modern-web-starter-kit
```

### 2단계: 의존성 설치

```bash
npm install
```

### 3단계: 개발 서버 시작

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📦 기술 스택

### 프론트엔드 프레임워크
- **Next.js 16**: React 기반 풀스택 프레임워크
- **React 19**: 최신 버전의 React 라이브러리
- **TypeScript**: 타입 안정성과 개발자 경험 향상

### 스타일링 & UI
- **Tailwind CSS v4**: Utility-first CSS 프레임워크
- **shadcn/ui**: 커스터마이징 가능한 UI 컴포넌트 라이브러리
- **next-themes**: 다크 모드 지원

### 개발 도구
- **ESLint**: 코드 품질 관리
- **lucide-react**: 아이콘 라이브러리
- **class-variance-authority**: 컴포넌트 변형 관리

## 📁 프로젝트 구조

```
modern-web-starter-kit/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈 페이지
│   └── globals.css              # 전역 스타일 & Tailwind 설정
├── components/                   # React 컴포넌트
│   ├── ui/                      # shadcn/ui 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트 (Header, Footer 등)
│   ├── sections/                # 페이지 섹션 컴포넌트
│   └── shared/                  # 공유 컴포넌트 (Card, Badge 등)
├── hooks/                        # 커스텀 React 훅
├── lib/                          # 유틸리티 함수
│   └── utils.ts                 # cn() 함수 (클래스명 병합)
├── public/                       # 정적 자산 (이미지, 폰트 등)
├── tsconfig.json                # TypeScript 설정
├── tailwind.config.ts           # Tailwind CSS 설정 (생략, CSS에서 직접 import)
├── next.config.ts               # Next.js 설정
└── package.json                 # 프로젝트 의존성
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

## 🎨 페이지 구조

랜딩 페이지는 다음과 같이 구성되어 있습니다:

1. **Hero Section** - 메인 제목, 설명, CTA 버튼
2. **Features Section** - 6개의 주요 기술 소개
3. **Quick Start Section** - 3단계 시작 가이드 (npm/pnpm/yarn 탭)
4. **Stack Detail Section** - 기술 스택 상세 분류 및 설명
5. **Footer Section** - 링크, 소셜 미디어, 추가 정보

## 🌙 Dark Mode

프로젝트에는 자동 다크 모드 지원이 내장되어 있습니다:

- **토글 버튼**: 사이트 헤더의 테마 버튼으로 전환 가능
- **시스템 기본값**: 사용자의 OS 설정 자동 감지
- **CSS 변수**: `app/globals.css`에서 커스터마이징 가능

```css
@theme inline {
  --color-background: #ffffff;
  --color-foreground: #000000;
  /* ... 다른 색상 변수 */
}

.dark {
  --color-background: #000000;
  --color-foreground: #ffffff;
  /* ... */
}
```

## 📱 반응형 디자인

모든 컴포넌트는 Tailwind CSS의 브레이크포인트를 사용하여 반응형으로 설계되었습니다:

- `sm`: 640px 이상
- `md`: 768px 이상
- `lg`: 1024px 이상
- `xl`: 1280px 이상

## 🔧 커스터마이징

### 새로운 shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add [component-name]

# 예시
npx shadcn@latest add dialog
npx shadcn@latest add form
```

### 색상 테마 변경

`app/globals.css`의 CSS 변수를 수정하여 전체 색상 테마를 변경할 수 있습니다:

```css
@theme inline {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* ... */
}
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

## 🚢 배포

### Vercel로 배포하기 (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshpark0627%2Fmodern-web-starter-kit)

위 버튼을 클릭하면 자동으로 배포할 수 있습니다.

### 수동 배포

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 로그인
vercel login

# 3. 배포
vercel
```

### 다른 호스팅 서비스

이 프로젝트는 Next.js 표준 설정을 따르므로 모든 주요 호스팅 서비스에 배포 가능합니다:

- **Netlify**
- **AWS Amplify**
- **GitHub Pages** (정적 내보내기 설정 필요)
- **Docker** (커스텀 컨테이너)

## 📚 리소스

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React 공식 문서](https://react.dev)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [shadcn/ui 공식 사이트](https://ui.shadcn.com)
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs)

## 🤝 기여

버그 리포트, 기능 제안, Pull Request를 환영합니다!

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 공개되어 있습니다.

---

**Happy coding! 🎉**
