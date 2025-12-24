'use client';

import { useWallet } from '@/context/WalletContext';
import { useMarkets } from '@/context/MarketsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function PortfolioPage() {
    const { isConnected, address, balance, connectWallet } = useWallet();
    const { positions } = useMarkets();

    if (!isConnected) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto text-center">
                    <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h1>
                    <p className="text-muted-foreground mb-6">
                        Connect your wallet to view your portfolio and trading positions
                    </p>
                    <Button onClick={connectWallet} size="lg" className="bg-primary hover:bg-primary/90">
                        <Wallet className="mr-2 h-5 w-5" />
                        Connect Wallet
                    </Button>
                </div>
            </div>
        );
    }

    const totalValue = positions.reduce((sum, p) => sum + p.currentValue, 0);
    const totalCost = positions.reduce((sum, p) => sum + (p.shares * p.averagePrice / 100), 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Portfolio</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(balance, 'sBTC')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Position Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue, 'sBTC')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Unrealized P&L</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(totalPnL, 'sBTC')}
                        </p>
                        <p className={`text-sm ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalPnL >= 0 ? '+' : ''}{formatPercentage(totalPnLPercentage, 2)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Positions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-foreground">{positions.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Positions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Positions</CardTitle>
                </CardHeader>
                <CardContent>
                    {positions.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Market</TableHead>
                                            <TableHead>Position</TableHead>
                                            <TableHead className="text-right">Shares</TableHead>
                                            <TableHead className="text-right">Avg Price</TableHead>
                                            <TableHead className="text-right">Current Value</TableHead>
                                            <TableHead className="text-right">Unrealized P&L</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {positions.map((position) => (
                                            <TableRow key={position.marketId}>
                                                <TableCell className="font-medium max-w-xs">
                                                    <Link
                                                        href={`/market/${position.marketId}`}
                                                        className="hover:text-primary line-clamp-2"
                                                    >
                                                        {position.market.question}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={position.side === 'YES' ? 'default' : 'secondary'}
                                                        className={position.side === 'YES' ? 'bg-primary' : ''}
                                                    >
                                                        {position.side}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">{position.shares}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(position.averagePrice / 100, 'sBTC')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(position.currentValue, 'sBTC')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className={position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                        <div className="flex items-center justify-end">
                                                            {position.unrealizedPnL >= 0 ? (
                                                                <TrendingUp className="h-4 w-4 mr-1" />
                                                            ) : (
                                                                <TrendingDown className="h-4 w-4 mr-1" />
                                                            )}
                                                            <span>{formatCurrency(Math.abs(position.unrealizedPnL), 'sBTC')}</span>
                                                        </div>
                                                        <div className="text-xs">
                                                            {position.unrealizedPnL >= 0 ? '+' : ''}
                                                            {formatPercentage(position.unrealizedPnLPercentage, 2)}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/market/${position.marketId}`}>
                                                        <Button variant="outline" size="sm">
                                                            <ExternalLink className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-4">
                                {positions.map((position) => (
                                    <Card key={position.marketId}>
                                        <CardContent className="pt-4">
                                            <Link href={`/market/${position.marketId}`}>
                                                <h3 className="font-semibold text-sm mb-3 hover:text-primary">
                                                    {position.market.question}
                                                </h3>
                                            </Link>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Position</span>
                                                    <Badge
                                                        variant={position.side === 'YES' ? 'default' : 'secondary'}
                                                        className={position.side === 'YES' ? 'bg-primary' : ''}
                                                    >
                                                        {position.side}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Shares</span>
                                                    <span className="font-medium">{position.shares}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Current Value</span>
                                                    <span className="font-medium">{formatCurrency(position.currentValue, 'sBTC')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Unrealized P&L</span>
                                                    <span className={`font-medium ${position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(position.unrealizedPnL, 'sBTC')} ({position.unrealizedPnL >= 0 ? '+' : ''}{formatPercentage(position.unrealizedPnLPercentage, 2)})
                                                    </span>
                                                </div>
                                            </div>
                                            <Link href={`/market/${position.marketId}`}>
                                                <Button variant="outline" size="sm" className="w-full mt-3">
                                                    <ExternalLink className="h-3 w-3 mr-1" />
                                                    View Market
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">You don't have any positions yet</p>
                            <Link href="/">
                                <Button className="bg-primary hover:bg-primary/90">Explore Markets</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
