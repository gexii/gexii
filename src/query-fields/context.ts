'use client';

import { createContext } from 'react';

import { Adapter, UpdateQuery } from './types';
import { adapter } from './adapter';

export const ValueContext = createContext<Record<string, unknown>>({} as never);
export const UpdateContext = createContext<UpdateQuery>(null as never);
export const ConfigContext = createContext<Adapter>(adapter);
