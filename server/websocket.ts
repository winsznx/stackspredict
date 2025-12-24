import { WebSocketServer, WebSocket } from 'ws';
import Redis from 'ioredis';

// Redis pub/sub for broadcasting
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const redisSub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// WebSocket server
const PORT = parseInt(process.env.WS_PORT || '8080');
const wss = new WebSocketServer({ port: PORT });

// Track connected clients
const clients = new Set<WebSocket>();

// Subscribe to Redis channels
redisSub.subscribe('market-updates', 'new-bets', 'market-resolved');

// Handle Redis messages
redisSub.on('message', (channel, message) => {
    console.log(`[Redis] ${channel}:`, message.substring(0, 100));

    // Broadcast to all connected WebSocket clients
    broadcast({
        channel,
        data: JSON.parse(message)
    });
});

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
    console.log('[WebSocket] Client connected. Total clients:', clients.size + 1);
    clients.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to StacksPredict real-time updates'
    }));

    // Handle client messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('[WebSocket] Received from client:', message);

            // Handle subscribe to specific market
            if (message.type === 'subscribe' && message.marketId) {
                // Store subscription info (can use a Map for client subscriptions)
                ws.send(JSON.stringify({
                    type: 'subscribed',
                    marketId: message.marketId
                }));
            }
        } catch (error) {
            console.error('[WebSocket] Error parsing client message:', error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        clients.delete(ws);
        console.log('[WebSocket] Client disconnected. Total clients:', clients.size);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('[WebSocket] Error:', error);
        clients.delete(ws);
    });
});

/**
 * Broadcast message to all connected clients
 */
function broadcast(message: any) {
    const payload = JSON.stringify(message);
    let sent = 0;

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
            sent++;
        }
    });

    console.log(`[WebSocket] Broadcast to ${sent} clients`);
}

/**
 * Publish event to Redis (to be picked up by WebSocket)
 */
export async function publishUpdate(channel: string, data: any) {
    await redis.publish(channel, JSON.stringify(data));
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[WebSocket] Shutting down...');
    wss.close(() => {
        redis.disconnect();
        redisSub.disconnect();
        process.exit(0);
    });
});

console.log(`[WebSocket] Server running on ws://localhost:${PORT}`);

export { wss, redis };
