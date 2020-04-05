'use strict'

const empty = {}

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
  var data = empty
  beforeEach(() => {
    data = JSON.parse(JSON.stringify(events.http))
  })
  afterEach(() => {
    data = empty
  })
  test('should parse the path sucessfully if array', async () => {
    const options = {
      path: ['body']
    }
    const response = await invokeHandler(data, options)
    expect(response).toHaveProperty('body.type', 'payment.created')
  })
  test('should parse the path sucessfully if string', async () => {
    const options = {
      path: 'body'
    }
    const response = await invokeHandler(data, options)
    expect(response).toHaveProperty('body.type', 'payment.created')
  })
  test('should continue silently if the path is not valid', async () => {
    const options = {
      path: ['foo']
    }
    const response = await invokeHandler(data, options)
    expect(response).toBeTruthy()
  })
  test('should throw if not silent and the path does not exist', async () => {
    const options = {
      path: ['foo'],
      silent: false
    }
    await expect(invokeHandler(data, options))
      .rejects.toThrow('foo property not found')
  })
  test('should throw if not silent and the path has invalid json', async () => {
    const options = {
      path: ['foo'],
      silent: false
    }
    data.foo = '{ "hello": "world" ' // note missing closing bracket
    await expect(invokeHandler(data, options))
      .rejects.toThrow('foo property value is not in json format')
  })
  test('should continue silently if the path is not an array', async () => {
    const options = {
      path: function () {}
    }
    const response = await invokeHandler(data, options)
    expect(response).toBeTruthy()
  })
})
