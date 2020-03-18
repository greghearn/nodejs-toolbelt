'use strict'

const correlationKeys = require('@greghearn/correlation-keys')
const { defaultTestSuite, invokeHandler } = require('./index')
const { match } = require('../event-source/api-gateway')
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
  describe('when matching an event and the event', () => {
    test('to match = `httpsMethod` should return false', async () => {
      const event = { httpsMethod: 'POST' }
      expect(match(event)).toEqual(false)
    })
    test('to match = `httpsMethods` should return false', async () => {
      const event = { httpsMethods: 'POST' }
      expect(match(event)).toEqual(false)
    })
    test('to match = `httpMethods` should return false', async () => {
      const event = { httpMethods: 'POST' }
      expect(match(event)).toEqual(false)
    })
    test('to match = ` httpMethod ` should return false', async () => {
      const event = { ' httpMethod ': 'POST' }
      expect(match(event)).toEqual(false)
    })
    test('to match = `httpMethod` should return true', async () => {
      const event = { httpMethod: 'POST' }
      expect(match(event)).toEqual(true)
    })
    test('to match = `HTTPMETHOD` should return true', async () => {
      const event = { HTTPMETHOD: 'POST' }
      expect(match(event)).toEqual(true)
    })
    test('to match = `HttpMethod` should return true', async () => {
      const event = { HttpMethod: 'POST' }
      expect(match(event)).toEqual(true)
    })
    test('to match = `httpmethod` should return true', async () => {
      const event = { httpmethod: 'POST' }
      expect(match(event)).toEqual(true)
    })
    test('is null should return false', async () => {
      expect(match(null)).toEqual(false)
    })
    test('is null object should return false', async () => {
      expect(match(Object.create(null))).toEqual(false)
    })
    test('is empty object should return false', async () => {
      expect(match({})).toEqual(false)
    })
    test('is undefined should return false', async () => {
      expect(match(undefined)).toEqual(false)
    })
  })
})
