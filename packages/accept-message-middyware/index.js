'use strict'

const capture = require('./capture')

/**
 * Input:
 * 1. Incoming event message
 * 2. User ajv supplied schema
 *
 * Output:
 * 1. Response error passed on to next middleware if
 *    message is not valid based on supplied schema
 * 2. No response error message populated if message
 *    is valid based on the user supplied schema
 *
 * @param {*} args
 */
const acceptMessageMiddyware = (args) => {
  const defaults = {
    schema: {},
    debug: false
  }
  const options = Object.assign({}, defaults, args)

  return ({
    before: (handler, next) => {
      const { event } = handler
      capture(event, options)
      next()
    },
    onError: (handler, next) => {
      if (options.debug) console.error(handler.error)
      next(handler.error)
    }
  })
}

module.exports = acceptMessageMiddyware
