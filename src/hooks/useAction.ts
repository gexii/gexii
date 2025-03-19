'use client';

import { useMemo, useRef, useState } from 'react';

// ----------

export function useAction<T extends (...args: any[]) => any>(
  callback: T,
  options: ActionOptions<T> = {},
): Action<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ReturnType<Awaited<T>> | null>(null);

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

export interface Action<T extends (...args: any[]) => any> {
  call: T;
  getError(): Error | null;
  getData(): ReturnType<T> | null;
  isLoading(): boolean;
  hasError(): boolean;
}

export interface ActionOptions<T extends (...args: any[]) => any> {
  onSuccess?: (data: ReturnType<T>) => void;
  onError?: (error: Error) => void;
  throwOnError?: boolean;
}
