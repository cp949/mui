# @cp949/mui

CP949 MUI React component library built with Turbo monorepo.

## 개요

`@cp949/mui`는 Material-UI를 기반으로 한 React 컴포넌트 라이브러리입니다. React 18과 19를 지원하며, Turbo monorepo로 구성되어 효율적인 개발과 빌드를 제공합니다.

## 주요 기능

- **컴포넌트**: 레이아웃, 버튼, 반응형 컴포넌트 등 50+ 컴포넌트
- **훅**: 상태 관리, 이벤트 처리, 스토리지, 옵저버블 등 50+ 커스텀 훅
- **헬퍼**: MUI CSS 변수, 미디어 쿼리 유틸리티
- **유틸리티**: 이벤트 처리, refs 합성, 타입 유틸리티

## 설치

```bash
npm install @cp949/mui
# or
pnpm add @cp949/mui
# or
yarn add @cp949/mui
```

## 사용법

```tsx
import { FlexRow, Center, useLocalStorage } from '@cp949/mui';

function MyComponent() {
  const [value, setValue] = useLocalStorage('key', 'default');

  return (
    <FlexRow spacing={2}>
      <Center>
        Content here
      </Center>
    </FlexRow>
  );
}
```

## 호환성

- **React**: ^18 || ^19
- **Material-UI**: ^7
- **TypeScript**: ^5.0

## 개발 환경

이 프로젝트는 Turbo monorepo로 구성되어 있습니다.

### 사전 요구사항

- Node.js 18+

### 개발 시작

```bash
# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm dev

# 빌드
pnpm build

# 린팅
pnpm lint

# 포맷팅
pnpm format

# 타입 체크
pnpm typecheck
```

### 프로젝트 구조

```
├── packages/
│   ├── core/                    # 메인 라이브러리 (@cp949/mui)
│   └── shared-config/           # 공유 설정
│       ├── eslint-config/       # ESLint 설정
│       ├── prettier-config/     # Prettier 설정
│       └── tsconfig/           # TypeScript 설정
├── apps/                        # 향후 문서/데모 사이트
├── turbo.json                   # Turbo 설정
├── package.json                 # 루트 워크스페이스
└── pnpm-workspace.yaml         # 워크스페이스 설정
```

## 내보내기

### 메인
```tsx
import { Component } from '@cp949/mui';
```

### 훅
```tsx
import { useLocalStorage } from '@cp949/mui/hooks';
```

### 헬퍼
```tsx
import { muiCssVars } from '@cp949/mui/helper';
```

## 라이센스

MIT

## 기여

이 프로젝트는 내부 라이브러리로 사용되고 있습니다. 버그 리포트나 기능 제안은 프로젝트 담당자에게 문의해주세요.

