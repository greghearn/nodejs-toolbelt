'use strict'

const validate = require('./validate')

/**
 * Purpose:
 *
 * @param {*} args
 */
const squareupAuthenticityMiddyware = (args) => {
  const defaults = {
    signatureKey: ''
  }
  const options = Object.assign({}, defaults, args)

  return ({
    before: (handler, next) => {
      const { event } = handler
      if (!validate.authenticity(event, options.signatureKey)) {
        throw new Error(
          'Could not validate the authenticity of this message'
        )
      }
      next()
    },
    after: (handler, next) => {
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

module.exports = squareupAuthenticityMiddyware
