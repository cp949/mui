import { type DependencyList } from 'react';
import { deepEq } from '../misc/deepEq.js';
import { useCustomCompareMemo } from './useCustomCompareMemo.js';

/**
 * 깊은 비교를 사용하여 의존성 변화를 검사하는 useMemo 훅입니다.
 * React의 기본 useMemo는 참조 비교(얼은 비교)를 사용하지만,
 * 이 훅은 객체와 배열의 내용을 재귀적으로 비교하여 실제 값의 변화를 감지합니다.
 *
 * 이는 다음과 같은 상황에서 유용합니다:
 * - 중첩된 객체나 배열을 의존성으로 사용할 때
 * - API 응답과 같은 복잡한 데이터 구조를 다룰 때
 * - 객체의 참조는 변경되었지만 내용은 동일한 경우
 *
 * @template T - 메모이제이션될 값의 타입
 * @template Deps - 의존성 배열의 타입
 * @param factory - 메모이제이션될 값을 계산하는 팩토리 함수
 * @param deps - factory 내부에서 참조되는 모든 의존성의 목록
 * @returns 처음에는 factory 호출 결과를 반환하고,
 *          이후 렉더링에서는 의존성이 변경되지 않았으면 동일한 값을,
 *          변경되었으면 factory를 다시 호출한 결과를 반환
 *
 * @example
 * ```tsx
 * // 객체의 내용이 변경된 경우만 재계산
 * const Component = ({ user }: { user: User }) => {
 *   const displayName = useDeepCompareMemo(
 *     () => `${user.firstName} ${user.lastName}`,
 *     [user]
 *   );
 *
 *   return <h1>{displayName}</h1>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 배열의 내용이 변경된 경우만 재계산
 * const Component = ({ items }: { items: Item[] }) => {
 *   const total = useDeepCompareMemo(
 *     () => items.reduce((sum, item) => sum + item.price, 0),
 *     [items]
 *   );
 *
 *   return <div>총액: {total}</div>;
 * };
 * ```
 *
 * @warning
 * 깊은 비교는 성능 비용이 들 수 있으므로, 의존성이 매우 크거나 복잡한 경우에만 사용하세요.
 * 기본 값(primitive values)만을 의존성으로 사용하는 경우에는 기본 useMemo를 사용하세요.
 */
export function useDeepCompareMemo<T, Deps extends DependencyList>(factory: () => T, deps: Deps) {
  return useCustomCompareMemo(factory, deps, deepEq);
}
