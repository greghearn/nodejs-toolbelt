'use strict'

const middy = require('@middy/core')

/**
 * Purpose:
 *  Middleware under test.
 */
const middleware = require('../index')

const events = {
  http: require('./events/http/2020-03-31T01:26:30.316Z.json'),
  sns: require('./events/sns/2020-04-01T01:39:39.179Z.json')
}

/**
 * Mocking of handler function used to mimic a lambda entry point.
 * @param {*} event
 * @param {*} options
 */
const invokeHandler = (event, options) => {
  const handler = middy((event, context, callback) => {
    // propergate the event as a response for testing output
    callback(null, event)
  })
  handler.use(middleware(options))
  return handler(event)
}

describe('when supplied with a http event', () => {
  const data = events.http
  test('should parse the path sucessfully', async () => {
    const options = {
      paths: ['body']
    }
    const response = await invokeHandler(data, options)
    expect(response).toHaveProperty('body.type', 'payment.created')
  })
  test('should continue silently if the path is not valid', async () => {
    const options = {
      paths: ['foo']
    }
    const response = await invokeHandler(data, options)
    expect(response).anything()
  })
  test('should throw if not silent and the path is not valid', async () => {
    const options = {
      paths: ['foo'],
      silent: false
    }
    await expect(invokeHandler(data, options))
      .rejects.toThrow('path not found: foo')
  })
})
