require('module-alias/register')
require('dotenv').config()

const shouldLogDebbug = process.env.DEBBUG_LOG.toLocaleLowerCase() === 'true'

class Logger {
  static log (message) {
    if (shouldLogDebbug) {
      console.log(message)
    }
  }
}

module.exports = Logger
