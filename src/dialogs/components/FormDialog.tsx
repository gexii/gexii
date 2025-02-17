import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import { noop } from 'lodash';
import React, { createElement, useRef } from 'react';
import { useBoolean } from 'react-use';

// ----------

export interface OpenFormDialogOptions {
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  color?: ButtonProps['color'];
  maxWidth?: DialogProps['maxWidth'];
}

export interface FormDialogProps<TComponent extends React.ComponentType<any>>
  extends OpenFormDialogOptions {
  open: boolean;
  title: React.ReactNode;
  component: TComponent;
  onClose: (result: Parameters<React.ComponentProps<TComponent>['onSubmit']>[0] | null) => unknown;
}

export default function FormDialog<TComponent extends React.ComponentType<any>>({
  open,
  component: FormContent,
  title,
  color,
  okText = 'Ok',
  cancelText = 'Cancel',
  maxWidth = 'md',
  onClose: close = noop,
}: FormDialogProps<TComponent>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useBoolean(false);

  // --- FUNCTIONS ---

  const requestSubmit = () => {
    formRef.current?.requestSubmit();
  };

  // --- HANDLERS ---

  const handleSubmit = async (data: unknown) => {
    try {
      setLoading(true);
      await close(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} maxWidth={maxWidth} onClose={() => close(null)}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {createElement(FormContent, { ref: formRef, onSubmit: handleSubmit })}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color={color} onClick={() => close(null)}>
          {cancelText}
        </Button>
        <Button loading={loading} variant="contained" color={color} onClick={() => requestSubmit()}>
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
