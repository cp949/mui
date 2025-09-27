import { alpha as muiAlpha } from '@mui/material';

/**
 * 숫자 값을 지정된 범위 내로 제한합니다.
 *
 * @param value - 제한할 값
 * @param min - 최소값
 * @param max - 최대값
 * @returns min과 max 사이로 제한된 값
 *
 * @example
 * ```typescript
 * clamp(5, 0, 10);   // 5
 * clamp(-1, 0, 10);  // 0
 * clamp(15, 0, 10);  // 10
 * ```
 */
function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    return clamp(value, max, min);
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * MUI 팔레트 색상의 CSS 변수 채널 문자열을 생성합니다.
 * 채널 변수는 RGB 값들을 공백으로 구분한 형태로 저장되는 CSS 변수입니다.
 *
 * @param paletteName - MUI 팔레트 색상 이름
 * @param shade - 색상 단계 (기본값: 'main')
 * @returns CSS 채널 변수 문자열
 *
 * @example
 * ```typescript
 * colorChannel('primary', 'dark');
 * // 결과: "var(--mui-palette-primary-darkChannel)"
 *
 * colorChannel('secondary');
 * // 결과: "var(--mui-palette-secondary-mainChannel)"
 *
 * // RGBA 함수와 함께 사용
 * const semiTransparent = `rgba(${colorChannel('primary')}/0.5)`;
 * ```
 */
export function colorChannel(
  paletteName: 'primary' | 'secondary' | 'warning' | 'info' | 'error' | 'success' | 'warning',
  shade: 'main' | 'light' | 'dark' | 'contrastText' = 'main',
): string {
  return `var(--mui-palette-${paletteName}-${shade}Channel)`;
}

/**
 * MUI 팔레트 색상의 CSS 변수 문자열을 생성합니다.
 * 색상 변수는 완전한 색상 값을 담고 있는 CSS 변수입니다.
 *
 * @param paletteName - MUI 팔레트 색상 이름
 * @param shade - 색상 단계 (기본값: 'main')
 * @returns CSS 색상 변수 문자열
 *
 * @example
 * ```typescript
 * const primaryColor = color('primary', 'light');
 * // 결과: "var(--mui-palette-primary-light)"
 *
 * const defaultColor = color('secondary');
 * // 결과: "var(--mui-palette-secondary-main)"
 *
 * // CSS에서 사용
 * const styles = {
 *   backgroundColor: color('primary'),
 *   color: color('primary', 'contrastText')
 * };
 * ```
 */
export function color(
  paletteName: 'primary' | 'secondary' | 'warning' | 'info' | 'error' | 'success' | 'warning',
  shade: 'main' | 'light' | 'dark' | 'contrastText' = 'main',
) {
  return `var(--mui-palette-${paletteName}-${shade})`;
}

/**
 * MUI 팔레트 색상의 RGBA CSS 문자열을 생성합니다.
 * CSS 채널 변수를 사용하여 투명도를 지정한 RGBA 색상을 만듭니다.
 *
 * @param paletteName - MUI 팔레트 색상 이름
 * @param shade - 색상 단계 ('main', 'light', 'dark', 'contrastText')
 * @param alpha - 투명도 값 (0.0~1.0 범위)
 * @returns RGBA CSS 문자열
 *
 * @example
 * ```typescript
 * const semiTransparent = rgba('primary', 'main', 0.5);
 * // 결과: "rgba(var(--mui-palette-primary-mainChannel)/0.5)"
 *
 * const lightOverlay = rgba('secondary', 'light', 0.1);
 * // 결과: "rgba(var(--mui-palette-secondary-lightChannel)/0.1)"
 *
 * // CSS에서 사용
 * const styles = {
 *   backgroundColor: rgba('primary', 'main', 0.1),
 *   borderColor: rgba('error', 'main', 0.5)
 * };
 * ```
 */
export function rgba(
  paletteName: 'primary' | 'secondary' | 'warning' | 'info' | 'error' | 'success' | 'warning',
  shade: 'main' | 'light' | 'dark' | 'contrastText',
  alpha: number,
) {
  return `rgba(var(--mui-palette-${paletteName}-${shade}Channel)/${alpha})`;
}

type ApplyAlphaFn = (color: string, opacity: number) => string;
// const sss = (c: string, alpha: ApplyAlphaFn) => `0px 2px 1px -1px ${alpha(c, 0.2)},0px 1px 1px 0px ${alpha(c, 0.14)},0px 1px 3px 0px ${alpha(c, 0.12)}`;

