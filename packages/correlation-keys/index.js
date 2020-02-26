'use strict'

const cache = require('global-cache')

const CACHE_KEY = 'correlation-keys'

const regex = s => new RegExp(s, 'i')
const normalizeValue = v => typeof v === 'string' ? v : String(v)
const normalizeKey = k => {
  if (typeof k !== 'string') { k = String(k) }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(k)) {
    throw new TypeError('Invalid character in key string')
  }
  return k.toLowerCase()
}

class CorrelationKeys {
  constructor (options = {}) {
    this.options = options
    this.prefix = options.prefix || 'x-correlation-'
    this.context = {}
  }

  set (key, value) {
    if (key.search(regex(this.prefix)) < 0) {
      key = `${this.prefix}${key}`
    }
    this.context[normalizeKey(key)] = normalizeValue(value)
  }

  get (key) {
    key = normalizeKey(`${this.prefix}${key}`)
    return this.context[key] ? this.context[key] : null
  }

  has (key) {
    return (this.get(key) !== null)
  }

  getAll () {
    return this.context
  }

  clearAll () {
    this.context = {}
  }

  replaceAll (context) {
    this.clearAll()
    Object.entries(context).map(([k, v]) => {
      this.set(k, v)
    })
  }

  replacePrefix (str) {
    const tmp = {}
    Object.entries(this.context).map(([k, v]) => {
      const key = k.replace(regex(this.prefix), str)
      tmp[normalizeKey(key)] = v
    })
    this.context = tmp
  }
}

const instance = new CorrelationKeys()
if (!cache.has(CACHE_KEY)) {
  cache.set(CACHE_KEY, instance)
}
Object.assign(instance, cache.get(CACHE_KEY))

module.exports = instance
