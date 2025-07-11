// ----- ADAPTER -----

interface Router {
  [EBehavior.REPLACE]: (url: string) => void;
  [EBehavior.PUSH]: (url: string) => void;
}

export interface Adapter {
  useRouter: () => Router;
  useSearchParams: () => URLSearchParams;
}

// ----- UPDATE QUERY -----

export interface UpdateQueryOptions {
  /** The behavior to use when updating the query, either `replace` or `push`. */
  behavior?: EBehavior;

  /** The child fields to remove from the query when updating. */
  childFields?: string[];
}

export interface UpdateQuery {
  (entries: [key: string, value: unknown][], options: Required<UpdateQueryOptions>): Promise<void>;
}

// ----- ROUTER BEHAVIORS -----

export type MultipleQueriesFieldRule = { [valueKey: string]: string } | string[];

export const EBehavior = {
  REPLACE: 'replace',
  PUSH: 'push',
} as const;

export type EBehavior = (typeof EBehavior)[keyof typeof EBehavior];

// ----- QUERY FIELD -----

export interface CustomQueryFieldParams {
  value: unknown;
  error: Error | null;
  loading: boolean;
  update: (value?: unknown) => void;
}
