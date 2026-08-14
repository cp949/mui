import type { DependencyList, EffectCallback } from 'react';
import { useLayoutEffect, useRef } from 'react';

export const useUpdateLayoutEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isMounted = useRef(false);

  useLayoutEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: deps는 호출자가 전달하는 동적 의존성 배열이라 정적 분석 대상이 아님
  }, deps);
};
