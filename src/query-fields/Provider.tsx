'use client';

import { ZodTypeAny } from 'zod';
import { isEqual, isNil, omitBy } from 'lodash';
import { useCallback, useContext, useRef, useState } from 'react';

import { useTransitionCallback, useUpdateEffect } from 'src/hooks';

import { ConfigContext, ValueContext, UpdateContext } from './context';
import { Adapter, UpdateQuery } from './types';

// ----------

export interface QueryFieldProviderProps {
  children: React.ReactNode;
  schema?: ZodTypeAny;
  adapter?: Adapter;
}

export default function QueryFieldProvider({ children, schema }: QueryFieldProviderProps) {
  const adapter = useContext(ConfigContext);
  const modifyingSearchParamsRef = useRef<URLSearchParams>(null);
  const searchParams = adapter.useSearchParams();
  const router = adapter.useRouter();

  const [query, setQuery] = useState<Record<string, unknown>>(() =>
    parseBy(new URLSearchParams(window.location.search), schema),
  );
  const queryRef = useRef(query);
  queryRef.current = query;

  // --- FUNCTIONS ---

  const update = useTransitionCallback<UpdateQuery>(
    async (key, value, { behavior, childFields }) => {
      const searchParams = getModifyingSearchParams();
      searchParams.set(key, value as string);

      childFields.forEach((field) => {
        searchParams.delete(field);
      });

      searchParams.entries().forEach(([key, value]) => {
        if (value === '' || isNil(value)) {
          searchParams.delete(key);
        }
      });

      parseBy(searchParams, schema);

      router[behavior](`?${searchParams.toString()}`);
    },
  );

  const updateQuery = useCallback<UpdateQuery>(async (...args) => {
    if (!modifyingSearchParamsRef.current)
      modifyingSearchParamsRef.current = getModifyingSearchParams();

    await update(...args);
    modifyingSearchParamsRef.current = null;
  }, []);

  const getModifyingSearchParams = () => {
    if (modifyingSearchParamsRef.current) return modifyingSearchParamsRef.current;
    return new URLSearchParams(window.location.search);
  };

  // --- EFFECTS ---

  useUpdateEffect(() => {
    setQuery((prevState) => {
      const query = parseBy(searchParams, schema);
      if (isEqual(query, prevState)) return prevState;
      return query;
    });
  }, [searchParams]);

  return (
    <UpdateContext.Provider value={updateQuery}>
      <ValueContext.Provider value={query}>{children}</ValueContext.Provider>
    </UpdateContext.Provider>
  );
}

// ----- HELPERS -----

function parseBy(searchParams: URLSearchParams, schema?: ZodTypeAny) {
  const query = omitBy(
    Object.fromEntries(searchParams.entries()),
    (value) => value === '' || isNil(value),
  );

  if (schema) return schema.parse(query);

  return query;
}
