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
lib.read = (fileName, callback) => {
  fs.readFile(`${directory}/${fileName}.json`, 'utf8', (err, data) => {
    if (err) {
      callback('Error: Can not read file')
    } else {
      callback(data)
    }
  })
}

// Update file
lib.update = (fileName, data, callback) => {
  fs.writeFile(`${directory}/${fileName}.json`, data, { flag: 'r+' }, (err) => {
    if (err) {
      callback('Error updating file. The file may not exist!')
    } else {
      callback('File updated')
    }
  })
}

// Delete file
lib.deleteFile = (fileName, callback) => {
  fs.unlink(`${directory}/${fileName}.json`, (err) => {
    if (err) {
      callback('Error, deleting file. The file may not exist!')
    } else {
      callback('File deleted')
    }
  })
}

// Export module
module.exports = lib
