'use client';

import { Button, type ButtonProps } from '@mui/material';
import type { MouseEvent } from 'react';
import { forwardRef, useRef } from 'react';

/**
 * DebouncedButton 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends ButtonProps Material-UI Button 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface DebouncedButtonProps extends ButtonProps {
  /**
   * 디바운스 지속 시간(밀리초)입니다.
   * 마지막 클릭 후 이 시간이 경과해야 실제 클릭 이벤트가 실행됩니다.
   * @default 700
   */
  debounce?: number;
}

/**
 * 디바운스 기능이 있는 버튼 컴포넌트입니다.
 * 빠른 연속 클릭 시 마지막 클릭만 실행되도록 하여 불필요한 요청을 방지합니다.
 * 검색 입력이나 자동 완성 같은 기능에 유용합니다.
 *
 * @param props - DebouncedButton 컴포넌트의 속성
 * @param props.debounce - 디바운스 지속 시간(밀리초, 기본값: 700)
 * @param props.onClick - 버튼 클릭 이벤트 핸들러
 * @param props.disabled - 버튼 비활성화 여부
 * @param props.children - 버튼 내부 콘텐츠
 * @param ref - 전달받은 ref 객체
 * @returns 디바운스 기능이 적용된 Button 컴포넌트
 *
 * @example
 * ```tsx
 * // 검색 버튼
 * <DebouncedButton
 *   debounce={500}
 *   onClick={handleSearch}
 *   variant="contained"
 * >
 *   검색
 * </DebouncedButton>
 *
 * // 자동 저장 버튼
 * <DebouncedButton
 *   debounce={2000}
 *   onClick={handleAutoSave}
 * >
 *   자동 저장
 * </DebouncedButton>
 * ```
 */
export const DebouncedButton = forwardRef<HTMLButtonElement, DebouncedButtonProps>(
  ({ debounce = 700, onClick, disabled, children, ...props }, ref) => {
    const debounceTimeout = useRef<any | null>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        if (!disabled && onClick) onClick(event);
      }, debounce);
    };

    return (
      <Button {...props} ref={ref} onClick={handleClick} disabled={disabled}>
        {children}
      </Button>
    );
  },
);

DebouncedButton.displayName = 'DebouncedButton';
