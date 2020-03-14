'use strict'

const middy = require('@middy/core')
const middleware = require('../index')
const correlationKeys = require('@greghearn/correlation-keys')
const utils = require('../utils')
const { CORRELATION_ID, DEBUG_ENABLED } = require('../constants')

const invokeHandler = async (event, options) => {
  const handler = middy((event) => {})
  handler.use(middleware(options))
  handler(event)
}

const defaultTestSuite = (event) => {
  describe('when testing debug log rate', () => {
    test('if debug log rate = 1 then debug enabled is true', async () => {
      await invokeHandler(event, { debugLogRate: '1' })
      expect(correlationKeys.get(DEBUG_ENABLED)).toEqual('true')
    })
    test('if debug log rate = 0 then debug enabled is false', async () => {
      await invokeHandler(event, { debugLogRate: '0' })
      expect(correlationKeys.get(DEBUG_ENABLED)).toEqual('false')
    })
  })
  describe('when testing correlation identifier', () => {
    test('if it doesnt exist then add to correlations', async () => {
      await invokeHandler(event, {})
      expect(correlationKeys.has(CORRELATION_ID)).toEqual(true)
      expect(utils.isUUID(correlationKeys.get(CORRELATION_ID))).toEqual(true)
    })
  })
}
describe('skipping this test suite on purpose', () => {
  test('so the same test suite can be used by other event sources', () => {
    expect.anything()
  })
})

// eslint-disable-next-line jest/no-export
module.exports = {
  invokeHandler,
  defaultTestSuite
}
