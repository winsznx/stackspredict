import { createServer } from 'http';
import next from 'next';
import './websocket';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = parseInt(process.env.PORT || '3000');

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
        console.log('> WebSocket server running on port 8080');
    });
});
