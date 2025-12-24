import axios from 'axios';

const KALSHI_API = 'https://trading-api.kalshi.com/v1';

export interface KalshiMarket {
    ticker: string;
    title: string;
    category: string;
    yes_ask: number;
    yes_bid: number;
    no_ask: number;
    no_bid: number;
    volume: number;
    open_interest: number;
    close_time: string;
    status: string;
}

/**
 * Get markets from Kalshi
 * Note: Requires API key for authentication
 */
export async function getKalshiMarkets(apiKey: string): Promise<KalshiMarket[]> {
    try {
        const response = await axios.get(`${KALSHI_API}/markets`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        return response.data.markets || [];
    } catch (error) {
        console.error('Error fetching Kalshi markets:', error);
        return [];
    }
}

/**
 * Get specific market by ticker
 */
export async function getKalshiMarket(ticker: string, apiKey: string): Promise<KalshiMarket | null> {
    try {
        const response = await axios.get(`${KALSHI_API}/markets/${ticker}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        return response.data.market;
    } catch (error) {
        console.error(`Error fetching Kalshi market ${ticker}:`, error);
        return null;
    }
}

/**
 * Get orderbook for a market
 */
export async function getKalshiOrderbook(ticker: string, apiKey: string) {
    try {
        const response = await axios.get(`${KALSHI_API}/markets/${ticker}/orderbook`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching Kal orderbook for ${ticker}:`, error);
        return null;
    }
}

/**
 * Match local market to Kalshi market
 */
export function matchKalshiMarket(localQuestion: string, kalshiMarkets: KalshiMarket[]): KalshiMarket | null {
    const normalized = localQuestion.toLowerCase().trim();

    for (const market of kalshiMarkets) {
        const kalshiTitle = market.title.toLowerCase().trim();

        if (normalized === kalshiTitle ||
            normalized.includes(kalshiTitle) ||
            kalshiTitle.includes(normalized)) {
            return market;
        }
    }

    return null;
}
