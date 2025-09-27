import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { overrideProps } from '../../util/override-props.js';
import { createFlexComponent } from './create-component.js';
import type { FlexBaseProps } from './types.js';

const FlexRowStart = createFlexComponent('FlexRow.Start', 'row', {
  justifyContent: 'flex-start',
});

const FlexRowEnd = createFlexComponent('FlexRow.End', 'row', {
  justifyContent: 'flex-end',
});

const FlexRowAround = createFlexComponent('FlexRow.Around', 'row', {
  justifyContent: 'space-around',
});

const FlexRowBetween = createFlexComponent('FlexRow.Between', 'row', {
  justifyContent: 'space-between',
});

const FlexRowEvenly = createFlexComponent('FlexRow.Evenly', 'row', {
  justifyContent: 'space-evenly',
});

const FlexRowCenter = createFlexComponent('FlexRow.Center', 'row', {
  justifyContent: 'center',
});

/**
 * FlexRow 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends FlexBaseProps Flex 기본 속성들을 상속받습니다.
 */
export interface FlexRowProps extends FlexBaseProps {
  /**
   * 자동으로 중앙 정렬(justify-content: center, align-items: center)을 적용할지 여부입니다.
   * @default false
   */
  center?: boolean;
}

/**
 * FlexRow 컴포넌트의 타입 정의입니다.
 * 기본 컴포넌트와 함께 정렬 옵션별 하위 컴포넌트들을 포함합니다.
 */
interface FlexRowComponent extends React.ForwardRefExoticComponent<FlexRowProps> {
  /** 수평 시작 정렬 (justify-content: flex-start) */
  Start: typeof FlexRowStart;
  /** 수평 끝 정렬 (justify-content: flex-end) */
  End: typeof FlexRowEnd;
  /** 수평 중앙 정렬 (justify-content: center) */
  Center: typeof FlexRowCenter;
  /** 요소들 사이에 균등한 간격 (justify-content: space-between) */
  Between: typeof FlexRowBetween;
  /** 요소들 주위에 균등한 간격 (justify-content: space-around) */
  Around: typeof FlexRowAround;
  /** 요소들과 가장자리까지 균등한 간격 (justify-content: space-evenly) */
  Evenly: typeof FlexRowEvenly;
}

/**
 * 가로 방향 flexbox 레이아웃을 위한 컴포넌트입니다.
 * flexDirection이 'row'로 설정된 flex 컨테이너를 생성하며,
 * 다양한 수평 정렬 옵션을 가진 하위 컴포넌트들을 제공합니다.
 *
 * @param props - FlexRow 컴포넌트의 속성
 * @param props.center - 자동 중앙 정렬 적용 여부 (기본값: false)
 * @param props.inlineFlex - inline-flex 사용 여부 (기본값: false)
 * @param props.justifyContent - 주축(가로) 정렬 방식
 * @param props.alignItems - 교차축(세로) 정렬 방식
 * @param props.flexWrap - flex 아이템 줄바꿈 설정
 * @param ref - 전달받은 ref 객체
 * @returns 가로 방향 flex 컨테이너
 *
 * @example
 * ```tsx
 * // 기본 가로 레이아웃
 * <FlexRow>
 *   <Button>왼쪽</Button>
 *   <Button>오른쪽</Button>
 * </FlexRow>
 *
 * // 양끝 정렬
 * <FlexRow.Between>
 *   <Logo />
 *   <Navigation />
 * </FlexRow.Between>
 * ```
 */
const FlexRowBase = forwardRef<HTMLDivElement, FlexRowProps>(
  ({ center, inlineFlex = false, justifyContent, alignItems, flexWrap, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={[
          {
            display: inlineFlex ? 'inline-flex' : 'flex',
            flexDirection: 'row',
            ...overrideProps(
              center
                ? {
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
                : {},
              { justifyContent, alignItems, flexWrap },
            ),
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      />
    );
  },
) as FlexRowComponent;

export const FlexRow = FlexRowBase;
FlexRow.displayName = 'FlexRow';
FlexRow.Start = FlexRowStart;
FlexRow.End = FlexRowEnd;
FlexRow.Center = FlexRowCenter;
FlexRow.Between = FlexRowBetween;
FlexRow.Around = FlexRowAround;
FlexRow.Evenly = FlexRowEvenly;
FlexRowBase.displayName = 'FlexRowBase';
