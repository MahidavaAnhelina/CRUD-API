import {IncomingMessage, ServerResponse} from "node:http";
import {getUsersController} from "./getUsersController";
import {getUserByIdController} from "./getUserByIdController";
import {createUserController} from "./createUserController";

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
        //api/users/ + body
        case 'POST': {
            createUserController(req, res);
            break;
        }
        //api/users/{userId} + body
        case 'PUT': {
            break;
        }
        //api/users/{userId}
        case 'DELETE': {
            break;
        }
    }
};
