import { createContext, useContext } from 'react';

// ----- TABLE SOURCE -----

export const context = createContext<Record<string, unknown>[]>(null as never);

export const { Provider } = context;

export const useTableSource = () => useContext(context);

// ----- ROW INDEX -----

export const indexContext = createContext(0);

export const IndexProvider = indexContext.Provider;

export const useRowIndex = () => useContext(indexContext);

// ----- SHARED -----

export const HEAD_INDEX = -1;
