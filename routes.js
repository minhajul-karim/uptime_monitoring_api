/*
 * Title: Route Handlers
 * Description: Handle routes
 * Author: Minhajul Karim
 * Date: 28/02/2021
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler')
const { notFoundHandler } = require('./handlers/routeHandlers/notFoundHandler')

// Routes object, module scaffolding
const routes = {
  sample: sampleHandler,
  notFound: notFoundHandler,
}

// Export module
module.exports = routes
