import {IncomingMessage, ServerResponse} from "node:http";
import {processUIRequest} from "./validationInterceptor";
import {createUser, User} from "../models/User";

export const createUserController = async (req: IncomingMessage, res: ServerResponse) => {
    const newUserData = await processUIRequest(req, res);
    if (!newUserData || !(newUserData as User).username || !(newUserData as User).hobbies || !(newUserData as User).age) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ message: 'Missing required fields' }));
    }

    const {username, age, hobbies} = newUserData as User;

    try {
        const newUser = createUser(username, age, hobbies);
        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(newUser))
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ message: 'Unexpected server error', log: err }));
    }
};