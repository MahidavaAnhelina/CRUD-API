import { IncomingMessage, ServerResponse } from "http";
import { handleRequest } from "../../src/services/handleRequest";
import * as userControllerModule from "../../src/controllers/userController";

jest.mock("../../src/controllers/userController");

describe("handleRequest function", () => {
    let req: Partial<IncomingMessage>;
    let res: Partial<ServerResponse>;

    beforeEach(() => {
        req = {};
        res = {
            writeHead: jest.fn(),
            end: jest.fn(),
        };
    });

    test("should return 404 for non-existing endpoints", async () => {
        req.url = "/non/existing/endpoint";

        await handleRequest(req as IncomingMessage, res as ServerResponse);

        expect(res.writeHead).toHaveBeenCalledWith(404, { "Content-Type": "application/json" });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: "Endpoint not found" }));
    });

    test("should call userController for valid 'api/users' endpoint", async () => {
        req.url = "/api/users";

        await handleRequest(req as IncomingMessage, res as ServerResponse);

        expect(userControllerModule.userController).toHaveBeenCalledWith(req, res, undefined);
    });

    test("should call userController with userId for 'api/users/:userId' endpoint", async () => {
        const userId = "1234";
        req.url = `/api/users/${userId}`;

        await handleRequest(req as IncomingMessage, res as ServerResponse);

        expect(userControllerModule.userController).toHaveBeenCalledWith(req, res, userId);
    });

    test("should return 404 for incorrect API prefix", async () => {
        req.url = "/incorrect/users";

        await handleRequest(req as IncomingMessage, res as ServerResponse);

        expect(res.writeHead).toHaveBeenCalledWith(404, { "Content-Type": "application/json" });
        expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: "Endpoint not found" }));
    });
});
