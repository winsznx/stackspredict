import Link from 'next/link';
import { Market } from '@/types/market';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, formatPercentage, getTimeUntil } from '@/lib/utils';
import { TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';

interface MarketCardProps {
    market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
    const probability = market.yesPrice;
    const change24h = Math.random() * 10 - 5; // Mock 24h change
    const isPositive = change24h >= 0;

    return (
        <Link href={`/market/${market.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                            {market.category}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span className="text-xs">{getTimeUntil(market.endDate)}</span>
                        </div>
                    </div>
                    <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
                        {market.question}
                    </h3>
                </CardHeader>

                <CardContent>
                    {/* Probability Display */}
                    <div className="mb-4">
                        <div className="flex items-baseline justify-between mb-2">
                            <div>
                                <span className="text-3xl font-bold text-primary">
                                    {formatPercentage(probability, 0)}
                                </span>
                                <span className="text-sm text-muted-foreground ml-2">chance</span>
                            </div>
                            <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? (
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                <span>{formatPercentage(Math.abs(change24h), 1)}</span>
                            </div>
                        </div>

                        {/* Probability Bar */}
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${probability}%` }}
                            />
                        </div>
                    </div>

                    {/* Market Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
                            <p className="text-sm font-medium">
                                {formatCurrency(market.volume24h, 'sBTC')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Volume</p>
                            <p className="text-sm font-medium">
                                {formatCurrency(market.totalVolume, 'sBTC')}
                            </p>
                        </div>
                    </div>

                    {/* Settlement Source */}
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Settlement:</span>
                            <span className="text-xs font-medium text-foreground">{market.settlementSource}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
