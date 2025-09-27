import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { overrideProps } from '../../util/override-props.js';
import { createFlexComponent } from './create-component.js';
import type { FlexBaseProps } from './types.js';

const FlexColumnStart = createFlexComponent('FlexColumn.Start', 'column', {
  justifyContent: 'flex-start',
});

const FlexColumnEnd = createFlexComponent('FlexColumn.End', 'column', {
  justifyContent: 'flex-end',
});

const FlexColumnCenter = createFlexComponent('FlexColumn.Center', 'column', {
  justifyContent: 'center',
});

const FlexColumnAround = createFlexComponent('FlexColumn.Around', 'column', {
  justifyContent: 'space-around',
});

const FlexColumnBetween = createFlexComponent('FlexColumn.Between', 'column', {
  justifyContent: 'space-between',
});

const FlexColumnEvenly = createFlexComponent('FlexColumn.Evenly', 'column', {
  justifyContent: 'space-evenly',
});

/**
 * FlexColumn 컴포넌트의 속성을 정의하는 인터페이스입니다.
 *
 * @extends FlexBaseProps Flex 기본 속성들을 상속받습니다.
 */
export interface FlexColumnProps extends FlexBaseProps {
  /**
   * 자동으로 중앙 정렬(justify-content: center, align-items: center)을 적용할지 여부입니다.
   * true일 경우 justifyContent와 alignItems 속성을 덮어씁니다.
   * @default false
   */
  center?: boolean;
}

/**
 * FlexColumn 컴포넌트의 타입 정의입니다.
 * 기본 컴포넌트와 함께 정렬 옵션별 하위 컴포넌트들을 포함합니다.
 */
interface FlexColumnComponent extends React.ForwardRefExoticComponent<FlexColumnProps> {
  /** 수직 시작 정렬 (justify-content: flex-start) */
  Start: typeof FlexColumnStart;
  /** 수직 끝 정렬 (justify-content: flex-end) */
  End: typeof FlexColumnEnd;
  /** 수직 중앙 정렬 (justify-content: center) */
  Center: typeof FlexColumnCenter;
  /** 요소들 사이에 균등한 간격 (justify-content: space-between) */
  Between: typeof FlexColumnBetween;
  /** 요소들 주위에 균등한 간격 (justify-content: space-around) */
  Around: typeof FlexColumnAround;
  /** 요소들과 가장자리까지 균등한 간격 (justify-content: space-evenly) */
  Evenly: typeof FlexColumnEvenly;
}

/**
 * 세로 방향 flexbox 레이아웃을 위한 컴포넌트입니다.
 * flexDirection이 'column'으로 설정된 flex 컨테이너를 생성하며,
 * 다양한 정렬 옵션을 가진 하위 컴포넌트들을 제공합니다.
 *
 * @param props - FlexColumn 컴포넌트의 속성
 * @param props.center - 자동 중앙 정렬 적용 여부 (기본값: false)
 * @param props.inlineFlex - inline-flex 사용 여부
 * @param props.justifyContent - 주축(세로) 정렬 방식
 * @param props.alignItems - 교차축(가로) 정렬 방식
 * @param props.flexWrap - flex 아이템 줄바꿈 설정
 * @param ref - 전달받은 ref 객체
 * @returns 세로 방향 flex 컨테이너
 *
 * @example
 * ```tsx
 * // 기본 세로 레이아웃
 * <FlexColumn>
 *   <div>첫 번째</div>
 *   <div>두 번째</div>
 * </FlexColumn>
 *
 * // 중앙 정렬
 * <FlexColumn center>
 *   <Button>중앙 정렬 버튼</Button>
 * </FlexColumn>
 *
 * // 하위 컴포넌트 사용
 * <FlexColumn.Between>
 *   <Header />
 *   <Content />
 *   <Footer />
 * </FlexColumn.Between>
 *
 * // 커스텀 정렬
 * <FlexColumn justifyContent="flex-end" alignItems="stretch">
 *   <Card />
 * </FlexColumn>
 * ```
 */
const FlexColumnBase = forwardRef<HTMLDivElement, FlexColumnProps>(
  ({ center, inlineFlex, justifyContent, alignItems, flexWrap, sx, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        sx={[
          {
            display: inlineFlex ? 'inline-flex' : 'flex',
            flexDirection: 'column',
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
) as FlexColumnComponent;

export const FlexColumn = FlexColumnBase;
FlexColumn.displayName = 'FlexColumn';
FlexColumn.Start = FlexColumnStart;
FlexColumn.End = FlexColumnEnd;
FlexColumn.Center = FlexColumnCenter;
FlexColumn.Between = FlexColumnBetween;
FlexColumn.Evenly = FlexColumnEvenly;
FlexColumn.Around = FlexColumnAround;
FlexColumnBase.displayName = 'FlexColumnBase';
