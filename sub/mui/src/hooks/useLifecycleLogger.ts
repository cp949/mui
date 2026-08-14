import { type DependencyList, useEffect, useRef } from 'react';

/**
 * This hook provides a console log when the component mounts, updates and unmounts.
 *
 * @param componentName Provides the name of the component in which the life cycle is being logged
 * @param deps Dependencies list, as for `useEffect` hook
 */
export function useLifecycleLogger(componentName: string, deps?: DependencyList): void {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) {
      console.log(`${componentName} updated`, deps && [...deps]);
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps는 호출자가 전달하는 동적 의존성 배열이라 정적 분석 대상이 아님
  }, deps);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시 1회만 로그를 남기려는 의도이므로 componentName/deps 최신값 반영은 불필요
  useEffect(() => {
    mountedRef.current = true;
    console.log(`${componentName} mounted`, deps && [...deps]);

    return () => {
      mountedRef.current = false;
      console.log(`${componentName} unmounted`);
    };
  }, []);
}
