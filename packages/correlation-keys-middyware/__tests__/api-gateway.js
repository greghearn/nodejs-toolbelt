'use strict'

const correlationKeys = require('@greghearn/correlation-keys')
const { defaultTestSuite, invokeHandler } = require('./index')
const event = require('./events/api-gateway.json')

describe('Api Gateway suite event testing...', () => {
  describe('default test suite with api gateway event data', () => {
    defaultTestSuite(event)
  })
  describe('when header has existing correlations header fields', () => {
    test('add it to the correlations', async () => {
      const copy = event
      const key = `${correlationKeys.getPrefix()}test-field`
      copy.headers[key] = 'test'
      await invokeHandler(copy, {})
      expect(correlationKeys.has(key)).toEqual(true)
    })
  })
})
