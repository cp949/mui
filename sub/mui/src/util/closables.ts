import { Subject } from 'rxjs';
import { EventEmitter } from '../eventemitter/eventemitter3.js';

type WinEventType = keyof WindowEventMap;
type WinEventListener<K extends WinEventType> = (this: Window, ev: WindowEventMap[K]) => any;
type EventOptions = boolean | AddEventListenerOptions;

type DocEventType = keyof DocumentEventMap;

type DocEventListener<K extends DocEventType> = (this: Document, ev: DocumentEventMap[K]) => any;

type ElemEventType = keyof HTMLElementEventMap;
type ElemEventListener<K extends ElemEventType> = (
  this: HTMLElement,
  ev: HTMLElementEventMap[K],
) => any;

/**
 * 다양한 리소스의 정리 작업을 관리하는 클래스입니다.
 * 이벤트 리스너, RxJS 구독, 각종 자원들을 일괄적으로 정리할 수 있습니다.
 *
 * @example
 * ```typescript
 * const closables = new Closables();
 *
 * // 이벤트 리스너 추가
 * closables.addWindowListener('resize', handleResize);
 *
 * // RxJS 구독 추가
 * const subscription = observable.subscribe(handleData);
 * closables.addRx(subscription);
 *
 * // 모든 리소스 정리
 * closables.close();
 * ```
 */
export class Closables {
  #store = new Set<() => any>();
  #closeTrigger$: Subject<any> | undefined;
  #events = new EventEmitter<{ closed: () => void }>();

  /**
   * 닫히기 이벤트를 수신할 수 있는 EventEmitter를 반환합니다.
   *
   * @returns EventEmitter 인스턴스
   *
   * @example
   * ```typescript
   * closables.events.on('closed', () => {
   *   console.log('리소스가 정리되었습니다');
   * });
   * ```
   */
  get events() {
    return this.#events;
  }

  /**
   * 닫히기 트리거 Subject를 반환합니다.
   * 리소스가 정리될 때 신호를 발생시킵니다.
   *
   * @returns RxJS Subject 인스턴스
   *
   * @example
   * ```typescript
   * closables.closeTrigger$.subscribe(() => {
   *   console.log('정리 신호 수신');
   * });
   * ```
   */
  get closeTrigger$(): Subject<any> {
    if (!this.#closeTrigger$) {
      this.#closeTrigger$ = new Subject();
    }
    return this.#closeTrigger$;
  }

  /**
   * 정리 함수들을 추가합니다.
   *
   * @param closables - 정리시 호출할 함수들
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * closables.add(
   *   () => console.log('정리 1'),
   *   () => clearInterval(intervalId)
   * );
   * ```
   */
  add = (...closables: (() => any)[]): this => {
    closables.forEach((it) => {
      this.#store.add(it);
    });
    return this;
  };

  /**
   * 정리 함수들을 제거합니다.
   *
   * @param closables - 제거할 함수들
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const cleanup = () => console.log('정리');
   * closables.add(cleanup);
   * closables.remove(cleanup); // 제거
   * ```
   */
  remove = (...closables: (() => any)[]): this => {
    closables.forEach((it) => {
      this.#store.delete(it);
    });
    return this;
  };

