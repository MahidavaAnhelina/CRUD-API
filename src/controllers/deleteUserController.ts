import {ServerResponse} from "node:http";
import {validate} from "uuid";
import {deleteUser} from "../models/User";

export const deleteUserController = (res: ServerResponse, userId?: string) => {
    if (userId && validate(userId)) {
        const {success} = deleteUser(userId);
        if (success) {
            res.writeHead(204)
            return res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ message: 'User not found' }))
        }
    }
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: 'Invalid user ID' }));
};
