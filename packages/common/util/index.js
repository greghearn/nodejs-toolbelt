'use strict'

const util = {

  uuid: {
    v4: function uuidV4 () {
      return require('uuid').v4()
    }
  },

  json: {
    stringify: function stringify (obj) {
      try {
        return JSON.stringify(obj)
      } catch {
        return obj
      }
    },
    parse: function parse (string) {
      try {
        return JSON.parse(string)
      } catch {
        return string
      }
    }
  },

  property: function property (obj, name, value, enumerable, isValue) {
    var opts = {
      configurable: true,
      enumerable: enumerable !== undefined ? enumerable : true
    }
    if (typeof value === 'function' && !isValue) {
      opts.get = value
    } else {
      opts.value = value
      opts.writable = true
    }

    Object.defineProperty(obj, name, opts)
  },

  /* Abort constant */
  abort: {},

  each: function each (object, iterFunction) {
    if (typeof object === 'object') {
      for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          var ret = iterFunction.call(this, key, object[key])
          if (ret === util.abort) break
        }
      }
    }
  },

  arrayEach: function arrayEach (array, iterFunction) {
    if (typeof array === 'string') array = [array]
    if (Array.isArray(array)) {
      for (var idx in array) {
        if (Object.prototype.hasOwnProperty.call(array, idx)) {
          var ret = iterFunction.call(this, array[idx], parseInt(idx, 10))
          if (ret === util.abort) break
        }
      }
    }
  },

  copy: function copy (object) {
    if (object === null || object === undefined) return object
    var dupe = {}
    for (var key in object) {
      dupe[key] = object[key]
    }
    return dupe
  },

  update: function update (obj1, obj2) {
    util.each(obj2, function iterator (key, item) {
      obj1[key] = item
    })
    return obj1
  },

  merge: function merge (obj1, obj2) {
    return util.update(util.copy(obj1), obj2)
  },

  isEmpty: function isEmpty (obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false
      }
    }
    return true
  }
}

module.exports = util
