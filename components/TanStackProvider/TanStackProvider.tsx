// components/TanStackProvider/TanStackProvider.tsx
'use client';

import React, { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/react-query';

interface Props {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}

export default function TanStackProvider({ children, dehydratedState }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 1000 * 60 } },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
