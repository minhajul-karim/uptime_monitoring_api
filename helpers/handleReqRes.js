/*
 * Title: Handle request and response
 * Description: Handle request and response
 * Author: Minhajul Karim
 * Date: 28/02/2021
 */

// Dependencies
const { StringDecoder } = require('string_decoder')
const url = require('url')
const { parse } = require('path')
const routes = require('../routes')
const { sampleHandler } = require('../handlers/routeHandlers/sampleHandler')
const { userHandler } = require('../handlers/routeHandlers/userHandler')
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler')

// Helper object, module scaffolding
const helper = {}

// Function that handles request, response
helper.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const queryObj = parsedUrl.query
  const { pathname } = parsedUrl
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '')
  const method = req.method.toLowerCase()
  const headersObj = req.headers
  const reqObj = {
    parsedUrl,
    queryObj,
    pathname,
    trimmedPath,
    method,
    headersObj,
  }

  const chosenHandler = routes[trimmedPath] !== undefined ? routes[trimmedPath] : notFoundHandler
  const decoder = new StringDecoder('utf8')
  let fullData = ''

  req.on('data', (buffer) => {
    fullData += decoder.write(buffer)
  })

  req.on('end', () => {
    const body = decoder.end(fullData)
    reqObj.body = body
    chosenHandler(reqObj, (statusCode, payload) => {
      const currentStatusCode = typeof statusCode === 'number' ? statusCode : 500
      const currentPayload = typeof payload === 'object' ? payload : {}
      const currentPayloadStr = JSON.stringify(currentPayload)
      res.writeHead(currentStatusCode)
      res.end(currentPayloadStr)
    })
  })
}

// Export module
module.exports = helper
