'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Market, Position } from '@/types/market';
import { mockMarkets, mockPositions } from '@/lib/mockData';

interface MarketsContextType {
    markets: Market[];
    positions: Position[];
    featuredMarkets: Market[];
    getMarket: (id: string) => Market | undefined;
    refreshMarkets: () => void;
}

const MarketsContext = createContext<MarketsContextType | undefined>(undefined);

export function MarketsProvider({ children }: { children: ReactNode }) {
    const [markets] = useState<Market[]>(mockMarkets);
    const [positions] = useState<Position[]>(mockPositions);

    const featuredMarkets = markets.slice(0, 4);

    const getMarket = (id: string) => {
        return markets.find(m => m.id === id);
    };

    const refreshMarkets = () => {
        // In a real app, this would fetch from API
        console.log('Refreshing markets...');
    };

    return (
        <MarketsContext.Provider
            value={{
                markets,
                positions,
                featuredMarkets,
                getMarket,
                refreshMarkets,
            }}
        >
            {children}
        </MarketsContext.Provider>
    );
}

export function useMarkets() {
    const context = useContext(MarketsContext);
    if (context === undefined) {
        throw new Error('useMarkets must be used within a MarketsProvider');
    }
    return context;
}
