import { toString } from 'lodash';

export type TransformableType = 'string' | 'number' | 'int' | 'float' | 'boolean';

export function transform<T>(value: T, type: TransformableType) {
  if (type === 'string') return toString(value);

  if (type === 'boolean') return Boolean(value);

  if (['number', 'int', 'float'].includes(type)) {
    if (Number.isNaN(Number(value))) return value;

    if (type === 'int') return Number(value);

    if (type === 'float') return Number(value);
  }

  return value;
}
