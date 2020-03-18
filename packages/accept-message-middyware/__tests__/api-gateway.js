'use strict'

const { match } = require('../event-source/api-gateway')

describe('when matching an event and the event', () => {
  test('is empty then should return false', async () => {
    expect(match({})).toEqual(false)
  })
  test('is an empty object should return false', async () => {
    expect(match({})).toEqual(false)
  })
  test('is null should return false', async () => {
    expect(match(null)).toEqual(false)
  })
  test('is undefined should return false', async () => {
    expect(match(undefined)).toEqual(false)
  })
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
})
