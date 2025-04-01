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
  (key: string, value: unknown, options: Required<UpdateQueryOptions>): Promise<void>;
}

// ----- ROUTER BEHAVIORS -----

export const EBehavior = {
  REPLACE: 'replace',
  PUSH: 'push',
} as const;

export type EBehavior = (typeof EBehavior)[keyof typeof EBehavior];
