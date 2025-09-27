// copy from lodash/debounce
/**
 * 디바운스된 함수의 타입 정의입니다.
 * 원본 함수에 cancel과 flush 메서드가 추가된 타입입니다.
 */
type DebouncedFunction<T extends (...args: any[]) => any> = T & {
  /** 대기 중인 함수 호출을 취소합니다 */
  cancel: () => void;
  /** 대기 중인 함수를 즉시 실행합니다 */
  flush: () => ReturnType<T> | undefined;
};

/**
 * 디바운스 옵션 인터페이스입니다.
 */
interface DebounceOptions {
  /** 대기 시간 시작 시점에 함수를 실행할지 여부 */
  leading?: boolean;
  /** 대기 시간 끝에 함수를 실행할지 여부 */
  trailing?: boolean;
  /** 함수가 지연될 수 있는 최대 시간(밀리초) */
  maxWait?: number;
}

/**
 * 함수 호출을 지연시켜 빠른 연속 호출을 방지하는 디바운스 함수를 생성합니다.
 * 마지막 호출 후 지정된 시간이 지나야 실제 함수가 실행됩니다.
 *
 * @param func - 디바운스할 원본 함수
 * @param wait - 대기 시간(밀리초), 기본값: 0
 * @param options - 디바운스 동작 옵션
 * @returns 디바운스된 함수 (cancel, flush 메서드 포함)
 *
 * @example
 * ```typescript
 * // 기본 디바운스 (검색 입력 지연)
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('검색:', query);
 * }, 300);
 *
 * debouncedSearch('a'); // 실행 안됨
 * debouncedSearch('ab'); // 실행 안됨
 * debouncedSearch('abc'); // 300ms 후 실행
 *
 * // leading 옵션 사용 (버튼 클릭 방지)
 * const debouncedClick = debounce(() => {
 *   console.log('버튼 클릭!');
 * }, 1000, { leading: true, trailing: false });
 *
 * // 취소 및 즉시 실행
 * const debouncedSave = debounce(saveData, 2000);
 * debouncedSave(); // 2초 후 실행 예정
 * debouncedSave.cancel(); // 취소
 * debouncedSave.flush(); // 즉시 실행
 * ```
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0,
  options: DebounceOptions = {},
): DebouncedFunction<T> {
  let lastArgs: any;
  let lastThis: any;
  let maxWait: number | undefined;
  let result: ReturnType<T>;
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  const { leading = false, trailing = true, maxWait: userMaxWait } = options;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  if (typeof userMaxWait === 'number') {
    maxWait = Math.max(userMaxWait, wait);
  }

  /**
   * 현재 시간을 밀리초로 반환합니다.
   */
  function now(): number {
    return Date.now();
  }

  /**
   * 원본 함수를 실제로 호출합니다.
   */
  function invokeFunc(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  /**
   * leading edge에서의 처리를 수행합니다.
   */
  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  /**
   * 남은 대기 시간을 계산합니다.
   */
  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  /**
   * 함수를 실행해야 하는지 판단합니다.
   */
  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  /**
   * 타이머가 만료되었을 때 처리합니다.
   */
  function timerExpired() {
    const time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  /**
   * trailing edge에서의 처리를 수행합니다.
   */
  function trailingEdge(time: number) {
    timerId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  /**
   * 대기 중인 함수 호출을 취소합니다.
   */
  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    lastThis = undefined;
    timerId = undefined;
  }

  /**
   * 대기 중인 함수를 즉시 실행합니다.
   */
  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  /**
   * 디바운스된 함수 본체입니다.
   */
  function debounced(this: any, ...args: any[]) {
    const time = now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxWait !== undefined) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced as DebouncedFunction<T>;
}

export { debounce };
