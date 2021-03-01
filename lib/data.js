/*
 * Title: CRUD File operations
 * Description: Create, read, update, delete files
 * Author: Minhajul Karim
 * Date: 03/01/2021
 */

// Dependencies
const fs = require('fs')

// Module scaffolding
const lib = {}

const directory = `${__dirname}/../.data/testDir`

// Create file
lib.create = (fileName, data, callback) => {
  fs.writeFile(`${directory}/${fileName}.json`, data, { flag: 'wx' }, (err) => {
    if (err) {
      callback(
        'Error creating file. There could be another file with this name'
      )
    } else {
      callback('File saved')
    }
  })
}

// Read file

// Export module
module.exports = lib
