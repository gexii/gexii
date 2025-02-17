import { RefCallback, RefObject } from 'react';

// ----------

/**
 *
 * Return a ref callback that combines each of the ref in inputs
 *
 */
export const combineRefs = <T>(...refs: Ref<T>[]): RefCallback<T> => {
  // a function for updating all refs to the same value
  return (value: T) => {
    refs.forEach((ref) => {
      try {
        if (!ref) return;

        if (typeof ref === 'function') {
          ref(value);
        } else {
          // eslint-disable-next-line no-param-reassign
          (ref.current as T) = value;
        }
      } catch {
        /* empty */
      }
    });
  };
};

// ----- HELPER TYPES -----

type Ref<T = unknown> = RefObject<T> | RefCallback<T> | null | undefined;
