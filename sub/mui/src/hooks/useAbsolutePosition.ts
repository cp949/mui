import { useCallback, useEffect, useMemo, useState } from 'react';
import { BehaviorSubject, skip, throttleTime } from 'rxjs';
import { useIsomorphicEffect } from './useIsomorphicEffect.js';
import { useWindowSize } from './useWindowSize.js';

/**
 * DOM 요소의 절대 위치(문서 기준)를 추적하는 React 훅입니다.
 * ResizeObserver와 윈도우 크기 변화를 감지하여 요소의 위치를 실시간으로 업데이트합니다.
 *
 * 이 훅은 스크롤 위치와 관계없이 문서 전체에서의 절대 좌표를 반환하며,
 * RxJS의 BehaviorSubject와 throttleTime을 사용하여 성능을 최적화합니다.
 *
 * @template E - 추적할 DOM 요소의 타입 (기본값: Element)
 * @param deps - 위치 재계산을 트리거할 의존성 배열
 * @param options - 훅의 동작을 제어하는 옵션 객체
 * @param options.intervalMs - 위치 업데이트 간격 (밀리초, 기본값: 0)
 * @returns [ref 함수, 위치 객체] 튜플
 * - ref 함수: 추적할 요소에 연결할 ref 함수
 * - 위치 객체: { x: number, y: number } 형태의 절대 좌표
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const [elementRef, position] = useAbsolutePosition([], { intervalMs: 100 });
 *
 *   return (
 *     <div>
 *       <div ref={elementRef}>추적 대상 요소</div>
 *       <p>절대 위치: x={position.x}, y={position.y}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export function useAbsolutePosition<E extends Element = Element>(
  deps: any[],
  options?: {
    /** 위치 업데이트 간격 (밀리초) @default 0 */
    intervalMs?: number;
  },
): [(element: E | null) => void, { x: number; y: number }] {
  const [element, ref] = useState<E | null>(null);
  const { intervalMs = 0 } = options || {};
  const [refreshToken, setRefreshToken] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const pendingPosition$ = useMemo(
    () => new BehaviorSubject<{ x: number; y: number } | null>(null),
    [],
  );
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const observer = useMemo(
    () =>
      typeof window === 'undefined'
        ? null
        : new window.ResizeObserver((entries) => {
            if (entries[0]) {
              // const { x, y, width, height, top, left, bottom, right } = entries[0].contentRect;
              // setRect({ x, y, width, height, top, left, bottom, right });
              setRefreshToken(Date.now());
            }
          }),
    [],
  );

  useIsomorphicEffect(() => {
    if (!observer) return;
    if (!element) return;
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element, observer]);

  const updatePosition = useCallback((newPos: { x: number; y: number }) => {
    setPosition((prev) => {
      if (fuzzyEquals(prev.x, newPos.x) && fuzzyEquals(prev.y, newPos.y)) {
        return prev;
      }
      return newPos;
    });
  }, []);

  useIsomorphicEffect(() => {
    if (!element) {
      updatePosition({ x: 0, y: 0 });
      return;
    }
    pendingPosition$.next(getAbsolutePosition(element));
  }, [pendingPosition$, refreshToken, element, windowWidth, windowHeight, updatePosition, ...deps]);

  useEffect(() => {
    const s1 = pendingPosition$
      .pipe(skip(1), throttleTime(intervalMs))
      .subscribe((pendingPosition) => {
        if (pendingPosition) {
          updatePosition(pendingPosition);
        }
      });
    return () => {
      s1.unsubscribe();
    };
  }, [pendingPosition$, intervalMs, updatePosition]);

  return [ref, position];
}

/**
 * 두 숫자가 거의 같은지 비교하는 유틸리티 함수입니다.
 * 부동소수점 연산의 정밀도 문제를 해결하기 위해 사용됩니다.
 *
 * @param a - 비교할 첫 번째 숫자
 * @param b - 비교할 두 번째 숫자
 * @param epsilon - 허용 오차 (기본값: 0.0001)
 * @returns 두 숫자의 차이가 epsilon보다 작으면 true
 */
function fuzzyEquals(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * DOM 요소의 문서 기준 절대 위치를 계산하는 함수입니다.
 * getBoundingClientRect()와 스크롤 위치를 조합하여 절대 좌표를 구합니다.
 *
 * @param element - 위치를 계산할 DOM 요소
 * @returns 문서 기준 절대 좌표 { x: number, y: number }
 */
function getAbsolutePosition(element: Element): { x: number; y: number } {
  if (typeof window === 'undefined') {
    // ssr
    return { x: 0, y: 0 };
  }
  // 요소의 bounding rectangle을 가져옵니다.
  const rect = element.getBoundingClientRect();

  // 페이지의 스크롤 위치를 가져옵니다.
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // 절대 위치를 계산합니다.
  const top = rect.top + scrollTop;
  const left = rect.left + scrollLeft;

  return { x: left, y: top };
}
