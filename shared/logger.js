require('module-alias/register')
require('dotenv').config()

const shouldLogDebbug = true
// const shouldLogDebbug = process.env.DEBUG_LOG.toLocaleLowerCase() === true

class Logger {
  static log (message) {
    if (shouldLogDebbug) {
      console.log(message)
    }
  }
}

module.exports = Logger