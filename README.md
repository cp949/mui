# @cp949/mui

CP949 MUI React component library built with Turbo monorepo.

## 개요

`@cp949/mui`는 Material-UI를 기반으로 한 React 컴포넌트 라이브러리입니다. React 18과 19를 지원하며, Turbo monorepo로 구성되어 효율적인 개발과 빌드를 제공합니다.

## 주요 기능

- **컴포넌트**: 레이아웃, 버튼, 반응형 컴포넌트 등 52개 컴포넌트
- **훅**: 상태 관리, 이벤트 처리, 스토리지, 옵저버블 등 67개 커스텀 훅
- **헬퍼**: MUI CSS 변수, 미디어 쿼리 유틸리티
- **유틸리티**: 이벤트 처리, refs 합성, 타입 유틸리티
- **EventEmitter**: EventEmitter3 래퍼
- **Persistence**: 스토리지 상태 관리

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
- **TypeScript**: ^5.9
- **Node.js**: ^18
- **pnpm**: ^10

### ⚠️ React 18 + MUI v7 사용자 주의사항

React 18과 MUI v7을 함께 사용하는 경우, `react-is` 버전 불일치로 인한 런타임 에러가 발생할 수 있습니다.
이 경우 프로젝트의 `package.json`에 다음 설정을 추가해주세요:

```json
{
  "overrides": {
    "react-is": "^18.3.1"
  }
}
```

**React 19 사용자는 이 설정을 추가하지 마세요.** React 19에서는 이 설정이 오히려 문제를 일으킬 수 있습니다.

## 개발 환경

이 프로젝트는 Turbo monorepo로 구성되어 있습니다.

### 사전 요구사항

- Node.js 18+
- pnpm 10+

### 개발 시작

```bash
# 의존성 설치
pnpm install

# 개발 모드 실행 (모든 패키지)
pnpm dev

# 빌드 (모든 패키지)
pnpm build

# 린팅 (모든 패키지)
pnpm lint

# 포맷팅 (모든 패키지)
pnpm format

# 타입 체크 (모든 패키지)
pnpm typecheck

# E2E 테스트 (React 19 + React 18)
pnpm e2e

# E2E 테스트 (React 19만)
pnpm e2e:react19

# E2E 테스트 (React 18만)
pnpm e2e:react18

# 특정 패키지 작업
pnpm --filter @cp949/mui build
pnpm --filter @cp949/mui lint
pnpm --filter @cp949/mui format
```

### E2E 테스트(Playwright) 개요

이 레포의 E2E는 **동일한 테스트 소스(`apps/e2e-test`)를 React 19/18 환경에서 각각 실행**하여,
훅/컴포넌트 변경 시 런타임 회귀를 잡는 것을 목표로 합니다.

- **React 19 러너**: `apps/e2e-test` (기본 포트: 4173)
- **React 18 러너**: `apps/e2e-test-react18` (기본 포트: 4174)

> WSL 환경에서는 headless 실행이 기본이며, Playwright Chromium이 설치되어 있어야 합니다.

### 프로젝트 구조

```
├── sub/
│   ├── mui/                     # 메인 라이브러리 (@cp949/mui) - 153 TypeScript 파일
│   │   ├── src/
│   │   │   ├── components/      # 52개 React 컴포넌트
│   │   │   ├── hooks/          # 67개 커스텀 훅
│   │   │   ├── helper/         # MUI 헬퍼 유틸리티
│   │   │   ├── util/           # 공통 유틸리티
│   │   │   ├── eventemitter/   # EventEmitter3 래퍼
│   │   │   ├── persistence/    # 스토리지 상태 관리
│   │   │   └── misc/           # debounce, deep equality 유틸리티
│   │   └── tsup.config.ts      # 빌드 설정
│   ├── eslint-config/          # 공유 ESLint 설정 (@repo/eslint-config)
│   └── typescript-config/      # 공유 TypeScript 설정 (@repo/typescript-config)
├── apps/
│   ├── e2e-test/                # E2E 테스트(React 19) - Vite + Playwright
│   └── e2e-test-react18/        # E2E 러너(React 18) - 동일 소스 기반 실행
├── turbo.json                  # Turbo 설정
├── package.json                # 루트 워크스페이스
└── pnpm-workspace.yaml        # 워크스페이스 설정
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

