/*
 * Title: Handle request and response
 * Description: Handle request and response
 * Author: Minhajul Karim
 * Date: 28/02/2021
 */

// Dependencies
const url = require('url')
const routes = require('../routes')
const { sampleHandler } = require('../handlers/routeHandlers/sampleHandler')
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler')

// Helper object, module scaffolding
const helper = {}

// Function that handles request, response
helper.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const queryObj = parsedUrl.query
  const { pathname } = parsedUrl
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '')
  const reqObj = {
    parsedUrl,
    queryObj,
    pathname,
    trimmedPath,
  }
  const chosenRoute = routes[trimmedPath] !== undefined ? routes[trimmedPath] : notFoundHandler
  console.log(chosenRoute)
  chosenRoute(reqObj, (statusCode, payload) => {
    const currentStatusCode = typeof statusCode === 'number' ? statusCode : 500
    const currentPayload = typeof payload === 'object' ? payload : {}
    const currentPayloadStr = JSON.stringify(currentPayload)
    res.writeHead(currentStatusCode)
    res.end(currentPayloadStr)
  })
}

// Export module
module.exports = helper