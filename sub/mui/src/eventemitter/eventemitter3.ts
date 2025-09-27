// copy from https://github.com/primus/eventemitter3/blob/master/index.js

import type { EventArgs, EventListener, EventNames, ValidEventTypes } from './types.js';

/**
 * 이벤트 리스너의 정보를 저장하는 내부 인터페이스입니다.
 */
interface ListenerHolder {
  /** 리스너 함수 */
  fn: (...args: any[]) => void;
  /** 리스너가 실행될 컨텍스트 */
  context?: any;
  /** 한 번만 실행되는지 여부 */
  once?: boolean;
}

/**
 * 이벤트 리스너를 내부적으로 추가하는 헬퍼 함수입니다.
 *
 * @param emitter - 이벤트 에미터 인스턴스
 * @param event - 이벤트 이름
 * @param fn - 리스너 함수
 * @param context - 실행 컨텍스트
 * @param once - 한 번만 실행여부
 */
function addListener_(
  emitter: any,
  event: any,
  fn: (...args: any[]) => void,
  context: any | undefined,
  once?: boolean,
) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  const listener: ListenerHolder = {
    fn,
    context: context || emitter,
    once,
  };
  const evt = event;

  if (!emitter._events[evt]) {
    emitter._events[evt] = listener;
    emitter._eventsCount++;
  } else if (!emitter._events[evt].fn) {
    emitter._events[evt].push(listener);
  } else {
    emitter._events[evt] = [emitter._events[evt], listener];
  }
}

/**
 * 이벤트를 에미터에서 제거하는 헬퍼 함수입니다.
 *
 * @param emitter - 이벤트 에미터 인스턴스
 * @param evt - 제거할 이벤트 이름
 */
function clearEvent_(emitter: any, evt: any) {
  if (--emitter._eventsCount === 0) {
    emitter._events = {};
  } else {
    delete emitter._events[evt];
  }
}

/**
 * Node.js EventEmitter 인터페이스를 모방한 최소한의 EventEmitter 클래스입니다.
 * 타입 안전성을 지원하고 브라우저 환경에 최적화되어 있습니다.
 *
 * @template EventTypes - 이벤트 타입 정의 (string, symbol, 또는 이벤트 맵 객체)
 * @template Context - 리스너 컨텍스트 타입
 *
 * @example
 * ```typescript
 * // 기본 사용
 * const emitter = new EventEmitter();
 * emitter.on('data', (value: string) => console.log(value));
 * emitter.emit('data', 'hello');
 *
 * // 타입드 이벤트 맵
 * interface Events {
 *   connect: [string]; // 인수 배열
 *   error: [Error];
 *   disconnect: [];
 * }
 * const typedEmitter = new EventEmitter<Events>();
 * ```
 */
export class EventEmitter<EventTypes extends ValidEventTypes = string | symbol, Context = any> {
  private _eventsCount = 0;

  private _events: Partial<Record<EventNames<EventTypes>, ListenerHolder | ListenerHolder[]>> = {};

