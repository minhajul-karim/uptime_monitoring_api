/*
 * Title: CRUD File operations
 * Description: Create, read, update, delete files
 * Author: Minhajul Karim
 * Date: 03/06/2021
 */

// Dependencies
const fs = require('fs')

// Module scaffolding
const lib = {}

const baseDir = `${__dirname}/../.data`

// Create file
lib.create = (dirName, fileName, fileData, callback) => {
  // Open file for writing
  fs.open(`${baseDir}/${dirName}/${fileName}.json`, 'wx', (openErr, fileDescriptor) => {
    if (!openErr && fileDescriptor) {
      // Convert file data to string
      const stringData = JSON.stringify(fileData)
      // Write data to file and then close it
      fs.writeFile(`${baseDir}/${dirName}/${fileName}.json`, stringData, (writeErr) => {
        if (!writeErr) {
          // Close file
          fs.close(fileDescriptor, (closeErr) => {
            if (!closeErr) {
              callback(false)
            } else {
              callback('Error: Closing file')
            }
          })
        } else {
          callback('Error: Writing to new file')
        }
      })
    } else {
      callback('Error: Opening file. File may already exists!')
    }
  })
}

// Read file
lib.read = (dirName, fileName, callback) => {
  fs.readFile(`${baseDir}/${dirName}/${fileName}.json`, 'utf8', (err, data) => {
    callback(err, data)
  })
}

// Update file
lib.update = (dirName, fileName, fileData, callback) => {
  fs.open(`${baseDir}/${dirName}/${fileName}.json`, 'r+', (openErr, fileDescriptor) => {
    if (!openErr && fileDescriptor) {
      // Convert file data to string
      const stringData = JSON.stringify(fileData)
      // Truncate file
      fs.ftruncate(fileDescriptor, (truncateErr) => {
        if (!truncateErr) {
          // Write new data to file and then close it
          fs.writeFile(`${baseDir}/${dirName}/${fileName}.json`, stringData, (writeErr) => {
            if (!writeErr) {
              // Close file
              fs.close(fileDescriptor, (closeErr) => {
                if (!closeErr) {
                  callback(false)
                } else {
                  callback('Error: Closing file')
                }
              })
            } else {
              callback('Error: Writing to new file')
            }
          })
        } else {
          callback('Error: truncating file!')
        }
      })
    } else {
      callback('Error: updating. File may not exists!')
    }
  })
}

// Delete file
lib.delete = (dirName, fileName, callback) => {
  fs.unlink(`${baseDir}/${dirName}/${fileName}.json`, (err) => {
    if (!err) {
      callback(false)
    } else {
      callback('Error: deleting file')
    }
  })
}

// List all filenames of given directory
lib.getFileNames = (dirName, callback) => {
  fs.readdir(`${baseDir}/${dirName}`, (err, fileNames) => {
    if (!err && fileNames && fileNames.length > 0) {
      const trimmedFileNames = fileNames.map((name) => name.replace('.json', ''))
      callback(false, trimmedFileNames)
    } else {
      callback(`Error: reading files of /${dirName}`)
    }
  })
}

// lib.getFileNames('checks', (err) => {
//   console.log(err)
// })

// Export module
module.exports = lib
