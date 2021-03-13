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
        const hashedPassword = createHash(password)
        if (hashedPassword === parseJSON(userStr).password) {
          // Token object
          const tokenObj = {
            phone,
            token: createRandomString(20),
            expireTime: Date.now() + 60 * 60 * 1000,
          }
          // Store token
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
handler._tokens.get = (reqObj, callback) => {
  // Get the id from request object
  let { id } = reqObj.queryObj
  // Validate id
  id = typeof id === 'string' && id.trim().length === 20 ? id : null
  if (id) {
    // Read token file
    data.read('tokens', id, (readErr, tokenData) => {
      if (readErr) {
        callback(500, { Error: 'No such token found' })
      } else {
        const token = { ...parseJSON(tokenData) }
        callback(200, token)
      }
    })
  } else {
    callback(404, { Error: 'No such token found' })
  }
}

// Replace token information
handler._tokens.put = (reqObj, callback) => {
  // Parse reqObj.body and convert it into JSON data
  const parsedBody = parseJSON(reqObj.body)

  // Destructure the JSON
  let { id, needToExtend } = parsedBody

  // Validate fields
  id = typeof id === 'string' && id.trim().length === 20 ? id : null
  needToExtend = typeof needToExtend === 'boolean' && needToExtend ? needToExtend : false

  if (id && needToExtend) {
    // Check if such token with given id exists
    data.read('tokens', id, (readErr, tokenDataStr) => {
      if (!readErr && tokenDataStr) {
        // Update token expire time
        const token = parseJSON(tokenDataStr)
        token.expireTime = Date.now() + 60 * 60 * 1000
        // Save updated token
        data.update('tokens', id, token, (updateErr) => {
          if (updateErr) {
            callback(500, { Error: 'Can not update token' })
          } else {
            callback(200, { Message: 'Token updated' })
          }
        })
      } else {
        callback(400, { Error: 'There is a problem in your request' })
      }
    })
  } else {
    callback(400, { Error: 'There is a problem in your request' })
  }
}

// Remove token
handler._tokens.delete = (reqObj, callback) => {
  // Get the id from request object
  let { id } = reqObj.queryObj
  // Validate id
  id = typeof id === 'string' && id.trim().length === 20 ? id : null
  if (id) {
    // Read token
    data.read('tokens', id, (readErr) => {
      if (!readErr) {
        // Delete file
        data.delete('tokens', id, (deleteErr) => {
          if (deleteErr) {
            callback(500, { Error: 'Can not delete token' })
          } else {
            callback(200, { Message: 'Token deleted' })
          }
        })
      } else {
        callback(400, { Error: 'Delete error. Token may not exists!' })
      }
    })
  } else {
    callback(400, { Error: 'There is an error in your request.' })
  }
}

// Verify token
handler._tokens.verify = (tokenId, phone, callback) => {
  // Read token file
  data.read('tokens', tokenId, (readErr, tokenDataStr) => {
    // When token exists, compare phone
    if (!readErr && tokenDataStr) {
      const tokenData = parseJSON(tokenDataStr)
      // When phone matches with token's phone and token is still alive
      if (tokenData.phone === phone && tokenData.expireTime > Date.now()) {
        callback(true)
      } else {
        callback(false)
      }
    } else {
      callback(false)
    }
  })
}

// Export Module
module.exports = handler
