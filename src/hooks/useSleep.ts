import { useRef, useState } from 'react';

// ----------

export function useSleep(defaultMs?: number) {
  const resolveRef = useRef<VoidFunction | null>(null);
  const [, updateSignal] = useState(Object());

  // trigger and reset resolve function
  if (resolveRef.current) {
    resolveRef.current();
    resolveRef.current = null;
  }

  return (ms: number | undefined = defaultMs) => {
    return new Promise<void>((resolve) => {
      // wait for certain time if `ms` provided
      if (ms) {
        setTimeout(resolve, ms);
      }

      // wait til next frame if `ms` didn't provide
      else {
        resolveRef.current = resolve;
        updateSignal(Object());
      }
    });
  };
}
