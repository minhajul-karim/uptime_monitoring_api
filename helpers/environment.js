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
}

environments.production = {
  envName: 'production',
  port: 5000,
  secretKey: 'twinkle twinkle little star!',
}

const nodeEnv = process.env.NODE_ENV
const currentEnv = typeof nodeEnv === 'string' ? nodeEnv : 'staging'
const envToExport =
  typeof environments[currentEnv] === 'object' ? environments[currentEnv] : environments.staging

// Export module
module.exports = envToExport
