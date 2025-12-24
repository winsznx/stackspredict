'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PricePoint } from '@/types/market';
import { formatPercentage, formatTimeAgo } from '@/lib/utils';

interface ProbabilityChartProps {
    data: PricePoint[];
    marketQuestion: string;
}

const timeRanges = [
    { label: '1H', value: 'hour' },
    { label: '24H', value: 'day' },
    { label: '7D', value: 'week' },
    { label: 'All', value: 'all' },
];

export default function ProbabilityChart({ data, marketQuestion }: ProbabilityChartProps) {
    const [timeRange, setTimeRange] = useState('all');

    // Filter data based on time range
    const getFilteredData = () => {
        const now = new Date();
        let cutoff = new Date(0);

        if (timeRange === 'hour') {
            cutoff = new Date(now.getTime() - 60 * 60 * 1000);
        } else if (timeRange === 'day') {
            cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        } else if (timeRange === 'week') {
            cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        return data.filter(point => point.timestamp >= cutoff);
    };

    const filteredData = getFilteredData();

    const formatXAxis = (timestamp: number) => {
        const date = new Date(timestamp);
        if (timeRange === 'hour') {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } else if (timeRange === 'day') {
            return date.toLocaleTimeString('en-US', { hour: 'numeric' });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                        {formatTimeAgo(new Date(data.timestamp))}
                    </p>
                    <div className="flex items-center space-x-4">
                        <div>
                            <p className="text-xs text-muted-foreground">YES</p>
                            <p className="text-sm font-bold text-primary">
                                {formatPercentage(data.yesPrice, 1)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">NO</p>
                            <p className="text-sm font-bold text-foreground">
                                {formatPercentage(data.noPrice, 1)}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full">
            {/* Time Range Selector */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Probability Over Time</h3>
                <div className="flex gap-2">
                    {timeRanges.map((range) => (
                        <Button
                            key={range.value}
                            variant={timeRange === range.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTimeRange(range.value)}
                            className={timeRange === range.value ? 'bg-primary hover:bg-primary/90' : ''}
                        >
                            {range.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-80 bg-background border border-border rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="rgb(255, 107, 44)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="rgb(255, 107, 44)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                            stroke="#737373"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                            stroke="#737373"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="yesPrice"
                            stroke="rgb(255, 107, 44)"
                            strokeWidth={2}
                            fill="url(#colorYes)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