// copy from https://mui.com/material-ui/customization/default-theme/
// shadow 23개
const PREDEFINED_SHADOWS = [
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 2px 1px -1px ${alpha(c, 0.2)},0px 1px 1px 0px ${alpha(c, 0.14)},0px 1px 3px 0px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 3px 1px -2px ${alpha(c, 0.2)},0px 2px 2px 0px ${alpha(c, 0.14)},0px 1px 5px 0px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 3px 3px -2px ${alpha(c, 0.2)},0px 3px 4px 0px ${alpha(c, 0.14)},0px 1px 8px 0px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 2px 4px -1px ${alpha(c, 0.2)},0px 4px 5px 0px ${alpha(c, 0.14)},0px 1px 10px 0px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 3px 5px -1px ${alpha(c, 0.2)},0px 5px 8px 0px ${alpha(c, 0.14)},0px 1px 14px 0px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 3px 5px -1px ${alpha(c, 0.2)},0px 6px 10px 0px ${alpha(c, 0.14)},0px 1px 18px 0px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 4px 5px -2px ${alpha(c, 0.2)},0px 7px 10px 1px ${alpha(c, 0.14)},0px 2px 16px 1px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 5px 5px -3px ${alpha(c, 0.2)},0px 8px 10px 1px ${alpha(c, 0.14)},0px 3px 14px 2px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 5px 6px -3px ${alpha(c, 0.2)},0px 9px 12px 1px ${alpha(c, 0.14)},0px 3px 16px 2px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 6px 6px -3px ${alpha(c, 0.2)},0px 10px 14px 1px ${alpha(c, 0.14)},0px 4px 18px 3px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 6px 7px -4px ${alpha(c, 0.2)},0px 11px 15px 1px ${alpha(c, 0.14)},0px 4px 20px 3px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 7px 8px -4px ${alpha(c, 0.2)},0px 12px 17px 2px ${alpha(c, 0.14)},0px 5px 22px 4px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 7px 8px -4px ${alpha(c, 0.2)},0px 13px 19px 2px ${alpha(c, 0.14)},0px 5px 24px 4px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 7px 9px -4px ${alpha(c, 0.2)},0px 14px 21px 2px ${alpha(c, 0.14)},0px 5px 26px 4px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 8px 9px -5px ${alpha(c, 0.2)},0px 15px 22px 2px ${alpha(c, 0.14)},0px 6px 28px 5px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 8px 10px -5px ${alpha(c, 0.2)},0px 16px 24px 2px ${alpha(c, 0.14)},0px 6px 30px 5px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 8px 11px -5px ${alpha(c, 0.2)},0px 17px 26px 2px ${alpha(c, 0.14)},0px 6px 32px 5px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 9px 11px -5px ${alpha(c, 0.2)},0px 18px 28px 2px ${alpha(c, 0.14)},0px 7px 34px 6px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 9px 12px -6px ${alpha(c, 0.2)},0px 19px 29px 2px ${alpha(c, 0.14)},0px 7px 36px 6px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 10px 13px -6px ${alpha(c, 0.2)},0px 20px 31px 3px ${alpha(c, 0.14)},0px 8px 38px 7px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 10px 13px -6px ${alpha(c, 0.2)},0px 21px 33px 3px ${alpha(c, 0.14)},0px 8px 40px 7px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 10px 14px -6px ${alpha(c, 0.2)},0px 22px 35px 3px ${alpha(c, 0.14)},0px 8px 42px 7px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 11px 14px -7px ${alpha(c, 0.2)},0px 23px 36px 3px ${alpha(c, 0.14)},0px 9px 44px 8px ${alpha(c, 0.12)}`,
  (c: string, alpha: ApplyAlphaFn) =>
    `0px 11px 15px -7px ${alpha(c, 0.2)},0px 24px 38px 3px ${alpha(c, 0.14)},0px 9px 46px 8px ${alpha(c, 0.12)}`,
];

/**
 * 지정된 인덱스와 색상으로 MUI 그림자 값을 생성합니다.
 * MUI의 미리 정의된 그림자 패턴을 사용합니다.
 *
 * @param index - 그림자 레벨 (0-24 범위, 0은 그림자 없음)
 * @param hexColor - 그림자 색상 (16진수 색상 코드, 기본값: '#000')
 * @returns 그림자 CSS 값 문자열 또는 'none'
 *
 * @example
 * ```typescript
 * const shadow1 = shadowValue(1);
 * // 결과: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
 *
 * const redShadow = shadowValue(4, '#ff0000');
 * // 결과: 빨간색 그림자
 *
 * const noShadow = shadowValue(0);
 * // 결과: "none"
 * ```
 */
export function shadowValue(index: number, hexColor = '#000'): string {
  const idx = clamp(index, 0, PREDEFINED_SHADOWS.length - 1);
  if (idx === 0) {
    return 'none';
  }
  return PREDEFINED_SHADOWS[idx - 1]?.(hexColor, muiAlpha) || 'none';
}

/**
 * MUI 팔레트 색상을 사용하여 그림자 CSS 값을 생성합니다.
 * CSS 변수를 사용하여 동적으로 색상이 적용되는 그림자를 만듭니다.
 *
 * @param paletteName - MUI 팔레트 색상 이름
 * @param shade - 색상 단계
 * @param index - 그림자 레벨 (0-24 범위)
 * @returns CSS 변수를 사용한 그림자 값 또는 'none'
 *
 * @example
 * ```typescript
 * const primaryShadow = shadow('primary', 'main', 2);
 * // 결과: CSS 변수를 사용한 그림자
 *
 * const errorShadow = shadow('error', 'dark', 4);
 * // 결과: 에러 색상의 짙은 그림자
 *
 * // CSS에서 사용
 * const cardStyles = {
 *   boxShadow: shadow('primary', 'main', 3)
 * };
 * ```
 */
export function shadow(
  paletteName: 'primary' | 'secondary' | 'warning' | 'info' | 'error' | 'success' | 'warning',
  shade: 'main' | 'light' | 'dark' | 'contrastText',
  index: number,
): string {
  //ex: --mui-palette-primary-mainChannel
  const cssVar = `var(--mui-palette-${paletteName}-${shade}Channel)`;

  const idx = clamp(index, 0, PREDEFINED_SHADOWS.length - 1);
  if (idx === 0) {
    return 'none';
  }

  // ex: channelVar: 244 24 23, opacity: 0.2
  const alphaFn = (channelVar: string, opacity: number) => `rgba(${channelVar}/${opacity})`;

  return PREDEFINED_SHADOWS[idx - 1]?.(cssVar, alphaFn) || 'none';
}
