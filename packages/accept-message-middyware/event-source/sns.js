'use strict'

const keyToMatch = 'eventsource'
const valueToMatch = 'aws:sns'

const match = function match (event) {
  try {
    const { Records = [] } = event
    var index = -1

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
    return index >= 0
  } catch {
    return false
  }
}

const capture = function capture (event, options) {
}

module.exports = {
  capture,
  match
}
