import { useEffect, useRef } from 'react';

/**
 * HTML 요소에 이벤트 리스너를 안전하게 추가하고 관리하는 React 훅입니다.
 * 컴포넌트가 언마운트될 때 자동으로 이벤트 리스너를 제거하여 메모리 누수를 방지합니다.
 *
 * @template K - HTML 요소 이벤트 맵의 키 타입
 * @template T - 타겟 HTML 요소의 타입
 * @param type - 듣고자 하는 이벤트 타입 (click, mouseover, keydown 등)
 * @param listener - 이벤트가 발생했을 때 호출될 콜백 함수
 * @param options - addEventListener의 옵션 (capture, once, passive 등)
 * @returns 이벤트를 듣고자 하는 요소에 연결할 ref 객체
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const buttonRef = useEventListener(
 *     'click',
 *     (event) => {
 *       console.log('버튼 클릭!', event.target);
 *     }
 *   );
 *
 *   return (
 *     <button ref={buttonRef}>
 *       클릭 이벤트가 자동으로 바인딩됨
 *     </button>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 다양한 이벤트 옵션 사용
 * const Component = () => {
 *   const divRef = useEventListener(
 *     'wheel',
 *     (event) => {
 *       event.preventDefault();
 *       console.log('휠 이벤트 발생');
 *     },
 *     { passive: false, capture: true }
 *   );
 *
 *   return (
 *     <div ref={divRef} style={{ height: 200, overflow: 'auto' }}>
 *       스크롤 방지 영역
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 타입 안전성을 위해 구체적인 요소 타입 지정
 * const Component = () => {
 *   const inputRef = useEventListener<'focus', HTMLInputElement>(
 *     'focus',
 *     (event) => {
 *       console.log('입력 필드 포커스');
 *       event.target.select(); // HTMLInputElement의 select 메서드 사용 가능
 *     }
 *   );
 *
 *   return <input ref={inputRef} type="text" />;
 * };
 * ```
 */
export function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = any>(
  type: K,
  listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener(type, listener as any, options);
      return () => element.removeEventListener(type, listener as any, options);
    }
    return undefined;
  }, [type, listener, options]);

  return ref;
}
