import React from 'react';

export interface DialogKey<TResult = unknown> extends Promise<TResult> {
  key: number;
  close: (result?: TResult) => Promise<void>;
}

export interface OpenDialog {
  <TDialog extends React.ComponentType<any>>(
    component: TDialog,
    payload: Omit<React.ComponentProps<TDialog>, 'open' | 'onClose'> &
      Partial<Pick<React.ComponentProps<TDialog>, 'onClose'>>,
    options?: OpenDialogOptions,
  ): DialogKey<ResultType<TDialog>>;
}

export interface OpenDialogOptions {
  onCloseError?: (error: Error) => void;
}

export interface CloseDialog {
  <TResult = void>(dialog: DialogKey, result?: TResult): void;
}

export type DialogComponent<
  TPayload extends Record<string, unknown>,
  TResult = void,
> = React.ComponentType<TPayload & { open: boolean; onClose?: (result?: TResult) => void }>;

// --- INTERNAL TYPES ---

type FixResultType<T> = [T] extends [undefined] ? void : T;
type ResultType<TDialog extends React.ComponentType<any>> = FixResultType<
  Parameters<React.ComponentProps<TDialog>['onClose']>[0]
>;
