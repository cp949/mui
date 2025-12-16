import { useState } from 'react';

/**
 * 렉더링 전체에 걸쳐 동일한 값을 유지하는 React 훅입니다.
 * 첫 번째 렉더링에서만 초기화 함수를 실행하고, 이후에는 결과를 재사용합니다.
 *
 * 이 훅은 비용이 많이 드는 계산이나 인스턴스 생성이 여러 번 수행되는 것을 방지하는 데 유용합니다.
 * useMemo와 비슷하지만 의존성 배열이 없어 항상 동일한 값을 보장합니다.
 *
 * @template T - 상수로 사용할 값의 타입
 * @param fn - 첫 번째 렉더링에서 실행될 초기화 함수
 * @returns 첫 번째 렉더링에서 생성된 상수 값
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   // 비용이 많이 드는 초기화 작업
 *   const expensiveValue = useConstant(() => {
 *     console.log('이 로그는 한 번만 출력됨');
 *     return new SomeExpensiveClass();
 *   });
 *
 *   return <div>{expensiveValue.data}</div>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Map 인스턴스를 상수로 사용
 * const Component = () => {
 *   const cache = useConstant(() => new Map<string, any>());
 *
 *   const getValue = (key: string) => cache.get(key);
 *   const setValue = (key: string, value: any) => cache.set(key, value);
 *
 *   return <div>커스텀 캐시 컴포넌트</div>;
 * };
 * ```
 */
export function useConstant<T>(fn: () => T): T {
  // Store once per mount, and avoid ref access during render to satisfy react-hooks/refs.
  // Note: In React StrictMode (dev), initializers may run more than once due to double-invocation.
  const [value] = useState(fn);
  return value;
}
