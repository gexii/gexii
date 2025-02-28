'use client';

import { useEffect, useState } from 'react';

// ----------

/**
 * A hook that runs an effect only after the first render.
 *
 * Note:
 * The reason for this hook is that the `useUpdateEffect` hook from `react-use` library
 * does not work as expected. It runs the effect on the first render, which is not the
 * intended behavior. So, this hook is created to fix that issue.
 */
export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) {
      setReady(true);
      return;
    }

    return effect();
  }, deps);
};
