'use client';

import * as React from 'react';
import type { Codec } from './codec.js';
import { CODEC_STRING } from './codec.js';

// storage events only work across tabs, we'll use an event emitter to announce within the current tab
const currentTabChangeListeners = new Map<string, Set<() => void>>();

/**
 * 현재 탭에서 스토리지 변경 이벤트 리스너를 등록합니다.
 *
 * @param key - 스토리지 키
 * @param handler - 변경 시 호출될 함수
 */
function onCurrentTabStorageChange(key: string, handler: () => void) {
  let listeners = currentTabChangeListeners.get(key);

  if (!listeners) {
    listeners = new Set();
    currentTabChangeListeners.set(key, listeners);
  }

  listeners.add(handler);
}

/**
 * 현재 탭에서 스토리지 변경 이벤트 리스너를 제거합니다.
 *
 * @param key - 스토리지 키
 * @param handler - 제거할 핸들러 함수
 */
function offCurrentTabStorageChange(key: string, handler: () => void) {
  const listeners = currentTabChangeListeners.get(key);
  if (!listeners) {
    return;
  }

  listeners.delete(handler);

  if (listeners.size === 0) {
    currentTabChangeListeners.delete(key);
  }
}

/**
 * 현재 탭에서 스토리지 변경 이벤트를 발생시킵니다.
 *
 * @param key - 변경된 스토리지 키
 */
function emitCurrentTabStorageChange(key: string) {
  const listeners = currentTabChangeListeners.get(key);
  if (listeners) {
    listeners.forEach((listener) => listener());
  }
}

if (typeof window !== 'undefined') {
  const origSetItem = window.localStorage.setItem;
  window.localStorage.setItem = function setItem(key, value) {
    const result = origSetItem.call(this, key, value);
    emitCurrentTabStorageChange(key);
    return result;
  };
}

/**
 * 스토리지 영역의 특정 키 변경을 구독합니다.
 * 브라우저 탭 간 변경과 현재 탭 내 변경을 모두 감지합니다.
 *
 * @param area - 감시할 스토리지 영역 (localStorage 또는 sessionStorage)
 * @param key - 감시할 스토리지 키
 * @param callback - 변경 시 호출될 함수
 * @returns 구독을 취소하는 함수
 */
function subscribe(area: Storage, key: string | null, callback: () => void): () => void {
  if (!key) {
    return () => {};
  }
  const storageHandler = (event: StorageEvent) => {
    if (event.storageArea === area && event.key === key) {
      callback();
    }
  };
  window.addEventListener('storage', storageHandler);
  onCurrentTabStorageChange(key, callback);
  return () => {
    window.removeEventListener('storage', storageHandler);
    offCurrentTabStorageChange(key, callback);
  };
}

/**
 * 스토리지에서 지정된 키의 현재 값을 가져옵니다.
 * 오류가 발생하면 null을 반환합니다.
 *
 * @param area - 스토리지 영역
 * @param key - 가져올 키
 * @returns 스토리지에 저장된 값 또는 null
 */
function getSnapshot(area: Storage, key: string | null): string | null {
  if (!key) {
    return null;
  }
  try {
    return area.getItem(key);
  } catch {
    // ignore
    // See https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
    return null;
  }
}

/**
 * 스토리지에 값을 설정하거나 제거합니다.
 * 값이 null이면 해당 키를 스토리지에서 제거합니다.
 *
 * @param area - 스토리지 영역
 * @param key - 설정할 키
 * @param value - 설정할 값 (또는 null로 제거)
 */
function setValue(area: Storage, key: string | null, value: string | null) {
  if (!key) {
    return;
  }
  try {
    if (value === null) {
      area.removeItem(key);
    } else {
      area.setItem(key, String(value));
    }
  } catch {
    // ignore
    // See https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
    return;
  }
  emitCurrentTabStorageChange(key);
}

/**
 * 스토리지 상태의 초기값을 생성하는 함수 타입입니다.
 */
export type StorageStateInitializer<T> = () => T | null;

/**
 * useStorageState 훅의 반환 타입입니다.
 * 첫 번째 요소는 현재 값, 두 번째 요소는 값을 설정하는 함수입니다.
 */
