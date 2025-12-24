'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Zap, TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface YieldIndicatorProps {
    marketId: string;
    escrowAmount: number;
    endDate: Date;
}

export default function YieldIndicator({ marketId, escrowAmount, endDate }: YieldIndicatorProps) {
    // Mock stacking yield calculation
    const stackingAPY = 8.5; // 8.5% APY
    const daysUntilEnd = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const estimatedRewards = (escrowAmount * stackingAPY / 100) * (daysUntilEnd / 365);
    const dailyYield = estimatedRewards / daysUntilEnd;

    return (
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-primary/20">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Earning While You Wait
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <p>Market escrow is stacked on the Stacks blockchain, generating Bitcoin yield while you wait for resolution.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* APY Display */}
                <div>
                    <p className="text-sm text-muted-foreground mb-1">Stacking APY</p>
                    <p className="text-3xl font-bold text-primary">
                        {formatPercentage(stackingAPY, 1)}
                    </p>
                </div>

                {/* Rewards Breakdown */}
                <div className="space-y-2 pt-4 border-t border-primary/20">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Escrow Amount</span>
                        <span className="font-medium">{formatCurrency(escrowAmount, 'sBTC')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Days Until End</span>
                        <span className="font-medium">{daysUntilEnd} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Daily Yield</span>
                        <span className="font-medium text-green-600">
                            +{formatCurrency(dailyYield, 'sBTC')}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-primary/20">
                        <span className="text-muted-foreground font-medium">Est. Total Rewards</span>
                        <span className="font-bold text-primary">
                            {formatCurrency(estimatedRewards, 'sBTC')}
                        </span>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-white/60 rounded-lg p-3 text-xs text-muted-foreground">
                    <p className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>
                            Rewards are automatically distributed to active traders when the market resolves. No fees are deducted from your position.
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
