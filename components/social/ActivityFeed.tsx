'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatTimeAgo } from '@/lib/utils';
import { TrendingUp, TrendingDown, Trophy, Zap, Users } from 'lucide-react';

interface Activity {
    id: string;
    type: 'BET' | 'MARKET_CREATED' | 'MARKET_RESOLVED' | 'LARGE_BET';
    user: string;
    bnsName?: string;
    amount?: number;
    side?: 'YES' | 'NO';
    marketQuestion: string;
    marketId: string;
    outcome?: 'YES' | 'NO';
    timestamp: Date;
    verified?: boolean;
    expert?: boolean;
}

// Mock activities
const mockActivities: Activity[] = [
    {
        id: '1',
        type: 'LARGE_BET',
        user: 'SP2ABC...XYZ',
        bnsName: 'cryptowhale.btc',
        amount: 500,
        side: 'YES',
        marketQuestion: 'Will Bitcoin reach $150,000 by end of Q1 2025?',
        marketId: '1',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        verified: true,
        expert: true
    },
    {
        id: '2',
        type: 'BET',
        user: 'SP1DEF...ABC',
        bnsName: 'trader.btc',
        amount: 100,
        side: 'NO',
        marketQuestion: 'Will there be a US presidential debate before March 2025?',
        marketId: '2',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        verified: false
    },
    {
        id: '3',
        type: 'MARKET_CREATED',
        user: 'SP3GHI...DEF',
        bnsName: 'predictor.btc',
        marketQuestion: 'Will Apple announce a foldable iPhone by WWDC 2025?',
        marketId: '5',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        verified: true
    },
    {
        id: '4',
        type: 'MARKET_RESOLVED',
        marketQuestion: 'Will the Lakers win the 2024-25 NBA Championship?',
        marketId: '4',
        outcome: 'NO',
        user: 'Oracle',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
        id: '5',
        type: 'BET',
        user: 'SP4JKL...GHI',
        amount: 250,
        side: 'YES',
        marketQuestion: 'Will Ethereum pass 5,000 TPS with sharding by June 2025?',
        marketId: '3',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
    }
];

export default function ActivityFeed({ limit }: { limit?: number }) {
    const activities = limit ? mockActivities.slice(0, limit) : mockActivities;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Live Activity
                </h3>
                <Badge variant="secondary" className="animate-pulse">
                    <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    LIVE
                </Badge>
            </div>

            {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
        </div>
    );
}

function ActivityCard({ activity }: { activity: Activity }) {
    const getIcon = () => {
        switch (activity.type) {
            case 'LARGE_BET':
                return <Zap className="h-5 w-5 text-primary" />;
            case 'BET':
                return activity.side === 'YES'
                    ? <TrendingUp className="h-5 w-5 text-green-600" />
                    : <TrendingDown className="h-5 w-5 text-red-600" />;
            case 'MARKET_CREATED':
                return <Trophy className="h-5 w-5 text-primary" />;
            case 'MARKET_RESOLVED':
                return <Trophy className="h-5 w-5 text-yellow-600" />;
            default:
                return <Users className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getMessage = () => {
        const userName = activity.bnsName || `${activity.user.slice(0, 8)}...`;

        switch (activity.type) {
            case 'LARGE_BET':
                return (
                    <>
                        <span className="font-semibold">{userName}</span>
                        {activity.verified && <Badge variant="secondary" className="mx-1 text-xs">✓</Badge>}
                        {activity.expert && <Badge className="mx-1 text-xs bg-primary">Expert</Badge>}
                        <span> bet </span>
                        <span className="font-bold text-primary">{formatCurrency(activity.amount!, 'sBTC')}</span>
                        <span> on </span>
                        <Badge variant={activity.side === 'YES' ? 'default' : 'secondary'} className={activity.side === 'YES' ? 'bg-green-600' : 'bg-red-600'}>
                            {activity.side}
                        </Badge>
                    </>
                );
            case 'BET':
                return (
                    <>
                        <span className="font-semibold">{userName}</span>
                        {activity.verified && <Badge variant="secondary" className="mx-1 text-xs">✓</Badge>}
                        <span> bet </span>
                        <span className="font-semibold">{formatCurrency(activity.amount!, 'sBTC')}</span>
                        <span> on </span>
                        <Badge variant={activity.side === 'YES' ? 'default' : 'secondary'}>
                            {activity.side}
                        </Badge>
                    </>
                );
            case 'MARKET_CREATED':
                return (
                    <>
                        <span className="font-semibold">{userName}</span>
                        {activity.verified && <Badge variant="secondary" className="mx-1 text-xs">✓</Badge>}
                        <span> created a new market</span>
                    </>
                );
            case 'MARKET_RESOLVED':
                return (
                    <>
                        <span>Market resolved as </span>
                        <Badge className={activity.outcome === 'YES' ? 'bg-green-600' : 'bg-red-600'}>
                            {activity.outcome}
                        </Badge>
                    </>
                );
            default:
                return <span>Activity</span>;
        }
    };

    return (
        <Card className={activity.type === 'LARGE_BET' ? 'border-primary bg-primary/5' : ''}>
            <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                        {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap text-sm">
                            {getMessage()}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {activity.marketQuestion}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                            {activity.type === 'LARGE_BET' && (
                                <Badge variant="secondary" className="text-xs">🔥 Whale Alert</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Export avatar component for consistency
export { Avatar, AvatarFallback };