export type UseStorageStateHookResult<T> = [
  T | null,
  React.Dispatch<React.SetStateAction<T | null>>,
];

const serverValue: UseStorageStateHookResult<any> = [null, () => {}];

/**
 * 서버 사이드 렌더링에서 사용하는 useStorageState의 서버 버전입니다.
 * 항상 null 값과 빈 함수를 반환합니다.
 *
 * @returns 서버에서 사용할 더미 값들
 */
export function useStorageStateServer<T = string>(): UseStorageStateHookResult<T> {
  return serverValue;
}

/**
 * 기본 스토리지 상태 옵션입니다.
 */
export interface DefaultStorageStateoptions<T = string> {
  codec?: Codec<T>;
}

/**
 * 스토리지 상태 옵션입니다. 코덱이 필수입니다.
 */
export interface StorageStateOptions<T> extends DefaultStorageStateoptions<T> {
  codec: Codec<T>;
}

/**
 * 코덱을 사용하여 값을 문자열로 인코딩합니다.
 *
 * @param codec - 사용할 코덱
 * @param value - 인코딩할 값
 * @returns 인코딩된 문자열 또는 null
 */
function encode<V>(codec: Codec<V>, value: V | null): string | null {
  return value === null ? null : codec.stringify(value);
}

/**
 * 코덩을 사용하여 문자열을 값으로 디코딩합니다.
 *
 * @param codec - 사용할 코덱
 * @param value - 디코딩할 문자열
 * @returns 디코딩된 값 또는 null
 */
function decode<V>(codec: Codec<V>, value: string | null): V | null {
  return value === null ? null : codec.parse(value);
}

// Start with null for the hydration, and then switch to the actual value.
const getKeyServerSnapshot = () => null;

/**
 * 상태를 로컬 스토리지와 동기화하여 페이지 새로고침 후에도 지속되도록 합니다.
 * useState와 비슷하게 사용하지만, 스토리지 키를 전달하여 페이지 로드 시
 * 지정된 초기값 대신 스토리지에 저장된 값을 기본값으로 사용합니다.
 *
 * 서버 렌더링 환경에서는 스토리지 API를 사용할 수 없으므로,
 * SSR과 하이드레이션 중에는 null을 반환합니다.
 *
 * @param area - 사용할 스토리지 영역 (localStorage 또는 sessionStorage)
 * @param key - 스토리지 키
 * @param initializer - 초기값 또는 초기값을 생성하는 함수
 * @param options - 옵션 객체
 * @returns [현재 값, 값 설정 함수] 튜플
 *
 * @example
 * ```typescript
 * // 기본 문자열 사용
 * const [name, setName] = useStorageState(localStorage, 'username', '');
 *
 * // 초기값 함수 사용
 * const [theme, setTheme] = useStorageState(
 *   localStorage,
 *   'theme',
 *   () => 'light'
 * );
 * ```
 */
export function useStorageState(
  area: Storage,
  key: string | null,
  initializer?: string | null | StorageStateInitializer<string>,
  options?: DefaultStorageStateoptions,
): UseStorageStateHookResult<string>;

/**
 * 상태를 스토리지와 동기화하는 제네릭 버전입니다.
 * 코덱을 사용하여 커스텀 타입의 데이터를 저장할 수 있습니다.
 *
 * @param area - 사용할 스토리지 영역
 * @param key - 스토리지 키
 * @param initializer - 초기값 또는 초기값 생성 함수
 * @param options - 코덱을 포함한 옵션 객체 (필수)
 * @returns [현재 값, 값 설정 함수] 튜플
 *
 * @example
 * ```typescript
 * // Date 객체 저장
 * const [selectedDate, setSelectedDate] = useStorageState(
 *   localStorage,
 *   'selected-date',
 *   new Date(),
 *   { codec: CODEC_DATE }
 * );
 *
 * // JSON 객체 저장
 * const [settings, setSettings] = useStorageState(
 *   localStorage,
 *   'app-settings',
 *   { theme: 'light', language: 'ko' },
 *   { codec: CODEC_JSON }
 * );
 * ```
 */
