/*
 * Title: Sample Route Handler
 * Description: Handle /sample route
 * Author: Minhajul Karim
 * Date: 28/02/2021
 */

// Handler module - module scaffolding
const handler = {}

// Function that handles /sample route
handler.sampleHandler = (reqObj, callback) => {
  callback(200, { message: 'This is a sample route' })
}

// Export Module
module.exports = handler
