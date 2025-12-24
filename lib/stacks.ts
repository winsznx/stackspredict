import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// App configuration for Stacks Connect
export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

// Network configuration
export const getNetwork = () => {
    const isMainnet = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';
    return isMainnet ? STACKS_MAINNET : STACKS_TESTNET;
};

// Connect wallet
export const connectWallet = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        showConnect({
            appDetails: {
                name: 'StacksPredict',
                icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '',
            },
            redirectTo: '/',
            onFinish: () => {
                resolve();
            },
            onCancel: () => {
                reject(new Error('User cancelled'));
            },
            userSession,
        });
    });
};

// Disconnect wallet
export const disconnectWallet = () => {
    userSession.signUserOut();
};

// Get user address
export const getUserAddress = (): string | null => {
    if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        return userData.profile.stxAddress.mainnet;
    }
    return null;
};

// Format Stacks address (truncate)
export const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format STX/sBTC amount
export const formatSTX = (amount: number): string => {
    return `${amount.toFixed(8)} STX`;
};

export const formatSBTC = (amount: number): string => {
    return `₿${amount.toFixed(8)}`;
};

// Calculate probability from YES price
export const calculateProbability = (yesPrice: number): number => {
    return yesPrice; // Price is already in percentage (0-100)
};

// Calculate potential payout
export const calculatePayout = (
    shares: number,
    side: 'YES' | 'NO',
    outcomePrice: number
): number => {
    // Each share pays out 1 sBTC if correct
    return shares * 1;
};

// Calculate unrealized P&L
export const calculateUnrealizedPnL = (
    shares: number,
    averagePrice: number,
    currentPrice: number
): number => {
    const costBasis = shares * (averagePrice / 100);
    const currentValue = shares * (currentPrice / 100);
    return currentValue - costBasis;
};

// Calculate unrealized P&L percentage
export const calculateUnrealizedPnLPercentage = (
    averagePrice: number,
    currentPrice: number
): number => {
    if (averagePrice === 0) return 0;
    return ((currentPrice - averagePrice) / averagePrice) * 100;
};
