'use client';

import type { BoxProps, LinkProps, SxProps } from '@mui/material';
import { Box, Link, styled } from '@mui/material';
import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';
import { forwardRef } from 'react';
import { useElementSize } from '../hooks/useElementSize.js';
import { useId } from '../hooks/useId.js';
import { useUncontrolled } from '../hooks/useUncontrolled.js';

/**
 * Spoiler 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface SpoilerProps {
  /**
   * Material-UI sx 스타일 속성입니다.
   */
  sx?: SxProps;

  /**
   * CSS 클래스 이름입니다.
   */
  className?: string;

  /**
   * 인라인 CSS 스타일입니다.
   */
  style?: CSSProperties;

  /**
   * 컴포넌트의 고유 ID입니다.
   */
  id?: string;

  /**
   * 보이는 콘텐츠의 최대 높이입니다.
   * 이 높이를 초과하면 스포일러가 나타납니다.
   * @default 100
   */
  maxHeight?: number;

  /**
   * 스포일러를 닫는 액션을 위한 라벨입니다.
   */
  hideLabel: React.ReactNode;

  /**
   * 스포일러를 여는 액션을 위한 라벨입니다.
   */
  showLabel: React.ReactNode;

  /**
   * 스포일러 토글 버튼의 ref를 가져오기 위한 속성입니다.
   */
  controlRef?: React.ForwardedRef<HTMLButtonElement>;

  /**
   * 초기 스포일러 상태입니다.
   * true면 콘텐츠를 스포일러로 감싸고, false면 스포일러 없이 콘텐츠를 보여줍니다.
   */
  initialState?: boolean;

  /**
   * 제어되는 확장 상태 값입니다.
   */
  expanded?: boolean;

  /**
   * 확장 상태가 변경될 때 호출되는 함수입니다.
   * 사용자가 스포일러 가시성을 토글할 때 호출됩니다.
   * @param expanded - 현재 확장 상태
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * 스포일러 공개 전환 지속 시간(밀리초)입니다.
   * 0 또는 null로 설정하면 애니메이션을 끄니다.
   * @default 200
   */
  transitionDuration?: number;

  /**
   * 스포일러 내부에 표시될 자식 요소들입니다.
   */
  children?: ReactNode;
}

/**
 * 긴 콘텐츠를 숨기고 필요에 따라 펼칠 수 있는 스포일러 컴포넌트입니다.
 * 지정된 높이를 초과하는 콘텐츠가 있을 때 "더보기" 버튼을 표시하여
 * 사용자가 선택적으로 전체 내용을 볼 수 있도록 합니다.
 *
 * @param props - Spoiler 컴포넌트의 속성
 * @param props.maxHeight - 보이는 콘텐츠의 최대 높이 (기본값: 100)
 * @param props.hideLabel - 스포일러를 닫는 액션의 라벨
 * @param props.showLabel - 스포일러를 여는 액션의 라벨
 * @param props.initialState - 초기 스포일러 상태
 * @param props.expanded - 제어되는 확장 상태
 * @param props.onExpandedChange - 확장 상태 변경 시 호출되는 함수
 * @param props.transitionDuration - 애니메이션 지속 시간 (기본값: 200ms)
 * @param ref - 전달받은 ref 객체
 * @returns 스포일러 기능이 적용된 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <Spoiler
 *   maxHeight={150}
 *   showLabel="더보기"
 *   hideLabel="접기"
 * >
 *   <p>긴 콘텐츠...</p>
 * </Spoiler>
 *
 * // 제어 모드
 * <Spoiler
 *   expanded={isExpanded}
 *   onExpandedChange={setIsExpanded}
 *   showLabel="펼치기"
 *   hideLabel="접기"
 * >
 *   <LongContent />
 * </Spoiler>
 * ```
 */
export const Spoiler = forwardRef<HTMLElement, SpoilerProps>((props, ref) => {
  const {
    sx,
    className,
    style,
    id,
    initialState,
    maxHeight = 100,
    hideLabel,
    showLabel,
    expanded,
    onExpandedChange,
    controlRef,
    children,
    transitionDuration = 100,
    ...restProps
  } = props;

  const _id = useId(id);
  const regionId = `${_id}-region`;
  const [show, setShowState] = useUncontrolled({
    value: expanded,
    defaultValue: initialState,
    finalValue: false,
    onChange: onExpandedChange,
  });
  const { ref: contentRef, height } = useElementSize();

  const spoilerMoreContent = show ? hideLabel : showLabel;
  const hasSpoiler = spoilerMoreContent !== null && maxHeight < height;

  return (
    <RootBox
      className={clsx('Spoiler-root', className)}
      sx={[sx, ...(Array.isArray(sx) ? sx : [sx ?? false])]}
      style={style}
      id={_id}
      ref={ref}
      data-has-spoiler={hasSpoiler}
      {...restProps}
    >
      {hasSpoiler && (
        <StyledMoreButton
          component="button"
          ref={controlRef}
          onClick={() => {
            setShowState(!show);
          }}
          aria-expanded={show}
          aria-controls={regionId}
        >
          {spoilerMoreContent}
        </StyledMoreButton>
      )}
      <StyledContent
        data-reduce-motion
        role="region"
        id={regionId}
        transitionDuration={transitionDuration}
        style={{
          maxHeight: !show ? maxHeight : (height ?? undefined),
        }}
      >
        <div ref={contentRef}>{children}</div>
      </StyledContent>
    </RootBox>
  );
});

Spoiler.displayName = 'Spoiler';

const RootBox = styled(Box)<BoxProps>(() => ({
  position: 'relative',
  '&:where([data-has-spoiler="true"])': {
    marginBottom: 24,
  },
}));

const StyledMoreButton = styled(Link<'button'>)<LinkProps<'button'>>(() => ({
  position: 'absolute',
  insetInlineStart: 0,
  top: '100%',
  height: 32,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const StyledContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'transitionDuration',
})<
  BoxProps & {
    transitionDuration?: number;
  }
>(({ transitionDuration = 200 }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: `max-height ${transitionDuration}ms ease`,
}));
