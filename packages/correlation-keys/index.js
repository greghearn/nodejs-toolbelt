'use strict'

var cache = require('global-cache')

const CACHE_KEY = 'correlation-keys'
const DEBUG_ENABLED = 'debug-enabled'

class CorrelationKeys {
  constructor () {
    this.context = {}
    this.prefix = 'x-correlation-'
  }

  set (key, value) {
    if (!key.startsWith(this.prefix)) {
      key = this.prefix + key
    }
    this.context[key] = value
  }

  get () {
    return this.context
  }

  clearAll () {
    this.context = {}
  }

  replaceAll (context) {
    this.context = context
  }

  isDebugEnabled () {
    return (this.context[DEBUG_ENABLED] === 'true')
  }
}

const instance = new CorrelationKeys()
if (!cache.has(CACHE_KEY)) {
  cache.set(CACHE_KEY, instance)
}
Object.assign(instance, cache.get(CACHE_KEY))

module.exports = instance
