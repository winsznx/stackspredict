import axios from 'axios';

const POLYMARKET_API = 'https://gamma-api.polymarket.com';
const CLOB_API = 'https://clob.polymarket.com';

export interface PolymarketMarket {
    condition_id: string;
    question: string;
    description: string;
    end_date_iso: string;
    outcomes: string[];
    outcomePrices: string[];
    volume: string;
    liquidity: string;
    tags: string[];
}

export interface PolymarketPrice {
    market: string;
    price: number;
    timestamp: string;
}

/**
 * Fetch all markets from Polymarket
 */
export async function getPolymarketMarkets(limit = 100): Promise<PolymarketMarket[]> {
    try {
        const response = await axios.get(`${POLYMARKET_API}/markets`, {
            params: { limit, closed: false }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Polymarket markets:', error);
        return [];
    }
}

/**
 * Get price for a specific market
 */
export async function getPolymarketPrice(conditionId: string): Promise<PolymarketPrice | null> {
    try {
        const response = await axios.get(`${CLOB_API}/prices`, {
            params: { market: conditionId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching Polymarket price:', error);
        return null;
    }
}

/**
 * Match a local market to Polymarket by question similarity
 */
export function matchPolymarketQuestion(localQuestion: string, polymarkets: PolymarketMarket[]): PolymarketMarket | null {
    const normalizedLocal = localQuestion.toLowerCase().trim();

    for (const market of polymarkets) {
        const normalizedPoly = market.question.toLowerCase().trim();

        // Simple fuzzy matching - can be improved with better algorithm
        if (normalizedLocal === normalizedPoly ||
            normalizedLocal.includes(normalizedPoly) ||
            normalizedPoly.includes(normalizedLocal)) {
            return market;
        }
    }

    return null;
}

/**
 * Sync markets from Polymarket to database
 */
export async function syncPolymarketMarkets() {
    const markets = await getPolymarketMarkets();
    console.log(`Fetched ${markets.length} markets from Polymarket`);

    // TODO: Save to database with MarketMirror relationship
    return markets;
}
