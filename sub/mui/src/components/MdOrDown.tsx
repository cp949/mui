'use client';

import { type Theme, useMediaQuery } from '@mui/material';
import { type ReactNode } from 'react';

/**
 * MdOrDown 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface MdOrDownProps {
  /**
   * lg 브레이크포인트 미만에서 보여줄 자식 요소들입니다.
   */
  children?: ReactNode | ReactNode[];
}

/**
 * lg 브레이크포인트(1200px) 미만에서만 자식 요소를 보여주는 반응형 컴포넌트입니다.
 * 모바일, 태블릿, 데스크톱의 중간 크기에서 보여줄 콘텐츠에 사용됩니다.
 *
 * @param props - MdOrDown 컴포넌트의 속성
 * @param props.children - lg 브레이크포인트 미만에서 보여줄 요소들
 * @returns 조건에 맞을 때 children, 그렇지 않으면 null
 *
 * @example
 * ```tsx
 * // 대형 데스크톱 전용을 제외한 모든 화면에서 보이는 콘텐츠
 * <MdOrDown>
 *   <CompactLayout />
 * </MdOrDown>
 *
 * // 1200px 미만에서만 보이는 점색 메뉴
 * <MdOrDown>
 *   <HamburgerMenu />
 * </MdOrDown>
 * ```
 */
export function MdOrDown(props: MdOrDownProps) {
  const { children } = props;
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  if (!matched || !children) return null;
  return <>{children}</>;
}
