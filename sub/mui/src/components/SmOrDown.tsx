'use client';

import { type Theme, useMediaQuery } from '@mui/material';
import { type ReactNode } from 'react';

/**
 * SmOrDown 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface SmOrDownProps {
  /**
   * md 브레이크포인트 미만에서 보여줄 자식 요소들입니다.
   */
  children?: ReactNode | ReactNode[];
}

/**
 * md 브레이크포인트(900px) 미만에서만 자식 요소를 보여주는 반응형 컴포넌트입니다.
 * 주로 모바일과 태블릿 화면에서 보여줄 콘텐츠에 사용됩니다.
 *
 * @param props - SmOrDown 컴포넌트의 속성
 * @param props.children - md 브레이크포인트 미만에서 보여줄 요소들
 * @returns 조건에 맞을 때 children, 그렇지 않으면 null
 *
 * @example
 * ```tsx
 * // 모바일/태블릿에서만 보이는 함버거 메뉴
 * <SmOrDown>
 *   <MobileMenu />
 * </SmOrDown>
 *
 * // 900px 미만에서만 보이는 암축된 UI
 * <SmOrDown>
 *   <CompactView />
 * </SmOrDown>
 * ```
 */
export function SmOrDown(props: SmOrDownProps) {
  const { children } = props;
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  if (!matched || !children) return null;
  return <>{children}</>;
}
