'use strict'

const middy = require('@middy/core')
const middleware = require('../index')
const event = require('./event.json')
const signatureKey = 'rBnSB9miw_dN-4ZA0hrQ5w'
const domainName = 't7ip8r6gwl.execute-api.ap-southeast-2.amazonaws.com'
const path = '/dev/'
const pattern = /Could not validate the authenticity/i

const invokeHandler = async (event, options) => {
  // const handler = middy((event) => {})
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
    const event = {
      requestContext: {
        domainName: `${domainName}`,
        path: `${path}`
      }
    }
    const { error } = await invokeHandler(event, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `x-square-signature` does not exist then authenticity response error', async () => {
    const event = {
      headers: {},
      requestContext: {
        domainName: `${domainName}`,
        path: `${path}`
      }
    }
    const { error } = await invokeHandler(event, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `x-square-signature` value empty then authenticity response error', async () => {
    const event = {
      headers: {
        'x-square-signature': ''
      },
      requestContext: {
        domainName: `${domainName}`,
        path: `${path}`
      }
    }
    const { error } = await invokeHandler(event, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
})
describe('when validating `requestContext` metadata field', () => {
  test('if no requestContext then authenticity response error', async () => {
    const event = {
      headers: {
        'x-square-signature': `${signatureKey}`
      }
    }
    const { error } = await invokeHandler(event, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `domainName` field does not exist then test for authenticity response error', async () => {
    const event = {
      headers: {
        'x-square-signature': `${signatureKey}`
      },
      requestContext: {
        path: `${path}`
      }
    }
    const { error } = await invokeHandler(event, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `domainName` fields value is empty then test for authenticity response error', async () => {
    const event = {
      headers: {
        'x-square-signature': `${signatureKey}`
      },
      requestContext: {
        domainName: '',
        path: `${path}`
      }
    }
    const { error } = await invokeHandler(event, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `path` field does not exist then test for authenticity response error', async () => {
    const event = {
      headers: {
        'x-square-signature': `${signatureKey}`
      },
      requestContext: {
        domainName: `${domainName}`
      }
    }
    const { error } = await invokeHandler(event, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
  test('if `path` fields value is empty then test for authenticity response error', async () => {
    const event = {
      headers: {
        'x-square-signature': `${signatureKey}`
      },
      requestContext: {
        domainName: `${domainName}`,
        path: ''
      }
    }
    const { error } = await invokeHandler(event, {})
    expect(pattern.test(error.message)).toEqual(true)
  })
})