export function useStorageState<T>(
  area: Storage,
  key: string | null,
  initializer: T | null | StorageStateInitializer<T>,
  options: StorageStateOptions<T>,
): UseStorageStateHookResult<T>;

export function useStorageState<T = string>(
  area: Storage,
  key: string | null,
  initializer: T | null | StorageStateInitializer<T> = null,
  options?: DefaultStorageStateoptions | StorageStateOptions<T>,
): UseStorageStateHookResult<T> {
  const codec = (options?.codec ?? CODEC_STRING) as Codec<T>;

  const [initialValue] = React.useState(initializer);
  const encodedInitialValue = React.useMemo(
    () => encode(codec, initialValue),
    [codec, initialValue],
  );

  const subscribeKey = React.useCallback(
    (callback: () => void) => subscribe(area, key, callback),
    [area, key],
  );

  const getKeySnapshot = React.useCallback<() => string | null>(
    () => getSnapshot(area, key) ?? encodedInitialValue,
    [area, encodedInitialValue, key],
  );

  const encodedStoredValue = React.useSyncExternalStore(
    subscribeKey,
    getKeySnapshot,
    getKeyServerSnapshot,
  );

  const storedValue = React.useMemo(
    () => decode(codec, encodedStoredValue),
    [codec, encodedStoredValue],
  );

  const setStoredValue = React.useCallback(
    (value: React.SetStateAction<T | null>) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const encodedValueToStore = encode(codec, valueToStore);
      setValue(area, key, encodedValueToStore);
    },
    [area, codec, storedValue, key],
  );

  const [nonStoredValue, setNonStoredValue] = React.useState(initialValue);

  if (!key) {
    return [nonStoredValue, setNonStoredValue];
  }

  return [storedValue, setStoredValue];
}

/**
 * 스토리지 상태 훅의 인터페이스 정의입니다.
 * 다양한 오버로드를 지원하여 문자열과 커스텀 타입을 모두 저장할 수 있습니다.
 */
export interface UseStorageState {
  /**
   * 로컬 또는 세션 스토리지와 상태를 동기화하여 페이지 새로고침 후에도 지속되도록 합니다.
   * useState와 비슷하게 사용하지만 값을 고유하게 식별하는 스토리지 키를 전달합니다.
   *
   * @param key - 로컬 또는 세션 스토리지에 값을 저장할 때 사용할 키
   * @param initializer - 키가 스토리지에 없을 때 사용할 초기값
   * @param options - 스토리지 상태에 대한 추가 옵션
   */
  (
    key: string | null,
    initializer?: string | null | StorageStateInitializer<string>,
    options?: DefaultStorageStateoptions,
  ): UseStorageStateHookResult<string>;

  /**
   * 로컬 또는 세션 스토리지와 상태를 동기화하여 페이지 새로고침 후에도 지속되도록 합니다.
   * 제네릭 타입과 코덱을 사용하여 커스텀 데이터 타입을 지원합니다.
   *
   * @param key - 로컬 또는 세션 스토리지에 값을 저장할 때 사용할 키
   * @param initializer - 키가 스토리지에 없을 때 사용할 초기값
   * @param options - 스토리지 상태에 대한 추가 옵션
   */
  <T>(
    key: string | null,
    initializer: T | null | StorageStateInitializer<T>,
    options: StorageStateOptions<T>,
  ): UseStorageStateHookResult<T>;

  /**
   * 로컬 또는 세션 스토리지와 상태를 동기화하여 페이지 새로고침 후에도 지속되도록 합니다.
   * 제네릭 타입과 옵션널 코덱을 지원합니다.
   *
   * @param key - 로컬 또는 세션 스토리지에 값을 저장할 때 사용할 키
   * @param initializer - 키가 스토리지에 없을 때 사용할 초기값
   * @param options - 스토리지 상태에 대한 추가 옵션
   */
  <T>(
    key: string | null,
    initializer?: T | null | StorageStateInitializer<T>,
    options?: StorageStateOptions<T>,
  ): UseStorageStateHookResult<T>;
}
