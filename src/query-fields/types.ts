// ----- ADAPTER -----

interface Router {
  [EBehavior.REPLACE]: (url: string) => void;
  [EBehavior.PUSH]: (url: string) => void;
}

export interface Adapter {
  useRouter: () => Router;
  useSearchParams: () => URLSearchParams;
}

// ----- UPDATE QUERY

export interface UpdateQueryOptions {
  behavior?: EBehavior;
  childrenFields?: string[];
}

export interface UpdateQuery {
  (key: string, value: unknown, options: Required<UpdateQueryOptions>): void;
}

// ----- ROUTER BEHAVIORS -----

export const EBehavior = {
  REPLACE: 'replace',
  PUSH: 'push',
} as const;

export type EBehavior = (typeof EBehavior)[keyof typeof EBehavior];
