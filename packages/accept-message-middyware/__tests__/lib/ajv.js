'use strict'

const ajv = require('../../lib/ajv')

describe('when validating a schema', () => {
  const schema = {
    required: ['body'],
    properties: {
      body: {
        type: 'object'
      }
    }
  }
  beforeEach(() => {})
  afterEach(() => {})
  test('it should throw an error if the data is an empty object due the schemas required properties', () => {
    expect(() => {
      ajv.test(schema, {})
    }).toThrow()
  })
  test('it should not throw an error if the data has the required properties', () => {
    const data = {
      body: {}
    }
    expect(() => {
      ajv.test(schema, data)
    }).not.toThrow()
  })
  test('it should throw an error if the data doesnt have the required properties', () => {
    const data = {
      headers: {}
    }
    expect(() => {
      ajv.test(schema, data)
    }).toThrow()
  })
  test('it should throw an error if a data property doesnt match the schemas corresponding property', () => {
    const data = {
      body: '' /* should be an object as per scehma */
    }
    expect(() => {
      ajv.test(schema, data)
    }).toThrow()
  })
})
