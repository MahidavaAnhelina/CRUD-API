import http from 'http'
import dotenv from 'dotenv'
import { handleRequest } from './services/handleRequest'

dotenv.config()

const port = process.env.PORT || 4000
const server = http.createServer(handleRequest)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
