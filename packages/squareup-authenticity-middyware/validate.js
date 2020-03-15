'use strict'

const utils = require('./utils')
const crypto = require('crypto')

const authenticity = function authenticity (event, signatureKey) {
  const { headers } = event
  if (!headers) {
    return false
  }
  // capture the square signature value from the header if one exists
  const signature = utils.caseInsensitiveGet(headers, 'x-square-signature')
  // check to see we have received a value for the signature otherwise we can
  // just finish here and return false
  if (signature === undefined) {
    return false
  }

  // capture the domain name and path values from the request context as these
  // are needed to populate a signature url
  const { requestContext } = event
  if (!requestContext) {
    return false
  }
  const host = utils.caseInsensitiveGet(requestContext, 'domainName')
  const path = utils.caseInsensitiveGet(requestContext, 'path')
  if (host === undefined || path === undefined) {
    return false
  }
  // construct the signature url from the request domain and path values
  const signatureUrl = `https://${host}${path}`

  const { body } = event
  if (body === undefined) {
    return false
  }
  const combined = signatureUrl + body

  const hmac = crypto.createHmac('sha1', signatureKey)
  hmac.write(combined)
  hmac.end()

  const checkHash = hmac.read().toString('base64')

  // Compare HMAC-SHA1 signatures.
  if (checkHash === signature) {
    return true
  }
  return false
}

module.exports = {
  authenticity
}
