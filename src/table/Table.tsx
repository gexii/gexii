'use client';

import React, { forwardRef } from 'react';
import {
  Table as MuiTable,
  TableProps as MuiTableProps,
  TableHead,
  TableBody,
  TableRow,
  TableRowProps,
  BoxProps,
} from '@mui/material';

import { Provider, IndexProvider, HEAD_INDEX } from './context';

// ----------

export interface TableProps extends MuiTableProps {
  source?: any[];
  keyIndex?: string | null;
  minHeight?: number;
  containerProps?: BoxProps;
  getRowProps?: (item: any, index: number) => TableRowProps;
}

export default forwardRef(function Table(
  { source = [], keyIndex, children, getRowProps, ...props }: TableProps,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  return (
    <MuiTable {...props} ref={ref}>
      <Provider value={source}>
        <TableHead>
          <IndexProvider value={HEAD_INDEX}>
            <TableRow {...getRowProps?.({}, -1)}>{children}</TableRow>
          </IndexProvider>
        </TableHead>

        <TableBody>
          {source.map((item, i) => (
            <IndexProvider key={String(keyIndex ? item[keyIndex] : i)} value={i}>
              <TableRow {...getRowProps?.(item, i)}>{children}</TableRow>
            </IndexProvider>
          ))}
        </TableBody>
      </Provider>
    </MuiTable>
  );
});
