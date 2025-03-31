'use client';

import React, { isValidElement } from 'react';
import { get, isNil, merge, omit } from 'lodash';
import { Breakpoint, TableCellProps, Box, TableCell } from '@mui/material';

import { mixins } from 'src/theme';

import { useRowIndex, useTableSource, HEAD_INDEX } from './context';

// ----------

export interface CellProps extends Omit<TableCellProps, 'align' | 'width'> {
  label?: React.ReactNode;
  path?: string;
  align?: CellAlign;
  width?: number | string | Record<Breakpoint, number | string>;
  ellipsis?: boolean;
  placeholder?: React.ReactNode;
  headCellProps?: BasicCellProps;
  bodyCellProps?: BasicCellProps;
  render?: (value: any, item: any, index: number) => React.ReactNode;
}

interface BasicCellProps
  extends Omit<
    Partial<CellProps>,
    'headCellProps' | 'bodyCellProps' | 'label' | 'path' | 'render'
  > {}

export default function Cell({ bodyCellProps, headCellProps, sx, ...props }: CellProps) {
  const rowIndex = useRowIndex();
  const headCombinedSx = mixins.combineSx(sx, headCellProps?.sx);
  const bodyCombinedSx = mixins.combineSx(sx, bodyCellProps?.sx);

  if (rowIndex === HEAD_INDEX)
    return <HeadCell {...merge(props, headCellProps)} sx={headCombinedSx} />;
  return <BodyCell {...merge(props, bodyCellProps)} sx={bodyCombinedSx} />;
}

// ----- RELATED COMPONENTS -----

/**
 *
 * Table Head Cell
 *
 */
function HeadCell({ label, align, width, ...props }: CellProps) {
  return (
    <TableCell
      {...omit(props, ['render', 'path', 'ellipsis'])}
      align={align}
      sx={mixins.combineSx({ width }, props.sx)}
    >
      {label}
    </TableCell>
  );
}

/**
 *
 * Table Body Cell
 *
 */
function BodyCell({ path, children, align, ellipsis, placeholder, render, ...props }: CellProps) {
  const rowIndex = useRowIndex();
  const source = useTableSource();

  const item = source[rowIndex];
  const value = (path ? get(item, path) : item) as React.ReactNode;

  const getElement = () => {
    const element =
      typeof render === 'function' ? render(value, item, rowIndex) : (children ?? value);

    if (isNil(element) || (typeof element === 'string' && element.trim() === ''))
      return placeholder;

    if (typeof element !== 'object' || isValidElement(element)) return element;

    return String(element);
  };

  return (
    <TableCell {...omit(props, ['label', 'width'])} align={align}>
      <Box sx={ellipsis ? mixins.ellipse() : {}}>{getElement()}</Box>
    </TableCell>
  );
}

// ----- TYPES ------

const CellAlign = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const;

type CellAlign = (typeof CellAlign)[keyof typeof CellAlign];
