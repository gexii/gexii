'use client';

import { get, isNumber, noop } from 'lodash';
import React, { cloneElement, ForwardedRef, forwardRef } from 'react';
import {
  IconButton,
  IconButtonProps,
  Stack,
  StackProps,
  SvgIcon,
  SvgIconProps,
} from '@mui/material';

import { combineCallbacks } from 'src/utils';

// ----------

export interface NumberIncrementerProps
  extends Omit<StackProps, 'children' | 'direction' | 'value' | 'onChange'> {
  children: React.ReactElement;
  value?: number;
  increaseAmount?: number;
  min?: number;
  max?: number;
  error?: boolean;

  slots?: {
    decreasementIcon?: React.ReactElement;
    increasementIcon?: React.ReactElement;
  };

  slotProps?: {
    decreasement?: IconButtonProps;
    increasement?: IconButtonProps;
  };

  onChange?: (value: number) => void;
}

export default forwardRef(function NumberIncrementer(
  {
    children,
    value,
    increaseAmount = 1,
    min,
    max,
    error,
    slots,
    slotProps,
    onChange: setValue = noop,
    ...props
  }: NumberIncrementerProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  // --- FUNCTIONS ---

  const addAmount = (amount: number) => {
    const newValue = (value || 0) + amount;

    if (isNumber(max) && newValue > max) return setValue(max);
    if (isNumber(min) && newValue < min) return setValue(min);

    setValue(newValue);
  };

  return (
    <Stack {...props} ref={ref} direction="row" spacing={props.spacing ?? 0.5}>
      <IconButton
        {...slotProps?.decreasement}
        size="small"
        disabled={isNumber(min) && (value || 0) <= min}
        onClick={combineCallbacks(
          () => addAmount(-increaseAmount),
          slotProps?.decreasement?.onClick,
        )}
      >
        {slots?.decreasementIcon ?? <DecreasementIcon fontSize="inherit" />}
      </IconButton>

      {cloneElement(children, {
        value,
        min: get(children.props, 'min', min),
        max: get(children.props, 'max', max),
        error,
        onChange: setValue,
      } as never)}

      <IconButton
        {...slotProps?.increasement}
        size="small"
        disabled={isNumber(max) && (value || 0) >= max}
        onClick={combineCallbacks(
          () => addAmount(increaseAmount),
          slotProps?.increasement?.onClick,
        )}
      >
        {slots?.increasementIcon ?? <IncreasementIcon fontSize="inherit" />}
      </IconButton>
    </Stack>
  );
});

// ----- INTERNAL COMPONENTS -----

function DecreasementIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M7 11v2h10v-2zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8" />
    </SvgIcon>
  );
}

function IncreasementIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8" />
    </SvgIcon>
  );
}
