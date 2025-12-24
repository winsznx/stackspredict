'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface TradingPanelProps {
    marketId: string;
    yesPrice: number;
    noPrice: number;
    question: string;
}

export default function TradingPanel({ marketId, yesPrice, noPrice, question }: TradingPanelProps) {
    const { isConnected, connectWallet, balance } = useWallet();
    const [side, setSide] = useState<'YES' | 'NO'>('YES');
    const [quantity, setQuantity] = useState('10');
    const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
    const [limitPrice, setLimitPrice] = useState('');

    const currentPrice = side === 'YES' ? yesPrice : noPrice;
    const effectivePrice = orderType === 'LIMIT' && limitPrice ? parseFloat(limitPrice) : currentPrice;
    const quantityNum = parseFloat(quantity) || 0;
    const totalCost = (quantityNum * effectivePrice) / 100;
    const potentialPayout = quantityNum;
    const potentialProfit = potentialPayout - totalCost;

    const handleTrade = () => {
        if (!isConnected) {
            connectWallet();
            return;
        }

        // Mock trade execution
        console.log('Executing trade:', {
            marketId,
            side,
            quantity: quantityNum,
            orderType,
            price: effectivePrice,
            totalCost,
        });

        alert(`Trade submitted! Buying ${quantityNum} ${side} shares`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Side Selector */}
                <Tabs value={side} onValueChange={(value) => setSide(value as 'YES' | 'NO')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="YES" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            YES {formatPercentage(yesPrice, 0)}
                        </TabsTrigger>
                        <TabsTrigger value="NO" className="data-[state=active]:bg-foreground">
                            <TrendingDown className="h-4 w-4 mr-2" />
                            NO {formatPercentage(noPrice, 0)}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Order Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Order Type</label>
                    <Tabs value={orderType} onValueChange={(value) => setOrderType(value as 'MARKET' | 'LIMIT')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="MARKET">Market</TabsTrigger>
                            <TabsTrigger value="LIMIT">Limit</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Limit Price (only for LIMIT orders) */}
                {orderType === 'LIMIT' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Limit Price (%)</label>
                        <Input
                            type="number"
                            placeholder={currentPrice.toString()}
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            min="1"
                            max="99"
                        />
                    </div>
                )}

                {/* Quantity Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Shares</label>
                    <Input
                        type="number"
                        placeholder="10"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                    />
                </div>

                {/* Price Summary */}
                <div className="bg-accent/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price per share</span>
                        <span className="font-medium">{formatCurrency(effectivePrice / 100, 'sBTC')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total cost</span>
                        <span className="font-medium">{formatCurrency(totalCost, 'sBTC')}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-border pt-2">
                        <span className="text-muted-foreground">Potential payout</span>
                        <span className="font-bold text-primary">{formatCurrency(potentialPayout, 'sBTC')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Potential profit</span>
                        <span className={`font-bold ${potentialProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(potentialProfit, 'sBTC')}
                        </span>
                    </div>
                </div>

                {/* Balance */}
                {isConnected && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Your balance</span>
                        <span>{formatCurrency(balance, 'sBTC')}</span>
                    </div>
                )}

                {/* Trade Button */}
                <Button
                    onClick={handleTrade}
                    disabled={!quantity || quantityNum <= 0 || (isConnected && totalCost > balance)}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                >
                    {!isConnected ? (
                        <>
                            <Wallet className="mr-2 h-4 w-4" />
                            Connect Wallet to Trade
                        </>
                    ) : totalCost > balance ? (
                        'Insufficient Balance'
                    ) : (
                        `Buy ${side} Shares`
                    )}
                </Button>

                {/* Quick Buy Buttons */}
                <div className="grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((amount) => (
                        <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setQuantity(amount.toString())}
                        >
                            {amount}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
