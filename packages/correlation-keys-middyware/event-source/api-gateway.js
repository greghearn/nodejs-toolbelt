'use strict'

const uuidv4 = require('uuid').v4
const utils = require('../utils')
const correlationKeys = require('@greghearn/correlation-keys')

const CALL_CHAIN_LENGTH = require('../constants').CALL_CHAIN_LENGTH
const CORRELATION_ID = require('../constants').CORRELATION_ID
const DEBUG_ENABLED = require('../constants').DEBUG_ENABLED

const match = function match (event) {
  return utils.caseInsensitiveGet(event, 'httpMethod') !== undefined
}

const capture = function capture (event, options) {
  const { headers } = event
  if (headers) {
    // populate correlation keys from header object that start with
    // the correlation keys prefix value
    const prefix = correlationKeys.getPrefix()
    Object.entries(headers).forEach(([key, value]) => {
      if (key.startsWith(prefix)) {
        correlationKeys.set(key, value)
      }
    })

    // add any additional fields required from user setup
    const { additionalFields } = options
    Object.entries(additionalFields).forEach((key) => {
      const value = utils.caseInsensitiveGet(headers, key)
      if (value !== undefined) {
        correlationKeys.set(key, value)
      }
    })

    // correlation id value depending if already exists otherwise set
    // one based on a uuid4 identifier
    if (!correlationKeys.has(CORRELATION_ID)) {
      correlationKeys.set(CORRELATION_ID, uuidv4())
    }

    // call chain length increments if it alreasy exists otherwise set one
    if (correlationKeys.has(CALL_CHAIN_LENGTH)) {
      const len = parseInt(correlationKeys.get(CALL_CHAIN_LENGTH))
      if (!isNaN(len)) {
        correlationKeys.set(CALL_CHAIN_LENGTH, (len + 1))
      }
    } else {
      correlationKeys.set(CALL_CHAIN_LENGTH, 1)
    }

    // debug enabled depending if already exists otherwise set one based on a
    // parameter defined random rate
    const { debugLogRate } = options
    if (!correlationKeys.has(DEBUG_ENABLED)) {
      correlationKeys.set(DEBUG_ENABLED, Math.random() < debugLogRate ? 'true' : 'false')
    }
  }
}

module.exports = {
  capture,
  match
}
