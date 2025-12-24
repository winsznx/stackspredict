import { Market, UserProfile, Comment, PricePoint, Position } from '@/types/market';

// Create dates relative to now
const now = new Date();
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * oneDay;

// Mock markets data
export const mockMarkets: Market[] = [
    {
        id: '1',
        question: 'Will Bitcoin reach $150,000 by end of Q1 2025?',
        category: 'Crypto',
        yesPrice: 67,
        noPrice: 33,
        volume24h: 24.5,
        totalVolume: 156.8,
        endDate: new Date(now.getTime() + 45 * oneDay),
        settlementSource: 'CoinGecko API',
        creator: 'SP2ABC...XYZ',
        resolved: false,
        createdAt: new Date(now.getTime() - 15 * oneDay),
        description: 'This market resolves YES if Bitcoin (BTC) reaches or exceeds $150,000 on CoinGecko at any point before March 31, 2025 23:59:59 UTC.',
        liquidity: 180.5,
    },
    {
        id: '2',
        question: 'Will there be a US presidential debate before March 2025?',
        category: 'Politics',
        yesPrice: 45,
        noPrice: 55,
        volume24h: 18.2,
        totalVolume: 89.3,
        endDate: new Date(now.getTime() + 60 * oneDay),
        settlementSource: 'Associated Press',
        creator: 'SP1DEF...ABC',
        resolved: false,
        createdAt: new Date(now.getTime() - 8 * oneDay),
        description: 'Resolves YES if an official US presidential debate is held before March 1, 2025, as confirmed by the Associated Press.',
        liquidity: 95.2,
    },
    {
        id: '3',
        question: 'Will Ethereum pass 5,000 TPS with sharding by June 2025?',
        category: 'Crypto',
        yesPrice: 38,
        noPrice: 62,
        volume24h: 12.7,
        totalVolume: 67.4,
        endDate: new Date(now.getTime() + 150 * oneDay),
        settlementSource: 'Ethereum Foundation',
        creator: 'SP3GHI...DEF',
        resolved: false,
        createdAt: new Date(now.getTime() - 20 * oneDay),
        description: 'Market resolves YES if Ethereum mainnet processes 5,000+ transactions per second with sharding enabled, verified by Ethereum Foundation.',
        liquidity: 72.1,
    },
    {
        id: '4',
        question: 'Will the Lakers win the 2024-25 NBA Championship?',
        category: 'Sports',
        yesPrice: 28,
        noPrice: 72,
        volume24h: 31.5,
        totalVolume: 201.3,
        endDate: new Date(now.getTime() + 180 * oneDay),
        settlementSource: 'ESPN Official Results',
        creator: 'SP4JKL...GHI',
        resolved: false,
        createdAt: new Date(now.getTime() - 45 * oneDay),
        description: 'Resolves YES if the Los Angeles Lakers win the 2024-2025 NBA Championship, as confirmed by ESPN.',
        liquidity: 215.8,
    },
    {
        id: '5',
        question: 'Will Apple announce a foldable iPhone by WWDC 2025?',
        category: 'Technology',
        yesPrice: 22,
        noPrice: 78,
        volume24h: 9.8,
        totalVolume: 45.6,
        endDate: new Date(now.getTime() + 120 * oneDay),
        settlementSource: 'Apple Official Announcement',
        creator: 'SP5MNO...JKL',
        resolved: false,
        createdAt: new Date(now.getTime() - 10 * oneDay),
        description: 'Market resolves YES if Apple officially announces a foldable iPhone model at or before WWDC 2025 (typically June).',
        liquidity: 50.2,
    },
    {
        id: '6',
        question: 'Will AI generate a movie that grosses $100M+ by end of 2025?',
        category: 'Entertainment',
        yesPrice: 15,
        noPrice: 85,
        volume24h: 7.2,
        totalVolume: 28.9,
        endDate: new Date(now.getTime() + 300 * oneDay),
        settlementSource: 'Box Office Mojo',
        creator: 'SP6PQR...MNO',
        resolved: false,
        createdAt: new Date(now.getTime() - 5 * oneDay),
        description: 'Resolves YES if a feature film generated primarily by AI (70%+ of production) grosses $100M+ worldwide by Dec 31, 2025, per Box Office Mojo.',
        liquidity: 32.5,
    },
    {
        id: '7',
        question: 'Will Stacks sBTC TVL exceed $1 Billion by Q2 2025?',
        category: 'Crypto',
        yesPrice: 58,
        noPrice: 42,
        volume24h: 19.4,
        totalVolume: 112.7,
        endDate: new Date(now.getTime() + 90 * oneDay),
        settlementSource: 'DeFi Llama',
        creator: 'SP7STU...PQR',
        resolved: false,
        createdAt: new Date(now.getTime() - 12 * oneDay),
        description: 'Market resolves YES if Stacks sBTC Total Value Locked (TVL) reaches or exceeds $1 Billion by June 30, 2025, as tracked on DeFi Llama.',
        liquidity: 125.3,
    },
    {
        id: '8',
        question: 'Will global temperatures set a new record high in 2025?',
        category: 'Other',
        yesPrice: 71,
        noPrice: 29,
        volume24h: 5.3,
        totalVolume: 34.2,
        endDate: new Date(now.getTime() + 365 * oneDay),
        settlementSource: 'NOAA / NASA',
        creator: 'SP8VWX...STU',
        resolved: false,
        createdAt: new Date(now.getTime() - 30 * oneDay),
        description: 'Resolves YES if 2025 is confirmed as the hottest year on record globally by NOAA or NASA climate data.',
        liquidity: 38.7,
    },
];

