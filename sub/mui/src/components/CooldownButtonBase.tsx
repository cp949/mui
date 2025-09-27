'use client';

import { ButtonBase, type ButtonBaseProps } from '@mui/material';
import type { MouseEvent } from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

/**
 * CooldownButtonBase 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends ButtonBaseProps Material-UI ButtonBase 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface CooldownButtonBaseProps extends ButtonBaseProps {
  /**
   * 쿨다운 지속 시간(밀리초)입니다.
   * 버튼 클릭 후 이 시간 동안 버튼이 비활성화됩니다.
   * @default 1000
   */
  cooldown?: number;
}

/**
 * 클릭 후 일정 시간 동안 비활성화되는 쿨다운 기능이 있는 기본 버튼 컴포넌트입니다.
 * ButtonBase를 기반으로 하여 최소한의 스타일링과 함께 쿨다운 기능을 제공합니다.
 *
 * @param props - CooldownButtonBase 컴포넌트의 속성
 * @param props.cooldown - 쿨다운 지속 시간(밀리초, 기본값: 1000)
 * @param props.onClick - 버튼 클릭 이벤트 핸들러
 * @param props.disabled - 버튼 비활성화 여부
 * @param ref - 전달받은 ref 객체
 * @returns 쿨다운 기능이 적용된 ButtonBase 컴포넌트
 *
 * @example
 * ```tsx
 * <CooldownButtonBase
 *   cooldown={1500}
 *   onClick={handleAction}
 *   sx={{ padding: 1 }}
 * >
 *   클릭
 * </CooldownButtonBase>
 * ```
 */
export const CooldownButtonBase = forwardRef<HTMLButtonElement, CooldownButtonBaseProps>(
  ({ cooldown = 1000, onClick, disabled, ...props }, ref) => {
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
      <ButtonBase
        {...props}
        ref={internalRef}
        onClick={handleClick}
        disabled={disabled || isCooldown}
      >
        {props.children}
      </ButtonBase>
    );
  },
);

CooldownButtonBase.displayName = 'CooldownButtonBase';
