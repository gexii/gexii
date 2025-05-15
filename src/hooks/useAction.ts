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
  const programKeyRef = useRef(0);

  const state = useMemo(() => {
    return { loading, error, data };
  }, [loading, error, data]);

  const stateRef = useRef(state);
  stateRef.current = state;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  // ----- FUNCTIONS -----

  const call = async (...args: Parameters<T>) => {
    setLoading(true);
    setError(null);
    const options = optionsRef.current;
    const programKey = newProgramKey();

    try {
      const result = await callbackRef.current(...args);
      setData(result);
      setError(null);
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        options.onError?.(error);

        if (options.throwOnError !== false) throw error;
      }
    } finally {
      // Reset loading state only if the program key equals the latest one
      if (isCurrentProgramKey(programKey)) setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(defaultValue);
  };

  const newProgramKey = () => ++programKeyRef.current;

  const isCurrentProgramKey = (programKey: unknown) => programKey === programKeyRef.current;

  return useMemo(() => {
    const action: Action<T, TDefault> = (...args) => call(...args);
    action.isLoading = () => stateRef.current.loading;
    action.getError = () => stateRef.current.error;
    action.getData = () => stateRef.current.data;
    action.hasError = () => !!stateRef.current.error;
    action.call = (...args) => call(...args);
    action.reset = () => reset();

    return action;
  }, []);
}

// ----- TYPES -----

export interface Action<
  T extends (...args: any[]) => any,
  TDefault extends Awaited<ReturnType<T>> | null,
> {
  (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>>;
  call(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>>;
  reset(): void;
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
