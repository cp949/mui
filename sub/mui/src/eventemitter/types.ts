/**
 * 유효한 이벤트 타입을 정의합니다.
 * 문자열, 심볼, 또는 이벤트 맵을 나타내는 객체가 될 수 있습니다.
 *
 * 객체 타입의 경우 다음 형태 중 하나를 사용해야 합니다:
 *
 * @example
 * ```typescript
 * interface EventTypes {
 *   'data-received': [string, number]; // 매개변수 배열
 *   'user-click': (x: number, y: number) => void; // 핸들러 함수 시그니처
 *   'simple-event': []; // 매개변수 없는 이벤트
 * }
 * ```
 */
export type ValidEventTypes = string | symbol | object;

/**
 * 이벤트 타입에서 이벤트 이름을 추출합니다.
 * 문자열이나 심볼의 경우 그대로 사용하고,
 * 객체의 경우 키들을 사용합니다.
 *
 * @example
 * ```typescript
 * type Names1 = EventNames<'click' | 'hover'>; // 'click' | 'hover'
 * type Names2 = EventNames<{ click: [], hover: [number] }>; // 'click' | 'hover'
 * ```
 */
export type EventNames<T extends ValidEventTypes> = T extends string | symbol ? T : keyof T;

/**
 * 이벤트 타입 객체에서 각 이벤트의 인수 타입을 추출합니다.
 * 함수 시그니처인 경우 Parameters를 사용하고,
 * 배열인 경우 그대로 사용합니다.
 *
 * @example
 * ```typescript
 * type EventMap = {
 *   click: (x: number, y: number) => void;
 *   data: [string, boolean];
 * };
 * type Args = ArgumentMap<EventMap>;
 * // {
 * //   click: [number, number];
 * //   data: [string, boolean];
 * // }
 * ```
 */
export type ArgumentMap<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => void
    ? Parameters<T[K]>
    : T[K] extends any[]
      ? T[K]
      : any[];
};

/**
 * 이벤트 리스너 함수의 타입을 정의합니다.
 * 이벤트 타입과 이벤트 이름에 따라 적절한 매개변수 타입을 추론합니다.
 *
 * @example
 * ```typescript
 * type EventMap = {
 *   click: [number, number];
 *   message: [string];
 * };
 *
 * type ClickListener = EventListener<EventMap, 'click'>;
 * // (x: number, y: number) => void
 *
 * type MessageListener = EventListener<EventMap, 'message'>;
 * // (msg: string) => void
 * ```
 */
export type EventListener<T extends ValidEventTypes, K extends EventNames<T>> = T extends
  | string
  | symbol
  ? (...args: any[]) => void
  : (...args: ArgumentMap<Exclude<T, string | symbol>>[Extract<K, keyof T>]) => void;

/**
 * 이벤트 리스너의 매개변수 타입을 추출합니다.
 * EventListener의 Parameters를 사용하여 간단하게 인수 타입을 가져옵니다.
 *
 * @example
 * ```typescript
 * type EventMap = { click: [number, number] };
 * type ClickArgs = EventArgs<EventMap, 'click'>; // [number, number]
 * ```
 */
export type EventArgs<T extends ValidEventTypes, K extends EventNames<T>> = Parameters<
  EventListener<T, K>
>;
