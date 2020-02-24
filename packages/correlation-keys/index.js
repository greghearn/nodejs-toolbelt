'use strict'

var cache = require('global-cache')

const CACHE_KEY = 'correlation-keys'
const DEBUG_ENABLED = 'debug-enabled'

class CorrelationKeys {
  constructor ({
    prefix = 'x-correlation-'
  } = {}) {
    this.context = {}
    this.prefix = prefix
  }

  set (key, value) {
    if (typeof key === 'string') {
      const regex = new RegExp(this.prefix, 'i')
      if (key.search(regex) < 0) {
        key = `${this.prefix}${key}`
      }
      this.context[key] = value
    }
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

  replacePrefix (value) {
    const tmp = {}
    const regex = new RegExp(this.prefix, 'i')
    for (var element in this.context) {
      const key = element.replace(regex, value)
      tmp[key] = this.context[element]
    }
    this.replaceAll(tmp)
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
