/*
 * Title: Route Handlers
 * Description: Handle routes
 * Author: Minhajul Karim
 * Date: 28/02/2021
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler')
const { userHandler } = require('./handlers/routeHandlers/userHandler')
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler')

// Routes object, module scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
}

// Export module
module.exports = routes
