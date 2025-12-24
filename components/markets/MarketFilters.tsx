'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MarketFiltersProps {
    onCategoryChange: (category: string) => void;
    onSearchChange: (query: string) => void;
    onSortChange: (sort: string) => void;
}

const categories = ['All', 'Politics', 'Crypto', 'Sports', 'Technology', 'Entertainment', 'Other'];

export default function MarketFilters({
    onCategoryChange,
    onSearchChange,
    onSortChange,
}: MarketFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('volume');

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        onCategoryChange(category);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearchChange(query);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10"
                />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCategoryClick(category)}
                        className={selectedCategory === category ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify between gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <div className="flex gap-2">
                    <Button
                        variant={sortBy === 'volume' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => {
                            setSortBy('volume');
                            onSortChange('volume');
                        }}
                        className={sortBy === 'volume' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                        Volume
                    </Button>
                    <Button
                        variant={sortBy === 'newest' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => {
                            setSortBy('newest');
                            onSortChange('newest');
                        }}
                        className={sortBy === 'newest' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                        Newest
                    </Button>
                    <Button
                        variant={sortBy === 'ending' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => {
                            setSortBy('ending');
                            onSortChange('ending');
                        }}
                        className={sortBy === 'ending' ? 'bg-primary hover:bg-primary/90' : ''}
                    >
                        Ending Soon
                    </Button>
                </div>
            </div>
        </div>
    );
}
