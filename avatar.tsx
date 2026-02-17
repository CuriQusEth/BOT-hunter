'use client';

/**
 * Web3Provider Component
 * 
 * Wraps the application with Wagmi and React Query providers
 * enabling Web3 wallet connections and transaction capabilities
 */

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi-config';
import type { ReactNode } from 'react';

/**
 * Create React Query client with optimized settings
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 30000, // 30 seconds
    },
  },
});

/**
 * Web3Provider props
 */
interface Web3ProviderProps {
  children: ReactNode;
}

/**
 * Web3Provider component
 * 
 * Provides Web3 context to the entire application
 * Must be placed high in the component tree
 * 
 * @example
 * ```tsx
 * <Web3Provider>
 *   <App />
 * </Web3Provider>
 * ```
 */
export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
