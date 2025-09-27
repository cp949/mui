import { useEffect } from 'react';
import { isBrowser } from '../util/misc-utils.js';
import { useRafState } from './useRafState.js';

/**
 * useWindowSize 훅에 전달할 수 있는 옵션의 타입을 정의합니다.
 */
interface Options {
  /** 윈도우의 초기 너비 (default: Infinity) */
  initialWidth?: number;
  /** 윈도우의 초기 높이 (default: Infinity) */
  initialHeight?: number;
  /** 윈도우 크기 변경 시 호출될 콜백 함수 (선택사항) */
  onChange?: (width: number, height: number) => void;
}

/**
 * 브라우저 윈도우의 현재 크기를 추적하고 변경사항을 감지하는 React 훅입니다.
 * resize 이벤트를 자동으로 처리하여 윈도우 크기가 변경될 때마다 상태를 업데이트합니다.
 *
 * 이 훅은 반응형 디자인, 모달 위치 조정, 레이아웃 업데이트 등에 유용합니다.
 * useRafState를 사용하여 성능을 최적화하고, SSR 환경에서도 안전하게 작동합니다.
 *
 * @param options - 훅의 동작을 제어하는 옵션 객체
 * @param options.initialWidth - 윈도우의 초기 너비 (default: Infinity)
 * @param options.initialHeight - 윈도우의 초기 높이 (default: Infinity)
 * @param options.onChange - 윈도우 크기 변경 시 호출될 콜백 함수
 * @returns 현재 윈도우의 width와 height를 포함하는 객체
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const { width, height } = useWindowSize();
 *
 *   return (
 *     <div>
 *       <p>윈도우 크기: {width} x {height}</p>
 *       {width < 768 ? (
 *         <div>모바일 레이아웃</div>
 *       ) : (
 *         <div>데스크톱 레이아웃</div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 윈도우 크기 변경 시 콜백 사용
 * const Component = () => {
 *   const { width, height } = useWindowSize({
 *     onChange: (w, h) => {
 *       console.log(`윈도우 크기 변경: ${w}x${h}`);
 *       // 기타 레이아웃 업데이트 로직
 *     }
 *   });
 *
 *   return <div>반응형 컴포넌트</div>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // SSR 환경에서 초기값 설정
 * const Component = () => {
 *   const { width, height } = useWindowSize({
 *     initialWidth: 1200,
 *     initialHeight: 800
 *   });
 *
 *   return (
 *     <div style={{ width: '100%', height: '100vh' }}>
 *       초기 크기: {width} x {height}
 *     </div>
 *   );
 * };
 * ```
 */
export const useWindowSize = ({
  initialWidth = Infinity,
  initialHeight = Infinity,
  onChange,
}: Options = {}) => {
  // Use the useRafState hook to maintain the current window size (width and height)
  const [state, setState] = useRafState<{ width: number; height: number }>({
    width: isBrowser ? window.innerWidth : initialWidth,
    height: isBrowser ? window.innerHeight : initialHeight,
  });

  useEffect((): (() => void) | void => {
    // Only run the effect on the browser (to avoid issues with SSR)
    if (isBrowser) {
      const handler = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update the state with the new window size
        setState({
          width,
          height,
        });

        // If an onChange callback is provided, call it with the new dimensions
        if (onChange) onChange(width, height);
      };

      // Add event listener for the resize event
      window.addEventListener('resize', handler);

      // Cleanup function to remove the event listener when the component is unmounted (it's for performance optimization)
      return () => {
        window.removeEventListener('resize', handler);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return the current window size (width and height)
  return state;
};
