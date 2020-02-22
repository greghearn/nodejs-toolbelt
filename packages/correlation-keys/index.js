'use strict'

const DEBUG_LOG_ENABLED = 'debug-log-enabled'

class CorrelationKeys {
  constructor () {
    if (!CorrelationKeys.instance) {
      this.clearAll()
      CorrelationKeys.instance = this
    }

    return CorrelationKeys.instance
  }

  set (key, value) {
    if (!key.startsWith('x-correlation-')) {
      key = 'x-correlation-' + key
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
    return (this.context[DEBUG_LOG_ENABLED] === 'true')
  }
}

const instance = new CorrelationKeys()
Object.freeze(instance)

// export default instance
module.exports = instance
