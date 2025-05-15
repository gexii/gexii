'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { combineCallbacks } from 'src/utils';

// ----------

/**
 *
 * This is a custom hook that specializes in handling router transitions in React applications.
 *
 * For example, it can be used to wrap a router.refresh() in Next.js application, turning it into a Promise that resolves when the transition is complete.
 * @example
 * ```ts
 * const router = useRouter();
 * const refresh = useTransitionCallback(() => router.refresh());
 * const handleRefresh = async () => {
 *  await refresh();
 *  // Do something after the transition is complete
 * }
 * ```
 *
 */

export function useTransitionCallback<T extends (...args: any[]) => any>(callback: T) {
  const [isPending, startTransition] = useTransition();

  const [resolve, setResolve] = useState<((value: void) => void) | null>(null);
  const [isTriggered, setIsTriggered] = useState(false);

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // --- FUNCTIONS ---

  const previousResolve = useRef(resolve);
  previousResolve.current = resolve;
  const run = useCallback((...args: unknown[]) => {
    return new Promise<void>((resolve) => {
      setResolve(() => combineCallbacks(resolve, previousResolve.current));
      startTransition(() => callbackRef.current(...args));
    });
  }, []);

  // --- EFFECTS ---

  useEffect(() => {
    if (isTriggered && !isPending) {
      if (resolve) {
        resolve();

        setIsTriggered(false);
        setResolve(null);
      }
    }

    if (isPending) {
      setIsTriggered(true);
    }
  }, [isTriggered, isPending, resolve]);

  // Clean up the resolve function when the component unmounts
  useEffect(
    () => () => {
      if (resolve) resolve();
    },
    [],
  );

  return run;
}
