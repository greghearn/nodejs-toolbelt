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

module.exports = {
  caseInsensitiveGet
}
