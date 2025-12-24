'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

interface Order {
    price: number;
    quantity: number;
    total: number;
    user?: string;
}

interface OrderBookProps {
    marketId: string;
    bids: Order[]; // YES orders
    asks: Order[]; // NO orders
}

export default function OrderBook({ marketId, bids = [], asks = [] }: OrderBookProps) {
    // Mock order book data if none provided
    const mockBids: Order[] = bids.length > 0 ? bids : [
        { price: 67, quantity: 150, total: 100.5 },
        { price: 66, quantity: 200, total: 132.0 },
        { price: 65, quantity: 100, total: 65.0 },
        { price: 64, quantity: 250, total: 160.0 },
        { price: 63, quantity: 180, total: 113.4 },
    ];

    const mockAsks: Order[] = asks.length > 0 ? asks : [
        { price: 34, quantity: 120, total: 40.8 },
        { price: 35, quantity: 200, total: 70.0 },
        { price: 36, quantity: 150, total: 54.0 },
        { price: 37, quantity: 180, total: 66.6 },
        { price: 38, quantity: 100, total: 38.0 },
    ];

    const spread = mockBids[0] && mockAsks[0]
        ? mockBids[0].price + mockAsks[0].price
        : 0;

    const maxTotal = Math.max(
        ...mockBids.map(b => b.total),
        ...mockAsks.map(a => a.total)
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4 text-primary" />
                        Order Book (CLOB)
                    </CardTitle>
                    {spread > 0 && (
                        <Badge variant="secondary">
                            Spread: {formatPercentage(100 - spread, 1)}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b border-border">
                        <div className="text-left">Price (%)</div>
                        <div className="text-right">Shares</div>
                        <div className="text-right">Total (sBTC)</div>
                    </div>

                    {/* Asks (NO orders) - Red */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                            <TrendingDown className="h-3 w-3 text-red-600" />
                            <span>NO Orders (Asks)</span>
                        </div>
                        {mockAsks.slice().reverse().map((ask, idx) => (
                            <OrderRow
                                key={`ask-${idx}`}
                                order={ask}
                                side="NO"
                                maxTotal={maxTotal}
                            />
                        ))}
                    </div>

                    {/* Spread Indicator */}
                    {spread > 0 && (
                        <div className="py-2 border-y border-border bg-accent/30 rounded text-center">
                            <p className="text-xs text-muted-foreground">
                                Market Spread
                            </p>
                            <p className="text-sm font-bold text-foreground">
                                {formatPercentage(100 - spread, 1)}
                            </p>
                        </div>
                    )}

                    {/* Bids (YES orders) - Green */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span>YES Orders (Bids)</span>
                        </div>
                        {mockBids.map((bid, idx) => (
                            <OrderRow
                                key={`bid-${idx}`}
                                order={bid}
                                side="YES"
                                maxTotal={maxTotal}
                            />
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    <p className="mb-1"><strong>How it works:</strong></p>
                    <ul className="space-y-1 list-disc list-inside">
                        <li>Click a row to fill an order at that price</li>
                        <li>Green (YES) bids pay out if the market resolves YES</li>
                        <li>Red (NO) asks pay out if the market resolves NO</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}

function OrderRow({
    order,
    side,
    maxTotal
}: {
    order: Order;
    side: 'YES' | 'NO';
    maxTotal: number;
}) {
    const percentage = (order.total / maxTotal) * 100;
    const bgColor = side === 'YES'
        ? 'bg-green-500/10 hover:bg-green-500/20'
        : 'bg-red-500/10 hover:bg-red-500/20';
    const textColor = side === 'YES' ? 'text-green-700' : 'text-red-700';

    return (
        <div
            className={`relative grid grid-cols-3 gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${bgColor}`}
            style={{
                background: `linear-gradient(to right, ${side === 'YES' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                    } ${percentage}%, transparent ${percentage}%)`
            }}
        >
            <div className={`text-sm font-medium ${textColor}`}>
                {order.price}%
            </div>
            <div className="text-sm text-right text-foreground">
                {order.quantity}
            </div>
            <div className="text-sm text-right text-foreground">
                {formatCurrency(order.total, 'sBTC')}
            </div>
        </div>
    );
}
