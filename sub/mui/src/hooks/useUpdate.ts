import { useCallback, useState } from 'react';

/**
 * 컴포넌트를 강제로 리렌더링하는 함수를 반환하는 React 훅입니다.
 * 내부적으로 빈 객체로 state를 업데이트하여 리렌더링을 트리거합니다.
 *
 * 이 훅은 다음과 같은 상황에서 유용합니다:
 * - 외부 데이터의 변화를 React가 감지하지 못할 때
 * - 비제어 컴포넌트에서 업데이트가 필요할 때
 * - 외부 라이브러리와의 동기화
 *
 * @returns 컴포넌트를 리렌더링하는 콜백 함수
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const forceUpdate = useUpdate();
 *
 *   const handleClick = () => {
 *     // 외부 데이터 수정 후 강제 리렌더링
 *     externalData.value = Math.random();
 *     forceUpdate();
 *   };
 *
 *   return (
 *     <div>
 *       <p>외부 데이터: {externalData.value}</p>
 *       <button onClick={handleClick}>업데이트</button>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 제3자 라이브러리와의 동기화
 * const Component = () => {
 *   const forceUpdate = useUpdate();
 *
 *   useEffect(() => {
 *     const unsubscribe = externalStore.subscribe(() => {
 *       forceUpdate(); // 외부 스토어 변화 시 리렌더링
 *     });
 *
 *     return unsubscribe;
 *   }, [forceUpdate]);
 *
 *   return <div>{externalStore.getValue()}</div>;
 * };
 * ```
 *
 * @warning
 * 이 훅은 일반적인 React 패턴에서 벗어나는 예외적인 경우에만 사용해야 합니다.
 * 대부분의 경우 useState, useReducer, 또는 외부 상태 관리 라이브러리를 사용하는 것이 좋습니다.
 */
export const useUpdate = () => {
  const [, setState] = useState({});

  return useCallback(() => setState({}), []);
};
