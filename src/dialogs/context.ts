'use client';

import { createContext } from 'react';
import { CloseDialog, OpenDialog } from './types';

// ----------

export const DialogsContext = createContext<{
  open: OpenDialog;
  close: CloseDialog;
} | null>(null);
