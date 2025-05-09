'use client';

import React, { useContext } from 'react';

import { DialogsContext } from './context';

import {
  AlertDialog,
  OpenAlertDialogOptions,
  ConfirmDialog,
  OpenConfirmDialogOptions,
  FormDialog,
  OpenFormDialogOptions,
  ViewDialog,
  OpenViewDialogOptions,
} from './components';

// ----------

export const useDialogs = () => {
  const dialogs = useContext(DialogsContext);

  if (!dialogs) throw Error(`context "DialogsContext" was used without a Provider`);

  return {
    ...dialogs,

    alert(title: React.ReactNode, message: React.ReactNode, options?: OpenAlertDialogOptions) {
      const payload = { ...options, title, message };
      return dialogs.open(AlertDialog, payload);
    },

    confirm(title: React.ReactNode, message: React.ReactNode, options?: OpenConfirmDialogOptions) {
      const payload = { ...options, title, message };
      return dialogs.open(ConfirmDialog, payload);
    },

    view<TComponent extends React.ComponentType<any>>(
      component: TComponent,
      title: React.ReactNode,
      options?: OpenViewDialogOptions & React.ComponentProps<TComponent>,
    ) {
      const payload = { ...options, title, component };
      return dialogs.open(ViewDialog, payload);
    },

    form<TComponent extends React.ComponentType<any>>(
      component: TComponent,
      title: React.ReactNode,
      options?: OpenFormDialogOptions<TComponent> &
        Omit<React.ComponentProps<TComponent>, 'onSubmit'>,
    ) {
      const payload = {
        ...options,
        title,
        component,
        onOk: options?.onOk as (data: unknown) => void,
      };
      return dialogs.open(FormDialog, payload);
    },
  };
};
