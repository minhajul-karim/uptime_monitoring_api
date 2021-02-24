/*
 * Title: Uptime Monitoring Application
 * Description: A RESTful API to monitor up or down time of user defined links
 * Author: Minhajul Karim
 * Date: 24/02/2021
 */

// Dependencies
const http = require('http')

// App object - module scaffolding
const app = {}

// Configuration
app.config = {
  port: 3000,
}

// Create server
app.createServer = () => {
  const server = http.createServer(app.handleReqResponse)
  server.listen(app.config.port, () => {
    console.log(`Listening on port ${app.config.port}`)
  })
}

// Function that handles request, response
app.handleReqResponse = (req, res) => {
  res.write('HI')
  res.end()
}

// Start the server
app.createServer()
