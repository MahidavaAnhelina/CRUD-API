import { createServer, request } from 'http';

export function loadBalancer(port: number, workerPorts: number[]) {
    let currentWorker = 0;

    const server = createServer((req, res) => {
        const workerPort = workerPorts[currentWorker];
        currentWorker = (currentWorker + 1) % workerPorts.length;

        const options = {
            hostname: 'localhost',
            port: workerPort,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };

        const proxy = request(options, (workerRes) => {
            res.writeHead(workerRes.statusCode || 500, workerRes.headers);
            workerRes.pipe(res, { end: true });
        });

        proxy.on('error', () => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        });

        req.pipe(proxy, { end: true });
    });

    server.listen(port, () => {
        console.log(`Load balancer is running on port ${port}`);
    });
}
