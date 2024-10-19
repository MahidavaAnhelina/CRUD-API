import {IncomingMessage, ServerResponse} from "node:http";
import {getUsersController} from "./getUsersController";
import {getUserByIdController} from "./getUserByIdController";

export const userController = (req: IncomingMessage, res: ServerResponse, userId: string) => {
    // will be parsing here by status
    switch (req.method) {
        //api/users
        //api/users/{userId}
        case 'GET': {
            if (userId) {
                getUserByIdController({ userId }, res);
            } else {
                getUsersController(res);
            }
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
};
