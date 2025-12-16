import { useEffect, useRef, useState } from 'react';
import { useUnmount } from './useUnmount.js';

/**
 * 시간이 지나면 자동으로 사라지는 데이터
 */
export function useTimeoutData<T>(timeoutMs: number): [T | null, (t: T | null) => void] {
  const [message, setMessage] = useState<T | null>(null);
  const timerRef = useRef<any | null>(null);

  useUnmount(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  });

  useEffect(() => {
    if (message == null) return;

    // 새로운 메시지가 오면 타이머를 종료한다
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setTimeout(() => {
      setMessage(null);
    }, timeoutMs);
  }, [message, timeoutMs]);

  return [message, setMessage];
}
