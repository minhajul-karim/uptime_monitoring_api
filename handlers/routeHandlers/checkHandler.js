/*
 * Title: Check Handler
 * Description: Handle check related routes
 * Author: Minhajul Karim
 * Date: 03/11/2021
 */

// Dependencies
const data = require('../../lib/data')
const { parseJSON, createRandomString } = require('../../helpers/utilities')
const tokenHandler = require('./tokenHandler')

// Handler module - module scaffolding
const handler = {}

// Function that handles user route
handler.checkHandler = (reqObj, callback) => {
  // Call the appropriate function received from reqObj
  const acceptedMethods = ['post', 'get', 'put', 'delete']
  // Index of accepted method
  const index = acceptedMethods.findIndex((method) => method === reqObj.method)
  if (index > -1) {
    // Call the function
    handler._checks[acceptedMethods[index]](reqObj, callback)
  } else {
    callback(405)
  }
}

handler._checks = {}

// Create new check file
handler._checks.post = (reqObj, callback) => {
  // Parse reqObj.body and convert it into JSON data
  const parsedBody = parseJSON(reqObj.body)

  // Sanitize inputs
  let { protocol, url, method, successCodes, timeoutSeconds } = parsedBody
  protocol = typeof protocol === 'string' && ['http', 'https'].includes(protocol) ? protocol : false
  url = typeof url === 'string' && url.trim().length > 0 ? url : false
  method =
    typeof method === 'string' && ['get', 'post', 'put', 'delete'].includes(method.toLowerCase())
      ? method
      : false
  successCodes =
    typeof successCodes === 'object' && successCodes instanceof Array ? successCodes : false
  timeoutSeconds =
    typeof timeoutSeconds === 'number' &&
    timeoutSeconds > 0 &&
    timeoutSeconds < 6 &&
    timeoutSeconds % 1 === 0
      ? timeoutSeconds
      : false

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // Sanitize token
    let { token } = reqObj.headersObj
    token = typeof token === 'string' && token.trim().length === 20 ? token : false
    if (token) {
      // Get phone number from token
      data.read('tokens', token, (tokenReadErr, tokenDataStr) => {
        if (!tokenReadErr && tokenDataStr) {
          const tokenData = parseJSON(tokenDataStr)
          const { phone } = tokenData
          // Verify token
          tokenHandler._tokens.verify(token, phone, (isVerified) => {
            if (isVerified) {
              const checkId = createRandomString(20)
              const checkObj = {
                id: checkId,
                protocol,
                phone,
                url,
                method,
                successCodes,
                timeoutSeconds,
              }
              // Store check data
              data.create('checks', checkId, checkObj, (createErr) => {
                if (!createErr) {
                  // Read phone.json
                  data.read('users', phone, (readErr, userDataStr) => {
                    if (!readErr && userDataStr) {
                      const userObj = parseJSON(userDataStr)
                      // Add checks property
                      userObj.checks =
                        typeof userObj.checks === 'object' && userObj.checks instanceof Array
                          ? userObj.checks
                          : []
                      // Add checks property to userobj
                      userObj.checks.push(checkId)
                      // Update phone.json
                      data.update('users', phone, userObj, (updateErr) => {
                        if (!updateErr) {
                          callback(200, checkObj)
                        } else {
                          callback(500, { Error: 'There is a problem in the server!' })
                        }
                      })
                    } else {
                      callback(500, { Error: 'There is a problem in the server!' })
                    }
                  })
                } else {
                  callback(500, { Error: 'There is a problem in the server!' })
                }
              })
            } else {
              callback(403, { Error: 'Authorization Failure' })
            }
          })
        } else {
          callback(400, {
            Error: 'Can not verify token. The token may have expired or does not exist!',
          })
        }
      })
    } else {
      callback(403, { Error: 'Authorization Failure' })
    }
  } else {
    callback(400, { Error: 'There is a problem in your request.' })
  }
}

// Retrieve check information
handler._checks.get = (reqObj, callback) => {
  // Get the check id from request object
  let checkId = reqObj.queryObj.id
  // Validate check id
  checkId = typeof checkId === 'string' && checkId.trim().length === 20 ? checkId : false
  if (checkId) {
    // Get and sanitize the token from headers
    let { token } = reqObj.headersObj
    token = typeof token === 'string' && token.trim().length === 20 ? token : false
    // Verify the token
    if (token) {
      // Get phone number from token
      data.read('tokens', token, (tokenReadErr, tokenDataStr) => {
        if (!tokenReadErr && tokenDataStr) {
          const tokenData = parseJSON(tokenDataStr)
          const { phone } = tokenData
          // Verify token
          tokenHandler._tokens.verify(token, phone, (isVerified) => {
            if (isVerified) {
              // Send the check obj
              data.read('checks', checkId, (checkReadErr, checkDataStr) => {
                if (!checkReadErr && checkDataStr) {
                  callback(200, parseJSON(checkDataStr))
                } else {
                  callback(500, { Error: 'There is a problem in the server!' })
                }
              })
            } else {
              callback(403, { Error: 'Authorization Failure' })
            }
          })
        } else {
          callback(400, { Error: 'The token may not exist or valid!' })
        }
      })
    } else {
      callback(403, { Error: 'Authorization Failure' })
    }
  } else {
    callback(400, { Error: 'There is a problem in your request.' })
  }
}

