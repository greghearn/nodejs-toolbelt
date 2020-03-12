'use strict'

const keys = require('../index')
const GLOBAL_KEY = '@greghearn/correlation-keys'

describe('when the key is missing x-correlation- prefix', () => {
  beforeEach(() => {
    keys.set('id', 'test')
  })
  afterEach(() => {
    keys.clear()
  })
  test('can retrieve value with prefix supplied', () => {
    expect(keys.has('x-correlation-id')).toEqual(true)
    expect(keys.get('x-correlation-id')).toEqual('test')
  })
  test('can retrieve value with just the key (no prefix supplied)', () => {
    expect(keys.has('id')).toEqual(true)
    expect(keys.get('id')).toEqual('test')
  })
})

describe('when we change the prefix', () => {
  const originalPrefix = keys.getPrefix()
  beforeEach(() => {
    keys.setPrefix('x-department-id')
  })
  afterEach(() => {
    keys.setPrefix(originalPrefix)
  })
  test('it updates the prefix', () => {
    expect(keys.getPrefix()).toEqual('x-department-id')
  })
})

describe('when key, value is set', () => {
  const correlation = require('../index')
  beforeEach(() => {
  })
  afterEach(() => {
    correlation.clear()
  })
  test('throws TypeError on invalid key name', () => {
    expect(function () { correlation.set('<Accept>', 'application/json') }).toThrow(TypeError)
    expect(function () { correlation.set('Accept:', 'application/json') }).toThrow(TypeError)
    expect(function () { correlation.set([0, 1, 2], 'application/json') }).toThrow(TypeError)
  })
  test('get() keys are case insensitive', () => {
    correlation.set('Accept', 'application/json')
    expect(correlation.get('ACCEPT')).toEqual('application/json')
    expect(correlation.get('Accept')).toEqual('application/json')
    expect(correlation.get('accept')).toEqual('application/json')
  })
  test('has() keys been found ', () => {
    correlation.set('Accept', 'application/json')
    expect(correlation.has('ACCEPT')).toEqual(true)
    expect(correlation.has('Accept')).toEqual(true)
    expect(correlation.has('accept')).toEqual(true)
    expect(correlation.has('abc123')).toEqual(false)
  })
})

describe('when adding the key twice', () => {
  beforeEach(() => {
    keys.set('id', 'test one')
    keys.set('id', 'test two')
  })
  afterEach(() => {
    keys.clear()
  })
  test('it overrides the existing first value', () => {
    expect(keys.has('x-correlation-id')).toEqual(true)
    expect(keys.get('x-correlation-id')).toEqual('test two')
  })
})

describe('when adding the complete key prefix as well', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
  })
  afterEach(() => {
    keys.clear()
  })
  test('it preserves the whole key prefix regardless', () => {
    expect(keys.has('x-correlation-id')).toEqual(true)
    expect(keys.get('x-correlation-id')).toEqual('test')
  })
})

describe('when clearing all correlation keys', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
    keys.set('x-correlation-idempotency', 'abc123')
  })
  afterEach(() => {
    keys.clear()
  })
  test('it will be empty', () => {
    keys.clear()
    expect(keys.size()).toEqual(0)
  })
})

describe('when deleting correlation keys', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
    keys.set('x-correlation-idempotency', 'abc123')
  })
  afterEach(() => {
    keys.clear()
  })
  test('one will still exist', () => {
    keys.delete('x-correlation-id')
    expect(keys.size()).toEqual(1)
  })
  test('it will be empty', () => {
    keys.delete('x-correlation-id')
    keys.delete('x-correlation-idempotency')
    expect(keys.size()).toEqual(0)
  })
})

describe('when replacing all correlation keys', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
    keys.set('x-correlation-idempotency', 'abc123')
  })
  afterEach(() => {
    keys.clear()
  })
  test('replace one', () => {
    keys.replace({
      'x-correlation-id': 'test'
    })
    expect(keys.has('x-correlation-id')).toEqual(true)
    expect(keys.get('x-correlation-id')).toEqual('test')
    expect(keys.has('x-correlation-idempotency')).toEqual(false)
  })
  test('it will be replaced with prefix preserved', () => {
    keys.replace({
      'org-id': '123',
      'org-dept': 'abc'
    })
    expect(keys.has('x-correlation-org-id')).toEqual(true)
    expect(keys.get('x-correlation-org-id')).toEqual('123')
    expect(keys.has('x-correlation-org-dept')).toEqual(true)
    expect(keys.get('x-correlation-org-dept')).toEqual('abc')
  })
})

describe('when creating two Global references', () => {
  const correlationA = require('../index')
  const correlationB = require('../index')
  beforeEach(() => {
    correlationA.set('id', 'test')
  })
  afterEach(() => {
    correlationA.clear()
  })
  test('stores a reference to the global instance as a global', () => {
    expect(global[GLOBAL_KEY]).toEqual(keys)
  })
  test('both instance share the same data', () => {
    expect(correlationA.has('x-correlation-id')).toEqual(true)
    expect(correlationB.has('x-correlation-id')).toEqual(true)
  })
})

describe('when we replace the default prefix with a new prefix', () => {
  const correlation = require('../index')
  beforeEach(() => {
    correlation.clear()
    correlation.setPrefix('x-correlation-')
  })
  test('the old prefix is replaced with a new one', () => {
    correlation.set('id', 'test')
    expect(correlation.has('x-correlation-id')).toEqual(true)
    correlation.setPrefix('x-org-')
    expect(correlation.has('x-org-id')).toEqual(true)
  })
  test('the beginning of the old prefix is replaced with a new one', () => {
    correlation.set('x-correlation-x-correlation-id', 'test')
    expect(correlation.has('x-correlation-x-correlation-id')).toEqual(true)
    correlation.setPrefix('x-org-')
    expect(correlation.has('x-org-x-correlation-id')).toEqual(true)
  })
})
