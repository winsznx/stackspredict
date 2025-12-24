'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/button';
import { formatAddress, formatSBTC } from '@/lib/stacks';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Wallet, ChevronDown, Settings, ExternalLink, Bitcoin, Layers } from 'lucide-react';

export default function Header() {
    const { isConnected, address, bnsName, balance, network, connecting, connectWallet, disconnectWallet, switchNetwork } = useWallet();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Display name: prefer BNS name, fallback to formatted address
    const displayName = bnsName || formatAddress(address || '');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">StacksPredict</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Markets
                        </Link>
                        <Link
                            href="/portfolio"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Portfolio
                        </Link>
                        <Link
                            href="/create"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Create
                        </Link>
                        <Link
                            href="/leaderboard"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Leaderboard
                        </Link>
                        <Link
                            href="/arbitrage"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Arbitrage
                        </Link>
                    </nav>

                    {/* Wallet Connection */}
                    <div className="hidden md:flex items-center space-x-3">
                        {isConnected ? (
                            <>
                                {/* Network Badge */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => switchNetwork('mainnet')}
                                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                                >
                                    {network?.includes('Bitcoin') ? (
                                        <Bitcoin className="h-3.5 w-3.5 text-orange-500" />
                                    ) : (
                                        <Layers className="h-3.5 w-3.5 text-primary" />
                                    )}
                                    <span className="text-xs">{network || 'Unknown'}</span>
                                </Button>

                                {/* Account Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center space-x-2">
                                            <Wallet className="h-4 w-4 text-primary" />
                                            <span className="font-medium">
                                                {bnsName ? (
                                                    <span className="text-primary">{bnsName}</span>
                                                ) : (
                                                    displayName
                                                )}
                                            </span>
                                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64">
                                        {/* Balance Section */}
                                        <div className="px-3 py-3 border-b border-border">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-muted-foreground">Balance</span>
                                                {bnsName && (
                                                    <Badge variant="secondary" className="text-xs">BNS</Badge>
                                                )}
                                            </div>
                                            <p className="text-lg font-bold text-primary">{formatSBTC(balance)}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{formatAddress(address || '')}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <DropdownMenuItem asChild>
                                            <Link href="/portfolio" className="flex items-center">
                                                <Wallet className="h-4 w-4 mr-2" />
                                                Portfolio
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => switchNetwork('mainnet')}>
                                            <Layers className="h-4 w-4 mr-2" />
                                            Switch Network
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={disconnectWallet}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Disconnect
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <Button
                                onClick={connectWallet}
                                disabled={connecting}
                                className="bg-primary hover:bg-primary/90"
                            >
                                <Wallet className="h-4 w-4 mr-2" />
                                {connecting ? 'Connecting...' : 'Connect Wallet'}
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Markets
                            </Link>
                            <Link
                                href="/portfolio"
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Portfolio
                            </Link>
                            <Link
                                href="/create"
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Create
                            </Link>
                            <Link
                                href="/leaderboard"
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Leaderboard
                            </Link>
                            <Link
                                href="/arbitrage"
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Arbitrage
                            </Link>

                            {/* Mobile Wallet Section */}
                            <div className="pt-4 border-t border-border">
                                {isConnected ? (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-accent rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-muted-foreground">Connected</span>
                                                {bnsName && (
                                                    <Badge variant="secondary" className="text-xs">BNS</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium">
                                                {bnsName ? (
                                                    <span className="text-primary">{bnsName}</span>
                                                ) : (
                                                    formatAddress(address || '')
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">{formatSBTC(balance)}</p>
                                            {network && (
                                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                                    {network.includes('Bitcoin') ? (
                                                        <Bitcoin className="h-3 w-3 text-orange-500" />
                                                    ) : (
                                                        <Layers className="h-3 w-3 text-primary" />
                                                    )}
                                                    {network}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                disconnectWallet();
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            Disconnect Wallet
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            connectWallet();
                                            setMobileMenuOpen(false);
                                        }}
                                        disabled={connecting}
                                        className="w-full bg-primary hover:bg-primary/90"
                                    >
                                        <Wallet className="h-4 w-4 mr-2" />
                                        {connecting ? 'Connecting...' : 'Connect Wallet'}
                                    </Button>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
