import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

/**
 * 컯포넌트가 첫 번째 마운트될 때는 실행되지 않고, 업데이트될 때만 실행되는 effect 훅입니다.
 * React의 기본 useEffect는 첫 번째 마운트 시에도 실행되지만,
 * 이 훅은 의존성이 변경된 경우에만 실행됩니다.
 *
 * 다음과 같은 상황에서 유용합니다:
 * - 상태 변화에 따른 API 호출
 * - 업데이트 시점에만 수행할 작업
 * - 사용자 입력에 따른 비동기 작업
 *
 * @param fn - 업데이트 시 실행할 effect 콜백 함수
 * @param dependencies - effect의 실행을 제어하는 의존성 배열 (선택사항)
 *
 * @example
 * ```tsx
 * const Component = ({ userId }: { userId: string }) => {
 *   const [userData, setUserData] = useState(null);
 *
 *   // 첫 번째 마운트에는 실행되지 않고, userId가 변경될 때만 실행
 *   useDidUpdate(() => {
 *     fetchUserData(userId).then(setUserData);
 *   }, [userId]);
 *
 *   return <div>{userData?.name}</div>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 의존성 없이 사용 (모든 리렌더링에서 첫 번째 제외하고 실행)
 * const Component = () => {
 *   const [count, setCount] = useState(0);
 *
 *   useDidUpdate(() => {
 *     console.log('컴포넌트가 업데이트되었습니다.');
 *   });
 *
 *   return (
 *     <button onClick={() => setCount(c => c + 1)}>
 *       Count: {count}
 *     </button>
 *   );
 * };
 * ```
 */
export function useDidUpdate(fn: EffectCallback, dependencies?: DependencyList) {
  const mounted = useRef(false);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  useEffect(() => {
    if (mounted.current) {
      return fn();
    }

    mounted.current = true;
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
