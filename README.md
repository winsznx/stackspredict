# StacksPredict - Bitcoin-Native Prediction Market

A comprehensive prediction market aggregator built on the Stacks blockchain, combining the best features of Polymarket and Kalshi with Bitcoin-native advantages.

## 🚀 Features

### 🎯 Core Features
- **Multi-Platform Price Comparison** - See odds from StacksPredict, Polymarket, and Kalshi side-by-side
- **Arbitrage Dashboard** - Detect price differences and profit from market inefficiencies
- **Real-Time Updates** - WebSocket integration for instant price updates
- **Stacking Yield** - Earn Bitcoin yield on escrow while waiting for resolution
- **Activity Feed** - Live market activity with BNS name resolution
- **Order Book (CLOB)** - Centralized limit order book visualization

### 💎 Unique Selling Points
1. **"Market Mirror"** - First platform to aggregate Polymarket AND Kalshi prices
2. **"Arbitrage Recognition"** - Not just a market, but a cross-chain arbitrage tool
3. **"Bitcoin-Native Settlement"** - DLC-based automatic resolution
4. **"Social Skin-in-the-Game"** - Only shareholders can comment
5. **"Stacking While You Wait"** - Earn yield on locked escrow

## 📸 Screenshots

### Arbitrage Dashboard
![Arbitrage Dashboard](file:///Users/macbook/.gemini/antigravity/brain/cf6da162-4639-47ff-a5dc-9f3164a51a5d/arbitrage_dashboard_1766284360897.png)

### Market Detail with Advanced Features
![Market Detail](file:///Users/macbook/.gemini/antigravity/brain/cf6da162-4639-47ff-a5dc-9f3164a51a5d/market_detail_new_features_1766284385857.png)

## 🛠 Tech Stack

**Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Recharts, @stacks/connect  
**Backend**: Prisma, PostgreSQL, Redis, WebSocket, Axios  
**Blockchain**: Stacks, sBTC, Hiro Chainhooks, Pyth oracles

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit: **http://localhost:3000**

## 🌐 API Integrations

- **Polymarket** - `lib/integrations/polymarket.ts`
- **Kalshi** - `lib/integrations/kalshi.ts` (requires API key)

## 🔗 Environment Variables

Create `.env.local`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/stackspredict"
REDIS_URL="redis://localhost:6379"
KALSHI_API_KEY="your-key"
NEXT_PUBLIC_NETWORK="testnet"
```

## 📖 Documentation

- [Backend Integration Guide](./INTEGRATION_GUIDE.md)
- [Full Walkthrough](/.gemini/antigravity/brain/cf6da162-4639-47ff-a5dc-9f3164a51a5d/walkthrough.md)

## 🎯 Status

**Frontend**: ✅ Production-ready  
**Backend**: ⏳ Infrastructure complete, awaiting smart contracts  
**Deployment**: Ready for Vercel

---

**Built with ❤️ on Stacks | Powered by Bitcoin**
