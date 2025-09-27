'use client';

import { useEffect, useRef } from 'react';
import { Closables } from '../util/closables.js';

/**
 * 콜백 함수의 타입입니다.
 * Closables 객체를 받아서 정리 함수를 반환하거나 void를 반환할 수 있습니다.
 */
type Callback =
  | ((closable: Closables) => VoidFunction | undefined)
  | ((closable: Closables) => void);

/**
 * 리소스 정리가 가능한 effect를 제공하는 React 훅입니다.
 * Closables 객체를 통해 여러 리소스를 체계적으로 관리하고 정리할 수 있습니다.
 *
 * 이 훅은 복잡한 비동기 작업이나 여러 구독을 관리할 때 유용하며,
 * 컴포넌트 언마운트 시 모든 리소스가 안전하게 정리되도록 보장합니다.
 *
 * @param callback - Closables 객체를 받아 실행되는 콜백 함수. 추가 정리 함수를 반환할 수 있음
 * @param deps - effect의 실행을 제어하는 의존성 배열
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   useClosableEffect((closables) => {
 *     // 여러 구독을 추가
 *     closables.add(observable1.subscribe(handler1));
 *     closables.add(observable2.subscribe(handler2));
 *
 *     // WebSocket 연결
 *     const ws = new WebSocket('ws://localhost');
 *     closables.add(() => ws.close());
 *
 *     // 추가 정리 로직
 *     return () => {
 *       console.log('추가 정리 작업');
 *     };
 *   }, []);
 *
 *   return <div>컴포넌트</div>;
 * };
 * ```
 */
export function useClosableEffect(callback: Callback, deps: unknown[]) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const closables = new Closables();
    const dispose = callbackRef.current(closables);
    return () => {
      if (typeof dispose === 'function') {
        dispose();
      }
      closables.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
