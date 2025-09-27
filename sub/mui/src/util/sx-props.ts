import type { SxProps, Theme } from '@mui/material';

/**
 * SxProps 배열을 평탄화하여 단일 SxProps로 만듭니다.
 * 가변인자로 받은 SxProps들을 하나의 배열로 합치고, falsy 값들은 필터링합니다.
 *
 * @param sxArray - 평탄화할 SxProps들 (가변인자)
 * @returns 평탄화된 SxProps 배열
 *
 * @example
 * ```typescript
 * const sx1 = { color: 'red' };
 * const sx2 = [{ fontSize: 16 }, { fontWeight: 'bold' }];
 * const sx3 = false; // 무시됨
 *
 * const combinedSx = flatSx(sx1, sx2, sx3);
 * // 결과: [{ color: 'red' }, { fontSize: 16 }, { fontWeight: 'bold' }]
 * ```
 */
export function flatSx<T extends Theme = Theme>(
  ...sxArray: (SxProps<T> | undefined | false | null)[]
): SxProps<T> {
  const result = [] as any[];
  sxArray.forEach((item) => {
    if (item) {
      if (Array.isArray(item)) {
        item.forEach((it) => {
          if (it) {
            result.push(it);
          }
        });
      } else {
        result.push(item);
      }
    }
  });
  return result as SxProps<T>;
}

/**
 * 여러 SxProps 중 첫 번째 유효한 항목만 반환합니다.
 *
 * @param sxArray - SxProps 배열 (가변인자)
 * @returns 첫 번째 유효한 SxProps 또는 undefined
 *
 * @example
 * ```typescript
 * const sx1 = { color: 'red' };
 * const sx2 = { fontSize: 16 };
 * const sx3 = undefined;
 *
 * const firstOnly = firstSx(sx3, sx1, sx2);
 * // 결과: { color: 'red' } (sx1만 반환)
 * ```
 */
export function firstSx<T extends Theme = Theme>(...sxArray: (SxProps<T> | undefined)[]) {
  const arr = flatSx(...sxArray) as SxProps<T>[];
  return arr.length > 0 ? (arr[0] as SxProps<T>) : undefined;
}

/**
 * MUI Dialog의 높이를 설정하는 SxProps를 생성합니다.
 * 브라우저 높이에서 64px(헤더 높이)를 뺀 비율 기반 높이를 적용합니다.
 *
 * @param key - 높이 속성 키 ('height', 'minHeight', 'maxHeight')
 * @param heightInPercent - 비율 높이 (0-100 범위)
 * @returns MUI Dialog Paper에 적용할 SxProps 객체
 *
 * @example
 * ```typescript
 * // 전체 화면의 80% 높이로 설정
 * const dialogSx = sxDialogHeight('height', 80);
 *
 * // 최소 높이 50%로 설정
 * const minHeightSx = sxDialogHeight('minHeight', 50);
 *
 * <Dialog sx={dialogSx}>
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 * ```
 */
export const sxDialogHeight = (
  key: 'height' | 'minHeight' | 'maxHeight' = 'height',
  heightInPercent = 100,
) => {
  return {
    '& .MuiDialog-paperScrollPaper': {
      [key]: `calc(${heightInPercent}% - 64px)`,
    },
  };
};
