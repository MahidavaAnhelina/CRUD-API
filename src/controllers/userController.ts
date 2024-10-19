import {IncomingMessage, ServerResponse} from "node:http";

export const userController = (req: IncomingMessage, res: ServerResponse, userId: string) => {
    // will be parsing here by status
    switch (req.method) {
        //api/users
        //api/users/{userId}
        case 'GET': {
            break;
        }
        //api/users
        //api/users/{userId}
        case 'POST': {
            break;
        }
        //api/users/{userId}
        case 'DELETE': {
            break;
        }
    }
    return res.end(JSON.stringify({message: "Test"}));
};
