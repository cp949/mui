'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { EventEmitter } from '../eventemitter/eventemitter3.js';
import { useSessionStorage } from './useSessionStorage.js';

type SetStateFn<T> = (value: T | undefined) => void;

type GetFn<T> = () => T;

const emitters: Record<string, EventEmitter<any>> = {};

const getOrCreateEmitter = (key: string): EventEmitter<any> => {
  const instance = emitters[key];
  if (instance) {
    return instance;
  }
  emitters[key] = new EventEmitter();
  return emitters[key];
};

function getDefaultValue<T>(value: T | GetFn<T>): T {
  if (typeof value === 'function') {
    return (value as () => T)();
  }
  return value;
}

export function useObservableSessionStorage<T>(
  key: string,
  initialValue: T | GetFn<T>,
): [T, SetStateFn<T | null>] {
  const defaultValueRef = useRef<T>(getDefaultValue(initialValue));
  const [value, setValue, removeValue] = useSessionStorage<T | null>(key, defaultValueRef.current);
  const emitter = useMemo(() => getOrCreateEmitter(key), [key]);

  const setValueAndNotify = useCallback(
    (value: T | null) => {
      if (typeof value === 'undefined' || value === null) {
        removeValue();
      }
      emitter.emit(key, value);
    },
    [emitter, key, removeValue],
  );

  useEffect(() => {
    const onChange = (value: T | null) => {
      setValue(value);
    };
    emitter.on(key, onChange);
    return () => {
      emitter.off(key, onChange);
    };
  }, [key, emitter, setValue]);

  return [value ?? defaultValueRef.current, setValueAndNotify];
}
