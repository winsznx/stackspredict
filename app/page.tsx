'use client';

import { useState } from 'react';
import { useMarkets } from '@/context/MarketsContext';
import MarketCard from '@/components/markets/MarketCard';
import MarketFilters from '@/components/markets/MarketFilters';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';
import { Market } from '@/types/market';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function HomePage() {
  const { markets } = useMarkets();
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>(markets);

  // Calculate stats
  const totalVolume = markets.reduce((sum, m) => sum + m.totalVolume, 0);
  const activeMarkets = markets.filter(m => !m.resolved).length;
  const categories = new Set(markets.map(m => m.category)).size;

  const handleCategoryChange = (category: string) => {
    if (category === 'All') {
      setFilteredMarkets(markets);
    } else {
      setFilteredMarkets(markets.filter(m => m.category === category));
    }
  };

  const handleSearchChange = (query: string) => {
    if (!query) {
      setFilteredMarkets(markets);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredMarkets(
        markets.filter(
          m =>
            m.question.toLowerCase().includes(lowerQuery) ||
            m.category.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleSortChange = (sort: string) => {
    let sorted = [...filteredMarkets];
    if (sort === 'volume') {
      sorted.sort((a, b) => b.totalVolume - a.totalVolume);
    } else if (sort === 'newest') {
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sort === 'ending') {
      sorted.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
    }
    setFilteredMarkets(sorted);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent/30 to-background border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Predict the Future with{' '}
              <span className="text-primary">Bitcoin</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Trade on real-world events using sBTC on Stacks. Featuring order books, social truth feeds, and Bitcoin-native payouts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#markets">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Explore Markets
                </Button>
              </Link>
              <Link href="/create">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Market
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-background border border-border rounded-lg p-6 text-center">
              <div className="flex justify-center mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {formatCurrency(totalVolume, 'sBTC')}
              </p>
              <p className="text-sm text-muted-foreground">Total Volume</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-6 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{activeMarkets}</p>
              <p className="text-sm text-muted-foreground">Active Markets</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-6 text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{categories}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section id="markets" className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">All Markets</h2>
          <p className="text-muted-foreground">
            Browse and trade on real-world prediction markets
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <MarketFilters
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Market Grid */}
        {filteredMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No markets found matching your criteria</p>
          </div>
        )}
      </section>
    </div>
  );
}
