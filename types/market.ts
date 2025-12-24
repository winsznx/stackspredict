// Market types
export interface Market {
  id: string;
  question: string;
  category: 'Politics' | 'Crypto' | 'Sports' | 'Technology' | 'Entertainment' | 'Other';
  yesPrice: number;  // Price in cents (0-100)
  noPrice: number;   // Price in cents (0-100)
  volume24h: number; // Trading volume in last 24h (in sBTC)
  totalVolume: number; // Total volume (in sBTC)
  endDate: Date;
  settlementSource: string;
  creator: string;
  resolved: boolean;
  outcome?: 'YES' | 'NO';
  createdAt: Date;
  description?: string;
  imageUrl?: string;
  liquidity: number; // Total liquidity pool
}

// User position in a market
export interface Position {
  marketId: string;
  market: Market;
  shares: number;
  side: 'YES' | 'NO';
  averagePrice: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
}

// Order in the order book
export interface Order {
  id: string;
  marketId: string;
  side: 'YES' | 'NO';
  price: number;
  quantity: number;
  total: number;
  type: 'LIMIT' | 'MARKET';
  user: string;
  timestamp: Date;
  filled: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
}

// Order book
export interface OrderBook {
  bids: Order[];  // YES orders
  asks: Order[];  // NO orders
  spread: number;
}

// Trade history
export interface Trade {
  id: string;
  marketId: string;
  side: 'YES' | 'NO';
  price: number;
  quantity: number;
  total: number;
  buyer: string;
  seller: string;
  timestamp: Date;
}

// Price history point for charts
export interface PricePoint {
  timestamp: Date;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

// User profile
export interface UserProfile {
  address: string;
  username?: string;
  totalProfit: number;
  totalVolume: number;
  winRate: number;
  currentStreak: number;
  marketsTraded: number;
  expert: boolean;
  expertCategory?: string;
  twitterHandle?: string;
  verified: boolean;
}

// Social feed comment
export interface Comment {
  id: string;
  marketId: string;
  user: UserProfile;
  content: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  position?: {
    side: 'YES' | 'NO';
    shares: number;
  };
}

// Survey response for sentiment tracking
export interface SurveyResponse {
  marketId: string;
  response: 'YES' | 'NO';
  timestamp: Date;
  userId?: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  user: UserProfile;
  metric: number; // Profit, win rate, or streak depending on leaderboard type
}

// Notification type
export interface Notification {
  id: string;
  type: 'MARKET_RESOLVED' | 'ORDER_FILLED' | 'NEW_FOLLOWER' | 'COPIED_TRADE';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

// Copy trading configuration
export interface CopyTradeConfig {
  traderId: string;
  enabled: boolean;
  maxAmountPerTrade: number;
  categories: string[];
}
