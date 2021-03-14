/*
 * Title: Worker library
 * Description: Worker related functionalities
 * Author: Minhajul Karim
 * Date: 03/14/2021
 */

// Dependencies
const http = require('http')
const https = require('https')
const fileHandler = require('./data')
const { parseJSON } = require('../helpers/utilities')

// Worker object - module scaffolding
const worker = {}

// Function that process check data
worker.processCheckData = (checkData, checkResponse) => {}

// Function to perform check
worker.performCheck = (checkData) => {
  // Construct the url that we need to check
  const { protocol, url, method, timeoutSeconds } = checkData
  const urlToCheck = `${protocol}://${url}`
  const parsedUrlToCheck = new URL(urlToCheck)
  const { hostname, pathname } = parsedUrlToCheck

  // Construct the details that we need to send with the request
  const reqDetails = {
    method,
    hostname,
    path: pathname,
    protocol: `${protocol}:`,
    timeout: timeoutSeconds * 1000,
  }

  // Determine the protocol
  const protocolToUse = protocol === 'http' ? http : https

  // Construct a response object
  let checkResponse = {
    hasError: false,
    responseCode: false,
  }

  // Flag to determine if check data has been sent for further processing or not
  let hasSentCheckData = false

  // Cosntruct the request
  const req = protocolToUse.request(reqDetails, (res) => {
    checkResponse.responseCode = res.statusCode
    if (!hasSentCheckData) {
      worker.processCheckData(checkData, checkResponse)
      hasSentCheckData = true
    }
  })

  // Check for error while sending request
  req.on('error', (err) => {
    // Modifly check response
    checkResponse = {
      hasError: true,
      error: err,
    }
    if (!hasSentCheckData) {
      worker.processCheckData(checkData, checkResponse)
      hasSentCheckData = true
    }
  })

  // Check for timeout while sending request
  req.on('timeout', (err) => {
    // Modifly check response
    checkResponse = {
      hasError: true,
      error: 'timeout',
    }
    if (!hasSentCheckData) {
      worker.processCheckData(checkData, checkResponse)
      hasSentCheckData = true
    }
  })

  // Send request
  req.end()
}

// Function that validates check fileHandler
worker.validateCheckData = (checkData) => {
  const data = checkData
  if (data && data.id) {
    data.state =
      typeof data.state === 'string' && ['up', 'down'].includes(data.state) ? data.state : 'down'
    data.lastCheckTime =
      typeof data.lastCheckTime === 'number' && data.lastCheckTime > 0 ? data.lastCheckTime : false

    // Perform check
    worker.performCheck(data)
  } else {
    console.log('Error: check was invalid or improperly formatted!')
  }
}

// Lookup checks in the check folder
worker.gatherAllChecks = () => {
  fileHandler.getFileNames('checks', (err, fileNames) => {
    if (!err && fileNames) {
      fileNames.forEach((name) => {
        // Read each check file
        fileHandler.read('checks', name, (readErr, checkDataStr) => {
          if (!readErr && checkDataStr) {
            const checkData = parseJSON(checkDataStr)
            worker.validateCheckData(checkData)
          } else {
            console.log('Error: could not read check files.')
          }
        })
      })
    } else {
      console.log('Error: could not find any check files to process!')
    }
  })
}

worker.gatherAllChecks()

// Start worker
worker.init = () => {
  console.log('Worker is working!')
}

// Export module
module.exports = worker
