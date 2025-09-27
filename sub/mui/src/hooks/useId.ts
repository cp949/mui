import React, { useState } from 'react';
import { useIsomorphicEffect } from './useIsomorphicEffect.js';

/** React 18의 useId 훅을 대체하는 함수 */
const __useId: () => string | undefined = (React as any)['useId'.toString()] || (() => undefined);

/**
 * React의 내장 useId를 사용하여 mantine 접두사가 붙은 ID를 생성합니다.
 * React 18 이상에서만 사용할 수 있습니다.
 */
function useReactId() {
  const id = __useId();
  return id ? `mantine-${id.replace(/:/g, '')}` : '';
}

/**
 * 랜덤한 ID를 생성하는 유틸리티 함수입니다.
 *
 * @param prefix - ID의 접두사 (default: "rand-")
 * @returns 랜덤한 문자열 ID
 */
function randomId(prefix = 'rand-'): string {
  return `${prefix}${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * 고유한 ID를 생성하는 React 훅입니다.
 * React 18의 useId가 사용 가능한 경우 이를 사용하고,
 * 그렇지 않으면 랜덤 ID를 생성합니다.
 *
 * 이 훅은 SSR 환경에서도 안전하게 작동하며,
 * 서버와 클라이언트 간의 ID 불일치를 방지합니다.
 *
 * @param staticId - 정적 ID가 제공된 경우 이를 반환 (선택사항)
 * @returns 고유한 문자열 ID
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const id = useId();
 *   const labelId = useId('custom-label');
 *
 *   return (
 *     <div>
 *       <label htmlFor={id}>레이블</label>
 *       <input id={id} type="text" />
 *       <span id={labelId}>도움말</span>
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // aria-describedby에 사용
 * const FormField = () => {
 *   const inputId = useId();
 *   const helpId = useId();
 *   const errorId = useId();
 *
 *   return (
 *     <div>
 *       <input
 *         id={inputId}
 *         aria-describedby={`${helpId} ${errorId}`}
 *       />
 *       <div id={helpId}>도움말</div>
 *       <div id={errorId}>오류 메시지</div>
 *     </div>
 *   );
 * };
 * ```
 */
export function useId(staticId?: string) {
  const reactId = useReactId();
  const [uuid, setUuid] = useState(reactId);

  useIsomorphicEffect(() => {
    setUuid(randomId());
  }, []);

  if (typeof staticId === 'string') {
    return staticId;
  }

  if (typeof window === 'undefined') {
    return reactId;
  }

  return uuid;
}
