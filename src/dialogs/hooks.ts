import React, { useContext } from 'react';

import { DialogsContext } from './context';

import {
  AlertDialog,
  OpenAlertDialogOptions,
  ConfirmDialog,
  OpenConfirmDialogOptions,
  FormDialog,
  OpenFormDialogOptions,
} from './components';

// ----------

export const useDialogs = () => {
  const dialogs = useContext(DialogsContext);

  if (!dialogs) throw Error(`context "DialogsContext" was used without a Provider`);

  return {
    ...dialogs,

    alert(title: React.ReactNode, message: React.ReactNode, options?: OpenAlertDialogOptions) {
      return dialogs.open(AlertDialog, { ...options, title, message });
    },

    confirm(title: React.ReactNode, message: React.ReactNode, options?: OpenConfirmDialogOptions) {
      return dialogs.open(ConfirmDialog, { ...options, title, message });
    },

    form<TComponent extends React.ComponentType<any>>(
      component: TComponent,
      title: React.ReactNode,
      options?: OpenFormDialogOptions,
    ) {
      return dialogs.open(FormDialog, { ...options, component, title });
    },
  };
};
