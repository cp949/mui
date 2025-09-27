import { type DependencyList } from 'react';

/**
 * Observable 패턴을 구현하는 인터페이스입니다.
 * 구독자에게 값의 변화를 알리는 기능을 제공합니다.
 *
 * @template T - Observable이 방출하는 값의 타입
 */
export interface Observable<T> {
  /**
   * 값의 변화를 구독하는 함수입니다.
   *
   * @param listener - 새로운 값이 방출될 때 호출되는 콜백 함수
   * @returns 구독을 취소할 수 있는 객체
   */
  subscribe: (listener: (value: T) => void) => {
    /**
     * 구독을 취소하는 함수입니다.
     */
    unsubscribe: () => void;
  };
}

/**
 * BehaviorSubject는 현재 값을 가지고 있는 Observable입니다.
 * 구독 시점에 즉시 현재 값을 방출하며, 이후 값이 변경될 때마다 새로운 값을 방출합니다.
 *
 * @template T - BehaviorSubject가 저장하고 방출하는 값의 타입
 */
export interface BehaviorSubject<T> extends Observable<T> {
  /**
   * BehaviorSubject의 현재 값입니다.
   * 구독자는 구독과 동시에 이 값을 받게 됩니다.
   */
  value: T;
}

/**
 * React 의존성 배열을 비교하는 함수의 타입입니다.
 * 두 의존성 배열이 동일한지 판단하여 불필요한 재실행을 방지하는 데 사용됩니다.
 *
 * @template Deps - 비교할 의존성 배열의 타입
 * @param a - 첫 번째 의존성 배열
 * @param b - 두 번째 의존성 배열
 * @returns 두 의존성 배열이 동일하면 true, 다르면 false
 */
export type DependenciesComparator<Deps extends DependencyList = DependencyList> = (
  a: Deps,
  b: Deps,
) => boolean;
