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

utilities.createHash = (str) =>
  crypto.createHmac('sha256', currentEnv.secretKey).update(str).digest('hex')

// Export module
module.exports = utilities
