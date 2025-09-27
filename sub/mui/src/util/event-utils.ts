/**
 * Tab 키 이벤트인지 확인합니다 (Shift 키 없이).
 *
 * @param e - React 키보드 이벤트 객체
 * @returns Tab 키가 눌렸고 Shift가 눌렸지 않으면 true
 *
 * @example
 * ```typescript
 * const handleKeyDown = (e: React.KeyboardEvent) => {
 *   if (isTabKeyEvent(e)) {
 *     console.log('다음 필드로 이동');
 *   }
 * };
 * ```
 */
export const isTabKeyEvent = (e: React.KeyboardEvent): boolean => {
  return !e.shiftKey && e.key === 'Tab';
};

/**
 * Enter 또는 Tab 키 이벤트인지 확인합니다.
 *
 * @param e - React 키보드 이벤트 객체
 * @returns Enter 키 또는 Tab 키(시프트 없이)가 눌렸으면 true
 *
 * @example
 * ```typescript
 * const handleKeyDown = (e: React.KeyboardEvent) => {
 *   if (isEnterOrTabKeyEvent(e)) {
 *     // 폼 제출 또는 다음 필드로 이동
 *     console.log('다음 단계로 진행');
 *   }
 * };
 * ```
 */
export const isEnterOrTabKeyEvent = (e: React.KeyboardEvent): boolean => {
  return e.key === 'Enter' || (!e.shiftKey && e.key === 'Tab');
};

/**
 * Enter 키 이벤트인지 확인합니다.
 *
 * @param e - React 키보드 이벤트 객체
 * @returns Enter 키가 눌렸으면 true
 *
 * @example
 * ```typescript
 * const handleKeyDown = (e: React.KeyboardEvent) => {
 *   if (isEnterKeyEvent(e)) {
 *     e.preventDefault();
 *     submitForm();
 *   }
 * };
 * ```
 */
export const isEnterKeyEvent = (e: React.KeyboardEvent): boolean => {
  return e.key === 'Enter';
};

/**
 * Escape 키 이벤트인지 확인합니다.
 *
 * @param e - React 키보드 이벤트 객체
 * @returns Escape 키가 눌렸으면 true
 *
 * @example
 * ```typescript
 * const handleKeyDown = (e: React.KeyboardEvent) => {
 *   if (isEscapeKeyEvent(e)) {
 *     closeModal();
 *   }
 * };
 * ```
 */
export const isEscapeKeyEvent = (e: React.KeyboardEvent): boolean => {
  return e.key === 'Escape';
};

/**
 * 이벤트가 터치 이벤트인지 확인합니다.
 *
 * @param event - 확인할 마우스 또는 터치 이벤트
 * @returns 터치 이벤트이면 true, 마우스 이벤트이면 false
 *
 * @example
 * ```typescript
 * const handlePointerEvent = (event: MouseEvent | TouchEvent) => {
 *   if (isTouchEvent(event)) {
 *     console.log('터치 좌표:', event.touches[0].clientX, event.touches[0].clientY);
 *   }
 * };
 * ```
 */
export const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  return Boolean((event as TouchEvent).touches && (event as TouchEvent).touches.length);
};

/**
 * 이벤트가 마우스 이벤트인지 확인합니다.
 *
 * @param event - 확인할 마우스 또는 터치 이벤트
 * @returns 마우스 이벤트이면 true, 터치 이벤트이면 false
 *
 * @example
 * ```typescript
 * const handlePointerEvent = (event: MouseEvent | TouchEvent) => {
 *   if (isMouseEvent(event)) {
 *     console.log('마우스 좌표:', event.clientX, event.clientY);
 *   }
 * };
 * ```
 */
export const isMouseEvent = (event: MouseEvent | TouchEvent): event is MouseEvent => {
  return Boolean(
    ((event as MouseEvent).clientX || (event as MouseEvent).clientX === 0) &&
      ((event as MouseEvent).clientY || (event as MouseEvent).clientY === 0),
  );
};

/**
 * 이벤트의 타겟 요소에서 포커스를 제거합니다.
 *
 * @param event - 포커스를 제거할 이벤트 객체
 * @param delay - 지연 시간(밀리초), -1이면 지연 없이 즉시 실행
 *
 * @example
 * ```typescript
 * const handleSubmit = (event: React.FormEvent) => {
 *   // 폼 제출 후 버튼에서 포커스 제거
 *   blurEventTarget(event, 100);
 * };
 *
 * // 지연 없이 즉시 포커스 제거
 * blurEventTarget(event);
 * ```
 */
export const blurEventTarget = (event: any, delay = -1) => {
  const target = event.target;
  if (!target) return;
  if (typeof target !== 'object') return;
  if (typeof target['blur'] !== 'function') return;
  if (delay >= 0) {
    setTimeout(() => {
      event.target.blur();
    }, delay);
  } else {
    event.target.blur();
  }
};
