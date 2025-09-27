'use client';

import { IconButton, type IconButtonProps } from '@mui/material';
import type { MouseEvent } from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

/**
 * CooldownIconButton 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends IconButtonProps Material-UI IconButton 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface CooldownIconButtonProps extends IconButtonProps {
  /**
   * 쿨다운 지속 시간(밀리초)입니다.
   * 아이콘 버튼의 특성상 짧은 쿨다운 시간을 기본값으로 사용합니다.
   * @default 700
   */
  cooldown?: number;
}

/**
 * 클릭 후 일정 시간 동안 비활성화되는 쿨다운 기능이 있는 아이콘 버튼 컴포넌트입니다.
 * 일반 버튼보다 짧은 쿨다운 시간(700ms)을 기본값으로 사용하여 아이콘 버튼의 빠른 상호작용에 적합합니다.
 *
 * @param props - CooldownIconButton 컴포넌트의 속성
 * @param props.cooldown - 쿨다운 지속 시간(밀리초, 기본값: 700)
 * @param props.onClick - 버튼 클릭 이벤트 핸들러
 * @param props.disabled - 버튼 비활성화 여부
 * @param ref - 전달받은 ref 객체
 * @returns 쿨다운 기능이 적용된 IconButton 컴포넌트
 *
 * @example
 * ```tsx
 * import { Delete } from '@mui/icons-material';
 *
 * <CooldownIconButton
 *   cooldown={1000}
 *   onClick={handleDelete}
 *   color="error"
 * >
 *   <Delete />
 * </CooldownIconButton>
 * ```
 */
export const CooldownIconButton = forwardRef<HTMLButtonElement, CooldownIconButtonProps>(
  ({ cooldown = 700, onClick, disabled, ...props }, ref) => {
    const [isCooldown, setIsCooldown] = useState(false);
    const internalRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => internalRef.current!);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (!isCooldown && onClick) {
        onClick(event);
        setIsCooldown(true);
        setTimeout(() => setIsCooldown(false), cooldown);
      }
    };

    return (
      <IconButton
        {...props}
        ref={internalRef}
        onClick={handleClick}
        disabled={disabled || isCooldown}
      >
        {props.children}
      </IconButton>
    );
  },
);

CooldownIconButton.displayName = 'CooldownIconButton';