  /**
   * RxJS Subscription 객체들을 추가합니다.
   *
   * @param closables - unsubscribe 메서드를 가진 객체들
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const subscription = observable.subscribe(data => console.log(data));
   * closables.addRx(subscription);
   * ```
   */
  addRx = (...closables: Array<{ unsubscribe: () => any }>): this => {
    closables.forEach((s) => {
      this.#store.add(() => {
        s.unsubscribe();
      });
    });
    return this;
  };

  /**
   * addRx의 별칭입니다. RxJS Subscription 객체들을 추가합니다.
   */
  addUnsubscribe = this.addRx;

  /**
   * close 메서드를 가진 객체들을 추가합니다.
   *
   * @param closables - close 메서드를 가진 객체들
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const connection = { close: () => socket.close() };
   * closables.addClose(connection);
   * ```
   */
  addClose = (...closables: Array<{ close: () => any }>): this => {
    closables.forEach((s) => {
      this.#store.add(() => {
        s.close();
      });
    });
    return this;
  };

  /**
   * dispose 메서드를 가진 객체들을 추가합니다.
   *
   * @param closables - dispose 메서드를 가진 객체들
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const resource = { dispose: () => cleanup() };
   * closables.addDispose(resource);
   * ```
   */
  addDispose = (...closables: Array<{ dispose: () => any }>): this => {
    closables.forEach((s) => {
      this.#store.add(() => {
        s.dispose();
      });
    });
    return this;
  };

  /**
   * destroy 메서드를 가진 객체들을 추가합니다.
   *
   * @param closables - destroy 메서드를 가진 객체들
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const widget = { destroy: () => widget.cleanup() };
   * closables.addDestroy(widget);
   * ```
   */
  addDestroy = (...closables: Array<{ destroy: () => any }>): this => {
    closables.forEach((s) => {
      this.#store.add(() => {
        s.destroy();
      });
    });
    return this;
  };

  /**
   * shutdown 메서드를 가진 객체들을 추가합니다.
   *
   * @param closables - shutdown 메서드를 가진 객체들
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const server = { shutdown: () => server.stop() };
   * closables.addShutdown(server);
   * ```
   */
  addShutdown = (...closables: Array<{ shutdown: () => any }>): this => {
    closables.forEach((s) => {
      this.#store.add(() => {
        s.shutdown();
      });
    });
    return this;
  };

  /**
   * terminate 메서드를 가진 객체들을 추가합니다.
   *
   * @param closables - terminate 메서드를 가진 객체들
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const worker = { terminate: () => worker.kill() };
   * closables.addTerminate(worker);
   * ```
   */
  addTerminate = (...closables: Array<{ terminate: () => any }>): this => {
    closables.forEach((s) => {
      this.#store.add(() => {
        s.terminate();
      });
    });
    return this;
  };

  /**
   * HTML 요소에 이벤트 리스너를 추가합니다.
   *
   * @param elem - 이벤트를 추가할 HTML 요소
   * @param type - 이벤트 타입
   * @param listener - 이벤트 리스너 함수
   * @param options - 이벤트 옵션
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * const button = document.getElementById('btn');
   * closables.addElementListener(button, 'click', handleClick);
   * ```
   */
  addElementListener = <K extends ElemEventType>(
    elem: HTMLElement,
    type: K,
    listener: ElemEventListener<K>,
    options?: EventOptions,
  ): this => {
    elem.addEventListener(type, listener, options);
    this.#store.add(() => {
      elem.removeEventListener(type, listener, options);
    });
    return this;
  };

  /**
   * Document에 이벤트 리스너를 추가합니다.
   *
   * @param type - 이벤트 타입
   * @param listener - 이벤트 리스너 함수
   * @param options - 이벤트 옵션
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * closables.addDocumentListener('keydown', handleGlobalKeydown);
   * ```
   */
  addDocumentListener = <K extends DocEventType>(
    type: K,
    listener: DocEventListener<K>,
    options?: EventOptions,
  ): this => {
    document.addEventListener(type, listener, options);
    this.#store.add(() => {
      document.removeEventListener(type, listener, options);
    });
    return this;
  };

  /**
   * Window에 이벤트 리스너를 추가합니다.
   *
   * @param type - 이벤트 타입
   * @param listener - 이벤트 리스너 함수
   * @param options - 이벤트 옵션
   * @returns 메서드 체이닝을 위한 this
   *
   * @example
   * ```typescript
   * closables.addWindowListener('resize', handleWindowResize);
   * closables.addWindowListener('beforeunload', handleBeforeUnload);
   * ```
   */
  addWindowListener = <K extends WinEventType>(
    type: K,
    listener: WinEventListener<K>,
    options?: EventOptions,
  ): this => {
    window.addEventListener(type, listener, options);
    this.#store.add(() => {
      window.removeEventListener(type, listener, options);
    });
    return this;
  };

  /**
   * 등록된 정리 함수의 개수를 반환합니다.
   *
   * @returns 등록된 정리 함수 개수
   *
   * @example
   * ```typescript
   * console.log(`등록된 리소스: ${closables.count}개`);
   * ```
   */
  get count() {
    return this.#store.size;
  }

  /**
   * 모든 등록된 리소스를 정리하고 이벤트를 발생시킵니다.
   *
   * @example
   * ```typescript
   * // 컴포넌트 언마운트시 호출
   * useEffect(() => {
   *   const closables = new Closables();
   *   // 리소스 등록
   *
   *   return () => closables.close(); // 정리
   * }, []);
   * ```
   */
  close = () => {
    this.#events.emit('closed');
    this.#events.removeAllListeners();
    if (this.#closeTrigger$) {
      this.#closeTrigger$.next(1);
      this.#closeTrigger$ = undefined;
    }

    if (this.#store.size > 0) {
      Array.from(this.#store).forEach((fn) => {
        fn();
      });
      this.#store.clear();
    }
  };

  /**
   * 정리 함수들로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param closables - 초기 정리 함수들
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const closables = Closables.create(
   *   () => clearTimeout(timerId),
   *   () => connection.close()
   * );
   * ```
   */
  static create = (...closables: (() => any)[]) => {
    const c = new Closables();
    c.add(...closables);
    return c;
  };

  /**
   * Window 이벤트 리스너로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param type - 이벤트 타입
   * @param listener - 이벤트 리스너 함수
   * @param options - 이벤트 옵션
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const resizeClosable = Closables.createWindowListener('resize', handleResize);
   * // 나중에 resizeClosable.close()로 정리
   * ```
   */
  static createWindowListener = <K extends WinEventType>(
    type: K,
    listener: WinEventListener<K>,
    options?: EventOptions,
  ) => {
    const c = new Closables();
    c.addWindowListener(type, listener, options);
    return c;
  };

  /**
   * Document 이벤트 리스너로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param type - 이벤트 타입
   * @param listener - 이벤트 리스너 함수
   * @param options - 이벤트 옵션
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const keydownClosable = Closables.createDocumentListener('keydown', handleKeydown);
   * ```
   */
  static createDocumentListener = <K extends DocEventType>(
    type: K,
    listener: DocEventListener<K>,
    options?: EventOptions,
  ) => {
    const c = new Closables();
    c.addDocumentListener(type, listener, options);
    return c;
  };

  /**
   * HTML 요소 이벤트 리스너로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param elem - 이벤트를 추가할 HTML 요소
   * @param type - 이벤트 타입
   * @param listener - 이벤트 리스너 함수
   * @param options - 이벤트 옵션
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const button = document.getElementById('btn');
   * const clickClosable = Closables.createElementListener(button, 'click', handleClick);
   * ```
   */
  static createElementListener = <K extends ElemEventType>(
    elem: HTMLElement,
    type: K,
    listener: ElemEventListener<K>,
    options?: EventOptions,
  ) => {
    const c = new Closables();
    c.addElementListener(elem, type, listener, options);
    return c;
  };

  /**
   * RxJS Subscription들로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param closables - RxJS Subscription 객체들
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const subscription1 = observable1.subscribe(handler1);
   * const subscription2 = observable2.subscribe(handler2);
   * const rxClosable = Closables.createRx(subscription1, subscription2);
   * ```
   */
  static createRx = (...closables: { unsubscribe: () => any }[]) => {
    const c = new Closables();
    c.addRx(...closables);
    return c;
  };

  /**
   * close 메서드를 가진 객체들로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param closables - close 메서드를 가진 객체들
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const connection1 = { close: () => socket1.close() };
   * const connection2 = { close: () => socket2.close() };
   * const connectionClosable = Closables.createClose(connection1, connection2);
   * ```
   */
  static createClose = (...closables: { close: () => any }[]) => {
    const c = new Closables();
    c.addClose(...closables);
    return c;
  };

  /**
   * terminate 메서드를 가진 객체들로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param closables - terminate 메서드를 가진 객체들
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const worker1 = new Worker('worker1.js');
   * const worker2 = new Worker('worker2.js');
   * const workerClosable = Closables.createTerminate(worker1, worker2);
   * ```
   */
  static createTerminate = (...closables: { terminate: () => any }[]) => {
    const c = new Closables();
    c.addTerminate(...closables);
    return c;
  };

  /**
   * shutdown 메서드를 가진 객체들로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param closables - shutdown 메서드를 가진 객체들
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const server1 = { shutdown: () => server1.stop() };
   * const server2 = { shutdown: () => server2.stop() };
   * const serverClosable = Closables.createShutdown(server1, server2);
   * ```
   */
  static createShutdown = (...closables: { shutdown: () => any }[]) => {
    const c = new Closables();
    c.addShutdown(...closables);
    return c;
  };

  /**
   * destroy 메서드를 가진 객체들로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param closables - destroy 메서드를 가진 객체들
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const widget1 = { destroy: () => widget1.cleanup() };
   * const widget2 = { destroy: () => widget2.cleanup() };
   * const widgetClosable = Closables.createDestroy(widget1, widget2);
   * ```
   */
  static createDestroy = (...closables: { destroy: () => any }[]) => {
    const c = new Closables();
    c.addDestroy(...closables);
    return c;
  };

  /**
   * dispose 메서드를 가진 객체들로 Closables 인스턴스를 생성하는 정적 팩토리 메서드입니다.
   *
   * @param closables - dispose 메서드를 가진 객체들
   * @returns 새로운 Closables 인스턴스
   *
   * @example
   * ```typescript
   * const resource1 = { dispose: () => resource1.cleanup() };
   * const resource2 = { dispose: () => resource2.cleanup() };
   * const resourceClosable = Closables.createDispose(resource1, resource2);
   * ```
   */
  static createDispose = (...closables: { dispose: () => any }[]) => {
    const c = new Closables();
    c.addDispose(...closables);
    return c;
  };
}
