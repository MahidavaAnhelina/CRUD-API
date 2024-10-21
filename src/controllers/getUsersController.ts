import { ServerResponse } from 'node:http'
import { users } from '../models/User'

export const getUsersController = (res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(JSON.stringify(users))
}
