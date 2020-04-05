'use strict'

const middy = require('@middy/core')

/**
 * Purpose:
 *  Middleware under test.
 */
const middleware = require('../index')

const empty = {}

/**
 * Mocking of handler function used to mimic a lambda entry point.
 * @param {*} event
 * @param {*} options
 */
const invokeHandler = (event, options) => {
  const handler = middy((event, context, callback) => {
    callback(null, empty)
  })
  handler.use(middleware(options))
  return handler(event)
}

describe('when supplied with an empty schema', () => {
  test('if event data is empty then should pass validation', async () => {
    await expect(invokeHandler({}, {})).resolves.toBe(empty)
  })
})
describe('when supplied with an invalid schema', () => {
  test('should print error to console', async () => {
    const event = {}
    const schema = {
      required: ['body']
    }
    await expect(invokeHandler(event, {
      debug: true,
      schema: schema
    })).rejects.toThrow('data should have required property')
  })
})
