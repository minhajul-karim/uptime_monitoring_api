/*
 * Title: Token Handler
 * Description: Handle user tokens
 * Author: Minhajul Karim
 * Date: 03/09/2021
 */

// Dependencies
const data = require('../../lib/data')
const { parseJSON, createHash, createRandomString } = require('../../helpers/utilities')

// Handler module - module scaffolding
const handler = {}

// Function that handles user route
handler.tokenHandler = (reqObj, callback) => {
  // Call the appropriate function received from reqObj
  const acceptedMethods = ['post', 'get', 'put', 'delete']
  // Index of accepted method
  const index = acceptedMethods.findIndex((method) => method === reqObj.method)
  if (index > -1) {
    // Call the function
    handler._tokens[acceptedMethods[index]](reqObj, callback)
  } else {
    callback(405)
  }
}

handler._tokens = {}

// Create new token
handler._tokens.post = (reqObj, callback) => {
  // Parse reqObj.body and convert it into JSON data
  const parsedBody = parseJSON(reqObj.body)

  // Destructure the JSON
  let { phone, password } = parsedBody

  // Validate fields
  phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : null
  password = typeof password === 'string' && password.trim().length > 0 ? password : null

  if (phone && password) {
    // Check if any user with this phone num exists
    data.read('users', phone, (readErr, userStr) => {
      if (!readErr && userStr) {
        // Check if provided password matches with the existing one
        if (createHash(password) === parseJSON(userStr).password) {
          const tokenObj = {
            phone,
            token: createRandomString(20),
            expireTime: Date.now() + 60 * 60 * 1000,
          }
          // Create token
          data.create('tokens', tokenObj.token, tokenObj, (createErr) => {
            if (!createErr) {
              callback(200, { Message: 'Token created' })
            } else {
              callback(500, { Error: 'Can not create token' })
            }
          })
        } else {
          callback(403, { Error: 'Authentication failure' })
        }
      } else {
        callback(403, { Error: 'Authentication failure' })
      }
    })
  } else {
    callback(400, { Error: 'There is a problem in your request.' })
  }
}

// Retrieve token information
handler._tokens.get = (reqObj, callback) => {}

// Replace token information
handler._tokens.put = (reqObj, callback) => {}

// Remove token
handler._tokens.delete = (reqObj, callback) => {}

// Export Module
module.exports = handler
