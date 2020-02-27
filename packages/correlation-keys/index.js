'use strict'

const cache = require('global-cache')

const CACHE_KEY = 'correlation-keys'

const regex = s => new RegExp(s, 'i')
const removePrefix = (k, p) => normalizeStr(k).replace(regex(p), '')
const normalizeStr = v => typeof v === 'string' ? v : String(v)
const normalizeKey = k => {
  if (typeof k !== 'string') { k = String(k) }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(k)) {
    throw new TypeError('Invalid character in key string')
  }
  return k.toLowerCase()
}

class CorrelationKeys extends Map {
  constructor (options = {}) {
    super()
    this.options = options
    this.prefix = options.prefix || 'x-correlation-'
  }

  set (key, value) {
    return super.set(normalizeKey(
      removePrefix(key, this.prefix)), normalizeStr(value)
    )
  }

  get (key) {
    return super.get(normalizeKey(
      removePrefix(key, this.prefix))
    )
  }

  has (key) {
    return super.has(normalizeKey(
      removePrefix(key, this.prefix))
    )
  }

  replace (context) {
    this.clear()
    Object.entries(context).map(([k, v]) => {
      this.set(k, v)
    })
  }

  getPrefix () {
    return this.prefix
  }

  setPrefix (string) {
    this.prefix = string
  }

  delete (key) {
    return super.delete(normalizeKey(
      removePrefix(key, this.prefix))
    )
  }

  clear () {
    super.clear()
  }

  size () {
    return super.size
  }

  /**
   * Returns a POJO of key, value pairs for every entry in the map
   */
  entries () {
    const result = {}
    for (const [key, value] of super.entries()) {
      result[`${this.prefix}${key}`] = value
    }
    return result
  }
}

const instance = new CorrelationKeys()
if (!cache.has(CACHE_KEY)) {
  cache.set(CACHE_KEY, instance)
}
Object.assign(instance, cache.get(CACHE_KEY))

module.exports = instance
