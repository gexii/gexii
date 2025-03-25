'use client';

import { noop } from 'lodash';
import React, { createElement, useRef } from 'react';
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';

import { useAction } from 'src/hooks';
import { combineCallbacks } from 'src/utils';

import { DialogKey } from '../types';

// ----------

export interface OpenFormDialogOptions<TComponent extends React.ComponentType<any>> {
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  color?: ButtonProps['color'];
  maxWidth?: DialogProps['maxWidth'];
  onOk?: (data: Awaited<SubmitReturn<TComponent>>) => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}

export interface FormDialogProps<TComponent extends React.ComponentType<any>>
  extends OpenFormDialogOptions<TComponent> {
  open: boolean;
  title: React.ReactNode;
  component: TComponent;
  onClose: (result: SubmitReturn<TComponent> | null) => unknown;
}

export default function FormDialog<TComponent extends React.ComponentType<any>>({
  open,
  component: FormContent,
  title,
  color,
  okText = 'Submit',
  cancelText = 'Cancel',
  maxWidth = 'xs',
  onOk = noop,
  onCancel = noop,
  onClose: close = noop,
  ...props
}: FormDialogProps<TComponent>) {
  const formRef = useRef<HTMLFormElement>(null);

  // --- FUNCTIONS ---

  const ok = useAction(onOk);
  const cancel = useAction(combineCallbacks.sequential(onCancel, () => close(null)));

  const requestSubmit = () => {
    formRef.current?.requestSubmit();
  };

  // --- HANDLERS ---

  const handleSubmit = useAction(async (data: SubmitReturn<TComponent>) => {
    const submission = (async () => {
      const awaitedData = await data;
      await ok.call(awaitedData);
      return awaitedData;
    })();

    await close(submission);
    await submission;
  });

  return (
    <Dialog open={open} fullWidth maxWidth={maxWidth} onClose={() => cancel.call()}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {createElement(FormContent, { ...props, ref: formRef, onSubmit: handleSubmit.call })}
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
          loading={handleSubmit.isLoading()}
          variant="contained"
          color={color}
          onClick={() => requestSubmit()}
        >
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FormDialog.isCancelled = async (dialog: DialogKey) => (await dialog) === null;

// ----- TYPES -----

type SubmitReturn<T extends React.ComponentType<any>> = Parameters<
  React.ComponentProps<T>['onSubmit']
>[0];
