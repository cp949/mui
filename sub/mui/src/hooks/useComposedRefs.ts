// copy from  https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/composeRefs.tsx

//
// 아래와 같이 하면 안된다. 매번 새로운 composed ref를 생성하게 된다.
// <div ref={composeRefs(ref1, ref2)}/>
//
// 이렇게 사용해야 한다.
// const ref = useComposedRefs(ref1,ref2)
//

import { useCallback } from 'react';

/** 가능한 ref 타입들을 나타내는 유니온 타입 */
type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * 주어진 ref에 값을 설정하는 유틸리티 함수입니다.
 * 콜백 ref와 RefObject 두 가지 타입을 모두 처리합니다.
 *
 * @template T - ref가 참조할 요소의 타입
 * @param ref - 값을 설정할 ref (콜백 함수 또는 RefObject)
 * @param value - ref에 설정할 값
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * 여러 ref를 하나로 결합하는 유틸리티 함수입니다.
 * 콜백 ref와 RefObject를 모두 받을 수 있습니다.
 *
 * @template T - ref가 참조할 요소의 타입
 * @param refs - 결합할 ref들의 배열
 * @returns 모든 ref에 값을 설정하는 함수
 */
function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => refs.forEach((ref) => setRef(ref, node));
}

/**
 * 여러 ref를 결합하여 하나의 ref로 만드는 React 훅입니다.
 * 한 요소에 여러 ref를 동시에 적용해야 할 때 사용합니다.
 *
 * 이 훅은 성능 최적화를 위해 메모이제이션을 적용하여
 * 불필요한 리렌더링을 방지합니다.
 *
 * @template T - ref가 참조할 요소의 타입
 * @param refs - 결합할 ref들의 가변 인자
 * @returns 모든 ref에 동시에 값을 설정하는 콜백 함수
 *
 * @example
 * ```tsx
 * const Component = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
 *   const localRef = useRef<HTMLDivElement>(null);
 *   const composedRef = useComposedRefs(localRef, forwardedRef);
 *
 *   useEffect(() => {
 *     // localRef.current로 요소에 접근 가능
 *     if (localRef.current) {
 *       localRef.current.focus();
 *     }
 *   }, []);
 *
 *   return <div ref={composedRef}>결합된 ref 사용</div>;
 * });
 * ```
 *
 * @example
 * ```tsx
 * // 여러 ref를 동시에 사용하는 경우
 * const Component = () => {
 *   const ref1 = useRef<HTMLDivElement>(null);
 *   const ref2 = useRef<HTMLDivElement>(null);
 *   const [ref3, setRef3] = useState<HTMLDivElement | null>(null);
 *
 *   const composedRef = useComposedRefs(ref1, ref2, setRef3);
 *
 *   return <div ref={composedRef}>모든 ref에 동시 적용</div>;
 * };
 * ```
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): (node: T | null) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
