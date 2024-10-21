import { processUIRequest } from './validationInterceptor'
import { IncomingMessage, ServerResponse } from 'node:http'
import { updateUser, User, users } from '../models/User'
import { validate } from 'uuid'

export const updateUserController = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId?: string,
) => {
  if (userId && validate(userId)) {
    const newUserData = await processUIRequest(req, res)
    if (
      !newUserData &&
      !(newUserData as User).username &&
      !(newUserData as User).hobbies &&
      !(newUserData as User).age
    ) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ message: 'Missing required fields' }))
    }

    if (
      !!(newUserData as User).hobbies &&
      !Array.isArray((newUserData as User).hobbies)
    ) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ message: 'Hobbies has invalid' }))
    }

    const foundUser = users.find((user) => user.id === userId)
    if (!foundUser) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ message: 'User not found' }))
    }

    try {
      const newUser = updateUser(newUserData as Partial<User>, userId)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify(newUser))
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      return res.end(
        JSON.stringify({ message: 'Unexpected server error', log: err }),
      )
    }
  }
  res.writeHead(400, { 'Content-Type': 'application/json' })
  return res.end(JSON.stringify({ message: 'Invalid user ID' }))
}
