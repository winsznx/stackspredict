'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    bnsName: string | null;
    balance: number;
    network: string | null;
    connecting: boolean;
    error: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    switchNetwork: (network: 'mainnet' | 'testnet') => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [balance, setBalance] = useState(0);
    const [bnsName, setBnsName] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [network, setNetwork] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [appKitModal, setAppKitModal] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize AppKit on mount - client-side only
    useEffect(() => {
        let isMounted = true;

        const initWallet = async () => {
            // Skip if not in browser
            if (typeof window === 'undefined') {
                return;
            }

            // Mark as mounted first so UI renders
            setMounted(true);

            try {
                // Check if project ID is configured
                const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

                if (!projectId) {
                    console.warn('[WalletContext] NEXT_PUBLIC_REOWN_PROJECT_ID not set, wallet features disabled');
                    setError('Wallet not configured');
                    return;
                }

                // Dynamically import Reown modules
                const [appkitReact, appkitAdapter, appkitNetworks] = await Promise.all([
                    import('@reown/appkit/react'),
                    import('@reown/appkit-adapter-bitcoin'),
                    import('@reown/appkit/networks'),
                ]);

                const { createAppKit } = appkitReact;
                const { BitcoinAdapter } = appkitAdapter;
                const { bitcoin, bitcoinTestnet } = appkitNetworks;

                const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'testnet';
                const bitcoinAdapter = new BitcoinAdapter();

                const modal = createAppKit({
                    adapters: [bitcoinAdapter],
                    networks: isTestnet ? [bitcoinTestnet, bitcoin] : [bitcoin, bitcoinTestnet],
                    projectId,
                    metadata: {
                        name: 'StacksPredict',
                        description: 'Bitcoin-Native Prediction Market Aggregator',
                        url: window.location.origin,
                        icons: [`${window.location.origin}/logo.png`],
                    },
                    features: {
                        analytics: true,
                        email: true,
                        socials: ['google', 'x', 'github'],
                        swaps: false,
                        onramp: true,
                    },
                    themeMode: 'light',
                    themeVariables: {
                        '--w3m-accent': '#FF6B2C',
                        '--w3m-color-mix': '#FF6B2C',
                        '--w3m-color-mix-strength': 20,
                        '--w3m-border-radius-master': '8px',
                    },
                });

                if (isMounted) {
                    setAppKitModal(modal);
                    setError(null);
                    console.log('[WalletContext] Reown AppKit initialized successfully');

                    // Subscribe to account changes
                    try {
                        modal.subscribeAccount((account: any) => {
                            if (!isMounted) return;
                            setIsConnected(account?.isConnected || false);
                            setAddress(account?.address || null);

                            if (account?.isConnected && account?.address) {
                                setBalance(2.5); // Mock balance
                                resolveBnsName(account.address).then(name => {
                                    if (isMounted) setBnsName(name);
                                });
                            } else {
                                setBalance(0);
                                setBnsName(null);
                            }
                        });

                        modal.subscribeNetwork((net: any) => {
                            if (isMounted) setNetwork(net?.name || null);
                        });
                    } catch (subError) {
                        console.error('[WalletContext] Error subscribing to events:', subError);
                    }
                }
            } catch (err) {
                console.error('[WalletContext] Failed to initialize Reown:', err);
                if (isMounted) {
                    setError('Failed to initialize wallet');
                }
            }
        };

        initWallet();

        return () => {
            isMounted = false;
        };
    }, []);

    const connectWallet = useCallback(() => {
        if (appKitModal) {
            setConnecting(true);
            try {
                appKitModal.open({ view: 'Connect' }).finally(() => {
                    setConnecting(false);
                });
            } catch (err) {
                console.error('[WalletContext] Error opening modal:', err);
                setConnecting(false);
            }
        } else if (error) {
            console.warn('[WalletContext] Wallet not available:', error);
            alert('Wallet connection is not available. Please check configuration.');
        } else {
            console.warn('[WalletContext] AppKit not initialized yet');
        }
    }, [appKitModal, error]);

    const disconnectWallet = useCallback(async () => {
        try {
            if (appKitModal) {
                await appKitModal.disconnect?.();
            }
        } catch (err) {
            console.error('[WalletContext] Error disconnecting:', err);
        }
        setIsConnected(false);
        setAddress(null);
        setBalance(0);
        setBnsName(null);
    }, [appKitModal]);

    const switchNetwork = useCallback((networkType: 'mainnet' | 'testnet') => {
        if (appKitModal) {
            try {
                appKitModal.open({ view: 'Networks' });
            } catch (err) {
                console.error('[WalletContext] Error switching network:', err);
            }
        }
    }, [appKitModal]);

    const value: WalletContextType = {
        isConnected,
        address,
        bnsName,
        balance,
        network,
        connecting,
        error,
        connectWallet,
        disconnectWallet,
        switchNetwork,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}

// BNS name resolution helper
async function resolveBnsName(address: string): Promise<string | null> {
    try {
        const response = await fetch(
            `https://stacks-node-api.mainnet.stacks.co/v1/addresses/stacks/${address}`
        );
        const data = await response.json();

        if (data.names && data.names.length > 0) {
            return data.names[0];
        }
        return null;
    } catch (error) {
        console.error('Error resolving BNS name:', error);
        return null;
    }
}

export default WalletContext;
