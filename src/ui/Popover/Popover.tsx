'use client';

import { get, noop } from 'lodash';
import React, { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  CSSObject,
  Popover as MuiPopover,
  PopoverProps as MuiPopoverProps,
  PopoverPaperProps,
  styled,
} from '@mui/material';

import { combineCallbacks } from 'src/utils';
import { useSleep, useUpdateEffect } from 'src/hooks';

import { blurCurrentElement, createListenerControl, isInside } from './helpers';

// ----------

export interface PopoverProps
  extends Omit<MuiPopoverProps, 'children' | 'open' | 'anchorEl' | 'content' | 'onClose'> {
  variant?: EVariant;
  children: React.ReactElement;
  disabled?: boolean;
  spacing?: CSSObject['padding'];
  spacingX?: CSSObject['padding'];
  spacingY?: CSSObject['padding'];
  content: React.ReactNode | (() => React.ReactNode);
  onOpen?: () => void;
  onClose?: () => void;
}

export default function Popover({
  variant = EVariant.CLICK,
  children,
  content,
  disabled = false,
  spacing,
  spacingX = spacing,
  spacingY = spacing,
  onOpen = noop,
  onClose = noop,
  ...props
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // --- FUNCTIONS ---

  const sleep = useSleep();

  const popoverOpen = useMemo(() => {
    if (disabled) return false;
    if (variant === EVariant.ALWAYS) return true;
    return open;
  }, [open, variant, disabled]);

  const openPopover = () => setOpen(true);

  const closePopover = () => setOpen(false);

  // --- PROPS ---

  const paperProps: PopoverPaperProps = (...args) => {
    const paperProps = {
      ...(typeof props.slotProps?.paper === 'function'
        ? props.slotProps?.paper(...args)
        : props.slotProps?.paper),
    };
    return {
      ...paperProps,
      onMouseLeave: combineCallbacks(
        variant === EVariant.HOVER && closePopover,
        paperProps.onMouseLeave,
      ),
    };
  };

  const overwriteChildrenProps = {
    onClick: combineCallbacks(
      variant === EVariant.CLICK && openPopover,
      get(children, ['props', 'onClick']),
    ),

    onFocus: combineCallbacks(
      variant === EVariant.FOCUS && openPopover,
      get(children, ['props', 'onFocus']),
    ),
    onBlur: combineCallbacks(
      variant === EVariant.FOCUS && closePopover,
      get(children, ['props', 'onBlur']),
    ),

    onMouseEnter: combineCallbacks(
      variant === EVariant.HOVER && openPopover,
      get(children, ['props', 'onMouseEnter']),
    ),
  };

  // --- EFFECTS ---

  // Effect for click variant
  useEffect(() => {
    if (variant !== EVariant.CLICK) return;
    if (!popoverOpen) return;

    // Close popover when user clicks outside the popover
    const listener = createListenerControl('mousedown', (event) => {
      if (isInside(popoverRef.current, event.target)) return;
      closePopover();
    });

    sleep().then(listener.attach);
    return listener.cleanup;
  }, [variant, popoverOpen]);

  useEffect(() => {
    if (!popoverOpen) return;

    // Close popover when user scrolls outside the popover
    const listener = createListenerControl('wheel', (event) => {
      if (isInside(popoverRef.current, event.target)) return;
      blurCurrentElement();
      closePopover();
      listener.cleanup();
    });

    listener.attach();
    return listener.cleanup;
  }, [popoverOpen]);

  useUpdateEffect(() => {
    if (popoverOpen) onOpen();
    else onClose();
  }, [popoverOpen]);

  return (
    <Box position="relative" onMouseLeave={variant === EVariant.HOVER ? closePopover : undefined}>
      <StyledPopover
        {...props}
        ref={popoverRef}
        open={popoverOpen}
        disableAutoFocus
        disableEnforceFocus
        anchorEl={anchorRef.current as Element}
        variant={variant}
        onClose={closePopover}
        slotProps={{ paper: paperProps }}
      >
        <Box sx={{ pointerEvents: 'auto' }}>
          {content instanceof Function ? content() : content}
        </Box>
      </StyledPopover>

      <AnchorHolder
        ref={anchorRef}
        sx={(theme) => {
          const paddingX = typeof spacingX === 'number' ? theme.spacing(spacingX) : spacingX;
          const paddingY = typeof spacingY === 'number' ? theme.spacing(spacingY) : spacingY;
          return {
            paddingX: spacingX,
            paddingY: spacingY,
            marginLeft: `calc(${paddingX} * -1)`,
            marginTop: `calc(${paddingY} * -1)`,
          };
        }}
      />

      {cloneElement(children, overwriteChildrenProps)}
    </Box>
  );
}

// ----- TYPES -----

const EVariant = {
  HOVER: 'hover',
  CLICK: 'click',
  FOCUS: 'focus',
  ALWAYS: 'always',
} as const;

type EVariant = (typeof EVariant)[keyof typeof EVariant];

// ----- STYLED -----

const StyledPopover = styled(MuiPopover)<{ variant: EVariant }>(({ variant }) =>
  variant !== EVariant.CLICK ? { pointerEvents: 'none' } : {},
);

const AnchorHolder = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  boxSizing: 'content-box',
}));
