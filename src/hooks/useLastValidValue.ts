'use client';

import { useRef } from 'react';

/**
 * Returns the latest value excluding null and undefined
 */
export function useLastValidValue<T>(validate: (value: unknown) => boolean, next: () => T) {
  const newValue = next();
  const lastValueRef = useRef<T | null>(newValue);

  lastValueRef.current = validate(newValue) ? newValue : lastValueRef.current;

  return lastValueRef.current;
}
