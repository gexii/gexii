'use client';

import { useMemo, useRef, useState } from 'react';

// ----------

export function useAction<
  T extends (...args: any[]) => any,
  TDefault extends Awaited<ReturnType<T>> | null,
>(
  callback: T,
  { defaultValue = null as TDefault, ...options }: ActionOptions<T, TDefault> = {},
): Action<T, TDefault> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Awaited<ReturnType<T>> | TDefault>(defaultValue);

  const state = useMemo(() => {
    return { loading, error, data };
  }, [loading, error, data]);
  const stateRef = useRef(state);
  stateRef.current = state;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useMemo(() => {
    return {
      isLoading: () => stateRef.current.loading,

      getError: () => stateRef.current.error,

      getData: () => stateRef.current.data,

      hasError: () => !!stateRef.current.error,

      call: (async (...args: Parameters<T>) => {
        setLoading(true);
        setError(null);
        try {
          const result = await callbackRef.current(...args);
          setData(result);
          setError(null);
          options.onSuccess?.(result);
        } catch (error) {
          if (error instanceof Error) {
            setError(error);
            options.onError?.(error);

            if (options.throwOnError !== false) throw error;
          }
        } finally {
          setLoading(false);
        }
      }) as T,
    };
  }, []);
}

// ----- TYPES -----

export interface Action<
  T extends (...args: any[]) => any,
  TDefault extends Awaited<ReturnType<T>> | null,
> {
  call: T;
  getError(): Error | null;
  getData(): Awaited<ReturnType<T>> | TDefault;
  isLoading(): boolean;
  hasError(): boolean;
}

export interface ActionOptions<
  T extends (...args: any[]) => any,
  TDefault extends Awaited<ReturnType<T>> | null,
> {
  onSuccess?: (data: Awaited<ReturnType<T>>) => void;
  onError?: (error: Error) => void;
  throwOnError?: boolean;
  defaultValue?: TDefault;
}
