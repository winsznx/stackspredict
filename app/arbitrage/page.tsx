'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatPercentage, formatTimeAgo } from '@/lib/utils';
import { TrendingUp, Bell, ExternalLink, AlertTriangle, Zap } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ArbitrageOpportunity {
    id: string;
    marketQuestion: string;
    marketId: string;
    buyFrom: {
        platform: string;
        side: 'YES' | 'NO';
        price: number;
    };
    sellTo: {
        platform: string;
        side: 'YES' | 'NO';
        price: number;
    };
    profitPercentage: number;
    requiredCapital: number;
    volume24h: number;
    lastUpdated: Date;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Mock data - will be replaced with real API
const mockOpportunities: ArbitrageOpportunity[] = [
    {
        id: '1',
        marketQuestion: 'Will Bitcoin reach $150,000 by end of Q1 2025?',
        marketId: '1',
        buyFrom: { platform: 'StacksPredict', side: 'YES', price: 62 },
        sellTo: { platform: 'Polymarket', side: 'YES', price: 68 },
        profitPercentage: 9.7,
        requiredCapital: 100,
        volume24h: 45.5,
        lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
        risk: 'LOW'
    },
    {
        id: '2',
        marketQuestion: 'Will there be a US presidential debate before March 2025?',
        marketId: '2',
        buyFrom: { platform: 'Polymarket', side: 'NO', price: 52 },
        sellTo: { platform: 'StacksPredict', side: 'NO', price: 58 },
        profitPercentage: 11.5,
        requiredCapital: 200,
        volume24h: 28.3,
        lastUpdated: new Date(Date.now() - 12 * 60 * 1000),
        risk: 'MEDIUM'
    },
    {
        id: '3',
        marketQuestion: 'Will Ethereum pass 5,000 TPS with sharding by June 2025?',
        marketId: '3',
        buyFrom: { platform: 'StacksPredict', side: 'YES', price: 35 },
        sellTo: { platform: 'Kalshi', side: 'YES', price: 42 },
        profitPercentage: 20.0,
        requiredCapital: 50,
        volume24h: 12.1,
        lastUpdated: new Date(Date.now() - 3 * 60 * 1000),
        risk: 'HIGH'
    },
];

export default function ArbitragePage() {
    const [sortBy, setSortBy] = useState<'profit' | 'volume' | 'risk'>('profit');
    const [alertsEnabled, setAlertsEnabled] = useState(false);

    const sortedOpportunities = [...mockOpportunities].sort((a, b) => {
        if (sortBy === 'profit') return b.profitPercentage - a.profitPercentage;
        if (sortBy === 'volume') return b.volume24h - a.volume24h;
        const riskOrder = { LOW: 0, MEDIUM: 1, HIGH: 2 };
        return riskOrder[a.risk] - riskOrder[b.risk];
    });

    const totalOpportunities = sortedOpportunities.length;
    const avgProfit = sortedOpportunities.reduce((sum, o) => sum + o.profitPercentage, 0) / totalOpportunities;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Arbitrage Dashboard</h1>
                        <p className="text-muted-foreground">
                            Find price differences across prediction markets and profit from inefficiencies
                        </p>
                    </div>
                    <Button
                        variant={alertsEnabled ? 'default' : 'outline'}
                        className={alertsEnabled ? 'bg-primary hover:bg-primary/90' : ''}
                        onClick={() => setAlertsEnabled(!alertsEnabled)}
                    >
                        <Bell className="h-4 w-4 mr-2" />
                        {alertsEnabled ? 'Alerts On' : 'Enable Alerts'}
                    </Button>
                </div>

                {/* Alert Banner */}
                {alertsEnabled && (
                    <Card className="border-primary bg-primary/5">
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Zap className="h-4 w-4 text-primary" />
                                <span>You'll be notified when arbitrage opportunities exceed 10% profit</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">Active Opportunities</p>
                            <p className="text-3xl font-bold text-foreground">{totalOpportunities}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">Avg Profit Potential</p>
                            <p className="text-3xl font-bold text-primary">{formatPercentage(avgProfit, 1)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">High Profit ({'>'}15%)</p>
                            <p className="text-3xl font-bold text-foreground">
                                {sortedOpportunities.filter(o => o.profitPercentage > 15).length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sort Controls */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sort by:</span>
                            <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                                <TabsList>
                                    <TabsTrigger value="profit">Highest Profit</TabsTrigger>
                                    <TabsTrigger value="volume">Volume</TabsTrigger>
                                    <TabsTrigger value="risk">Lowest Risk</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Last updated: {formatTimeAgo(new Date())}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Opportunities List */}
            <div className="space-y-4">
                {sortedOpportunities.map((opp) => (
                    <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Market Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <Link href={`/market/${opp.marketId}`}>
                                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                                                {opp.marketQuestion}
                                            </h3>
                                        </Link>
                                        <Badge
                                            variant={opp.risk === 'LOW' ? 'default' : 'secondary'}
                                            className={
                                                opp.risk === 'LOW' ? 'bg-green-500' :
                                                    opp.risk === 'MEDIUM' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                            }
                                        >
                                            {opp.risk} RISK
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <p className="text-xs text-green-700 mb-1">BUY FROM</p>
                                            <p className="font-semibold text-green-900">{opp.buyFrom.platform}</p>
                                            <p className="text-sm text-green-800">
                                                {opp.buyFrom.side} @ {formatPercentage(opp.buyFrom.price, 0)}
                                            </p>
                                        </div>
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                            <p className="text-xs text-orange-700 mb-1">SELL TO</p>
                                            <p className="font-semibold text-orange-900">{opp.sellTo.platform}</p>
                                            <p className="text-sm text-orange-800">
                                                {opp.sellTo.side} @ {formatPercentage(opp.sellTo.price, 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Profit Info */}
                                <div className="lg:w-64 bg-primary/5 rounded-lg p-4 border-2 border-primary">
                                    <p className="text-sm text-muted-foreground mb-2">Potential Profit</p>
                                    <p className="text-4xl font-bold text-primary mb-3">
                                        {formatPercentage(opp.profitPercentage, 1)}
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Required Capital</span>
                                            <span className="font-medium">{formatCurrency(opp.requiredCapital, 'sBTC')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">24h Volume</span>
                                            <span className="font-medium">{formatCurrency(opp.volume24h, 'sBTC')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Updated</span>
                                            <span className="font-medium">{formatTimeAgo(opp.lastUpdated)}</span>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 bg-primary hover:bg-primary/90" asChild>
                                        <Link href={`/market/${opp.marketId}`}>
                                            Execute Trade
                                            <ExternalLink className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* How It Works */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>How Arbitrage Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        <strong className="text-foreground">1. Price Discovery:</strong> We monitor prices across StacksPredict, Polymarket, and Kalshi in real-time
                    </p>
                    <p>
                        <strong className="text-foreground">2. Opportunity Detection:</strong> When the same market has different prices on different platforms, we alert you
                    </p>
                    <p>
                        <strong className="text-foreground">3. Execute:</strong> Buy shares on the cheaper platform, sell on the more expensive one
                    </p>
                    <p>
                        <strong className="text-foreground">4. Profit:</strong> Pocket the difference as pure arbitrage profit
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                        <p className="text-yellow-800">
                            <strong>⚠️ Risk Warning:</strong> Arbitrage requires capital on multiple platforms and prices can move quickly. Always verify liquidity before trading.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
