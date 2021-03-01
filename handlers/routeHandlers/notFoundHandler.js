/*
 * Title: Undefined Route Handler
 * Description: Create Not Found response
 * Author: Minhajul Karim
 * Date: 28/02/2021
 */

// Handler object, module scaffolding
const handler = {}

// Function that handles undefined routes
handler.notFoundHandler = (reqObj, callback) => {
  callback(404, { message: 'Not Found' })
}

// Exports module
module.exports = handler
