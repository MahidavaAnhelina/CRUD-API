import { users } from '../models/User'
import { validate } from 'uuid'
import { ServerResponse } from 'node:http'

interface Args {
  userId: string
}

export const getUserByIdController = (
  { userId }: Args,
  res: ServerResponse,
) => {
  if (validate(userId)) {
    const foundUser = users.find((user) => user.id === userId)
    if (foundUser) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify(foundUser))
    }
    res.writeHead(404, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: 'User not found' }))
  }
  res.writeHead(400, { 'Content-Type': 'application/json' })
  return res.end(JSON.stringify({ message: 'Invalid user ID' }))
}
