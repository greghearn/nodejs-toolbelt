'use strict'

const uuidv4 = require('uuid').v4
const correlationKeys = require('@greghearn/correlation-keys')
const { CORRELATION_ID, DEBUG_ENABLED } = require('../constants')

const match = function match (event) {
  try {
    return Object.keys(event).findIndex(k =>
      k.toLowerCase() === 'httpmethod'
    ) >= 0
  } catch {
    return false
  }
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

    // correlation id value depending if already exists otherwise set
    // one based on a uuid4 identifier
    if (!correlationKeys.has(CORRELATION_ID)) {
      correlationKeys.set(CORRELATION_ID, uuidv4())
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
