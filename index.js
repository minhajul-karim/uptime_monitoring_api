/*
 * Title: Project Initial File
 * Description: Initial file to start the server and workers
 * Author: Minhajul Karim
 * Date: 03/14/2021
 */

// Dependencies
const server = require('./lib/server')
const worker = require('./lib/worker')

// App object - module scaffolding
const app = {}

app.init = () => {
  // Start the server
  server.init()
  // Start the worker
  worker.init()
}

app.init()

// Export the app
module.exports = app
