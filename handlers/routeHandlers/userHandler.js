/*
 * Title: User Handler
 * Description: Handle user related routes
 * Author: Minhajul Karim
 * Date: 06/03/2021
 */

// Dependencies
const data = require('../../lib/data')
const { parseJSON, createHash } = require('../../helpers/utilities')

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

handler._users.get = () => {
  console.log('get')
}

handler._users.post = (reqObj, callback) => {
  // Parse reqObj.body and convert it into JSON data
  const parsedBody = parseJSON(reqObj.body)
  // Destructure the JSON
  let { firstName, lastName, phone, password, tosAgreement } = parsedBody
  // Validate fields
  firstName = typeof firstName === 'string' && firstName.trim().length > 0 ? firstName : null
  lastName = typeof lastName === 'string' && lastName.trim().length > 0 ? lastName : null
  phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : null
  password = typeof password === 'string' && password.trim().length > 0 ? password : null
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

handler._users.put = () => {
  console.log('put')
}

handler._users.delete = () => {
  console.log('delete')
}

// Export Module
module.exports = handler
