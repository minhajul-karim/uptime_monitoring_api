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
  port: 3001,
}

environments.production = {
  envName: 'production',
  port: 5000,
}

const nodeEnv = process.env.NODE_ENV
const currentEnv = typeof nodeEnv === 'string' ? nodeEnv : 'staging'
const envToExport =
  typeof environments[currentEnv] === 'object'
    ? environments[currentEnv]
    : environments.staging

// Export module
module.exports = envToExport
