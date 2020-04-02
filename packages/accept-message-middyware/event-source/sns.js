'use strict'

const ajv = require('../lib/ajv')
const util = require('../lib/util')

const keyToMatch = 'eventsource'
const valueToMatch = 'aws:sns'

const match = function match (event) {
  try {
    const { Records = [] } = event
    var index = -1

    if (Records.length > 0) {
      index = Object.entries(Records[0]).findIndex(([key, value]) => {
        return (
          (key.toLowerCase() === keyToMatch) &&
          (value.toLowerCase() === valueToMatch)
        )
      })
    }
    /*
     * removed bulk record checking as we dont have any example data
     * where more than 1 Record element exists yet.
     * code has been left in for a possible use later on
     *
    for (var i = 0, len = Records.length; i < len; i += 1) {
      index = Object.entries(Records[i]).findIndex(([key, value]) => {
        return (
          (key.toLowerCase() === keyToMatch) &&
          (value.toLowerCase() === valueToMatch)
        )
      })
      if (index >= 0) {
        break
      }
    }
    */
    return index >= 0
  } catch {
    return false
  }
}

const capture = function capture (event, options) {
  const { schema = {} } = options
  const { Records = [] } = event
  const { Message = {} } = Records[0].Sns

  event.Records[0].Sns.Message = util.json.parse(Message)
  ajv.test(schema, event)

  if (!options.convert) event.Records[0].Sns.Message = Message
}

module.exports = {
  capture,
  match
}
