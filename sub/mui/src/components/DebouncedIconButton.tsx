'use client';

import { IconButton, type IconButtonProps } from '@mui/material';
import type { MouseEvent } from 'react';
import { forwardRef, useRef } from 'react';

/**
 * DebouncedIconButton 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends IconButtonProps Material-UI IconButton 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface DebouncedIconButtonProps extends IconButtonProps {
  /**
   * 디바운스 지속 시간(밀리초)입니다.
   * 마지막 클릭 후 이 시간이 경과해야 실제 클릭 이벤트가 실행됩니다.
   * @default 700
   */
  debounce?: number;
}

/**
 * 디바운스 기능이 있는 아이콘 버튼 컴포넌트입니다.
 * 빠른 연속 클릭 시 마지막 클릭만 실행되도록 하여 불필요한 요청을 방지합니다.
 * 아이콘 버튼의 특성상 빠른 상호작용이 기대되므로 짧은 디바운스 시간을 사용합니다.
 *
 * @param props - DebouncedIconButton 컴포넌트의 속성
 * @param props.debounce - 디바운스 지속 시간(밀리초, 기본값: 700)
 * @param props.onClick - 버튼 클릭 이벤트 핸들러
 * @param props.disabled - 버튼 비활성화 여부
 * @param ref - 전달받은 ref 객체
 * @returns 디바운스 기능이 적용된 IconButton 컴포넌트
 *
 * @example
 * ```tsx
 * import { Search } from '@mui/icons-material';
 *
 * <DebouncedIconButton
 *   debounce={500}
 *   onClick={handleSearch}
 *   color="primary"
 * >
 *   <Search />
 * </DebouncedIconButton>
 * ```
 *
 * @todo unmount시 타이머 취소 기능 추가
 */
export const DebouncedIconButton = forwardRef<HTMLButtonElement, DebouncedIconButtonProps>(
  ({ debounce = 700, onClick, disabled, ...props }, ref) => {
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
      <IconButton {...props} ref={ref} onClick={handleClick} disabled={disabled}>
        {props.children}
      </IconButton>
    );
  },
);

DebouncedIconButton.displayName = 'DebouncedIconButton';
