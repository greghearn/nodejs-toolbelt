'use strict'

const _get = require('lodash.get')
const _set = require('lodash.set')

/**
 * Get the value of a property of an object using a path
 * @param {*} object
 * @param {*} path
 */
const get = function get (object, path) {
  const value = _get(object, path)
  if (!value) {
    throw new Error(`${path} property not found`)
  }
  return value
}

/**
 * Sets a value of an object at a specified path
 * @param {*} object
 * @param {*} path
 * @param {*} value
 */
const set = function set (object, path, value) {
  try {
    return _set(object, path, JSON.parse(value))
  } catch (e) {
    throw new Error(`${path} property value is not in json format`)
  }
}

/**
 * Purpose:
 *
 * @param {*} args
 */
const jsonParserMiddyware = (args) => {
  const defaults = {
    path: [],
    debug: false,
    silent: true
  }
  const options = Object.assign({}, defaults, args)

  return ({
    before: (handler, next) => {
      const { event } = handler
      try {
        if (typeof options.path === 'string') options.path = [options.path]
        if (Array.isArray(options.path)) {
          for (var i = 0, len = options.path.length; i < len; i += 1) {
            const value = get(event, options.path[i])
            set(event, options.path[i], value)
          }
        }
      } catch (e) {
        if (!options.silent) throw e
      }
      next()
    },
    after: (handler, next) => {
      next()
    },
    onError: (handler, next) => {
      if (options.debug) console.error(handler.error)
      next(handler.error)
    }
  })
}

module.exports = jsonParserMiddyware
