'use client';

import { ConfigContext } from './context';
import { Adapter } from './types';

export default function QueryFieldConfigProvider({
  children,
  adapter,
}: React.PropsWithChildren<{ adapter: Adapter }>) {
  return <ConfigContext.Provider value={adapter}>{children}</ConfigContext.Provider>;
}
