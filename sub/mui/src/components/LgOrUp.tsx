'use client';

import { type Theme, useMediaQuery } from '@mui/material';
import { type ReactNode } from 'react';

/**
 * LgOrUp 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface LgOrUpProps {
  /**
   * lg 브레이크포인트 이상에서 보여줄 자식 요소들입니다.
   */
  children?: ReactNode | ReactNode[];
}

/**
 * lg 브레이크포인트(1200px) 이상에서만 자식 요소를 보여주는 반응형 컴포넌트입니다.
 * 주로 대형 데스크톱 화면에서만 보여줄 콘텐츠에 사용됩니다.
 *
 * @param props - LgOrUp 컴포넌트의 속성
 * @param props.children - lg 브레이크포인트 이상에서 보여줄 요소들
 * @returns 조건에 맞을 때 children, 그렇지 않으면 null
 *
 * @example
 * ```tsx
 * // 대형 데스크톱에서만 보이는 사이드바
 * <LgOrUp>
 *   <WideScreenSidebar />
 * </LgOrUp>
 *
 * // 1200px 이상에서만 보이는 전체 대시보드
 * <LgOrUp>
 *   <FullWidthDashboard />
 *   <AdditionalPanels />
 * </LgOrUp>
 * ```
 */
export function LgOrUp(props: LgOrUpProps) {
  const { children } = props;
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  if (!matched || !children) return null;
  return <>{children}</>;
}
