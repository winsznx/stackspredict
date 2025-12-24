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
    isReady: boolean;
    connectWallet: () => void;
    disconnectWallet: () => void;
    switchNetwork: (network: 'mainnet' | 'testnet') => void;
}

const defaultContext: WalletContextType = {
    isConnected: false,
    address: null,
    bnsName: null,
    balance: 0,
    network: null,
    connecting: false,
    error: null,
    isReady: false,
    connectWallet: () => { },
    disconnectWallet: () => { },
    switchNetwork: () => { },
};

const WalletContext = createContext<WalletContextType>(defaultContext);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState({
        isConnected: false,
        address: null as string | null,
        bnsName: null as string | null,
        balance: 0,
        network: null as string | null,
        connecting: false,
        error: null as string | null,
        isReady: false,
    });
    const [appKitModal, setAppKitModal] = useState<any>(null);

    // Initialize AppKit on mount - client-side only
    useEffect(() => {
        let isMounted = true;

        const initWallet = async () => {
            // Skip SSR
            if (typeof window === 'undefined') return;

            // Mark as ready first
            if (isMounted) {
                setState(prev => ({ ...prev, isReady: true }));
            }

            // Check if project ID is configured
            const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

            if (!projectId) {
                console.log('[WalletContext] No NEXT_PUBLIC_REOWN_PROJECT_ID - wallet disabled');
                if (isMounted) {
                    setState(prev => ({ ...prev, error: 'Wallet not configured' }));
                }
                return;
            }

            try {
                // Dynamic imports to prevent SSR issues
                const appkitModule = await import('@reown/appkit/react');
                const adapterModule = await import('@reown/appkit-adapter-bitcoin');
                const networksModule = await import('@reown/appkit/networks');

                if (!isMounted) return;

                const { createAppKit } = appkitModule;
                const { BitcoinAdapter } = adapterModule;
                const { bitcoin, bitcoinTestnet } = networksModule;

                const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'testnet';
                const bitcoinAdapter = new BitcoinAdapter();

                const modal = createAppKit({
                    adapters: [bitcoinAdapter],
                    networks: isTestnet ? [bitcoinTestnet, bitcoin] : [bitcoin, bitcoinTestnet],
                    projectId,
                    metadata: {
                        name: 'StacksPredict',
                        description: 'Bitcoin-Native Prediction Market Aggregator',
                        url: typeof window !== 'undefined' ? window.location.origin : 'https://stackspredict.vercel.app',
                        icons: ['/logo.png'],
                    },
                    features: {
                        analytics: false,
                        email: false,
                        socials: false,
                        swaps: false,
                        onramp: false,
                    },
                    themeMode: 'light',
                    themeVariables: {
                        '--w3m-accent': '#FF6B2C',
                        '--w3m-color-mix': '#FF6B2C',
                        '--w3m-color-mix-strength': 20,
                        '--w3m-border-radius-master': '8px',
                    },
                });

                if (!isMounted) return;

                setAppKitModal(modal);
                console.log('[WalletContext] Reown AppKit initialized');

                // Subscribe to account changes (these don't return unsubscribe)
                modal.subscribeAccount((account: any) => {
                    if (!isMounted) return;

                    const isConnected = account?.isConnected || false;
                    const address = account?.address || null;

                    setState(prev => ({
                        ...prev,
                        isConnected,
                        address,
                        balance: isConnected ? 2.5 : 0,
                        error: null,
                    }));

                    if (isConnected && address) {
                        resolveBnsName(address).then(name => {
                            if (isMounted) {
                                setState(prev => ({ ...prev, bnsName: name }));
                            }
                        });
                    }
                });

                modal.subscribeNetwork((net: any) => {
                    if (isMounted) {
                        setState(prev => ({ ...prev, network: net?.name || null }));
                    }
                });

            } catch (err) {
                console.error('[WalletContext] Error initializing:', err);
                if (isMounted) {
                    setState(prev => ({ ...prev, error: 'Failed to load wallet' }));
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
            setState(prev => ({ ...prev, connecting: true }));
            appKitModal.open({ view: 'Connect' })
                .catch((err: any) => console.error('[WalletContext] Connect error:', err))
                .finally(() => setState(prev => ({ ...prev, connecting: false })));
        } else if (state.error) {
            alert('Wallet is not available. Please check configuration.');
        }
    }, [appKitModal, state.error]);

    const disconnectWallet = useCallback(async () => {
        try {
            await appKitModal?.disconnect?.();
        } catch (err) {
            console.error('[WalletContext] Disconnect error:', err);
        }
        setState(prev => ({
            ...prev,
            isConnected: false,
            address: null,
            balance: 0,
            bnsName: null,
        }));
    }, [appKitModal]);

    const switchNetwork = useCallback(() => {
        if (appKitModal) {
            appKitModal.open({ view: 'Networks' }).catch(console.error);
        }
    }, [appKitModal]);

    const value: WalletContextType = {
        ...state,
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
    return useContext(WalletContext);
}

// BNS name resolution
async function resolveBnsName(address: string): Promise<string | null> {
    try {
        const res = await fetch(
            `https://stacks-node-api.mainnet.stacks.co/v1/addresses/stacks/${address}`
        );
        const data = await res.json();
        return data.names?.[0] || null;
    } catch {
        return null;
    }
}

export default WalletContext;
