'use client';

import { ButtonBase, type ButtonBaseProps } from '@mui/material';
import type { MouseEvent } from 'react';
import { forwardRef, useRef } from 'react';

/**
 * DebouncedButtonBase 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends ButtonBaseProps Material-UI ButtonBase 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface DebouncedButtonBaseProps extends ButtonBaseProps {
  /**
   * 디바운스 지속 시간(밀리초)입니다.
   * 마지막 클릭 후 이 시간이 경과해야 실제 클릭 이벤트가 실행됩니다.
   * @default 700
   */
  debounce?: number;
}

/**
 * 디바운스 기능이 있는 기본 버튼 컴포넌트입니다.
 * ButtonBase를 기반으로 하여 최소한의 스타일링과 함께 디바운스 기능을 제공합니다.
 * 빠른 연속 클릭 시 마지막 클릭만 실행되도록 합니다.
 *
 * @param props - DebouncedButtonBase 컴포넌트의 속성
 * @param props.debounce - 디바운스 지속 시간(밀리초, 기본값: 700)
 * @param props.onClick - 버튼 클릭 이벤트 핸들러
 * @param props.disabled - 버튼 비활성화 여부
 * @param props.children - 버튼 내부 콘텐츠
 * @param ref - 전달받은 ref 객체
 * @returns 디바운스 기능이 적용된 ButtonBase 컴포넌트
 *
 * @example
 * ```tsx
 * <DebouncedButtonBase
 *   debounce={1000}
 *   onClick={handleAction}
 *   sx={{ padding: 1 }}
 * >
 *   디바운스 버튼
 * </DebouncedButtonBase>
 * ```
 *
 * @todo unmount시 타이머 취소 기능 추가
 */
export const DebouncedButtonBase = forwardRef<HTMLButtonElement, DebouncedButtonBaseProps>(
  ({ debounce = 700, onClick, disabled, children, ...props }, ref) => {
    const debounceTimeout = useRef<any | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        if (!disabled && onClick) {
          onClick(event);
        }
      }, debounce);
    };

    return (
      <ButtonBase {...props} ref={ref} onClick={handleClick} disabled={disabled}>
        {children}
      </ButtonBase>
    );
  },
);

DebouncedButtonBase.displayName = 'DebouncedButtonBase';
