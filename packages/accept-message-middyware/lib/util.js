'use strict'
var util = {
  json: {
    stringify: function stringify (obj) {
      try {
        return JSON.stringify(obj)
      } catch {
        return obj
      }
    },
    parse: function parse (string) {
      try {
        return JSON.parse(string)
      } catch {
        return string
      }
    }
  }
}

module.exports = util