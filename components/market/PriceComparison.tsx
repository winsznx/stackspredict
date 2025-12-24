'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { ExternalLink, TrendingUp, TrendingDown, Trophy } from 'lucide-react';

interface PriceData {
    platform: 'StacksPredict' | 'Polymarket' | 'Kalshi';
    yesPrice: number;
    noPrice: number;
    volume24h: number;
    liquidity: number;
    logo?: string;
}

interface PriceComparisonProps {
    marketId: string;
    stacksData: PriceData;
    polymarketData?: PriceData;
    kalshiData?: PriceData;
}

export default function PriceComparison({
    marketId,
    stacksData,
    polymarketData,
    kalshiData
}: PriceComparisonProps) {
    const allPrices = [stacksData, polymarketData, kalshiData].filter(Boolean) as PriceData[];

    // Find best YES and NO prices
    const bestYesPrice = Math.min(...allPrices.map(p => p.yesPrice));
    const bestNoPrice = Math.min(...allPrices.map(p => p.noPrice));

    // Calculate arbitrage opportunity
    const maxYesPrice = Math.max(...allPrices.map(p => p.yesPrice));
    const arbitrageSpread = maxYesPrice - bestYesPrice;
    const hasArbitrage = arbitrageSpread > 5; // 5% threshold

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Cross-Platform Price Comparison</h3>
                {hasArbitrage && (
                    <Badge className="bg-green-500 text-white animate-pulse">
                        {formatPercentage(arbitrageSpread, 1)} Arbitrage!
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* StacksPredict */}
                <PriceCard
                    data={stacksData}
                    bestYes={bestYesPrice === stacksData.yesPrice}
                    bestNo={bestNoPrice === stacksData.noPrice}
                    isLocal
                />

                {/* Polymarket */}
                {polymarketData && (
                    <PriceCard
                        data={polymarketData}
                        bestYes={bestYesPrice === polymarketData.yesPrice}
                        bestNo={bestNoPrice === polymarketData.noPrice}
                    />
                )}

                {/* Kalshi */}
                {kalshiData && (
                    <PriceCard
                        data={kalshiData}
                        bestYes={bestYesPrice === kalshiData.yesPrice}
                        bestNo={bestNoPrice === kalshiData.noPrice}
                    />
                )}
            </div>

            {hasArbitrage && (
                <Card className="border-green-500 bg-green-50">
                    <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                            <Trophy className="h-5 w-5 text-green-600 mt-0.5" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-green-900 mb-1">Arbitrage Opportunity Detected</h4>
                                <p className="text-sm text-green-800">
                                    You can potentially profit {formatPercentage(arbitrageSpread, 1)} by buying on the cheaper platform and selling on the more expensive one.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function PriceCard({
    data,
    bestYes,
    bestNo,
    isLocal
}: {
    data: PriceData;
    bestYes: boolean;
    bestNo: boolean;
    isLocal?: boolean;
}) {
    return (
        <Card className={isLocal ? 'border-primary' : ''}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{data.platform}</CardTitle>
                    {isLocal && (
                        <Badge variant="default" className="bg-primary">You're Here</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* YES Price */}
                <div className={`p-3 rounded-lg ${bestYes ? 'bg-primary/10 border-2 border-primary' : 'bg-secondary'}`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">YES</span>
                        {bestYes && (
                            <Badge className="bg-primary text-xs">BEST PRICE</Badge>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                        {formatPercentage(data.yesPrice, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(data.yesPrice / 100, 'sBTC')} per share
                    </p>
                </div>

                {/* NO Price */}
                <div className={`p-3 rounded-lg ${bestNo ? 'bg-primary/10 border-2 border-primary' : 'bg-secondary'}`}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">NO</span>
                        {bestNo && (
                            <Badge className="bg-primary text-xs">BEST PRICE</Badge>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                        {formatPercentage(data.noPrice, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(data.noPrice / 100, 'sBTC')} per share
                    </p>
                </div>

                {/* Stats */}
                <div className="pt-3 border-t border-border space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">24h Volume</span>
                        <span className="font-medium">{formatCurrency(data.volume24h, 'sBTC')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Liquidity</span>
                        <span className="font-medium">{formatCurrency(data.liquidity, 'sBTC')}</span>
                    </div>
                </div>

                {!isLocal && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={`https://${data.platform.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-2" />
                            Trade on {data.platform}
                        </a>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
