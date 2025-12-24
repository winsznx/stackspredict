'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { Calendar, AlertCircle, Wallet, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CreateMarketPage() {
    const { isConnected, connectWallet, balance } = useWallet();
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [endDate, setEndDate] = useState('');
    const [settlementSource, setSettlementSource] = useState('');
    const [initialLiquidity, setInitialLiquidity] = useState('10');

    const creationFee = 0.1; // Mock fee in sBTC
    const totalCost = creationFee + parseFloat(initialLiquidity || '0');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected) {
            connectWallet();
            return;
        }

        console.log('Creating market:', {
            question,
            description,
            category,
            endDate,
            settlementSource,
            initialLiquidity: parseFloat(initialLiquidity),
        });

        alert('Market creation submitted! In production, this would create a contract on Stacks.');
    };

    const isFormValid = question && category && endDate && settlementSource && parseFloat(initialLiquidity) > 0;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Create Prediction Market</h1>
                <p className="text-muted-foreground">
                    Create a new market for others to trade on. All markets are settled via transparent oracles.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Market Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Question */}
                                <div className="space-y-2">
                                    <Label htmlFor="question">
                                        Market Question <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="question"
                                        placeholder="Will Bitcoin reach $150,000 by end of Q1 2025?"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        maxLength={200}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {question.length}/200 characters
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Provide additional context about how this market will be resolved..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {description.length}/500 characters
                                    </p>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Category <span className="text-destructive">*</span>
                                    </Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Politics">Politics</SelectItem>
                                            <SelectItem value="Crypto">Crypto</SelectItem>
                                            <SelectItem value="Sports">Sports</SelectItem>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* End Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">
                                        End Date <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="datetime-local"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Market will close for trading at this time
                                    </p>
                                </div>

                                {/* Settlement Source */}
                                <div className="space-y-2">
                                    <Label htmlFor="settlement">
                                        Settlement Source <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="settlement"
                                        placeholder="e.g., CoinGecko API, Associated Press, ESPN Official"
                                        value={settlementSource}
                                        onChange={(e) => setSettlementSource(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        The authoritative source that will determine the outcome
                                    </p>
                                </div>

                                {/* Initial Liquidity */}
                                <div className="space-y-2">
                                    <Label htmlFor="liquidity">
                                        Initial Liquidity (sBTC) <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="liquidity"
                                        type="number"
                                        placeholder="10"
                                        value={initialLiquidity}
                                        onChange={(e) => setInitialLiquidity(e.target.value)}
                                        min="1"
                                        step="0.1"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Minimum 1 sBTC. Higher liquidity enables better price discovery.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={!isFormValid || (isConnected && totalCost > balance)}
                                    className="w-full bg-primary hover:bg-primary/90"
                                    size="lg"
                                >
                                    {!isConnected ? (
                                        <>
                                            <Wallet className="mr-2 h-4 w-4" />
                                            Connect Wallet to Create
                                        </>
                                    ) : totalCost > balance ? (
                                        'Insufficient Balance'
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Market
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-6">
                        {/* Cost Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cost Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Creation Fee</span>
                                    <span className="font-medium">{formatCurrency(creationFee, 'sBTC')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Initial Liquidity</span>
                                    <span className="font-medium">
                                        {formatCurrency(parseFloat(initialLiquidity || '0'), 'sBTC')}
                                    </span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between">
                                    <span className="font-medium">Total Cost</span>
                                    <span className="font-bold text-primary">{formatCurrency(totalCost, 'sBTC')}</span>
                                </div>
                                {isConnected && (
                                    <div className="pt-3 border-t border-border text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Your Balance</span>
                                            <span className="font-medium">{formatCurrency(balance, 'sBTC')}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Market Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs text-muted-foreground">
                                <div className="flex gap-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <p>Questions must be clear and unambiguous</p>
                                </div>
                                <div className="flex gap-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <p>Settlement sources must be publicly verifiable</p>
                                </div>
                                <div className="flex gap-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <p>Markets should have clear YES/NO outcomes</p>
                                </div>
                                <div className="flex gap-2">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <p>End dates must be in the future</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        {question && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Preview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {category && <Badge variant="secondary">{category}</Badge>}
                                        <h3 className="font-semibold text-sm leading-tight">{question}</h3>
                                        {description && (
                                            <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
