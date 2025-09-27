import { Box, type BoxProps } from '@mui/material';
import { forwardRef } from 'react';

/**
 * Space 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends BoxProps Material-UI Box 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface SpaceProps extends BoxProps {
  /**
   * 요소의 너비입니다.
   */
  width?: number;
  /**
   * 요소의 높이입니다.
   */
  height?: number;
  /**
   * 요소의 최소 너비입니다.
   * 지정하지 않으면 width 값을 사용합니다.
   */
  minWidth?: number;
  /**
   * 요소의 최소 높이입니다.
   * 지정하지 않으면 height 값을 사용합니다.
   */
  minHeight?: number;
}

/**
 * 레이아웃에서 빈 공간을 만들기 위한 컴포넌트입니다.
 * 지정된 크기의 투명한 영역을 만들어 요소들 사이에 간격을 주거나
 * 레이아웃 조정을 위해 사용합니다.
 *
 * @param props - Space 컴포넌트의 속성
 * @param props.width - 요소의 너비
 * @param props.height - 요소의 높이
 * @param props.minWidth - 요소의 최소 너비 (기본값: width)
 * @param props.minHeight - 요소의 최소 높이 (기본값: height)
 * @param ref - 전달받은 ref 객체
 * @returns 지정된 크기의 빈 공간 요소
 *
 * @example
 * ```tsx
 * // 가로 간격
 * <Space width={20} />
 *
 * // 세로 간격
 * <Space height={30} />
 *
 * // 정사각형 공간
 * <Space width={50} height={50} />
 *
 * // 최소 크기 지정
 * <Space width={100} height={100} minWidth={80} minHeight={80} />
 * ```
 */
export const Space = forwardRef<HTMLDivElement, SpaceProps>(
  ({ width, height, minWidth, minHeight, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={[
          {
            width,
            height,
            minWidth: minWidth ?? width,
            minHeight: minHeight ?? height,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      />
    );
  },
);

Space.displayName = 'Space';
