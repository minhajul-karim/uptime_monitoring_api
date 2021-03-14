/*
 * Title: Environment
 * Description: Handle enviroment variables
 * Author: Minhajul Karim
 * Date: 03/01/2021
 */

// Module scaffolding
const environments = {}

environments.staging = {
  envName: 'staging',
  port: 3000,
  secretKey: 'baa baa black sheep have you any wool?',
  twilio: {
    fromPhoneNum: '+15005550006',
    accountSID: 'ACe4f2a187b44751f5bdaecf83522263b6',
    authToken: '6950bc0b5c0800d4d68a9a0ac74bad3a',
  },
}

environments.production = {
  envName: 'production',
  port: 5000,
  secretKey: 'twinkle twinkle little star!',
  twilio: {
    fromPhoneNum: '+15005550006',
    accountSID: 'ACe4f2a187b44751f5bdaecf83522263b6',
    authToken: '6950bc0b5c0800d4d68a9a0ac74bad3a',
  },
}

const nodeEnv = process.env.NODE_ENV
const currentEnv = typeof nodeEnv === 'string' ? nodeEnv : 'staging'
const envToExport =
  typeof environments[currentEnv] === 'object' ? environments[currentEnv] : environments.staging

// Export module
module.exports = envToExport
