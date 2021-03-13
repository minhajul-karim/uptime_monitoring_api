/*
 * Title: Send SMS
 * Description: Handle SMS' using Twilio
 * Author: Minhajul Karim
 * Date: 03/13/2021
 */

// Dependencies
const https = require('https')
const querystring = require('querystring')
const { twilio } = require('./environment')

// Module scaffolding
const notifications = {}

// Send SMS
notifications.sendTwilioSms = (phoneNum, msg, callback) => {
  // Verify inputs
  const phone =
    typeof phoneNum === 'string' && phoneNum.trim().length === 11 ? phoneNum.trim() : false
  const message =
    typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length < 1600
      ? msg.trim()
      : false

  if (phone && message) {
    // Configure the request payload
    const payload = {
      Body: message,
      From: twilio.fromPhoneNum,
      To: `+88${phone}`,
    }

    // Stringify payload
    const stringifiedPayload = querystring.stringify(payload)

    // Configure the request options
    const requestDetailsObj = {
      hostname: 'api.twilio.com',
      path: `/2010-04-01/Accounts/${twilio.accountSID}/Messages.json`,
      method: 'POST',
      auth: `${twilio.accountSID}:${twilio.authToken}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    // Instantiate the request object
    const req = https.request(requestDetailsObj, (res) => {
      // Get the status code
      const { statusCode } = res
      if (statusCode === 200 || statusCode === 201) {
        callback(false)
      } else {
        callback(`The status code was ${statusCode}`)
      }
    })

    // Catch any error while sending request
    req.on('error', (err) => {
      callback(err)
    })

    // Send request
    req.write(stringifiedPayload)
    req.end()
  } else {
    callback('Given parameters were either missing or invalid')
  }
}

// Export module
module.exports = notifications
