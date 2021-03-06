/*
 * Title: User Handler
 * Description: Handle user related routes
 * Author: Minhajul Karim
 * Date: 06/03/2021
 */

// Dependencies
const data = require('../../lib/data')
const { parseJSON, createHash } = require('../../helpers/utilities')
const tokenHandler = require('./tokenHandler')

// Handler module - module scaffolding
const handler = {}

// Function that handles user route
handler.userHandler = (reqObj, callback) => {
  // Call the appropriate function received from reqObj
  const acceptedMethods = ['post', 'get', 'put', 'delete']
  // Index of accepted method
  const index = acceptedMethods.findIndex((method) => method === reqObj.method)
  if (index > -1) {
    // Call the function
    handler._users[acceptedMethods[index]](reqObj, callback)
  } else {
    callback(405)
  }
}

handler._users = {}

// Retrieve user information
handler._users.get = (reqObj, callback) => {
  // Get the phone and token from request object
  let { phone } = reqObj.queryObj
  let { token } = reqObj.headersObj
  // Validate phone and token
  phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false
  token = typeof token === 'string' && token.trim().length === 20 ? token : false
  if (phone) {
    // Verify token
    tokenHandler._tokens.verify(token, phone, (isVerified) => {
      if (isVerified) {
        // Send user data
        data.read('users', phone, (readErr, user) => {
          if (readErr) {
            callback(500, { Error: 'No such user found' })
          } else {
            const userInfo = { ...parseJSON(user) }
            delete userInfo.password
            delete userInfo.tosAgreement
            callback(200, userInfo)
          }
        })
      } else {
        callback(403, { Error: 'Authorization Failure' })
      }
    })
  } else {
    callback(400, { Error: 'There is an error in your request' })
  }
}

// Create new user
handler._users.post = (reqObj, callback) => {
  // Parse reqObj.body and convert it into JSON data
  const parsedBody = parseJSON(reqObj.body)

  // Destructure the JSON
  let { firstName, lastName, phone, password, tosAgreement } = parsedBody

  // Validate fields
  firstName = typeof firstName === 'string' && firstName.trim().length > 0 ? firstName : false
  lastName = typeof lastName === 'string' && lastName.trim().length > 0 ? lastName : false
  phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false
  password = typeof password === 'string' && password.trim().length > 0 ? password : false
  tosAgreement = typeof tosAgreement === 'boolean' && tosAgreement ? tosAgreement : false

  // Create file if validation is successfull
  if (firstName && lastName && phone && password && tosAgreement) {
    // Create hash for password
    parsedBody.password = createHash(password)
    data.read('users', phone, (readErr) => {
      // When read fails, there're no such file
      if (readErr) {
        // Create user
        data.create('users', phone, parsedBody, (createErr) => {
          if (!createErr) {
            callback(200, { Message: 'User created' })
          } else {
            callback(500, { Error: 'Can not create user' })
          }
        })
      } else {
        callback(500, { Error: 'User already exists!' })
      }
    })
  } else {
    callback(400, { Error: 'There is a problem in your request.' })
  }
}

// Replace user information
handler._users.put = (reqObj, callback) => {
  // Parse reqObj.body and convert it into JSON data
  const parsedBody = parseJSON(reqObj.body)

  // Destructure the JSON
  let { firstName, lastName, phone, password, tosAgreement } = parsedBody
  let { token } = reqObj.headersObj

  // Validate fields
  firstName = typeof firstName === 'string' && firstName.trim().length > 0 ? firstName : false
  lastName = typeof lastName === 'string' && lastName.trim().length > 0 ? lastName : false
  phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false
  password = typeof password === 'string' && password.trim().length > 0 ? password : false
  tosAgreement = typeof tosAgreement === 'boolean' && tosAgreement ? tosAgreement : false
  token = typeof token === 'string' && token.trim().length === 20 ? token : false

  if (phone) {
    // Verify token
    tokenHandler._tokens.verify(token, phone, (isVerified) => {
      if (isVerified) {
        if (firstName || lastName || password) {
          // Read from file
          data.read('users', phone, (readErr, user) => {
            if (readErr) {
              callback(500, { Error: 'Server Error' })
            } else {
              // Update data
              const userObj = { ...parseJSON(user) }
              if (firstName) {
                userObj.firstName = firstName
              }
              if (lastName) {
                userObj.lastName = lastName
              }
              if (password) {
                userObj.password = createHash(password)
              }
              // Write data
              data.update('users', phone, userObj, (updateErr) => {
                if (updateErr) {
                  callback(500, { Error: 'Can not update user' })
                } else {
                  callback(200, { Message: 'User updated' })
                }
              })
            }
          })
        } else {
          callback(400, { Error: 'There is a problem in your request' })
        }
      } else {
        callback(403, { Error: 'Authorization Failure' })
      }
    })
  } else {
    callback(400, { Error: 'There is a problem in your request' })
  }
}

// Remove user
handler._users.delete = (reqObj, callback) => {
  // Get the phone and token from request object
  let { phone } = reqObj.queryObj
  let { token } = reqObj.headersObj
  // Validate phone
  phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false
  token = typeof token === 'string' && token.trim().length === 20 ? token : false
  if (phone) {
    // Verify token
    tokenHandler._tokens.verify(token, phone, (isVerified) => {
      if (isVerified) {
        // Read user info
        data.read('users', phone, (readErr) => {
          if (!readErr) {
            // Delete file
            data.delete('users', phone, (deleteErr) => {
              if (deleteErr) {
                callback(500, { Error: 'Can not delete user' })
              } else {
                callback(200, { Message: 'User deleted' })
              }
            })
          } else {
            callback(500, { Error: 'Delete error. User does not exists!' })
          }
        })
      } else {
        callback(403, { Error: 'Authorization Failure' })
      }
    })
  } else {
    callback(400, { Error: 'There is an error in your request.' })
  }
}

// Export Module
module.exports = handler
