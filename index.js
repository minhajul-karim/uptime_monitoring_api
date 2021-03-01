/*
 * Title: Uptime Monitoring Application
 * Description: A RESTful API to monitor up or down time of user defined links
 * Author: Minhajul Karim
 * Date: 24/02/2021
 */

/**
 * CRUD file operation
 */

// Dependencies
const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')
const environment = require('./helpers/environment')

// App object - module scaffolding
const app = {}

// Create server
app.createServer = () => {
  const server = http.createServer(handleReqRes)
  server.listen(environment.port, () => {
    console.log(`Listening on port ${environment.port}`)
  })
}

// Start the server
app.createServer()
