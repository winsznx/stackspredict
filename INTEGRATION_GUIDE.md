# StacksPredict - Quick Start Integration Guide

## Immediate Priorities (Week 1)

### 1. Polymarket API Integration (Day 1-2)

```bash
npm install axios
```

Create `lib/integrations/polymarket.ts`:

```typescript
import axios from 'axios';

const POLYMARKET_API = 'https://gamma-api.polymarket.com';

export async function getPolymarketMarkets() {
  const { data } = await axios.get(`${POLYMARKET_API}/markets`);
  return data;
}

export async function getPolymarketPrice(conditionId: string) {
  const { data } = await axios.get(`${POLYMARKET_API}/prices/${conditionId}`);
  return data;
}
```

Add to market detail page:

```typescript
// app/market/[id]/page.tsx
import { getPolymarketPrice } from '@/lib/integrations/polymarket';

// Inside component
const polyPrice = await getPolymarketPrice(market.polymarket_id);

// Display comparison
<PriceComparison 
  stacksPrice={market.yesPrice}
  polymarketPrice={polyPrice}
/>
```

---

### 2. Hiro Chainhooks Setup (Day 3-4)

**Install Hiro Platform CLI:**
```bash
npm install -g @hirosystems/clarinet
```

**Create Chainhook Config:**

`chainhooks/bet-monitor.json`:
```json
{
  "chain": "stacks",
  "uuid": "stackspredict-bets",
  "name": "Bet Monitor",
  "version": 1,
  "networks": {
    "testnet": {
      "if_this": {
        "scope": "print_event",
        "contract_identifier": "ST1...YOUR-CONTRACT",
        "contains": "new-bet"
      },
      "then_that": {
        "http_post": {
          "url": "http://localhost:3001/api/webhooks/bet",
          "authorization_header": "Bearer YOUR_SECRET"
        }
      }
    }
  }
}
```

**Deploy Chainhook:**
```bash
clarinet chainhooks upload chainhooks/bet-monitor.json --testnet
```

---

### 3. WebSocket Server (Day 5)

**Install dependencies:**
```bash
npm install ws ioredis
```

**Create WebSocket server:**

`server/websocket.ts`:
```typescript
import { WebSocketServer } from 'ws';
import Redis from 'ioredis';

const wss = new WebSocketServer({ port: 8080 });
const redis = new Redis(process.env.REDIS_URL);

// Subscribe to Redis pub/sub
redis.subscribe('market-updates');

redis.on('message', (channel, message) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');
```

**Start server:**
```bash
node server/websocket.ts
```

**Connect from frontend:**

```typescript
// context/MarketsContext.tsx
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    updateMarket(update.marketId, update.newPrices);
  };
  
  return () => ws.close();
}, []);
```

---

## Medium Priority (Week 2)

### 4. Database Setup

**Install Prisma:**
```bash
npm install prisma @prisma/client
npx prisma init
```

**Schema:**

`prisma/schema.prisma`:
```prisma
model Market {
  id        String   @id @default(uuid())
  question  String
  yesPrice  Float
  noPrice   Float
  polymarketId String?
  kalshiId   String?
  createdAt DateTime @default(now())
  bets      Bet[]
}

model Bet {
  id        String   @id @default(uuid())
  marketId  String
  market    Market   @relation(fields: [marketId], references: [id])
  user      String
  amount    Float
  side      String
  txId      String   @unique
  createdAt DateTime @default(now())
}
```

**Migrate:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 5. Webhook Handler

**Create API route:**

`app/api/webhooks/bet/route.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

export async function POST(request: Request) {
  const payload = await request.json();
  
  // Extract bet data from Chainhook payload
  const tx = payload.apply[0].transactions[0];
  const betData = parseBetTransaction(tx);
  
  // Save to database
  await prisma.bet.create({
    data: {
      marketId: betData.marketId,
      user: betData.sender,
      amount: betData.amount,
      side: betData.side,
      txId: tx.transaction_identifier.hash
    }
  });
  
  // Recalculate market odds
  const newOdds = await recalculateOdds(betData.marketId);
  
  // Publish to Redis for WebSocket broadcast
  await redis.publish('market-updates', JSON.stringify({
    marketId: betData.marketId,
    newPrices: newOdds
  }));
  
  return Response.json({ success: true });
}
```

---

## Low Priority (Week 3-4)

### 6. Arbitrage Detection

```typescript
// services/arbitrage.ts
export async function detectArbitrage() {
  const markets = await prisma.market.findMany({
    where: { polymarketId: { not: null } }
  });
  
  const opportunities = [];
  
  for (const market of markets) {
    const polyPrice = await getPolymarketPrice(market.polymarketId!);
    const diff = Math.abs(market.yesPrice - polyPrice.yes);
    
    if (diff > 5) { // 5% threshold
      opportunities.push({
        market,
        stacksPrice: market.yesPrice,
        polyPrice: polyPrice.yes,
        profit: diff
      });
    }
  }
  
  return opportunities.sort((a, b) => b.profit - a.profit);
}
```

---

## Environment Variables

Create `.env.local`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/stackspredict"
REDIS_URL="redis://localhost:6379"
WEBHOOK_SECRET="your-secret-key"
POLYMARKET_API_URL="https://gamma-api.polymarket.com"
KALSHI_API_KEY="your-kalshi-key"
NEXT_PUBLIC_WS_URL="ws://localhost:8080"
```

---

## Testing Checklist

- [ ] Polymarket API returns data
- [ ] Chainhook triggers webhook on testnet
- [ ] WebSocket broadcasts updates
- [ ] Database saves bets correctly
- [ ] Frontend receives real-time updates
- [ ] Arbitrage detector finds opportunities

---

## Deployment Order

1. Deploy PostgreSQL (Supabase/Neon)
2. Deploy Redis (Upstash)
3. Deploy WebSocket server (Railway/Render)
4. Deploy Next.js app (Vercel)
5. Register Chainhooks with Hiro Platform
6. Monitor logs and errors

---

## Monitoring

**Add Sentry:**
```bash
npm install @sentry/nextjs
```

**Track key metrics:**
- API response times
- WebSocket connection count
- Chainhook webhook success rate
- Database query performance
- Arbitrage opportunities found

---

## Resources

- [Polymarket Docs](https://docs.polymarket.com/)
- [Kalshi API](https://docs.kalshi.com/)
- [Hiro Chainhooks](https://docs.hiro.so/chainhooks)
- [Stacks Connect](https://connect.stacks.js.org/)
- [Pyth Oracle](https://pyth.network/developers)
