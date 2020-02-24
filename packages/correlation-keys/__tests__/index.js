'use strict'

const keys = require('../index')

describe('when the key is missing x-correlation- prefix', () => {
  beforeEach(() => {
    keys.set('id', 'test')
  })
  it('adds the prefix', () => {
    expect(keys.get()).toEqual({
      'x-correlation-id': 'test'
    })
  })
})

describe('when adding the key twice', () => {
  beforeEach(() => {
    keys.set('id', 'test one')
    keys.set('id', 'test two')
  })
  it('it overrides the existing first value', () => {
    expect(keys.get()).toEqual({
      'x-correlation-id': 'test two'
    })
  })
})

describe('when adding the complete key prefix as well', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
  })
  it('it preserves the whole key prefix regardless', () => {
    expect(keys.get()).toEqual({
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

  })
  it('it will be empty', () => {
    keys.clearAll()
    expect(keys.get()).toEqual({})
  })
})

describe('when replacing all correlation keys', () => {
  beforeEach(() => {
    keys.set('x-correlation-id', 'test')
    keys.set('x-correlation-idempotency', 'abc123')
  })
  it('it will be empty', () => {
    keys.replaceAll({
      'x-correlation-id': 'test'
    })
    expect(keys.get()).toEqual({
      'x-correlation-id': 'test'
    })
    expect(keys.get()).not.toHaveProperty('x-correlation-idempotency')
  })
})

describe('when creating two instances', () => {
  const correlationA = require('../index')
  const correlationB = require('../index')
  beforeEach(() => {
    correlationA.set('id', 'test')
  })
  it('both instance will contain the same data', () => {
    expect(correlationA.get()).toHaveProperty('x-correlation-id')
    expect(correlationA.get()).toEqual({ 'x-correlation-id': 'test' })
    expect(correlationB.get()).toHaveProperty('x-correlation-id')
    expect(correlationB.get()).toEqual({ 'x-correlation-id': 'test' })
  })
})

describe('when we replace the default prefix with a new prefix', () => {
  const correlation = require('../index')
  beforeEach(() => {
    correlation.clearAll()
  })
  it('the old prefix is replaced with a new one', () => {
    correlation.set('id', 'test')
    expect(correlation.get()).toEqual({ 'x-correlation-id': 'test' })
    correlation.replacePrefix('x-org-')
    expect(correlation.get()).toEqual({ 'x-org-id': 'test' })
  })
  it('the beginning of the old prefix is replaced with a new one', () => {
    correlation.set('x-correlation-x-correlation-id', 'test')
    expect(correlation.get()).toEqual({ 'x-correlation-x-correlation-id': 'test' })
    correlation.replacePrefix('x-org-')
    expect(correlation.get()).toEqual({ 'x-org-x-correlation-id': 'test' })
    correlation.clearAll()
  })
})
