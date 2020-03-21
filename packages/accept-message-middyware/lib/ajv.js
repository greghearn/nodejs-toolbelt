'use strict'

const Ajv = require('ajv')
const ajv = new Ajv()
require('ajv-keywords')(ajv) // add all available keywords

/**
 * Validates a schema against a data object.
 *
 * @param {*} schema
 *  Schema object as per ajv schema validation
 * @param {*} data
 *  The object containing the data that needs to
 *  be valicated.
 * @throws
 *  TypeError exception is thrown if the validation fails. Error
 *  message from the validation is populated.
 */
const test = function validate (schema = {}, data = {}) {
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.errorsText())
  }
}

module.exports = {
  test
}
