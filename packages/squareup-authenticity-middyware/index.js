'use strict'

const validate = require('./validate')

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
        if (!validate.authenticity(event, signatureKey)) {
          throw new Error(
            `Could not validate the authenticity of this message ${JSON.stringify(event)}`
          )
        }
      }
      next()
    }
  })
}

module.exports = squareupAuthenticityMiddyware
