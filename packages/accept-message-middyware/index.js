'use strict'

const sources = [
  require('./event-source/api-gateway'),
  require('./event-source/sns')
]

const acceptMessageMiddyware = (args) => {
  const defaults = {
    requestSchema: {},
    responseSchema: {}
  }
  const options = Object.assign({}, defaults, args)

  return ({
    before: (handler, next) => {
      const { event } = handler
      const index = sources.findIndex(src => src.match(event))
      if (index < 0) {
        throw new TypeError('Could not find a valid event source to process this incoming message')
      }
      sources[index].capture(event, options)
      next()
    },
    after: (handler, next) => {
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
