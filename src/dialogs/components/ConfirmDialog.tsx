'use client';

import React from 'react';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import { noop } from 'lodash';

import { combineCallbacks } from 'src/utils';
import { useAction } from 'src/hooks';

// ----------

export interface OpenConfirmDialogOptions {
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  color?: ButtonProps['color'];
  maxWidth?: DialogProps['maxWidth'];
  onOk?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

export interface ConfirmDialogProps extends OpenConfirmDialogOptions {
  open: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
  onClose: (confirmed: boolean) => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  color,
  okText = 'Ok',
  cancelText = 'Cancel',
  maxWidth = 'sm',
  onOk,
  onCancel,
  onClose: close = noop,
}: ConfirmDialogProps) {
  const ok = useAction(combineCallbacks.sequential(onOk, () => close(true)));
  const cancel = useAction(combineCallbacks.sequential(onCancel, () => close(false)));

  return (
    <Dialog open={open} fullWidth maxWidth={maxWidth} onClose={() => cancel.call()}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText component="div">{message}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color={color}
          loading={cancel.isLoading()}
          onClick={() => cancel.call()}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color={color}
          loading={ok.isLoading()}
          onClick={() => ok.call()}
        >
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
