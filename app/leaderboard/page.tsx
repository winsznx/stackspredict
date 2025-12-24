'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUsers } from '@/lib/mockData';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Trophy, TrendingUp, Target, Flame, Star, Users } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LeaderboardPage() {
    const [sortBy, setSortBy] = useState<'profit' | 'winRate' | 'streak'>('profit');

    // Sort users based on selected metric
    const sortedUsers = [...mockUsers].sort((a, b) => {
        if (sortBy === 'profit') return b.totalProfit - a.totalProfit;
        if (sortBy === 'winRate') return b.winRate - a.winRate;
        return b.currentStreak - a.currentStreak;
    });

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
        if (rank === 2) return <Trophy className="h-6 w-6 text-gray-400" />;
        if (rank === 3) return <Trophy className="h-6 w-6 text-amber-600" />;
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h1>
                <p className="text-muted-foreground">
                    Top traders on StacksPredict ranked by performance
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Top Trader Profit</p>
                                <p className="text-2xl font-bold text-primary">
                                    {formatCurrency(sortedUsers[0]?.totalProfit || 0, 'sBTC')}
                                </p>
                            </div>
                            <Trophy className="h-12 w-12 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Highest Win Rate</p>
                                <p className="text-2xl font-bold text-primary">
                                    {formatPercentage(Math.max(...mockUsers.map(u => u.winRate)), 1)}
                                </p>
                            </div>
                            <Target className="h-12 w-12 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Longest Streak</p>
                                <p className="text-2xl font-bold text-primary">
                                    {Math.max(...mockUsers.map(u => u.currentStreak))} wins
                                </p>
                            </div>
                            <Flame className="h-12 w-12 text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sort Tabs */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Top Traders</CardTitle>
                        <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as any)} className="w-full sm:w-auto">
                            <TabsList className="grid w-full sm:w-auto grid-cols-3">
                                <TabsTrigger value="profit">Profit</TabsTrigger>
                                <TabsTrigger value="winRate">Win Rate</TabsTrigger>
                                <TabsTrigger value="streak">Streak</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sortedUsers.map((user, index) => {
                            const rank = index + 1;
                            const metricValue = sortBy === 'profit'
                                ? formatCurrency(user.totalProfit, 'sBTC')
                                : sortBy === 'winRate'
                                    ? formatPercentage(user.winRate, 1)
                                    : `${user.currentStreak} wins`;

                            return (
                                <div
                                    key={user.address}
                                    className={`flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors ${rank <= 3 ? 'bg-accent/30' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Rank */}
                                        <div className="w-12 flex items-center justify-center">
                                            {getRankIcon(rank)}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-foreground truncate">
                                                    {user.username || user.address}
                                                </h3>
                                                {user.verified && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Verified
                                                    </Badge>
                                                )}
                                                {user.expert && (
                                                    <Badge className="text-xs bg-primary">
                                                        Expert: {user.expertCategory}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center">
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                    {user.marketsTraded} markets
                                                </span>
                                                <span className="flex items-center">
                                                    <Target className="h-3 w-3 mr-1" />
                                                    {formatPercentage(user.winRate, 1)} win rate
                                                </span>
                                                <span className="flex items-center">
                                                    <Flame className="h-3 w-3 mr-1" />
                                                    {user.currentStreak} streak
                                                </span>
                                            </div>
                                        </div>

                                        {/* Metric Value - Desktop */}
                                        <div className="hidden md:block text-right">
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {sortBy === 'profit' ? 'Total Profit' : sortBy === 'winRate' ? 'Win Rate' : 'Current Streak'}
                                            </p>
                                            <p className="text-xl font-bold text-primary">{metricValue}</p>
                                        </div>

                                        {/* Copy Trade Button */}
                                        <Button variant="outline" size="sm" className="hidden sm:block">
                                            <Users className="h-4 w-4 mr-2" />
                                            Copy Trade
                                        </Button>
                                    </div>

                                    {/* Mobile Metric */}
                                    <div className="md:hidden text-right">
                                        <p className="text-lg font-bold text-primary">{metricValue}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {sortedUsers.length === 0 && (
                        <div className="text-center py-12">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No traders found</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* How Copy Trading Works */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>How Copy Trading Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        <strong className="text-foreground">1. Choose a Trader:</strong> Select a top performer from the leaderboard
                    </p>
                    <p>
                        <strong className="text-foreground">2. Set Parameters:</strong> Define your maximum bet amount per trade and categories
                    </p>
                    <p>
                        <strong className="text-foreground">3. Auto-Follow:</strong> When they make a trade, you automatically make the same trade
                    </p>
                    <p>
                        <strong className="text-foreground">4. Fee Sharing:</strong> A small percentage (2%) of profits goes to the trader you're copying
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
