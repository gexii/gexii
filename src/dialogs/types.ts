export interface DialogKey<TResult = unknown> extends Promise<TResult> {
  key: number;
}

export interface OpenDialog {
  <TDialog extends React.ComponentType<any>>(
    component: TDialog,
    payload: Omit<React.ComponentProps<TDialog>, 'open' | 'onClose'>,
  ): DialogKey<ResultType<TDialog>>;
}

export interface CloseDialog {
  <TResult = void>(key: DialogKey, result?: TResult): void;
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
