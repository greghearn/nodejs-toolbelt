'use strict'

const match = function match (event) {
  try {
    return Object.keys(event).findIndex(k =>
      k.toLowerCase() === 'httpmethod'
    ) >= 0
  } catch {
    return false
  }
}

const capture = function capture (event, options) {
  console.log('API GATEWAY Capture called')
}

module.exports = {
  capture,
  match
}
