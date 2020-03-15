'use strict'

const middy = require('@middy/core')

/**
 * Purpose:
 *  Middleware under test.
 */
const middleware = require('../index')

/**
 * Purpose:
 *  To supply a valid request object used for this test suite.
 */
const event = require('./event.json')

/**
 * Purpose:
 *  Supply a regular expression pattern for use when errors
 *  exist in the test suite.
 */
const pattern = /Could not validate the authenticity/i

/**
 * Purpose:
 *  The webhook signature key assigned by the Square Developer
 *  Portal in the Webhooks settings page for your application.
 *  You will compare the webhook signature key to the key provided
 *  in the notification.
 */
const signatureKey = 'rBnSB9miw_dN-4ZA0hrQ5w'

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

describe('when validating a supplied siganture', () => {
  test('if signature key is correct then no response error', async () => {
    const response = await invokeHandler(event, { signatureKey: signatureKey })
    expect(response).toEqual({})
  })
  test('if signature key is wrong then authenticity response error exists', async () => {
    const { error } = await invokeHandler(event, { signatureKey: 'fake key' })
    expect(pattern.test(error.message)).toEqual(true)
  })
})
describe('when validating `event` parameter', () => {
  test('if empty object then authenticity response error', async () => {
    const { error } = await invokeHandler({}, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
})
describe('when validating `header` metadata field', () => {
  test('if no field then authenticity response error', async () => {
    let copy = Object.assign({}, event)
    copy.headers = undefined
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `x-square-signature` does not exist then authenticity response error', async () => {
    let copy = Object.assign({}, event)
    copy.headers['x-square-signature'] = undefined
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `x-square-signature` value empty then authenticity response error', async () => {
    let copy = Object.assign({}, event)
    copy.headers['x-square-signature'] = ''
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
})
describe('when validating `requestContext` metadata field', () => {
  test('if no requestContext then authenticity response error', async () => {
    let copy = Object.assign({}, event)
    delete copy.requestContext
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `domainName` field does not exist then test for authenticity response error', async () => {
    let copy = Object.assign({}, event)
    delete copy.requestContext.domainName
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `domainName` fields value is empty then test for authenticity response error', async () => {
    let copy = Object.assign({}, event)
    copy.requestContext.domainName = ''
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `path` field does not exist then test for authenticity response error', async () => {
    let copy = Object.assign({}, event)
    delete copy.requestContext.path
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `path` fields value is empty then test for authenticity response error', async () => {
    let copy = Object.assign({}, event)
    copy.requestContext.path = ''
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
})
describe('when validating `body` field', () => {
  test('if no body exists then authenticity response error', async () => {
    let copy = Object.assign({}, event)
    delete copy.body
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if body is empty then authenticity response error', async () => {
    let copy = Object.assign({}, event)
    copy.body = ''
    copy = JSON.parse(JSON.stringify(copy))
    const { error } = await invokeHandler(copy, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
})
