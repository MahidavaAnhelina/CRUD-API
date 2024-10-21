import { IncomingMessage, ServerResponse } from 'node:http'
import { userController } from '../controllers/userController'

export const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const [_, api, resource, userId] = req.url ? req.url.split('/') : []

  if (api !== 'api' || resource !== 'users') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: 'Endpoint not found' }))
  }

  await userController(req, res, userId)
}
