'use strict'

const normalizeNumber = (n) => {
  if (typeof n !== 'number') { n = Number.MAX_SAFE_INTEGER }
  if (n > Number.MAX_SAFE_INTEGER) { n = Number.MAX_SAFE_INTEGER }
  if (n < 0) { n = 0 }
  return n
}
const CHAR_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const CHAR_UPPER = CHAR_LOWER.toUpperCase()
const NUMBER = '0123456789'
const DATA_FOR_RANDOM_STRING = CHAR_LOWER + CHAR_UPPER + NUMBER

class Random {
  constructor (options = {}) {
    this.options = options
  }

  /**
   * Returns a non-negative random integer.
   */
  /* next () {
    const max = normalizeNumber(Number.MAX_SAFE_INTEGER)
    return Math.floor(Math.random() * max)
  } */

  /**
   * Returns a non-negative random number that is less than the supplied maximum.
   */
  /* nextFrom (max = Number.MAX_SAFE_INTEGER) {
    max = normalizeNumber(max)
    return Math.floor(Math.random() * max)
  } */

  /**
   * Returns a random number that is within a supplied range.
   */
  number (min = 0, max = Number.MAX_SAFE_INTEGER) {
    min = normalizeNumber(min)
    max = normalizeNumber(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  string (length = 10) {
    let ret = ''
    for (let index = 0; index < length; index += 1) {
      ret += DATA_FOR_RANDOM_STRING.charAt(
        Math.floor(Math.random() * DATA_FOR_RANDOM_STRING.length)
      )
    }
    return ret
  }
}

module.exports = {
  Random
}
