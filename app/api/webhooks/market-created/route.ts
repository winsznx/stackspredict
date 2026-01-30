import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Timing-safe comparison to prevent timing attacks on auth headers
 */
function safeCompare(a: string, b: string) {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(request: NextRequest) {
  try {
    // 1. Enhanced Security Check
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (webhookSecret) {
      const expectedAuth = `Bearer ${webhookSecret}`;
      if (!authHeader || !safeCompare(authHeader, expectedAuth)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const payload = await request.json();

    // 2. Validate Chainhook Payload Structure
    if (!payload.apply || !Array.isArray(payload.apply)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const results = [];

    for (const block of payload.apply) {
      for (const tx of block.transactions || []) {
        const marketData = parseMarketTransaction(tx);
        if (!marketData) continue;

        const txHash = tx.transaction_identifier?.hash;

        try {
          // 3. TODO: Idempotency Check
          // const existing = await prisma.market.findUnique({ where: { txHash } });
          // if (existing) continue;

          // 4. TODO: Database Operation
          // await saveMarketToDatabase(marketData, txHash, block.block_identifier.index);
          
          results.push({ txHash, status: 'processed' });
        } catch (dbError) {
          console.error(`[Webhook] Failed to save tx ${txHash}:`, dbError);
          // Don't throw here; continue to next transaction
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      processedCount: results.length 
    });

  } catch (error) {
    console.error('[Webhook] Critical Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 5. Typesafe Parsing
interface MarketData {
  question: string;
  description: string | null;
  category: string;
  endDate: number;
  settlementSource: string;
  initialLiquidity: number;
}

function parseMarketTransaction(tx: any): MarketData | null {
  try {
    const data = tx.metadata?.kind?.data;
    if (data?.method !== 'create-market') return null;

    const args = data.args;
    // Basic validation that args exist
    if (!args || args.length < 5) return null;

    return {
      question: args[0],
      description: args[1] || null,
      category: args[2],
      endDate: parseInt(args[3], 10), 
      settlementSource: args[4],
      initialLiquidity: parseFloat(args[5]),
    };
  } catch (error) {
    return null;
  }
}
