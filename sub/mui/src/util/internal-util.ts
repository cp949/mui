/**
 * 값이 null 또는 undefined인지 확인합니다.
 *
 * @param v - 확인할 값
 * @returns 값이 null 또는 undefined이면 true
 *
 * @example
 * ```typescript
 * const value: string | null | undefined = getValue();
 * if (isNil(value)) {
 *   console.log('값이 비어있습니다');
 * } else {
 *   console.log('값이 존재합니다:', value);
 * }
 * ```
 */
export function isNil<T extends Exclude<any, null | undefined>>(
  v?: null | T,
): v is null | undefined {
  return typeof v === 'undefined' || v === null;
}

/**
 * 값이 null도 undefined도 아닌지 확인합니다.
 *
 * @param v - 확인할 값
 * @returns 값이 null도 undefined도 아니면 true
 *
 * @example
 * ```typescript
 * const value: string | null | undefined = getValue();
 * if (isNotNil(value)) {
 *   // 이 블록에서 value는 string 타입으로 좌혀짐
 *   console.log('문자열 길이:', value.length);
 * }
 * ```
 */
export function isNotNil<T extends Exclude<any, null | undefined>>(
  v?: null | T,
): v is Exclude<T, null | undefined> {
  return !isNil(v);
}

/**
 * 객체가 빈 객체(속성이 없는 객체)인지 확인합니다.
 *
 * @param value - 확인할 객체
 * @returns 객체가 비어있으면 true
 *
 * @example
 * ```typescript
 * const emptyObj = {};
 * const nonEmptyObj = { name: 'John' };
 *
 * console.log(isEmptyObject(emptyObj));    // true
 * console.log(isEmptyObject(nonEmptyObj)); // false
 * ```
 */
export function isEmptyObject(value: object) {
  for (const _ in value) {
    return false;
  }
  return true;
}
