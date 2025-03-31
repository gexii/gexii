'use client';

import { useEffect, useState } from 'react';

import { EBehavior, Adapter } from './types';

export const adapter: Adapter = {
  useRouter: () => {
    return {
      [EBehavior.REPLACE]: (url: string) => {
        window.history.replaceState({}, '', url);
        window.dispatchEvent(new Event('pushstate'));
      },
      [EBehavior.PUSH]: (url: string) => {
        window.history.pushState({}, '', url);
        window.dispatchEvent(new Event('pushstate'));
      },
    };
  },

  useSearchParams: () => {
    const [searchParams, setSearchParams] = useState(
      () => new URLSearchParams(window.location.search),
    );

    useEffect(() => {
      const handleChange = () => {
        setSearchParams(new URLSearchParams(window.location.search));
      };

      window.addEventListener('popstate', handleChange);
      window.addEventListener('pushstate', handleChange);

      return () => {
        window.removeEventListener('popstate', handleChange);
        window.removeEventListener('pushstate', handleChange);
      };
    }, []);

    return searchParams;
  },
};
