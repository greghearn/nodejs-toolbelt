'use strict'

const sources = [
  require('./event-source/api-gateway'),
  require('./event-source/sns')
]

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
 * Incoming event message is automatically matched
 * to supported aws lambda message types
 *
 * Schema:
 * Applying a schema to validate the incoming message.
 * 1. If the schema can validate the message then no
 *    response error message is populated and the
 *    handler middleware continues as normal.
 * 2. If the schema can not validate the message then
 *    this middleware handles the error and creates a
 *    response, the execution is still propagated to
 *    all the other error middlewares and they have a
 *    chance to update or replace the response as needed.
 *    At the end of the error middlewares sequence, the
 *    response is returned to the user.
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
      const index = sources.findIndex(src => src.match(event))
      if (index < 0) {
        throw new Error('Could not find a valid event source to process this incoming message')
      }
      sources[index].capture(event, options)
      next()
    },
    onError: (handler, next) => {
      handler.response = {
        error: handler.error
      }
      next()
    }
  })
}

module.exports = acceptMessageMiddyware
