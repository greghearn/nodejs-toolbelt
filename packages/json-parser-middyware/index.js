'use strict'

/**
 * Purpose:
 *
 * @param {*} args
 */
const jsonParserMiddyware = (args) => {
  const defaults = {
    paths: [],
    debug: false
  }
  const options = Object.assign({}, defaults, args)

  return ({
    before: (handler, next) => {
      const { event } = handler
      next()
    },
    after: (handler, next) => {
      next()
    },
    onError: (handler, next) => {
      if (options.debug) console.error(handler.error)
      next(handler.error)
    }
  })
}

module.exports = jsonParserMiddyware
