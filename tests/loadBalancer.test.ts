import { createServer, request } from 'http';
import {IncomingMessage, ServerResponse} from "node:http";
import {loadBalancer} from "../src/loadBalancer";

jest.mock('http', () => ({
    createServer: jest.fn(),
    request: jest.fn(),
}));

describe('loadBalancer function', () => {
    let serverListenMock: jest.Mock;
    let serverOnMock: jest.Mock;
    let reqMock: Partial<IncomingMessage>;
    let resMock: Partial<ServerResponse>;

    beforeEach(() => {
        serverListenMock = jest.fn();
        serverOnMock = jest.fn();
        (createServer as jest.Mock).mockImplementation((callback) => {
            return {
                listen: serverListenMock,
                on: serverOnMock,
            };
        });

        reqMock = {
            pipe: jest.fn(),
            method: 'GET',
            headers: {},
            url: '/test',
        };

        resMock = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };

        (request as jest.Mock).mockImplementation((options, callback) => {
            // Mocking the proxy request object and its events
            const proxyRes = {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                pipe: jest.fn(),
            };

            setImmediate(() => callback(proxyRes));
            return {
                on: jest.fn(),
                end: jest.fn(),
            };
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should start server and listen on specified port', () => {
        const port = 4000;
        const workerPorts = [4001, 4002, 4003];

        loadBalancer(port, workerPorts);

        expect(createServer).toHaveBeenCalled();
        expect(serverListenMock).toHaveBeenCalledWith(port, expect.any(Function));
    });

    test('should forward requests to worker ports in round-robin fashion', () => {
        const port = 4000;
        const workerPorts = [4001, 4002];

        loadBalancer(port, workerPorts);

        const requestHandler = (createServer as jest.Mock).mock.calls[0][0];
        requestHandler(reqMock as IncomingMessage, resMock as ServerResponse);

        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({ port: 4001 }),
            expect.any(Function)
        );

        requestHandler(reqMock as IncomingMessage, resMock as ServerResponse);

        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({ port: 4002 }),
            expect.any(Function)
        );

        requestHandler(reqMock as IncomingMessage, resMock as ServerResponse);

        // Round-robin back to the first worker port
        expect(request).toHaveBeenCalledWith(
            expect.objectContaining({ port: 4001 }),
            expect.any(Function)
        );
    });

    test('should handle worker response correctly', () => {
        const port = 4000;
        const workerPorts = [4001];

        loadBalancer(port, workerPorts);

        const requestHandler = (createServer as jest.Mock).mock.calls[0][0];
        requestHandler(reqMock as IncomingMessage, resMock as ServerResponse);

        const callback = (request as jest.Mock).mock.calls[0][1];
        const proxyRes = {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            pipe: jest.fn(),
        };

        callback(proxyRes);

        expect(resMock.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'application/json' });
        expect(proxyRes.pipe).toHaveBeenCalledWith(resMock, { end: true });
    });

    test('should handle proxy request error and return 500 status code', () => {
        const port = 4000;
        const workerPorts = [4001];

        loadBalancer(port, workerPorts);

        const requestHandler = (createServer as jest.Mock).mock.calls[0][0];
        requestHandler(reqMock as IncomingMessage, resMock as ServerResponse);

        const proxy = (request as jest.Mock).mock.results[0].value;
        proxy.on.mock.calls[0][1](); // Call the error handler

        expect(resMock.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'application/json' });
        expect(resMock.end).toHaveBeenCalledWith(JSON.stringify({ message: 'Internal Server Error' }));
    });
});
