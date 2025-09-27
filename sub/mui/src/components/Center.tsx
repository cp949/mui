import { Box, type BoxProps } from '@mui/material';
import { forwardRef } from 'react';

/**
 * Center 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends BoxProps Material-UI Box 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface CenterProps extends BoxProps {
  /**
   * 세로 방향으로 중앙 정렬할지 여부를 결정합니다.
   * @default false
   */
  vertical?: boolean;
}

/**
 * 자식 요소를 중앙에 정렬하는 레이아웃 컴포넌트입니다.
 * flexbox를 사용하여 가로 또는 세로 방향으로 콘텐츠를 중앙 정렬합니다.
 *
 * @param props - Center 컴포넌트의 속성
 * @param props.vertical - 세로 방향으로 정렬할지 여부 (기본값: false)
 * @param ref - 전달받은 ref 객체
 * @returns 중앙 정렬된 Box 컴포넌트
 *
 * @example
 * ```tsx
 * // 가로 방향 중앙 정렬
 * <Center>
 *   <div>중앙 정렬된 콘텐츠</div>
 * </Center>
 *
 * // 세로 방향 중앙 정렬
 * <Center vertical>
 *   <div>세로 중앙 정렬</div>
 * </Center>
 * ```
 */
export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ vertical = false, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={[
          {
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      />
    );
  },
);

Center.displayName = 'Center';
