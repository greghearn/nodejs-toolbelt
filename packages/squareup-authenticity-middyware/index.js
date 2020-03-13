'use strict'

const validateSignature = require('./validate-signature')

/**
 * Purpose:
 *
 * @param {*} args
 */
const squareupAuthenticityMiddyware = (signatureKey) => {
  return ({
    before: (handler, next) => {
      const { event } = handler
      if (event) {
        validateSignature(event, signatureKey)
        // TODO: throw exception for OnError when its false
      }
      next()
    }
  })
}

module.exports = squareupAuthenticityMiddyware
