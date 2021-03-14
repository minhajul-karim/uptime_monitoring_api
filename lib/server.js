/*
 * Title: Server library
 * Description: Server related functionalities
 * Author: Minhajul Karim
 * Date: 03/14/2021
 */

// Dependencies
const http = require('http')
const handler = require('../handlers/routeHandlers/sampleHandler')
const { handleReqRes } = require('../helpers/handleReqRes')

// Server object - module scaffolding
const server = {}

// Configuration
server.config = {
  port: 3000,
}

// Create server
server.createServer = () => {
  const myServer = http.createServer(server.handleReqRes)
  myServer.listen(server.config.port, () => {
    console.log(`Listening on port ${server.config.port}`)
  })
}

// Handle request response
server.handleReqRes = handleReqRes

// Start the server
server.init = () => {
  server.createServer()
}

// Export module
module.exports = server
