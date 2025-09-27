import { useMemo, useState } from 'react';
import type { BehaviorSubject } from './types.js';
import { useIsomorphicEffect } from './useIsomorphicEffect.js';

/** BehaviorSubject를 반환하는 함수 타입 */
type Fn<T> = () => T;

/**
 * BehaviorSubject를 React 컴포넌트에서 사용할 수 있게 해주는 훅입니다.
 * BehaviorSubject의 현재 값을 구독하여 값이 변경될 때마다 컴포넌트를 리렌더링합니다.
 *
 * 이 훅은 RxJS의 BehaviorSubject 패턴을 React의 상태 관리와 연결하여
 * Observable 패턴을 React 컴포넌트에서 쉽게 사용할 수 있도록 합니다.
 *
 * @template TItem - BehaviorSubject가 방출하는 값의 타입
 * @param subject - 구독할 BehaviorSubject 또는 BehaviorSubject를 반환하는 함수
 * @returns BehaviorSubject의 현재 값
 *
 * @example
 * ```tsx
 * import { BehaviorSubject } from 'rxjs';
 *
 * const counter$ = new BehaviorSubject(0);
 *
 * const Component = () => {
 *   const count = useBehaviorSubject(counter$);
 *
 *   const increment = () => {
 *     counter$.next(count + 1);
 *   };
 *
 *   return (
 *     <div>
 *       <p>카운트: {count}</p>
 *       <button onClick={increment}>증가</button>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 함수로 BehaviorSubject 전달
 * const Component = () => {
 *   const userData = useBehaviorSubject(() => userService.currentUser$);
 *
 *   return <div>사용자: {userData.name}</div>;
 * };
 * ```
 */
export function useBehaviorSubject<TItem>(
  subject: BehaviorSubject<TItem> | Fn<BehaviorSubject<TItem>>,
): TItem {
  const subject$ = useMemo(() => (typeof subject === 'function' ? subject() : subject), [subject]);
  const [value, setValue] = useState<TItem>(subject$.value);

  useIsomorphicEffect(() => {
    const s = subject$.subscribe(setValue);
    return () => {
      s.unsubscribe();
    };
  }, [subject$]);

  return value;
}