  /**
   * 에미터에 리스너가 등록된 이벤트 이름들의 배열을 반환합니다.
   *
   * @returns 리스너가 등록된 모든 이벤트 이름들
   *
   * @example
   * ```typescript
   * emitter.on('click', handler1);
   * emitter.on('hover', handler2);
   * console.log(emitter.eventNames()); // ['click', 'hover']
   * ```
   */
  eventNames(): EventNames<EventTypes>[] {
    const names: EventNames<EventTypes>[] = [];

    if (this._eventsCount === 0) return names;

    const events = this._events;
    for (const name in events) {
      if (Object.prototype.hasOwnProperty.call(events, name)) {
        names.push(name as any);
      }
    }

    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events) as any);
    }

    return names;
  }

  /**
   * 지정된 이벤트에 등록된 리스너들을 반환합니다.
   *
   * @param event - 리스너를 조회할 이벤트 이름
   * @returns 등록된 리스너 함수들의 배열 또는 undefined
   *
   * @example
   * ```typescript
   * const handler = (data: string) => console.log(data);
   * emitter.on('message', handler);
   * const listeners = emitter.listeners('message');
   * console.log(listeners); // [handler]
   * ```
   */
  listeners<T extends EventNames<EventTypes>>(
    event: T,
  ): EventListener<EventTypes, T>[] | undefined {
    const evt = event;
    const handlers = this._events[evt];

    if (!handlers) return [];
    if ('fn' in handlers) return [handlers['fn'] as any];

    const ee = new Array(handlers.length);
    for (let i = 0; i < handlers.length; i++) {
      ee[i] = handlers[i].fn;
    }

    return ee;
  }

  /**
   * 지정된 이벤트를 듣고 있는 리스너의 개수를 반환합니다.
   *
   * @param event - 리스너 개수를 확인할 이벤트 이름
   * @returns 등록된 리스너의 개수
   *
   * @example
   * ```typescript
   * emitter.on('click', handler1);
   * emitter.on('click', handler2);
   * console.log(emitter.listenerCount('click')); // 2
   * ```
   */
  listenerCount(event: EventNames<EventTypes>): number {
    const listeners = this._events[event];
    if (!listeners) return 0;
    if ('fn' in listeners) return 1;
    return listeners.length;
  }

  /**
   * 지정된 이벤트에 등록된 모든 리스너를 호출합니다.
   *
   * @param event - 발생시킬 이벤트 이름
   * @param args - 리스너에게 전달할 인수들
   * @returns 리스너가 있었으면 true, 없었으면 false
   *
   * @example
   * ```typescript
   * emitter.on('message', (text: string, count: number) => {
   *   console.log(`${text} (${count})`);
   * });
   * emitter.emit('message', 'Hello', 1); // "Hello (1)"
   * ```
   */
  emit<T extends EventNames<EventTypes>>(event: T, ...args: EventArgs<EventTypes, T>): boolean {
    const evt = event;

    const listeners = this._events[evt];
    if (!listeners) return false;
    if ('fn' in listeners) {
      if (listeners.once) this.removeListener(event, listeners.fn as any, undefined, true);
      listeners.fn.apply(listeners.context, args);
    } else {
      const length = listeners.length;
      for (let i = 0; i < length; i++) {
        if (listeners[i].once) this.removeListener(event, listeners[i].fn as any, undefined, true);
        listeners[i].fn.apply(listeners[i].context, args);
      }
    }

    return true;
  }

  /**
   * 지정된 이벤트에 리스너를 추가합니다.
   *
   * @param event - 리스너를 추가할 이벤트 이름
   * @param fn - 이벤트 리스너 함수
   * @param context - 리스너가 실행될 컨텍스트 (선택사항)
   * @returns 리스너를 제거하는 함수
   *
   * @example
   * ```typescript
   * const unsubscribe = emitter.on('data', (value) => {
   *   console.log('Received:', value);
   * });
   * // 나중에 제거
   * unsubscribe();
   * ```
   */
  on<T extends EventNames<EventTypes>>(
    event: T,
    fn: EventListener<EventTypes, T>,
    context?: Context,
  ) {
    addListener_(this, event, fn, context);
    return () => {
      this.removeListener(event, fn, context);
    };
  }

  /**
   * 지정된 이벤트에 리스너를 추가합니다. (on 메서드의 별칭)
   *
   * @param event - 리스너를 추가할 이벤트 이름
   * @param fn - 이벤트 리스너 함수
   * @param context - 리스너가 실행될 컨텍스트 (선택사항)
   * @returns 리스너를 제거하는 함수
   */
  addListener<T extends EventNames<EventTypes>>(
    event: T,
    fn: EventListener<EventTypes, T>,
    context?: Context,
  ) {
    addListener_(this, event, fn, context);
    return () => {
      this.removeListener(event, fn, context);
    };
  }

  /**
   * 지정된 이벤트에 한 번만 실행되는 리스너를 추가합니다.
   *
   * @param event - 리스너를 추가할 이벤트 이름
   * @param fn - 이벤트 리스너 함수 (한 번만 실행됨)
   * @param context - 리스너가 실행될 컨텍스트 (선택사항)
   * @returns 리스너를 제거하는 함수
   *
   * @example
   * ```typescript
   * emitter.once('ready', () => {
   *   console.log('초기화 완료!'); // 한 번만 출력됨
   * });
   * emitter.emit('ready');
   * emitter.emit('ready'); // 이번에는 아무년도 안 일어남
   * ```
   */
  once<T extends EventNames<EventTypes>>(
    event: T,
    fn: EventListener<EventTypes, T>,
    context?: Context,
  ) {
    addListener_(this, event, fn, context, true);
    return () => {
      this.removeListener(event, fn, context, true);
    };
  }

  /**
   * 지정된 이벤트의 리스너를 제거합니다.
   *
   * @param event - 리스너를 제거할 이벤트 이름
   * @param fn - 제거할 리스너 함수 (누락시 모든 리스너 제거)
   * @param context - 리스너의 컨텍스트
   * @param once - once 리스너인지 여부
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const handler = (data) => console.log(data);
   * emitter.on('message', handler);
   * emitter.removeListener('message', handler); // 특정 리스너 제거
   * emitter.removeListener('message'); // 모든 리스너 제거
   * ```
   */
  removeListener<T extends EventNames<EventTypes>>(
    event: T,
    fn?: EventListener<EventTypes, T>,
    context?: Context,
    once?: boolean,
  ): this {
    const evt = event;
    const listeners = this._events[evt];

    if (!listeners) return this;
    if (!fn) {
      clearEvent_(this, evt);
      return this;
    }

    if ('fn' in listeners) {
      if (
        listeners.fn === fn &&
        (!once || listeners.once) &&
        (!context || listeners.context === context)
      ) {
        clearEvent_(this, evt);
      }
    } else {
      const events = [] as ListenerHolder[];
      for (let i = 0, length = listeners.length; i < length; i++) {
        if (
          listeners[i].fn !== fn ||
          (once && !listeners[i].once) ||
          (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }

      // Reset the array, or remove it completely if we have no more listeners.
      if (events.length) {
        this._events[evt] = events.length === 1 ? events[0] : events;
      } else {
        clearEvent_(this, evt);
      }
    }

    return this;
  }

  /**
   * 지정된 이벤트의 리스너를 제거합니다. (removeListener의 별칭)
   *
   * @param event - 리스너를 제거할 이벤트 이름
   * @param fn - 제거할 리스너 함수
   * @param context - 리스너의 컨텍스트
   * @param once - once 리스너인지 여부
   * @returns 메서드 체이닝을 위한 this
   */
  off<T extends EventNames<EventTypes>>(
    event: T,
    fn?: EventListener<EventTypes, T>,
    context?: Context,
    once?: boolean,
  ): this {
    return this.removeListener(event, fn, context, once);
  }

  /**
   * 모든 리스너를 제거하거나 지정된 이벤트의 모든 리스너를 제거합니다.
   *
   * @param event - 리스너를 제거할 이벤트 이름 (누락시 모든 이벤트)
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * emitter.removeAllListeners('click'); // 'click' 이벤트의 모든 리스너 제거
   * emitter.removeAllListeners(); // 모든 이벤트의 모든 리스너 제거
   * ```
   */
  removeAllListeners(event?: EventNames<EventTypes>): this {
    if (event) {
      const evt = event;
      if (this._events[evt]) {
        clearEvent_(this, evt);
      }
    } else {
      this._events = {};
      this._eventsCount = 0;
    }

    return this;
  }
}
