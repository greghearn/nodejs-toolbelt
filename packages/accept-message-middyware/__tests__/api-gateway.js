'use strict'

const capture = require('../capture')

describe('When capture method invoked it should throw an error', () => {
  test('if schema and event null', () => {
    expect(() => {
      capture(null, null)
    }).toThrow()
  })
  test('if the event body message is not a valid json string', () => {
    const event = {
      body: 23
    }
    const schema = {
      required: ['body'],
      properties: {
        body: {
          type: 'string'
        }
      }
    }
    expect(() => {
      capture(event, { schema: schema })
    }).toThrowError(/body should be string/i)
  })
  test('if the event body message is not a valid json object', () => {
    const event = {
      body: '{ "hello": "world" } }' /* note extra } */
    }
    const schema = {
      required: ['body'],
      properties: {
        body: {
          type: 'object'
        }
      }
    }
    expect(() => {
      capture(event, { schema: schema })
    }).toThrowError(/data.body should be object/i)
  })
  test('if the body message doesnt match applied regexp', () => {
    const event = {
      body: { type: 'stock.count.updated' }
    }
    const schema = {
      required: ['body'],
      properties: {
        body: {
          type: 'object',
          allRequired: true,
          properties: {
            type: {
              regexp: '/^inventory\\.count\\.updated$/i'
            }
          }
        }
      }
    }
    expect(() => {
      capture(event, { schema: schema })
    }).toThrowError(/body.type should pass/i)
  })
  test('if a required property doesnt exist in the event object', () => {
    const event = {
      body: '{ "hello": "world" }'
    }
    const schema = {
      required: ['headers']
    }
    expect(() => {
      capture(event, { schema: schema })
    }).toThrowError(/should have required property/i)
  })
})
describe('When capture method invoked it should pass', () => {
  test('if schema and event is empty', () => {
    const options = { schema: {} }
    const event = { body: '{}' }
    expect(() => {
      capture(event, options)
    }).not.toThrow()
  })
  test('message body should be successfull if the message is a valid object', () => {
    const message = JSON.parse('{ "hello": "world" }')
    const event = {
      body: message
    }
    const options = {
      schema: {
        required: ['body'],
        properties: {
          body: {
            type: 'object'
          }
        }
      }
    }
    expect(() => {
      capture(event, options)
    }).not.toThrow()
  })
})
