/*
 * Title: Uptime Monitoring Application
 * Description: A RESTful API to monitor up or down time of user defined links
 * Author: Minhajul Karim
 * Date: 24/02/2021
 */

// Dependencies
const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')

// App object - module scaffolding
const app = {}

// Configuration
app.config = {
  port: 3000,
}

// Create server
app.createServer = () => {
  const server = http.createServer(handleReqRes)
  server.listen(app.config.port, () => {
    console.log(`Listening on port ${app.config.port}`)
  })
}

// Start the server
app.createServer()
