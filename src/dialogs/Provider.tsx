import React, { useRef, useState } from 'react';
import { noop, omit } from 'lodash';

import { CloseDialog, DialogComponent, DialogKey, OpenDialog } from './types';
import { DialogsContext } from './context';

// ----------

export interface DialogsProviderProps {
  children?: React.ReactNode;
}

export default function DialogsProvider({ children }: DialogsProviderProps) {
  const [collection, setCollection] = useState<Record<string, DialogConfig>>({});
  const collectionRef = useRef(collection);
  collectionRef.current = collection;

  // --- FUNCTIONS ----

  const indexRef = useRef(0);
  const uniqueId = () => indexRef.current++;

  const insertItem = (config: Pick<DialogConfig, 'Component' | 'payload'>) => {
    const [promise, resolvePromise] = generateDialogKey();
    setCollection((collection) => ({
      ...collection,
      [promise.key]: { ...config, open: true, promise, resolvePromise },
    }));
    return promise;
  };

  const updateItem = (key: number, updater: Partial<DialogConfig>) => {
    setCollection((collection) => ({ ...collection, [key]: { ...collection[key], ...updater } }));
  };

  const removeItem = (key: number) => {
    setCollection((collection) => omit(collection, key));
  };

  const findItem = (key: number) => collectionRef.current[key];

  const generateDialogKey = () => {
    const key = uniqueId();

    let resolvePromise = noop;
    const promise: DialogKey<never> = Object.assign(
      new Promise<never>((resolve) => {
        resolvePromise = resolve;
      }),
      { key },
    );

    return [promise, resolvePromise] as const;
  };

  // --- PROCEDURES ---

  const openDialog: OpenDialog = (component, payload) => {
    return insertItem({ Component: component, payload });
  };

  const closeDialog: CloseDialog = async (dialog, result) => {
    const awaitedResult = await result;

    const config = findItem(dialog.key);
    if (!config) return;
    updateItem(dialog.key, { open: false });

    // Wait for the dialog to close
    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    removeItem(dialog.key);
    config.resolvePromise(awaitedResult);
  };

  return (
    <DialogsContext.Provider
      value={{
        open: openDialog,
        close: closeDialog,
      }}
    >
      {children}
      {Object.values(collection).map(({ Component, open, promise, payload }) => (
        <Component
          {...payload}
          key={promise.key}
          open={open}
          onClose={(result) => closeDialog(promise, result)}
        />
      ))}
    </DialogsContext.Provider>
  );
}

// ----- INTERNAL TYPES -----

interface DialogConfig {
  Component: DialogComponent<{}>;
  payload: Record<string, unknown>;
  open: boolean;
  promise: DialogKey;
  resolvePromise: (result: unknown) => void;
}