// Replace user information
handler._checks.put = (reqObj, callback) => {
  // Parse reqObj.body and convert it into JSON data
  const parsedBody = parseJSON(reqObj.body)

  // Sanitize inputs
  let { id, protocol, url, method, successCodes, timeoutSeconds } = parsedBody
  id = typeof id === 'string' && id.trim().length === 20 ? id : false
  protocol = typeof protocol === 'string' && ['http', 'https'].includes(protocol) ? protocol : false
  url = typeof url === 'string' && url.trim().length > 0 ? url : false
  method =
    typeof method === 'string' && ['get', 'post', 'put', 'delete'].includes(method.toLowerCase())
      ? method
      : false
  successCodes =
    typeof successCodes === 'object' && successCodes instanceof Array ? successCodes : false
  timeoutSeconds =
    typeof timeoutSeconds === 'number' &&
    timeoutSeconds > 0 &&
    timeoutSeconds < 6 &&
    timeoutSeconds % 1 === 0
      ? timeoutSeconds
      : false
  if (id) {
    // Get and sanitize the token from headers
    let { token } = reqObj.headersObj
    token = typeof token === 'string' && token.trim().length === 20 ? token : false
    if (token) {
      // Get phone number from token
      data.read('tokens', token, (tokenReadErr, tokenDataStr) => {
        if (!tokenReadErr && tokenDataStr) {
          const tokenData = parseJSON(tokenDataStr)
          const { phone } = tokenData
          // Verify token
          tokenHandler._tokens.verify(token, phone, (isVerified) => {
            if (isVerified) {
              // Get the check object
              data.read('checks', id, (readErr, checkDataStr) => {
                if (!readErr && checkDataStr) {
                  const checkObj = parseJSON(checkDataStr)
                  if (protocol || url || method || successCodes || timeoutSeconds) {
                    if (protocol) {
                      checkObj.protocol = protocol
                    }
                    if (url) {
                      checkObj.url = url
                    }
                    if (method) {
                      checkObj.method = method
                    }
                    if (successCodes) {
                      checkObj.successCodes = successCodes
                    }
                    if (timeoutSeconds) {
                      checkObj.timeoutSeconds = timeoutSeconds
                    }
                    // Save the updated check object
                    data.update('checks', id, checkObj, (updateErr) => {
                      if (!updateErr) {
                        callback(200, { Message: 'Check file updated' })
                      } else {
                        callback(500, { Error: 'There is a server side error' })
                      }
                    })
                  } else {
                    callback(400, {
                      Error:
                        'There is a problem in your request. You must define a field that you want to update!',
                    })
                  }
                } else {
                  callback(400, {
                    Error: 'There is a problem in your request. The check data may not exists!',
                  })
                }
              })
            } else {
              callback(403, { Error: 'Authorization Failure' })
            }
          })
        } else {
          callback(400, { Error: 'The token may not exist or valid!' })
        }
      })
    } else {
      callback(403, { Error: 'Authorization Failure' })
    }
  } else {
    callback(400, { Error: 'There is a problem in your request.' })
  }
}

// Remove user
handler._checks.delete = (reqObj, callback) => {
  // Get the check id from request object
  let checkId = reqObj.queryObj.id
  // Validate check id
  checkId = typeof checkId === 'string' && checkId.trim().length === 20 ? checkId : false
  if (checkId) {
    // Get and sanitize the token from headers
    let { token } = reqObj.headersObj
    token = typeof token === 'string' && token.trim().length === 20 ? token : false
    // Verify the token
    if (token) {
      // Get phone number from token
      data.read('tokens', token, (tokenReadErr, tokenDataStr) => {
        if (!tokenReadErr && tokenDataStr) {
          const tokenData = parseJSON(tokenDataStr)
          const { phone } = tokenData
          // Verify token
          tokenHandler._tokens.verify(token, phone, (isVerified) => {
            if (isVerified) {
              // Delete check file
              data.delete('checks', checkId, (deleteErr) => {
                if (!deleteErr) {
                  // Update user file
                  data.read('users', phone, (readErr, userDataStr) => {
                    if (!readErr && userDataStr) {
                      const userObj = parseJSON(userDataStr)
                      // Add checks property
                      userObj.checks =
                        typeof userObj.checks === 'object' && userObj.checks instanceof Array
                          ? userObj.checks
                          : []
                      // Remove check id from userobj
                      userObj.checks = userObj.checks.filter((check) => check !== checkId)
                      // Update phone.json
                      data.update('users', phone, userObj, (updateErr) => {
                        if (!updateErr) {
                          callback(200, 'Check deleted')
                        } else {
                          callback(500, { Error: 'There is a problem in the server!' })
                        }
                      })
                    } else {
                      callback(500, { Error: 'There is a problem in the server!' })
                    }
                  })
                } else {
                  callback(500, { Error: 'There is a problem in the server!' })
                }
              })
            } else {
              callback(403, { Error: 'Authorization Failure' })
            }
          })
        } else {
          callback(400, { Error: 'The token may not exist or valid!' })
        }
      })
    } else {
      callback(403, { Error: 'Authorization Failure' })
    }
  } else {
    callback(400, { Error: 'There is a problem in your request.' })
  }
}

// Export Module
module.exports = handler
