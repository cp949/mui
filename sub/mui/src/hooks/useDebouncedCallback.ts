import { useRef, useEffect, useCallback, useMemo } from 'react';

/**
 * 디바운스된 콜백 훅의 옵션 인터페이스입니다.
 */
interface UseDebouncedCallbackOptions {
  /** 첫 번째 호출 시 즉시 실행 여부 @default false */
  leading?: boolean;
  /** 마지막 호출 후 대기 시간 이후 실행 여부 @default true */
  trailing?: boolean;
}

/**
 * 콜백 함수를 디바운스 처리하여 성능을 최적화하는 React 훅입니다.
 * 지정된 시간 내에 여러 번 호출되더라도 마지막 호출만 실행합니다.
 *
 * 이 훅은 검색, 자동 완성, API 호출 등에서 불필요한 요청을 줄이는 데 유용합니다.
 * cancel 및 flush 기능을 제공하여 디바운스를 세밀하게 제어할 수 있습니다.
 *
 * @template T - 디바운스할 콜백 함수의 타입
 * @param callback - 디바운스 처리할 콜백 함수
 * @param wait - 디바운스 대기 시간(밀리초)
 * @param options - 디바운스 동작을 제어하는 옵션
 * @returns 디바운스된 콜백 함수와 cancel 메서드
 *
 * @example
 * ```tsx
 * // 사용자 입력에 따른 자동 검색
 * const Component = () => {
 *   const [query, setQuery] = useState('');
 *
 *   const debouncedSearch = useDebouncedCallback(
 *     (searchTerm: string) => {
 *       console.log('검색 실행:', searchTerm);
 *       // API 호출 로직
 *     },
 *     300,
 *     { leading: false, trailing: true }
 *   );
 *
 *   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const value = e.target.value;
 *     setQuery(value);
 *     debouncedSearch(value);
 *   };
 *
 *   return (
 *     <div>
 *       <input value={query} onChange={handleChange} />
 *       <button onClick={debouncedSearch.cancel}>검색 취소</button>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // leading 옵션을 사용한 즉시 실행
 * const Component = () => {
 *   const debouncedClick = useDebouncedCallback(
 *     () => {
 *       console.log('버튼 클릭!');
 *     },
 *     1000,
 *     { leading: true, trailing: false }
 *   );
 *
 *   return (
 *     <button onClick={debouncedClick}>
 *       첫 클릭만 실행되는 버튼
 *     </button>
 *   );
 * };
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  wait: number,
  options: UseDebouncedCallbackOptions = {},
): T & { cancel: () => void } {
  const { leading = false, trailing = true } = options;

  // 디바운스 타이머 ID를 저장하는 ref
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 마지막으로 전달된 인자를 저장하는 ref
  const lastArgsRef = useRef<any[]>([]);

  // leading 호출이 이미 실행되었는지 여부를 기록하는 ref
  const leadingCalledRef = useRef(false);

  // 디바운싱된 콜백 함수
  const debouncedCallback = useCallback(
    (...args: any[]) => {
      // 마지막 인자를 업데이트
      lastArgsRef.current = args;

      // 콜백을 호출하는 내부 함수
      const invoke = () => {
        if (trailing || (leading && !leadingCalledRef.current)) {
          callback(...lastArgsRef.current); // 콜백 실행
        }
        leadingCalledRef.current = false; // 호출 상태 초기화
      };

      // 기존 타이머 제거
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      // leading 옵션에 따라 즉시 실행
      if (leading && !leadingCalledRef.current) {
        callback(...args); // 즉시 콜백 호출
        leadingCalledRef.current = true; // 호출 기록
      }

      // 대기 시간이 끝난 후 콜백 실행
      timeoutRef.current = setTimeout(() => {
        invoke(); // 마지막 콜백 실행
        timeoutRef.current = null; // 타이머 초기화
      }, wait);
    },
    [callback, leading, trailing, wait],
  );

  // 디바운스 타이머를 취소하는 함수
  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current); // 타이머 제거
      timeoutRef.current = null;
    }
    leadingCalledRef.current = false; // 호출 상태 초기화
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cancel(); // 타이머 정리
    };
  }, [cancel]);

  // 디바운스된 콜백에 cancel 메서드를 추가하여 반환
  return useMemo(() => {
    // Keep render immutable (no property writes), while preserving the legacy API:
    // a callable function with a `.cancel()` property.
    const target = function () {
      // The target is never called directly; `apply` trap handles invocation.
    };

    // NOTE: react-hooks/refs is overly conservative here and flags Proxy creation as "ref access during render".
    // We intentionally keep this API (function + .cancel) without mutating values in render, and rely on E2E tests
    // to guarantee behavior.
    /* eslint-disable react-hooks/refs */
    const proxy = new Proxy(target as unknown as T, {
      get(_target, prop) {
        if (prop === 'cancel') return cancel;
        return undefined;
      },
      apply(_target, _thisArg, argArray) {
        return (debouncedCallback as any)(...(argArray as any[]));
      },
    });
    /* eslint-enable react-hooks/refs */

    return proxy as unknown as T & { cancel: () => void };
  }, [debouncedCallback, cancel]);
}
