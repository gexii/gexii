'use client';

import { noop } from 'lodash';
import React, { createElement } from 'react';
import {
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';

// ----------

export interface OpenViewDialogOptions {
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  color?: ButtonProps['color'];
  maxWidth?: DialogProps['maxWidth'];
}

export interface ViewDialogProps<TComponent extends React.ComponentType<any>>
  extends OpenViewDialogOptions {
  open: boolean;
  title: React.ReactNode;
  component: TComponent;
  onClose: (result: Parameters<React.ComponentProps<TComponent>['onSubmit']>[0] | null) => unknown;
}

export default function ViewDialog<TComponent extends React.ComponentType<any>>({
  open,
  component: Content,
  title,
  maxWidth = 'xs',
  onClose: close = noop,
  ...props
}: ViewDialogProps<TComponent>) {
  return (
    <Dialog open={open} fullWidth maxWidth={maxWidth} onClose={() => close(null)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{createElement(Content, { ...props, onClose: close })}</DialogContent>
      <DialogActions />
    </Dialog>
  );
}
