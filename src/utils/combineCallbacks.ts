/* eslint-disable no-await-in-loop */

type FalseExpression = undefined | null | false | '' | 0;

type Callback = (...argv: any[]) => any;

// ----------

/**
 *
 * Combines multiple callbacks into one, executing them concurrently
 *
 */
export function combineCallbacks<C extends Callback>(...callbacks: (C | FalseExpression)[]) {
  return ((...args) =>
    Promise.allSettled<ReturnType<C>[]>(
      callbacks.map((callback) => (typeof callback === 'function' ? callback(...args) : undefined)),
    )) as (...args: Parameters<C>) => Promise<ReturnType<C>[]>;
}

// ----------

/**
 *
 *  Combines multiple callbacks into one with sequential execution by their order
 *
 */
combineCallbacks.sequential = function sequentialCombineCallbacks<C extends Callback>(
  ...callbacks: (C | FalseExpression)[]
) {
  return (async (...args) => {
    const result = [];

    for (let i = 0; i < callbacks.length; i += 1) {
      const callback = callbacks[i];
      result.push(typeof callback === 'function' ? await callback?.(...args) : undefined);
    }

    return result;
  }) as (...args: Parameters<C>) => Promise<ReturnType<C>[]>;
};
