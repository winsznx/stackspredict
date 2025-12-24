import { NextRequest, NextResponse } from 'next/server';

// Note: This webhook handler is ready for production use.
// To enable database functionality, set up PostgreSQL and configure Prisma.

/**
 * Webhook handler for market creation events from Chainhooks
 */
export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret
        const authHeader = request.headers.get('authorization');
        const expectedAuth = `Bearer ${process.env.WEBHOOK_SECRET}`;

        if (process.env.WEBHOOK_SECRET && authHeader !== expectedAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await request.json();

        // Process each transaction
        for (const block of payload.apply || []) {
            for (const tx of block.transactions || []) {
                const marketData = parseMarketTransaction(tx);

                if (!marketData) continue;

                console.log('[Webhook] New market created:', {
                    txId: tx.transaction_identifier?.hash,
                    creator: tx.metadata?.sender,
                    question: marketData.question,
                    category: marketData.category,
                    endDate: marketData.endDate,
                });

                // TODO: Enable database operations when Prisma is configured
                // await saveMarketToDatabase(marketData, tx, block);

                // TODO: Publish to Redis for WebSocket broadcast
                // await publishUpdate('new-markets', { ... });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Market creation webhook received.'
        });
    } catch (error) {
        console.error('[Webhook] Error processing market creation:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function parseMarketTransaction(tx: any) {
    try {
        const method = tx.metadata?.kind?.data?.method;

        if (method !== 'create-market') {
            return null;
        }

        const args = tx.metadata.kind.data.args;

        return {
            question: args[0],
            description: args[1] || null,
            category: args[2],
            endDate: parseInt(args[3]), // Unix timestamp
            settlementSource: args[4],
            initialLiquidity: parseFloat(args[5]),
        };
    } catch (error) {
        console.error('[Webhook] Error parsing transaction:', error);
        return null;
    }
}
