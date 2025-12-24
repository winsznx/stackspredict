'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { WalletProvider } from './WalletContext';
import { MarketsProvider } from './MarketsContext';

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                refetchOnWindowFocus: false,
            },
        },
    }));

    // Always render all providers - WalletProvider handles SSR internally
    return (
        <QueryClientProvider client={queryClient}>
            <WalletProvider>
                <MarketsProvider>
                    {children}
                </MarketsProvider>
            </WalletProvider>
        </QueryClientProvider>
    );
}

export default Providers;
