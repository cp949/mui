import { useEffect } from 'react';
import { useLatest } from './useLatest.js';

/**
 * 컴포넌트가 언마운트될 때 실행될 함수를 등록하는 React 훅입니다.
 * 정리 작업, 이벤트 리스너 제거, 타이머 취소 등에 사용합니다.
 *
 * useLatest를 사용하여 항상 최신 콜백 함수를 참조하도록 보장합니다.
 *
 * @param fn - 컴포넌트 언마운트 시 실행할 정리 함수
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const [timer, setTimer] = useState<number | null>(null);
 *
 *   useUnmount(() => {
 *     if (timer) {
 *       clearInterval(timer);
 *       console.log('타이머 정리 완료');
 *     }
 *   });
 *
 *   return <div>컴포넌트</div>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 이벤트 리스너 정리
 * const Component = () => {
 *   useUnmount(() => {
 *     window.removeEventListener('resize', handleResize);
 *     document.removeEventListener('click', handleClick);
 *   });
 *
 *   return <div>이벤트 리스너 컴포넌트</div>;
 * };
 * ```
 */
export const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn);
  useEffect(
    () => () => {
      fnRef.current();
    },
    [fnRef],
  );
};
