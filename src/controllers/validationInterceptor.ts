import {IncomingMessage, ServerResponse} from "node:http";

export const processUIRequest = async (req: IncomingMessage, res: ServerResponse) => {
    return new Promise((resolve, reject) => {
        try {
            let body = ''
            req.on('data', (chunk) => {
                body += chunk.toString()
            })
            req.on('end', () => {
                if (body) {
                    resolve(JSON.parse(body))
                } else {
                    reject(new Error('Unexpected body'));
                }
            })
        } catch (error) {
            reject(error)
        }
    })
};
