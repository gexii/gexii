import { CSSObject, SxProps, Theme } from '@mui/material';

// ----------

interface EllipseOptions {
  lines?: number;
  breakWord?: boolean;
}

export function ellipse({ breakWord = true, lines = 1 }: EllipseOptions = {}): CSSObject {
  return {
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical',
    overflowWrap: breakWord ? 'anywhere' : 'normal',
    WebkitLineClamp: String(lines ?? 1),
  };
}

// ----------

type FalseExpression = false | 0 | '' | null | undefined;

export function combineSx(
  sx: SxProps<Theme> | FalseExpression,
  ...targets: (SxProps<Theme> | FalseExpression)[]
): SxProps<Theme> {
  return targets.reduce(
    (accumulator, sx) => {
      if (!sx) return accumulator;

      if (Array.isArray(sx)) return [...accumulator, ...sx];

      return [...accumulator, sx];
    },
    [sx],
  );
}
