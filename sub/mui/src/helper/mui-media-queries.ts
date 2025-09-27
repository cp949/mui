import type { Breakpoint } from '@mui/material';
import type { AliasesCSSProperties, StandardCSSProperties } from '@mui/system';

/**
 * MUI 테마의 미디어 쿼리 기능을 위한 최소 타입 정의입니다.
 * breakpoints.down과 breakpoints.up 메서드를 포함합니다.
 */
type THEME = {
  breakpoints: {
    down: (breakpoint: Breakpoint) => string;
    up: (breakpoint: Breakpoint) => string;
  };
};

/**
 * xs 화면 크기 이하에서 적용될 CSS 스타일을 생성합니다.
 * 최대 너비 600px 이하의 디바이스에서 적용됩니다.
 *
 * @param theme - MUI 테마 객체 (breakpoints 속성 포함)
 * @param css - 적용할 CSS 스타일 객체
 * @returns 미디어 쿼리가 포함된 CSS 객체
 *
 * @example
 * ```typescript
 * const mobileStyles = xsOrDown(theme, {
 *   fontSize: '14px',
 *   padding: '8px'
 * });
 * ```
 */
export function xsOrDown(theme: THEME, css: AliasesCSSProperties | StandardCSSProperties) {
  return {
    // max-width: 600
    [theme.breakpoints.down('sm')]: css,
  };
}

/**
 * sm 화면 크기 이하에서 적용될 CSS 스타일을 생성합니다.
 * 최대 너비 900px 이하의 디바이스에서 적용됩니다.
 *
 * @param theme - MUI 테마 객체 (breakpoints 속성 포함)
 * @param css - 적용할 CSS 스타일 객체
 * @returns 미디어 쿼리가 포함된 CSS 객체
 *
 * @example
 * ```typescript
 * const tabletAndMobileStyles = smOrDown(theme, {
 *   flexDirection: 'column',
 *   gap: '16px'
 * });
 * ```
 */
export function smOrDown(theme: THEME, css: AliasesCSSProperties | StandardCSSProperties) {
  return {
    // max-width: 900
    [theme.breakpoints.down('md')]: css,
  };
}

/**
 * md 화면 크기 이하에서 적용될 CSS 스타일을 생성합니다.
 * 최대 너비 1200px 이하의 디바이스에서 적용됩니다.
 *
 * @param theme - MUI 테마 객체 (breakpoints 속성 포함)
 * @param css - 적용할 CSS 스타일 객체
 * @returns 미디어 쿼리가 포함된 CSS 객체
 *
 * @example
 * ```typescript
 * const mediumAndSmallerStyles = mdOrDown(theme, {
 *   gridTemplateColumns: '1fr',
 *   margin: '16px'
 * });
 * ```
 */
export function mdOrDown(theme: THEME, css: AliasesCSSProperties | StandardCSSProperties) {
  return {
    // max-width: 1200
    [theme.breakpoints.down('lg')]: css,
  };
}

/**
 * lg 화면 크기 이하에서 적용될 CSS 스타일을 생성합니다.
 * 최대 너비 1536px 이하의 디바이스에서 적용됩니다.
 *
 * @param theme - MUI 테마 객체 (breakpoints 속성 포함)
 * @param css - 적용할 CSS 스타일 객체
 * @returns 미디어 쿼리가 포함된 CSS 객체
 *
 * @example
 * ```typescript
 * const largeAndSmallerStyles = lgOrDown(theme, {
 *   maxWidth: '100%',
 *   padding: '20px'
 * });
 * ```
 */
export function lgOrDown(theme: THEME, css: AliasesCSSProperties | StandardCSSProperties) {
  return {
    // max-width: 1536
    [theme.breakpoints.down('xl')]: css,
  };
}

/**
 * sm 화면 크기 이상에서 적용될 CSS 스타일을 생성합니다.
 * 최소 너비 600px 이상의 디바이스에서 적용됩니다.
 *
 * @param theme - MUI 테마 객체 (breakpoints 속성 포함)
 * @param css - 적용할 CSS 스타일 객체
 * @returns 미디어 쿼리가 포함된 CSS 객체
 *
 * @example
 * ```typescript
 * const tabletAndDesktopStyles = smOrUp(theme, {
 *   display: 'flex',
 *   flexDirection: 'row'
 * });
 * ```
 */
export function smOrUp(theme: THEME, css: AliasesCSSProperties | StandardCSSProperties) {
  return {
    // min-width: 600
    [theme.breakpoints.up('sm')]: css,
  };
}

/**
 * md 화면 크기 이상에서 적용될 CSS 스타일을 생성합니다.
 * 최소 너비 900px 이상의 디바이스에서 적용됩니다.
 *
 * @param theme - MUI 테마 객체 (breakpoints 속성 포함)
 * @param css - 적용할 CSS 스타일 객체
 * @returns 미디어 쿼리가 포함된 CSS 객체
 *
 * @example
 * ```typescript
 * const desktopStyles = mdOrUp(theme, {
 *   gridTemplateColumns: 'repeat(3, 1fr)',
 *   gap: '24px'
 * });
 * ```
 */
export function mdOrUp(theme: THEME, css: AliasesCSSProperties | StandardCSSProperties) {
  return {
    // min-width: 900
    [theme.breakpoints.up('md')]: css,
  };
}

/**
 * lg 화면 크기 이상에서 적용될 CSS 스타일을 생성합니다.
 * 최소 너비 1200px 이상의 디바이스에서 적용됩니다.
 *
 * @param theme - MUI 테마 객체 (breakpoints 속성 포함)
 * @param css - 적용할 CSS 스타일 객체
 * @returns 미디어 쿼리가 포함된 CSS 객체
 *
 * @example
 * ```typescript
 * const largeDesktopStyles = lgOrUp(theme, {
 *   maxWidth: '1200px',
 *   margin: '0 auto'
 * });
 * ```
 */
export function lgOrUp(theme: THEME, css: AliasesCSSProperties | StandardCSSProperties) {
  return {
    // min-width: 1200
    [theme.breakpoints.up('lg')]: css,
  };
}

/**
 * xl 화면 크기 이상에서 적용될 CSS 스타일을 생성합니다.
 * 최소 너비 1536px 이상의 대형 디스플레이에서 적용됩니다.
 *
 * @param theme - MUI 테마 객체 (breakpoints 속성 포함)
 * @param css - 적용할 CSS 스타일 객체
 * @returns 미디어 쿼리가 포함된 CSS 객체
 *
 * @example
 * ```typescript
 * const extraLargeStyles = xlOrUp(theme, {
 *   gridTemplateColumns: 'repeat(4, 1fr)',
 *   padding: '40px'
 * });
 * ```
 */
export function xlOrUp(theme: THEME, css: AliasesCSSProperties | StandardCSSProperties) {
  return {
    // min-width: 1500
    [theme.breakpoints.up('xl')]: css,
  };
}
