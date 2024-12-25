'use client';

import { createORPCReact } from '@orpc/react';
import { createORPCFetchClient } from '@orpc/client';
import { RouterClient } from '@orpc/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import * as React from 'react';
import { router } from './orpc';

export const { orpc, ORPCContext } =
  createORPCReact<RouterClient<typeof router>>();

export function ORPCProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() =>
    createORPCFetchClient<typeof router>({
      baseURL: `${getBaseUrl()}/api`,
    }),
  );
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ORPCContext.Provider value={{ client, queryClient }}>
        {children}
      </ORPCContext.Provider>
    </QueryClientProvider>
  );
}

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // browser should use relative path
    return window.location.origin;
  }
  if (process.env.VERCEL_URL) {
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
