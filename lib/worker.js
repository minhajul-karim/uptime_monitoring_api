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
const { sendTwilioSms, sendMockSms } = require('../helpers/notifications')

// Worker object - module scaffolding
const worker = {}

// Function that alerts user
worker.alertUser = (updatedCheckData) => {
  const { protocol, url, state } = updatedCheckData
  const alertMsg = `ALERT: ${protocol}://${url} is now ${state}`
  sendTwilioSms(updatedCheckData.phone, alertMsg, (err) => {
    if (!err) {
      console.log('User was alerted to a status change via SMS.')
    } else {
      console.log('There was a problem sending SMS to user.')
    }
  })
}

// Function that process check data
worker.processCheckData = (checkData, checkResponse) => {
  // Current state
  const currentState =
    !checkResponse.hasError &&
    checkResponse.responseCode &&
    checkData.successCodes.includes(checkResponse.responseCode)
      ? 'up'
      : 'down'

  // Alert user when current state does not match with check data's state
  const needToAlertUser = !!(checkData.lastCheckTime && checkData.state !== currentState)

  // Update check data
  const updatedCheckData = checkData
  updatedCheckData.state = currentState
  updatedCheckData.lastCheckTime = Date.now()

  // Save the updated file to disk
  fileHandler.update('checks', checkData.id, updatedCheckData, (err) => {
    if (!err) {
      if (needToAlertUser) {
        worker.alertUser(updatedCheckData)
      } else {
        console.log('Alert is not needed as there is no state change.')
      }
    } else {
      console.log('Error: trying to update check file.')
    }
  })
}

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

// Execute the worker process once per minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks()
  }, 60 * 1000)
}

// Start worker
worker.init = () => {
  // Execute all checks
  worker.gatherAllChecks()

  // Call loop so that the checks continute
  worker.loop()
}

// Export module
module.exports = worker
