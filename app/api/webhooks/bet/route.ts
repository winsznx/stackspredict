import { NextRequest, NextResponse } from 'next/server';

// Note: This webhook handler is ready for production use.
// To enable database functionality, set up PostgreSQL and run:
// npx prisma generate && npx prisma migrate deploy

interface ChainhookPayload {
    apply: Array<{
        transactions: Array<{
            transaction_identifier: {
                hash: string;
            };
            metadata: {
                sender: string;
                kind: {
                    data: {
                        contract_identifier: string;
                        method: string;
                        args: string[];
                    };
                };
            };
            operations: any[];
        }>;
        block_identifier: {
            index: number;
            hash: string;
        };
    }>;
    rollback: any[];
}

/**
 * Webhook handler for new bet events from Chainhooks
 * 
 * To enable full functionality:
 * 1. Set up PostgreSQL database
 * 2. Configure DATABASE_URL in environment
 * 3. Run: npx prisma generate && npx prisma migrate deploy
 * 4. Uncomment database code below
 */
export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret
        const authHeader = request.headers.get('authorization');
        const expectedAuth = `Bearer ${process.env.WEBHOOK_SECRET}`;

        if (process.env.WEBHOOK_SECRET && authHeader !== expectedAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload: ChainhookPayload = await request.json();

        // Process each transaction
        for (const block of payload.apply) {
            for (const tx of block.transactions) {
                const betData = parseBetTransaction(tx);

                if (!betData) continue;

                console.log('[Webhook] New bet received:', {
                    txId: tx.transaction_identifier.hash,
                    sender: betData.sender,
                    marketId: betData.marketId,
                    side: betData.side,
                    shares: betData.shares,
                    price: betData.price,
                    blockHeight: block.block_identifier.index,
                });

                // TODO: Enable database operations when Prisma is configured
                // await saveBetToDatabase(betData, tx, block);

                // TODO: Publish to Redis for WebSocket broadcast
                // await publishUpdate('market-updates', { ... });
            }
        }

        return NextResponse.json({
            success: true,
            processed: payload.apply.length,
            message: 'Webhook received. Database operations pending configuration.'
        });
    } catch (error) {
        console.error('[Webhook] Error processing bet:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * Parse bet transaction from Chainhook payload
 */
function parseBetTransaction(tx: any) {
    try {
        const method = tx.metadata?.kind?.data?.method;

        if (method !== 'place-bet') {
            return null;
        }

        const args = tx.metadata.kind.data.args;

        return {
            sender: tx.metadata.sender,
            marketId: args[0], // market-id
            side: args[1], // YES or NO
            shares: parseInt(args[2]), // shares
            price: parseFloat(args[3]), // price
        };
    } catch (error) {
        console.error('[Webhook] Error parsing transaction:', error);
        return null;
    }
}
