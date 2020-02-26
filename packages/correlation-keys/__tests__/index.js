'use strict'

const keys = require('../index')

describe('when the key is missing x-correlation- prefix', () => {
  beforeEach(() => {
    keys.set('id', 'test')
  })
  afterEach(() => {
    keys.clearAll()
  })
  it('adds the prefix', () => {
    expect(keys.getAll()).toEqual({
      'x-correlation-id': 'test'
    })
  })
})

describe('when key, value is set', () => {
  const correlation = require('../index')
  beforeEach(() => {
  })
  afterEach(() => {
    correlation.clearAll()
  })
  it('throws TypeError on invalid key name', () => {
    expect(function () { correlation.set({ '<Accept>': ['application/json'] }) }).toThrow(TypeError)
    expect(function () { correlation.set({ 'Accept:': ['application/json'] }) }).toThrow(TypeError)
  })
  it('get() keys are case insensitive', () => {
    correlation.set('Accept', 'application/json')
    expect(correlation.get('ACCEPT')).toEqual('application/json')
    expect(correlation.get('Accept')).toEqual('application/json')
    expect(correlation.get('accept')).toEqual('application/json')
  })
  it('has() keys been found ', () => {
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
    keys.clearAll()
  })
  it('it overrides the existing first value', () => {
    expect(keys.getAll()).toEqual({
      'x-correlation-id': 'test two'
    })
  })
})

describe('when adding the complete key prefix as well', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
  })
  afterEach(() => {
    keys.clearAll()
  })
  it('it preserves the whole key prefix regardless', () => {
    expect(keys.getAll()).toEqual({
      'x-correlation-id': 'test'
    })
  })
})

describe('when clearing all correlation keys', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
    keys.set('x-correlation-idempotency', 'abc123')
  })
  afterEach(() => {
    keys.clearAll()
  })
  it('it will be empty', () => {
    keys.clearAll()
    expect(keys.getAll()).toEqual({})
  })
})

describe('when replacing all correlation keys', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
    keys.set('x-correlation-idempotency', 'abc123')
  })
  afterEach(() => {
    keys.clearAll()
  })
  it('replace one', () => {
    keys.replaceAll({
      'x-correlation-id': 'test'
    })
    expect(keys.getAll()).toEqual({
      'x-correlation-id': 'test'
    })
    expect(keys.getAll()).not.toHaveProperty('x-correlation-idempotency')
  })
  it('it will be replaced with prefix preserved', () => {
    keys.replaceAll({
      'org-id': '123',
      'org-dept': 'abc'
    })
    expect(keys.getAll()).toEqual({
      'x-correlation-org-id': '123',
      'x-correlation-org-dept': 'abc'
    })
    expect(keys.getAll()).not.toHaveProperty('org-id')
    expect(keys.getAll()).not.toHaveProperty('org-dept')
  })
})

describe('when creating two instances', () => {
  const correlationA = require('../index')
  const correlationB = require('../index')
  beforeEach(() => {
    correlationA.set('id', 'test')
  })
  afterEach(() => {
    correlationA.clearAll()
    correlationB.clearAll()
  })
  it('both instance will contain the same data', () => {
    expect(correlationA.getAll()).toHaveProperty('x-correlation-id')
    expect(correlationA.getAll()).toEqual({ 'x-correlation-id': 'test' })
    expect(correlationB.getAll()).toHaveProperty('x-correlation-id')
    expect(correlationB.getAll()).toEqual({ 'x-correlation-id': 'test' })
  })
})

describe('when we replace the default prefix with a new prefix', () => {
  const correlation = require('../index')
  beforeEach(() => {
    correlation.clearAll()
  })
  afterEach(() => {
    correlation.clearAll()
  })
  it('the old prefix is replaced with a new one', () => {
    correlation.set('id', 'test')
    expect(correlation.getAll()).toEqual({ 'x-correlation-id': 'test' })
    correlation.replacePrefix('x-org-')
    expect(correlation.getAll()).toEqual({ 'x-org-id': 'test' })
  })
  it('the beginning of the old prefix is replaced with a new one', () => {
    correlation.set('x-correlation-x-correlation-id', 'test')
    expect(correlation.getAll()).toEqual({ 'x-correlation-x-correlation-id': 'test' })
    correlation.replacePrefix('x-org-')
    expect(correlation.getAll()).toEqual({ 'x-org-x-correlation-id': 'test' })
  })
})
