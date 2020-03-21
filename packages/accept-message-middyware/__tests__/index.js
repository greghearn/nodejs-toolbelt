'use strict'

const middy = require('@middy/core')

/**
 * Purpose:
 *  Middleware under test.
 */
const middleware = require('../index')

/**
 * Purpose:
 *  Supply a regular expression pattern for use when no
 *  event source is found
 */
const pattern = /Could not find a valid event source/i

/**
 * Mocking of handler function used to mimic a lambda entry point.
 * @param {*} event
 * @param {*} options
 */
const invokeHandler = async (event, options) => {
  const handler = middy((event, context, callback) => {
    callback(null, {})
  })
  handler.use(middleware(options))
  return handler(event)
}

describe('when event data supplied', () => {
  test('is empty then error exists in response', async () => {
    const { error } = await invokeHandler({}, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('is an empty object then error exists in response', async () => {
    const { error } = await invokeHandler(Object.create(null), {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('is an NaN then error exists in response', async () => {
    const { error } = await invokeHandler(NaN, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('is an -1 then error exists in response', async () => {
    const { error } = await invokeHandler(-1, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('that is valid api-gateway event then no error in response', async () => {
    const event = require('./events/api-gateway.json')
    const { error } = await invokeHandler(event, {})
    expect(error).toBe(undefined)
  })
  test('that is valid sns event then no error in response', async () => {
    const event = require('./events/sns.json')
    const { error } = await invokeHandler(event, {})
    expect(error).toBe(undefined)
  })
})
describe('when api gateway event supplied with schema', () => {
  const event = require('./events/api-gateway.json')
  test('that is valid should have no error message', async () => {
    const schema = {
      required: ['body'],
      properties: {
        body: {
          type: 'object',
          properties: {
            type: {
              regexp: '/^inventory\\.count\\.updated$/i'
            }
          },
          allRequired: true
        }
      }
    }
    const response = await invokeHandler(event, { schema: schema })
    expect(response.error).toBe(undefined)
  })
  test('that an error exists when regexp dont match', async () => {
    const schema = {
      required: ['body'],
      properties: {
        body: {
          type: 'object',
          properties: {
            type: {
              regexp: '/^wrong.type.text$/i'
            }
          },
          allRequired: true
        }
      }
    }
    const { error } = await invokeHandler(event, { schema: schema })
    expect(error.message).toMatch(/body.type should pass/i)
  })
})
