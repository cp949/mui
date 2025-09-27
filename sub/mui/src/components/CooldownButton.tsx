'use client';

import { Button, type ButtonProps } from '@mui/material';
import type { MouseEvent } from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

/**
 * CooldownButton 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends ButtonProps Material-UI Button 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface CooldownButtonProps extends ButtonProps {
  /**
   * 쿨다운 지속 시간(밀리초)입니다.
   * 버튼 클릭 후 이 시간 동안 버튼이 비활성화됩니다.
   * @default 1000
   */
  cooldown?: number;
}

/**
 * 클릭 후 일정 시간 동안 비활성화되는 쿨다운 기능이 있는 버튼 컴포넌트입니다.
 * 연속 클릭을 방지하고 서버 요청 스팸을 예방하는 데 유용합니다.
 *
 * @param props - CooldownButton 컴포넌트의 속성
 * @param props.cooldown - 쿨다운 지속 시간(밀리초, 기본값: 1000)
 * @param props.onClick - 버튼 클릭 이벤트 핸들러
 * @param props.disabled - 버튼 비활성화 여부
 * @param ref - 전달받은 ref 객체
 * @returns 쿨다운 기능이 적용된 Button 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 쿨다운 (1초)
 * <CooldownButton onClick={handleSubmit}>
 *   제출
 * </CooldownButton>
 *
 * // 커스텀 쿨다운 (3초)
 * <CooldownButton cooldown={3000} onClick={handleApiCall}>
 *   API 호출
 * </CooldownButton>
 * ```
 */
export const CooldownButton = forwardRef<HTMLButtonElement, CooldownButtonProps>(
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
      <Button {...props} ref={internalRef} onClick={handleClick} disabled={disabled || isCooldown}>
        {props.children}
      </Button>
    );
  },
);

CooldownButton.displayName = 'CooldownButton';
