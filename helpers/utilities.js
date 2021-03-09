/*
 * Title: Utilities
 * Description: Utility functions
 * Author: Minhajul Karim
 * Date: 03/06/2021
 */

// Dependencies
const crypto = require('crypto')
const currentEnv = require('./environment')

// Scaffolding
const utilities = {}

// Function that parses string and return JSON data
utilities.parseJSON = (data) => {
  let output
  try {
    output = JSON.parse(data)
  } catch {
    output = {}
  }
  return output
}

// Function that creates a hash out of a string
utilities.createHash = (str) =>
  crypto.createHmac('sha256', currentEnv.secretKey).update(str).digest('hex')

// Function that creates a random string of given length
utilities.createRandomString = (length) => {
  const allPossibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let randomStr = ''
  for (let i = 0; i < length; i += 1) {
    randomStr += allPossibleChars.charAt(Math.floor(Math.random() * allPossibleChars.length))
  }
  return randomStr
}

// Export module
module.exports = utilities
