/**
 * 타입 V의 값을 문자열로 인코딩하고 문자열에서 디코딩할 수 있는 코덱 인터페이스입니다.
 * 로컬 스토리지나 세션 스토리지에 데이터를 저장할 때 사용됩니다.
 *
 * @typeParam V - 인코딩/디코딩될 값의 타입
 *
 * @example
 * ```typescript
 * const dateCodec: Codec<Date> = {
 *   parse: (value: string) => new Date(value),
 *   stringify: (value: Date) => value.toISOString()
 * };
 * ```
 */
export interface Codec<V> {
  /**
   * 문자열 값을 타입 V의 값으로 디코딩합니다.
   *
   * @param value - 디코딩할 문자열 값
   * @returns 디코딩된 값
   */
  parse: (value: string) => V;
  /**
   * 타입 V의 값을 문자열로 인코딩합니다.
   *
   * @param value - 인코딩할 값
   * @returns 인코딩된 문자열 값
   */
  stringify: (value: V) => string;
}

/**
 * Date 객체를 문자열로 인코딩/디코딩하는 코덱입니다.
 * ISO 8601 형식으로 날짜와 시간을 저장합니다.
 *
 * @example
 * ```typescript
 * const [date, setDate] = useStorageState(
 *   localStorage,
 *   'selected-date',
 *   new Date(),
 *   { codec: CODEC_DATE }
 * );
 * ```
 */
export const CODEC_DATE: Codec<Date> = {
  parse: (value) => new Date(value),
  stringify: (value) => value.toISOString(),
};

/**
 * Date 객체를 날짜 부분만 포함하여 문자열로 인코딩/디코딩하는 코덱입니다.
 * 시간 정보는 제외하고 YYYY-MM-DD 형식만 저장합니다.
 *
 * @example
 * ```typescript
 * const [birthDate, setBirthDate] = useStorageState(
 *   localStorage,
 *   'birth-date',
 *   new Date(),
 *   { codec: CODEC_DATE_ONLY }
 * );
 * ```
 */
export const CODEC_DATE_ONLY: Codec<Date> = {
  parse: (value) => new Date(value),
  stringify: (value) => value.toISOString().split('T')[0],
};

/**
 * 숫자를 문자열로 인코딩/디코딩하는 코덱입니다.
 *
 * @example
 * ```typescript
 * const [count, setCount] = useStorageState(
 *   localStorage,
 *   'counter',
 *   0,
 *   { codec: CODEC_NUMBER }
 * );
 * ```
 */
export const CODEC_NUMBER: Codec<number> = {
  parse: (value) => Number(value),
  stringify: (value) => String(value),
};

/**
 * 불리언 값을 문자열로 인코딩/디코딩하는 코덱입니다.
 *
 * @example
 * ```typescript
 * const [isEnabled, setIsEnabled] = useStorageState(
 *   localStorage,
 *   'feature-enabled',
 *   false,
 *   { codec: CODE_BOOLEAN }
 * );
 * ```
 */
export const CODE_BOOLEAN: Codec<boolean> = {
  parse: (value) => value === 'true',
  stringify: (value) => String(value),
};

/**
 * JSON 값을 문자열로 인코딩/디코딩하는 코덱입니다.
 * 파싱 오류가 발생하면 null을 반환합니다.
 *
 * @example
 * ```typescript
 * const [settings, setSettings] = useStorageState(
 *   localStorage,
 *   'app-settings',
 *   { theme: 'light', language: 'ko' },
 *   { codec: CODEC_JSON }
 * );
 * ```
 */
export const CODEC_JSON: Codec<unknown> = {
  parse: (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
  stringify: (value) => JSON.stringify(value),
};

/**
 * JSON 값을 문자열로 인코딩/디코딩하는 엄격한 코덱입니다.
 * JSON 값이 유효하지 않으면 파싱에 실패하고 예외를 발생시킵니다.
 *
 * @example
 * ```typescript
 * try {
 *   const [config, setConfig] = useStorageState(
 *     localStorage,
 *     'strict-config',
 *     { api: 'v1' },
 *     { codec: CODEC_JSON_STRICT }
 *   );
 * } catch (error) {
 *   console.error('설정 로드 실패:', error);
 * }
 * ```
 */
export const CODEC_JSON_STRICT: Codec<unknown> = {
  parse: (value) => JSON.parse(value),
  stringify: (value) => JSON.stringify(value),
};

/**
 * 문자열을 그대로 통과시키는 기본 코덱입니다.
 * 반환된 값을 그대로 사용합니다.
 *
 * @example
 * ```typescript
 * const [username, setUsername] = useStorageState(
 *   localStorage,
 *   'username',
 *   '',
 *   { codec: CODEC_STRING }
 * );
 * // 또는 기본값으로 사용
 * const [username, setUsername] = useStorageState(localStorage, 'username', '');
 * ```
 */
export const CODEC_STRING: Codec<string> = {
  parse: (value) => value,
  stringify: (value) => value,
};
