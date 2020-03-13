'use strict'

const correlationKeys = require('@greghearn/correlation-keys')

const eventSources = [
  require('./event-source/api-gateway')
]

/**
 * Purpose:
 *  Assign and analyze your own custom identifiers for your event messages
 *  to identify patterns and their relationship between multiple microservice
 *  message events.
 *
 *  A Correlation Identifier enables a requesting program to associate a specific
 *  response with its request. When the data to be conveyed spans several messages,
 *  a Sequence Identifier enables the receiver to accurately reconstruct the
 *  original data.
 *
 * @param {*} args
 */
const correlationKeysMiddyware = (opts) => {
  const defaults = {
    debugLogRate: '0.01'
  }
  const options = Object.assign({}, defaults, opts)

  return ({
    before: (handler, next) => {
      correlationKeys.clear()
      const { event } = handler
      const matchedSource = eventSources.find(src => src.match(event))
      if (matchedSource) {
        matchedSource.capture(event, options)
      }
      next()
    }
  })
}

module.exports = correlationKeysMiddyware
