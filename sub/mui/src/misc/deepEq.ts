/**
 * 두 값을 깊이 비교하여 동등성을 확인합니다.
 * 객체, 배열, 기본 값을 모두 재귀적으로 비교합니다.
 *
 * @param a - 비교할 첫 번째 값
 * @param b - 비교할 두 번째 값
 * @returns 두 값이 깊이 동등하면 true, 아니면 false
 *
 * @example
 * ```typescript
 * // 기본 값 비교
 * deepEq(1, 1); // true
 * deepEq('hello', 'hello'); // true
 *
 * // 객체 비교
 * deepEq({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * deepEq({ a: 1 }, { a: 1, b: 2 }); // false
 *
 * // 배열 비교
 * deepEq([1, 2, 3], [1, 2, 3]); // true
 * deepEq([1, [2, 3]], [1, [2, 3]]); // true (중첹 배열)
 *
 * // 중첹 객체 비교
 * deepEq(
 *   { user: { name: 'John', age: 30 } },
 *   { user: { name: 'John', age: 30 } }
 * ); // true
 * ```
 */
export function deepEq<T>(a: T, b: T): boolean {
  if (a === b) {
    return true; // 같은 참조를 가리키면 true
  }

  const t1 = typeof a;
  const t2 = typeof b;
  if (t1 !== t2) {
    // 타입이 다르면 false
    return false;
  }

  if (t1 !== 'object' || a === null || b === null) {
    return false; // 하나가 null이거나 객체가 아닌 경우 false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => deepEq(item, b[index]));
  }

  const aKeys = Object.keys(a as any) as Array<keyof T>;
  const bKeys = Object.keys(b as any) as Array<keyof T>;

  if (aKeys.length !== bKeys.length) {
    return false; // 속성의 개수가 다르면 false
  }

  return aKeys.every((key) => deepEq((a as any)[key], (b as any)[key]));
}
