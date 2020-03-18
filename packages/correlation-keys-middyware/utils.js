'use strict'

const isUUID = function isUUID (string) {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return pattern.test(string)
}

module.exports = {
  isUUID
}
