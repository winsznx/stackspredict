'use client';

import { useParams } from 'next/navigation';
import { useMarkets } from '@/context/MarketsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProbabilityChart from '@/components/market/ProbabilityChart';
import TradingPanel from '@/components/market/TradingPanel';
import PriceComparison from '@/components/market/PriceComparison';
import OrderBook from '@/components/market/OrderBook';
import YieldIndicator from '@/components/market/YieldIndicator';
import ActivityFeed from '@/components/social/ActivityFeed';
import { formatCurrency, formatPercentage, getTimeUntil, formatDate } from '@/lib/utils';
import { generatePriceHistory } from '@/lib/mockData';
import { Calendar, Info, TrendingUp, TrendingDown, Clock, Shield, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function MarketDetailPage() {
    const params = useParams();
    const { getMarket } = useMarkets();
    const market = getMarket(params.id as string);

    if (!market) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">Market Not Found</h1>
                    <Link href="/" className="text-primary hover:underline">
                        Back to Markets
                    </Link>
                </div>
            </div>
        );
    }

    const priceHistory = generatePriceHistory(market.id, 7);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Link */}
            <Link href="/" className="text-sm text-primary hover:underline mb-4 inline-block">
                ← Back to Markets
            </Link>

            {/* Market Header */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="secondary">{market.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Ends {getTimeUntil(market.endDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 mr-1" />
                        <span>Settles via {market.settlementSource}</span>
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {market.question}
                </h1>
                {market.description && (
                    <p className="text-muted-foreground max-w-3xl">{market.description}</p>
                )}
            </div>

            {/* Current Probability */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Current Probability</p>
                            <p className="text-4xl font-bold text-primary mb-1">
                                {formatPercentage(market.yesPrice, 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">YES chance</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <BarChart className="h-8 w-8 text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                            <p className="text-2xl font-bold text-foreground">
                                {formatCurrency(market.volume24h, 'sBTC')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
                            <p className="text-2xl font-bold text-foreground">
                                {formatCurrency(market.totalVolume, 'sBTC')}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Chart */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart */}
                    <ProbabilityChart data={priceHistory} marketQuestion={market.question} />
                </div>

                {/* Right Column - Trading & Components */}
                <div className="space-y-6">
                    {/* Trading Panel */}
                    <TradingPanel
                        marketId={market.id}
                        yesPrice={market.yesPrice}
                        noPrice={market.noPrice}
                        question={market.question}
                    />

                    {/* Yield Indicator */}
                    <YieldIndicator
                        marketId={market.id}
                        escrowAmount={market.totalVolume}
                        endDate={market.endDate}
                    />

                    {/* Order Book */}
                    <OrderBook marketId={market.id} bids={[]} asks={[]} />

                    {/* Market Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Market Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Created</span>
                                <span className="font-medium">{formatDate(market.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Settlement Source</span>
                                <Badge variant="secondary" className="font-mono text-xs">
                                    {market.settlementSource}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Liquidity</span>
                                <span className="font-medium">{formatCurrency(market.liquidity, 'sBTC')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Creator Fee</span>
                                <span className="font-medium">2%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Price Comparison Section */}
            <div className="mt-8">
                <PriceComparison
                    marketId={market.id}
                    stacksData={{
                        platform: 'StacksPredict',
                        yesPrice: market.yesPrice,
                        noPrice: market.noPrice,
                        volume24h: market.volume24h,
                        liquidity: market.liquidity
                    }}
                    polymarketData={{
                        platform: 'Polymarket',
                        yesPrice: market.yesPrice + 3,
                        noPrice: market.noPrice - 3,
                        volume24h: market.volume24h * 2.5,
                        liquidity: market.liquidity * 3
                    }}
                />
            </div>

            {/* Activity Feed & How It Works */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityFeed limit={5} />
                        </CardContent>
                    </Card>
                </div>

                {/* How It Works */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            How It Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">1. Buy Shares</h4>
                            <p>Purchase YES if you think it will happen, NO if you don't.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">2. Earn Yield</h4>
                            <p>Your position earns stacking yield while waiting for resolution.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">3. Resolution</h4>
                            <p>Oracle verifies outcome automatically via {market.settlementSource}.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">4. Get Paid</h4>
                            <p>Winning shares pay 1 sBTC each, plus your stacking rewards.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
