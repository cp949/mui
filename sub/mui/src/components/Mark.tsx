import type { SxProps } from '@mui/material';
import { Box } from '@mui/material';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';

/**
 * Mark 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface MarkProps {
  /**
   * Material-UI sx 스타일 속성입니다.
   */
  sx?: SxProps;

  /**
   * CSS 클래스 이름입니다.
   */
  className?: string;

  /**
   * 텍스트 색상입니다.
   * @default "#000"
   */
  color?: string;

  /**
   * 배경 색상입니다.
   * @default "#ff0"
   */
  bgcolor?: string;

  /**
   * 강조할 내용입니다.
   */
  children?: ReactNode;
}

/**
 * 텍스트를 강조하기 위한 마크 컴포넌트입니다.
 * HTML mark 요소를 기반으로 하여 중요한 텍스트를 시각적으로 강조합니다.
 * 기본적로 노란색 배경과 검은색 텍스트를 사용합니다.
 *
 * @param props - Mark 컴포넌트의 속성
 * @param props.color - 텍스트 색상 (기본값: "#000")
 * @param props.bgcolor - 배경 색상 (기본값: "#ff0")
 * @param props.children - 강조할 내용
 * @param ref - 전달받은 ref 객체
 * @returns 강조 표시가 적용된 mark 요소
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <Mark>중요한 내용</Mark>
 *
 * // 커스텀 색상
 * <Mark color="#fff" bgcolor="#f44336">
 *   경고 메시지
 * </Mark>
 *
 * // 인라인 강조
 * <p>
 *   이 문장에서 <Mark>이 부분</Mark>이 중요합니다.
 * </p>
 * ```
 */
export const Mark = forwardRef<HTMLElement, MarkProps>((props, ref) => {
  // restProps는 data-xxx를 적용하기 위해 필요함
  const { sx, className, color = '#000', bgcolor = '#ff0', children, ...restProps } = props;
  return (
    <Box
      className={clsx('Mark-root', className)}
      component="mark"
      ref={ref}
      sx={[
        {
          display: 'inline-block',
          color,
          bgcolor,
        },
        ...(Array.isArray(sx) ? sx : [sx ?? false]),
      ]}
      {...restProps}
    >
      {children}
    </Box>
  );
});

Mark.displayName = 'Mark';
