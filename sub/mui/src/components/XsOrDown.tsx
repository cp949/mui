'use client';

import { type Theme, useMediaQuery } from '@mui/material';
import { type ReactNode } from 'react';

/**
 * XsOrDown 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface XsOrDownProps {
  /**
   * sm 브레이크포인트 미만에서 보여줄 자식 요소들입니다.
   */
  children?: ReactNode | ReactNode[];
}

/**
 * sm 브레이크포인트(600px) 미만에서만 자식 요소를 보여주는 반응형 컴포넌트입니다.
 * 주로 모바일 화면에서만 보여줄 콘텐츠에 사용됩니다.
 *
 * @param props - XsOrDown 컴포넌트의 속성
 * @param props.children - sm 브레이크포인트 미만에서 보여줄 요소들
 * @returns 조건에 맞을 때 children, 그렇지 않으면 null
 *
 * @example
 * ```tsx
 * // 모바일에서만 보이는 함버거 메뉴
 * <XsOrDown>
 *   <MobileHamburgerMenu />
 * </XsOrDown>
 *
 * // 600px 미만에서만 보이는 간단한 UI
 * <XsOrDown>
 *   <SimplifiedMobileView />
 * </XsOrDown>
 * ```
 */
export function XsOrDown(props: XsOrDownProps) {
  const { children } = props;
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  if (!matched || !children) return null;
  return <>{children}</>;
}
