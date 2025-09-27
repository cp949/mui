import { useMemo, useRef, type DependencyList } from 'react';
import { type DependenciesComparator } from './types.js';

/**
 * 사용자 정의 비교 함수를 사용하여 의존성 변화를 검사하는 useMemo 훅입니다.
 * React의 기본 useMemo는 얼은 비교를 사용하지만, 이 훅은 사용자가 제공한 비교 함수를 사용합니다.
 *
 * 이를 통해 깊은 비교, 어셈 데이터 비교, 또는 특정 필드만 비교하는 등의
 * 복잡한 비교 로직을 구현할 수 있습니다.
 *
 * @template T - 메모이제이션될 값의 타입
 * @template Deps - 의존성 배열의 타입
 * @param factory - 메모이제이션될 값을 생성하는 팩토리 함수
 * @param deps - 의존성 배열
 * @param comparator - 의존성 변화를 검사하는 비교 함수
 * @returns 메모이제이션된 값
 *
 * @example
 * ```tsx
 * import { useCustomCompareMemo } from './useCustomCompareMemo';
 * import { deepEqual } from 'lodash';
 *
 * const Component = ({ user }: { user: User }) => {
 *   // 깊은 비교를 사용하여 객체의 내용이 변경된 경우만 재계산
 *   const expensiveValue = useCustomCompareMemo(
 *     () => calculateExpensiveValue(user),
 *     [user],
 *     deepEqual
 *   );
 *
 *   return <div>{expensiveValue}</div>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 특정 필드만 비교하는 커스텀 비교 함수
 * const compareByName = (prev: [User], next: [User]) =>
 *   prev[0].name === next[0].name;
 *
 * const Component = ({ user }: { user: User }) => {
 *   const greeting = useCustomCompareMemo(
 *     () => `Hello, ${user.name}!`,
 *     [user],
 *     compareByName
 *   );
 *
 *   return <h1>{greeting}</h1>;
 * };
 * ```
 */
export const useCustomCompareMemo = <T, Deps extends DependencyList>(
  factory: () => T,
  deps: Deps,
  comparator: DependenciesComparator<Deps>,
): T => {
  const dependencies = useRef<Deps | undefined>(undefined);

  if (dependencies.current === undefined || !comparator(dependencies.current, deps)) {
    dependencies.current = deps;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo<T>(factory, dependencies.current);
};
