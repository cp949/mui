'use client';

import { type Theme, useMediaQuery } from '@mui/material';
import { type ReactNode } from 'react';

/**
 * SmOrUp 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface SmOrUpProps {
  /**
   * sm 브레이크포인트 이상에서 보여줄 자식 요소들입니다.
   */
  children?: ReactNode | ReactNode[];
}

/**
 * sm 브레이크포인트(600px) 이상에서만 자식 요소를 보여주는 반응형 컴포넌트입니다.
 * Material-UI의 useMediaQuery를 사용하여 화면 크기를 감지합니다.
 *
 * @param props - SmOrUp 컴포넌트의 속성
 * @param props.children - sm 브레이크포인트 이상에서 보여줄 요소들
 * @returns 조건에 맞을 때 children, 그렇지 않으면 null
 *
 * @example
 * ```tsx
 * // 태블릿/데스크톱에서만 보이는 내비게이션
 * <SmOrUp>
 *   <DesktopNavigation />
 * </SmOrUp>
 *
 * // 600px 이상에서만 보이는 사이드바
 * <SmOrUp>
 *   <Sidebar />
 *   <AdditionalContent />
 * </SmOrUp>
 * ```
 */
export function SmOrUp(props: SmOrUpProps) {
  const { children } = props;
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  if (!matched || !children) return null;
  return <>{children}</>;
}
