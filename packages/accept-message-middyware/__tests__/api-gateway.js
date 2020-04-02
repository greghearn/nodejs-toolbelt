'use strict'

const { match, capture } = require('../event-source/api-gateway')

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
    const event = {
      httpsMethod: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }
    expect(match(event)).toEqual(false)
  })
  test('to match = `httpsMethods` should return false', async () => {
    const event = {
      httpsMethods: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }
    expect(match(event)).toEqual(false)
  })
  test('to match = `httpMethods` should return false', async () => {
    const event = {
      httpMethods: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }
    expect(match(event)).toEqual(false)
  })
  test('to match = ` httpMethod ` should return false', async () => {
    const event = {
      ' httpMethod ': 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }
    expect(match(event)).toEqual(false)
  })
  test('to match = `httpMethod` should return true', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }
    expect(match(event)).toEqual(true)
  })
})
describe('when checking the headers content-type', () => {
  test('should return true if content-type exists and equals application/json', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    }
    expect(match(event)).toEqual(true)
  })
  test('should return false if content-type doesnt exist', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
      }
    }
    expect(match(event)).toEqual(false)
  })
  test('should return false if content-type doesnt equal application/json', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
        'content-type': 'text/html'
      }
    }
    expect(match(event)).toEqual(false)
  })
  test('should return true if Content-Type is camel case and equals application/json', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    expect(match(event)).toEqual(true)
  })
  test('should return false if Content-Type is camel case but doesnt equal application/json', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      }
    }
    expect(match(event)).toEqual(false)
  })
})
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
      body: '{ "type": "stock.count.updated" }'
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
  test('message body should be transformed when validating the body as an object', () => {
    const message = '{"hello": "world"}'
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
      },
      convert: true
    }
    expect(() => {
      capture(event, options)
    }).not.toThrow()
    expect(event.body).toStrictEqual(JSON.parse(message))
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
