/**
 * 커스텀 타임아웃을 설정합니다.
 * 음수 값이 전달되면 0으로 조정합니다.
 *
 * @param callback - 실행할 콜백 함수
 * @param timeout - 지연 시간(밀리초), 음수이면 0으로 설정
 *
 * @example
 * ```typescript
 * setCustomTimeout(() => console.log('실행'), 1000); // 1초 후 실행
 * setCustomTimeout(() => console.log('즉시 실행'), -1); // 즉시 실행
 * ```
 */
const setCustomTimeout = (callback: () => any, timeout: number) => {
  setTimeout(
    () => {
      callback();
    },
    timeout < 0 ? 0 : timeout,
  );
};

/**
 * 주어진 요소에서 CSS 셀렉터로 요소를 찾습니다.
 *
 * @param el - 검색할 부모 요소 또는 Document
 * @param selector - CSS 셀렉터 문자열
 * @returns 찾은 요소 또는 null
 *
 * @example
 * ```typescript
 * const parent = document.getElementById('container');
 * const child = queryElement(parent, '.child-class');
 * if (child) {
 *   console.log('자식 요소를 찾았습니다');
 * }
 * ```
 */
const queryElement = (
  el: HTMLElement | Document | null | undefined,
  selector: string,
): Element | null => {
  if (!el) return null;
  return el.querySelector(selector);
};

/**
 * 지정된 셋렉터에 매칭되는 요소에 포커스를 요청합니다.
 *
 * @param parent - 검색할 부모 요소 또는 Document
 * @param selector - 포커스를 설정할 요소의 CSS 셀렉터
 * @param delay - 지연 시간(밀리초), -1이면 지연 없이 실행
 *
 * @example
 * ```typescript
 * // 모달 열린 후 첫 번째 인푸트에 포커스
 * requestFocusSelector(document, '#modal input:first-child', 200);
 *
 * // 지연 없이 즉시 포커스
 * requestFocusSelector(parentElement, '.focus-target');
 * ```
 */
export const requestFocusSelector = (
  parent: HTMLElement | Document | undefined | null,
  selector: string,
  delay = -1,
) => {
  if (!parent) return;
  setCustomTimeout(() => {
    const elem = parent.querySelector<HTMLInputElement>(selector);
    elem?.focus();
  }, delay);
};

/**
 * 지정된 셀렉터에 매칭되는 요소를 찾고 콜백을 실행합니다.
 *
 * @param el - 검색할 부모 요소 또는 Document
 * @param selector - 찾을 요소의 CSS 셀렉터
 * @param callback - 요소를 찾았을 때 실행할 콜백 함수
 * @param timeout - 지연 시간(밀리초), -1이면 지연 없이 실행
 *
 * @example
 * ```typescript
 * // 로딩 후 요소에 스타일 적용
 * requestSelector(document, '.loading-complete', (element) => {
 *   element.style.opacity = '1';
 * }, 500);
 *
 * // 지연 없이 실행
 * requestSelector(container, '.target', (el) => el.click());
 * ```
 */
export const requestSelector = (
  el: HTMLElement | Document | null | undefined,
  selector: string,
  callback: (elemnt: HTMLElement) => any,
  timeout = -1,
) => {
  setCustomTimeout(() => {
    const element = queryElement(el, selector);
    if (element) {
      callback(element as HTMLElement);
    }
  }, timeout);
};

/**
 * 현재 브라우저가 Web Serial API를 지원하는지 확인합니다.
 *
 * @returns Web Serial API를 지원하면 true
 *
 * @example
 * ```typescript
 * if (isWebSerialSupportBrowser()) {
 *   console.log('시리얼 통신을 사용할 수 있습니다');
 *   // Serial API 사용 코드
 * } else {
 *   console.log('시리얼 API가 지원되지 않습니다');
 * }
 * ```
 */
export function isWebSerialSupportBrowser(): boolean {
  return window.navigator && 'serial' in window.navigator;
}

/**
 * 현재 디바이스가 터치를 지원하는지 확인합니다.
 *
 * @returns 터치 디바이스이면 true
 *
 * @example
 * ```typescript
 * if (isTouchDevice()) {
 *   console.log('터치 인터렉션을 지원합니다');
 *   // 터치 전용 UI 표시
 * } else {
 *   console.log('데스크톱 디바이스입니다');
 *   // 마우스/키보드 UI 표시
 * }
 * ```
 */
export function isTouchDevice(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

/**
 * 요소가 셀렉터와 일치하거나 조상 요소 중에 일치하는 요소를 찾습니다.
 *
 * @param target - 검색을 시작할 요소
 * @param selector - 매칭할 CSS 셀렉터
 * @returns 매칭되는 요소 또는 undefined
 *
 * @example
 * ```typescript
 * const button = document.querySelector('button');
 * const clickableArea = matchesOrClosest<HTMLElement>(button, '.clickable');
 *
 * if (clickableArea) {
 *   console.log('클릭 가능한 영역을 찾았습니다');
 * }
 * ```
 */
export function matchesOrClosest<T extends HTMLElement>(
  target: Element,
  selector: string,
): T | undefined {
  const found = target.matches(selector) ? target : target.closest(selector);
  if (found) {
    return found as T;
  }
  return undefined;
}

/**
 * DOM 요소의 절대 위치를 계산합니다.
 * 뷰포트 기준이 아닌 문서 전체 기준의 좌표를 반환합니다.
 *
 * @param element - 위치를 계산할 HTML 요소
 * @returns 요소의 절대 x, y 좌표를 포함한 객체
 *
 * @example
 * ```typescript
 * const element = document.getElementById('myElement');
 * const position = getAbsolutePosition(element);
 * console.log(`위치: ${position.x}, ${position.y}`);
 *
 * // 툰팩 위치 지정
 * tooltip.style.left = `${position.x}px`;
 * tooltip.style.top = `${position.y + element.offsetHeight}px`;
 * ```
 */
export function getAbsolutePosition(element: HTMLElement): {
  x: number;
  y: number;
} {
  // 요소의 bounding rectangle을 가져옵니다.
  const rect = element.getBoundingClientRect();

  // 페이지의 스크롤 위치를 가져옵니다.
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // 절대 위치를 계산합니다.
  const top = rect.top + scrollTop;
  const left = rect.left + scrollLeft;

  return { x: left, y: top };
}

/**
 * 현재 환경이 브라우저 환경인지 나타내는 상수입니다.
 *
 * @example
 * ```typescript
 * if (isBrowser) {
 *   console.log('브라우저에서 실행 중');
 *   // DOM 조작 코드
 * } else {
 *   console.log('서버 사이드 렌더링');
 * }
 * ```
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Navigator 객체가 사용 가능한지 나타내는 상수입니다.
 *
 * @example
 * ```typescript
 * if (isNavigator) {
 *   console.log('브라우저 정보:', navigator.userAgent);
 *   console.log('언어:', navigator.language);
 * }
 * ```
 */
export const isNavigator = typeof navigator !== 'undefined';

/**
 * 아무 작업도 수행하지 않는 빈 함수입니다.
 * 콜백 함수의 기본값이나 플레이스홀더로 사용됩니다.
 *
 * @example
 * ```typescript
 * const options = {
 *   onSuccess: callback || noop,
 *   onError: errorCallback || noop
 * };
 *
 * // 또는 기본값으로 사용
 * function processData(data: any[], onComplete = noop) {
 *   // 데이터 처리
 *   onComplete();
 * }
 * ```
 */
export const noop = () => {};
