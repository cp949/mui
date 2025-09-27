'use client';

import type { FC } from 'react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

/**
 * DebouncedRender 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface DebouncedRenderProps {
  /**
   * 렌더링할 React 노드입니다.
   */
  children: ReactNode;
  /**
   * 첫 호출 시 즉시 렌더링할지 여부를 결정합니다.
   * @default false
   */
  leading?: boolean;
  /**
   * 마지막 호출 후 maxWait 시간이 지나면 렌더링할지 여부를 결정합니다.
   * @default true
   */
  trailing?: boolean;
  /**
   * 렌더링 대기 시간(밀리초)입니다.
   * @default 100
   */
  maxWait?: number;
}

/**
 * 디바운스 기능이 있는 렌더링 컴포넌트입니다.
 * debounce 기능을 이용해 자식 컴포넌트를 렌더링하는 빈도를 제어합니다.
 *
 * 빠르게 변화하는 상태나 props에 대응하여 불필요한 리렌더링을 방지하고
 * 성능을 최적화하는 데 유용합니다.
 *
 * @param props - DebouncedRender 컴포넌트의 속성
 * @param props.children - 렌더링할 React 노드
 * @param props.leading - 첫 호출 시 즉시 렌더링할지 여부 (기본값: false)
 * @param props.trailing - 마지막 호출 후 maxWait 시간이 지나면 렌더링할지 여부 (기본값: true)
 * @param props.maxWait - 렌더링 대기 시간(밀리초, 기본값: 100)
 * @returns 디바운스된 렌더링 결과
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <DebouncedRender>
 *   <p>{value}</p>
 * </DebouncedRender>
 *
 * // 커스텀 설정
 * <DebouncedRender leading trailing maxWait={200}>
 *   <ExpensiveComponent data={fastChangingData} />
 * </DebouncedRender>
 *
 * // leading만 활성화 (첫 렌더링만)
 * <DebouncedRender leading trailing={false}>
 *   <InstantFeedback />
 * </DebouncedRender>
 * ```
 *
 * @todo unmount시 타이머 취소 기능 추가
 */
export const DebouncedRender: FC<DebouncedRenderProps> = ({
  children,
  leading = false,
  trailing = true,
  maxWait = 100,
}) => {
  const [content, setContent] = useState<ReactNode>(leading ? children : undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);

  const closeTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const now = Date.now();
    const invoke = () => {
      setContent(children);
      lastCallTimeRef.current = now;
    };

    if (leading && lastCallTimeRef.current === null) {
      invoke();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (trailing) {
        invoke();
      }
      timeoutRef.current = null;
    }, maxWait);

    if (
      leading &&
      lastCallTimeRef.current !== null &&
      now - (lastCallTimeRef.current || 0) >= maxWait
    ) {
      invoke();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [children, leading, trailing, maxWait, closeTimer]);

  return <>{content}</>;
};
