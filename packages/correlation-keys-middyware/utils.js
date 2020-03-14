'use strict'

/** Returns object[matchKey] for a case-insensitive matchKey.
 *
 * Should be used to look up header params, since HTTP/2 requires lowercase
 * headers but some old HTTP/1 services may return any capitalization scheme.
 *
 * Usage:
 *   responseHeaders = {
 *     sOmE-HeAdEr: 'value'
 *   }
 *   utils.caseInsensitiveGet(responseHeaders, 'some-header') // returns 'value'.
 */
const caseInsensitiveGet = function caseInsensitiveGet (object, matchKey) {
  const objectKey = Object.keys(object).find(
    (key) => key.toLowerCase() === matchKey.toLowerCase()
  )
  return object[objectKey]
}

const isUUID = function isUUID (string) {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return pattern.test(string)
}

module.exports = {
  caseInsensitiveGet,
  isUUID
}
