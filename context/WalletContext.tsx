'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    bnsName: string | null;
    balance: number;
    network: string | null;
    connecting: boolean;
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

    // Initialize AppKit on mount - client-side only
    useEffect(() => {
        let isMounted = true;

        const initWallet = async () => {
            if (typeof window === 'undefined') return;

            try {
                // Dynamically import Reown modules
                const { createAppKit } = await import('@reown/appkit/react');
                const { BitcoinAdapter } = await import('@reown/appkit-adapter-bitcoin');
                const { bitcoin, bitcoinTestnet } = await import('@reown/appkit/networks');

                const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '3a8170812b534d0ff9d794f19a901d64';
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
                        icons: ['https://stackspredict.com/logo.png'],
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
                    setMounted(true);
                    console.log('[WalletContext] Reown AppKit initialized');

                    // Subscribe to account changes
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
                }
            } catch (error) {
                console.error('[WalletContext] Failed to initialize Reown:', error);
                if (isMounted) setMounted(true);
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
            appKitModal.open({ view: 'Connect' }).finally(() => {
                setConnecting(false);
            });
        } else {
            console.warn('[WalletContext] AppKit not initialized yet');
        }
    }, [appKitModal]);

    const disconnectWallet = useCallback(async () => {
        setIsConnected(false);
        setAddress(null);
        setBalance(0);
        setBnsName(null);
    }, []);

    const switchNetwork = useCallback((networkType: 'mainnet' | 'testnet') => {
        if (appKitModal) {
            appKitModal.open({ view: 'Networks' });
        }
    }, [appKitModal]);

    const value: WalletContextType = {
        isConnected,
        address,
        bnsName,
        balance,
        network,
        connecting,
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
