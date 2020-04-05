'use strict'

const _get = require('lodash.get')
const _set = require('lodash.set')

const get = function get (event, path) {
  return _get(event, path)
}

const parse = function parse (string) {
  return JSON.parse(string)
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
      if (typeof options.path === 'string') options.path = [options.path]
      if (Array.isArray(options.path)) {
        const len = options.path.length
        for (var index = 0; index < len; index += 1) {
          const value = get(event, options.path[index])
          if (!value && !options.silent) {
            throw new Error(`${options.path[index]} property not found`)
          }
          if (value) {
            try {
              _set(event, options.path[index], parse(value))
            } catch {
              if (!options.silent) {
                throw new Error(`${options.path[index]} property value is not in json format`)
              }
            }
          }
        }
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
