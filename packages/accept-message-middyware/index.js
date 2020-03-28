'use strict'

const sources = [
  require('./event-source/api-gateway'),
  require('./event-source/sns')
]

/**
 * Finds the index number to the appropriate source event file.
 * The incoming event message is automatically matched based on
 * the event source files match() method.
 * If there is a match then the index relating to the file is
 * returned so array syntax could be used to call the files
 * capture() method for further processing.
 * Current supported Lambda types are:
 *  1) API Gateway
 *  2) SNS
 *  3) *** there will be more added in the near future ***
 * If a match is found then a number greater than zero is returned.
 * If a match can't be found then an Error is thrown.
 * @param {*} event the event data from a message request
 */
const findModuleIndex = function findModuleIndex (event = {}) {
  const index = sources.findIndex(src => src.match(event))
  if (index < 0) {
    throw new Error('Could not find a valid event source to process this incoming message')
  }
  return index
}

/**
 * Input:
 * 1. Incoming event message from aws lambda
 *      a) api-gateway
 *      b) sns
 *      c) 1..n
 * 2. User supplied schema
 *
 * Output:
 * 1. Response error message populated if message
 *    is not valid based on the user supplied schema
 * 2. No response error message populated if message
 *    is valid based on the user supplied schema
 *
 * @param {*} args
 */
const acceptMessageMiddyware = (args) => {
  const defaults = {
    schema: {}
  }
  const options = Object.assign({}, defaults, args)

  return ({
    before: (handler, next) => {
      const { event } = handler
      const index = findModuleIndex(event)
      sources[index].capture(event, options)
      next()
    },
    onError: (handler, next) => {
      handler.response = {
        error: handler.error
      }
      console.error(handler.error)
      next()
    }
  })
}

module.exports = acceptMessageMiddyware
