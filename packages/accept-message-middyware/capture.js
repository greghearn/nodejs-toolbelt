'use strict'

const validator = require('./lib/ajv')

/**
 * Used to test the applied schema against the current
 * event object.
 * @param {*} event
 * @param {*} options
 */
module.exports = function (event, options) {
  const { schema = {} } = options
  validator.test(schema, event)
}
