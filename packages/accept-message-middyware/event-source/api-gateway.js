'use strict'

const ajv = require('../lib/ajv')

const REGEXP = {
  HTTP_METHOD: /^GET$|^HEAD$|^POST$|^PUT$|^DELETE$|^CONNECT$|^OPTIONS$|^TRACE$|^PATCH$/i,
  CONTENT_TYPE: /^application\/json$/i
}

const match = function match (event = {}) {
  try {
    if (Object.prototype.hasOwnProperty.call(event, 'httpMethod') &&
        Object.prototype.hasOwnProperty.call(event, 'headers')) {
      const { httpMethod = '', headers = {} } = event
      const header = headers['content-type'] || headers['Content-Type']
      return REGEXP.HTTP_METHOD.test(httpMethod) && REGEXP.CONTENT_TYPE.test(header)
    }
    return false
  } catch {
    return false
  }
}

const capture = function capture (event = {}, options = {}) {
  const { schema = {} } = options
  const { body = {} } = event

  try {
    event.body = JSON.parse(body)
  } catch {
    throw new TypeError('Content-Type defined as application/json ' +
    'but an invalid json string has been provided')
  }

  ajv.test(schema, event)
  event.body = body
}

module.exports = {
  capture,
  match
}
