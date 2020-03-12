'use strict'

const normalizeNumber = (n) => {
  if (typeof n !== 'number') { n = Number.MAX_SAFE_INTEGER }
  if (n > Number.MAX_SAFE_INTEGER) { n = Number.MAX_SAFE_INTEGER }
  if (n < 0) { n = 0 }
  return n
}
const DEFAULT_RANDOM_STRING_LENGTH = 16
const MAX_RANDOM_STRING_LENGTH = 255
const CHAR_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const CHAR_UPPER = CHAR_LOWER.toUpperCase()
const NUMBER = '0123456789'
const DATA_FOR_RANDOM_STRING = CHAR_LOWER + CHAR_UPPER + NUMBER

class Random {
  /**
   * Returns a random number that is within a supplied range.
   * @param {*} min
   * @param {*} max
   */
  number (min = 0, max = Number.MAX_SAFE_INTEGER) {
    min = normalizeNumber(min)
    max = normalizeNumber(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  /**
   * Returns a random string that is equal to the supplied length.
   * @param {*} length
   */
  string (length = 10) {
    if (typeof length !== 'number') { length = DEFAULT_RANDOM_STRING_LENGTH }
    if (length > MAX_RANDOM_STRING_LENGTH) { length = MAX_RANDOM_STRING_LENGTH }
    let ret = ''
    for (let index = 0; index < length; index += 1) {
      ret += DATA_FOR_RANDOM_STRING.charAt(
        Math.floor(Math.random() * DATA_FOR_RANDOM_STRING.length)
      )
    }
    return ret
  }
}

module.exports = new Random()
