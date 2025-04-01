'use client';

import { createContext } from 'react';

import { UpdateQuery, Adapter } from './types';
import { adapter } from './adapter';

export const ValueContext = createContext<Record<string, unknown>>({} as never);
export const UpdateContext = createContext<UpdateQuery>(async () => {});
export const ConfigContext = createContext<Adapter>(adapter);