// Mock user profiles
export const mockUsers: UserProfile[] = [
    {
        address: 'SP2ABC...XYZ',
        username: 'CryptoWhale',
        totalProfit: 45.7,
        totalVolume: 234.5,
        winRate: 68.5,
        currentStreak: 7,
        marketsTraded: 42,
        expert: true,
        expertCategory: 'Crypto',
        twitterHandle: '@cryptowhale',
        verified: true,
    },
    {
        address: 'SP1DEF...ABC',
        username: 'PoliPredictor',
        totalProfit: 32.3,
        totalVolume: 189.2,
        winRate: 64.2,
        currentStreak: 3,
        marketsTraded: 28,
        expert: true,
        expertCategory: 'Politics',
        verified: true,
    },
    {
        address: 'SP3GHI...DEF',
        username: 'TechOracle',
        totalProfit: 28.1,
        totalVolume: 156.8,
        winRate: 71.3,
        currentStreak: 12,
        marketsTraded: 35,
        expert: true,
        expertCategory: 'Technology',
        verified: true,
    },
];

// Mock price history
export const generatePriceHistory = (marketId: string, days: number = 7): PricePoint[] => {
    const market = mockMarkets.find(m => m.id === marketId);
    if (!market) return [];

    const points: PricePoint[] = [];
    const currentPrice = market.yesPrice;
    const startPrice = currentPrice - (Math.random() * 20 - 10);

    for (let i = days; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * oneDay);
        const progress = 1 - (i / days);
        const randomWalk = Math.random() * 10 - 5;
        const yesPrice = Math.max(10, Math.min(90,
            startPrice + (currentPrice - startPrice) * progress + randomWalk
        ));

        points.push({
            timestamp,
            yesPrice,
            noPrice: 100 - yesPrice,
            volume: Math.random() * 5 + 1,
        });
    }

    return points;
};

// Mock user positions
export const mockPositions: Position[] = [
    {
        marketId: '1',
        market: mockMarkets[0],
        shares: 150,
        side: 'YES',
        averagePrice: 62,
        currentValue: 100.5,
        unrealizedPnL: 7.5,
        unrealizedPnLPercentage: 8.06,
    },
    {
        marketId: '2',
        market: mockMarkets[1],
        shares: 200,
        side: 'NO',
        averagePrice: 58,
        currentValue: 110,
        unrealizedPnL: -6,
        unrealizedPnLPercentage: -5.17,
    },
    {
        marketId: '7',
        market: mockMarkets[6],
        shares: 100,
        side: 'YES',
        averagePrice: 55,
        currentValue: 58,
        unrealizedPnL: 3,
        unrealizedPnLPercentage: 5.45,
    },
];

// Mock comments
export const mockComments: Comment[] = [
    {
        id: '1',
        marketId: '1',
        user: mockUsers[0],
        content: 'Bitcoin has broken through key resistance levels. The halving effect combined with institutional adoption makes $150K very likely by Q1.',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        upvotes: 24,
        downvotes: 3,
        position: {
            side: 'YES',
            shares: 500,
        },
    },
    {
        id: '2',
        marketId: '1',
        user: mockUsers[1],
        content: 'Macro conditions suggest otherwise. Fed policy and global economic uncertainty could keep BTC below $120K through Q1.',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        upvotes: 15,
        downvotes: 8,
        position: {
            side: 'NO',
            shares: 300,
        },
    },
];

// Helper to get featured markets
export const getFeaturedMarkets = (): Market[] => {
    return mockMarkets.slice(0, 4);
};

// Helper to get markets by category
export const getMarketsByCategory = (category: string): Market[] => {
    if (category === 'All') return mockMarkets;
    return mockMarkets.filter(m => m.category === category);
};

// Helper to search markets
export const searchMarkets = (query: string): Market[] => {
    const lowerQuery = query.toLowerCase();
    return mockMarkets.filter(m =>
        m.question.toLowerCase().includes(lowerQuery) ||
        m.category.toLowerCase().includes(lowerQuery)
    );
};
