import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { isBrowser, noop } from '../util/misc-utils.js';

type parserOptions<T> =
  | {
      raw: true;
    }
  | {
      raw: false;
      serializer: (value: T) => string;
      deserializer: (value: string) => T;
    };

export const useSessionStorage = <T>(
  key: string,
  initialValue?: T,
  options?: parserOptions<T>,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] => {
  if (!isBrowser) {
    return [initialValue as T, noop, noop];
  }
  if (!key) {
    throw new Error('useSessionStorage key may not be falsy');
  }

  const deserializer = options
    ? options.raw
      ? (value) => value
      : options.deserializer
    : JSON.parse;

  // biome-ignore lint/correctness/useHookAtTopLevel: isBrowser는 모듈 로드 시점에 고정되는 상수라 훅 호출 순서가 항상 동일하게 유지됨
  const initializer = useRef((key: string) => {
    try {
      const serializer = options ? (options.raw ? String : options.serializer) : JSON.stringify;

      const sessionStorageValue = sessionStorage.getItem(key);
      if (sessionStorageValue !== null) {
        return deserializer(sessionStorageValue);
      } else {
        if (initialValue) {
          sessionStorage.setItem(key, serializer(initialValue));
        }
        return initialValue;
      }
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  // biome-ignore lint/correctness/useHookAtTopLevel: isBrowser는 모듈 로드 시점에 고정되는 상수라 훅 호출 순서가 항상 동일하게 유지됨
  const [state, setState] = useState<T | undefined>(() => initializer.current(key));

  // biome-ignore lint/correctness/useHookAtTopLevel: isBrowser는 모듈 로드 시점에 고정되는 상수라 훅 호출 순서가 항상 동일하게 유지됨
  useLayoutEffect(() => setState(initializer.current(key)), [key]);

  // biome-ignore lint/correctness/useHookAtTopLevel: isBrowser는 모듈 로드 시점에 고정되는 상수라 훅 호출 순서가 항상 동일하게 유지됨
  // biome-ignore lint/correctness/useExhaustiveDependencies: deserializer/options는 훅 호출 시점에 고정되는 안정적인 값으로 간주함(매 렌더 재전달 시 재생성 방지). setState는 React가 참조 안정성을 보장하므로 생략
  const set: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (valOrFunc) => {
      try {
        const newState =
          typeof valOrFunc === 'function'
            ? (valOrFunc as (prevState: T | undefined) => T | undefined)(state)
            : valOrFunc;
        if (typeof newState === 'undefined') return;
        let value: string;

        if (options)
          if (options.raw)
            if (typeof newState === 'string') value = newState;
            else value = JSON.stringify(newState);
          else if (options.serializer) value = options.serializer(newState);
          else value = JSON.stringify(newState);
        else value = JSON.stringify(newState);

        sessionStorage.setItem(key, value);
        setState(deserializer(value));
      } catch {
        // If user is in private mode or has storage restriction
        // sessionStorage can throw. Also JSON.stringify can throw.
      }
    },
    [key, state],
  );

  // biome-ignore lint/correctness/useHookAtTopLevel: isBrowser는 모듈 로드 시점에 고정되는 상수라 훅 호출 순서가 항상 동일하게 유지됨
  const remove = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      setState(undefined);
    } catch {
      // If user is in private mode or has storage restriction
      // sessionStorage can throw.
    }
  }, [key]);

  return [state, set, remove];
};
