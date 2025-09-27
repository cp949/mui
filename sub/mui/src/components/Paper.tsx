import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from '@mui/material';
import clsx from 'clsx';

/**
 * Paper 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends MuiPaperProps Material-UI Paper 컴포넌트의 모든 속성을 상속받습니다.
 */
export interface PaperProps extends MuiPaperProps {
  /**
   * 사각형 모양을 사용할지 여부입니다.
   * true일 경우 borderRadius가 0으로 설정됩니다.
   * @default false
   */
  squared?: boolean;
  /**
   * 테두리를 표시할지 여부입니다.
   * true일 경우 연한 회색 테두리가 추가됩니다.
   * @default false
   */
  outlined?: boolean;
}

/**
 * Material-UI Paper 컴포넌트를 확장한 컴포넌트입니다.
 * 그림자를 가진 쳤드나 패널을 만들 때 사용하며,
 * 사각형 모양과 테두리 옵션을 추가로 제공합니다.
 *
 * @param props - Paper 컴포넌트의 속성
 * @param props.squared - 사각형 모양 사용 여부 (기본값: false)
 * @param props.outlined - 테두리 표시 여부 (기본값: false)
 * @param props.children - Paper 내부에 들어갈 콘텐츠
 * @returns 스타일이 적용된 Paper 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <Paper>
 *   <Typography>Paper 콘텐츠</Typography>
 * </Paper>
 *
 * // 사각형 모양
 * <Paper squared>
 *   <Content />
 * </Paper>
 *
 * // 테두리가 있는 Paper
 * <Paper outlined elevation={0}>
 *   <BorderedContent />
 * </Paper>
 *
 * // 옵션 조합
 * <Paper squared outlined elevation={2}>
 *   <SpecialCard />
 * </Paper>
 * ```
 */
export function Paper(props: PaperProps) {
  const { className, sx, squared, outlined, children, ...rest } = props;
  return (
    <MuiPaper
      {...rest}
      className={clsx('Paper-root', className)}
      sx={[
        {
          borderRadius: squared ? 0 : 1,
          border: outlined ? '1px solid #ddd' : 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx ?? false]),
      ]}
    >
      {children}
    </MuiPaper>
  );
}
