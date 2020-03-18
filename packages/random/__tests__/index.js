'use strict'

const random = require('../index')
const MIN_NUMBER = 0
const MAX_NUMBER = Number.MAX_SAFE_INTEGER

describe('when random numbers are required...', () => {
  beforeEach(() => {
  })
  afterEach(() => {
  })
  test('a number is generated successfully', () => {
    const num = random.number()
    expect(num).toBeGreaterThanOrEqual(MIN_NUMBER)
    expect(num).toBeLessThanOrEqual(MAX_NUMBER)
  })
  test('a number is less than a specified number', () => {
    expect(random.number(0, 100)).toBeLessThanOrEqual(100)
  })
  test('a number is greater than a specified number', () => {
    expect(random.number(0, 100)).toBeGreaterThanOrEqual(0)
  })
  test('a number is between a specified set of numbers', () => {
    const num = random.number(0, 100)
    expect(num).toBeGreaterThanOrEqual(0)
    expect(num).toBeLessThanOrEqual(100)
  })
  test('a min & max number is null', () => {
    const num = random.number(null, null)
    expect(num).toBeGreaterThanOrEqual(0)
    expect(num).toBeGreaterThanOrEqual(0)
  })
  test('a min & max is a really big number', () => {
    const num = random.number((Number.MAX_SAFE_INTEGER + 1), (Number.MAX_SAFE_INTEGER + 1))
    expect(num).toBeGreaterThanOrEqual(0)
    expect(num).toBeGreaterThanOrEqual(0)
  })
  test('a min & max is less than 0', () => {
    const num = random.number(-1, -1)
    expect(num).toBeGreaterThanOrEqual(0)
    expect(num).toBeGreaterThanOrEqual(0)
  })
})

describe('when random strings are required...', () => {
  beforeEach(() => {
  })
  afterEach(() => {
  })
  test('a string is generated successfully', () => {
    const str = random.string()
    expect(str).not.toBeNull()
    expect(str.length).toBeGreaterThan(0)
  })
  test('a string is generated successfully if the parameter is not a number', () => {
    const str = random.string('abc123')
    expect(str).not.toBeNull()
    expect(str.length).toBeGreaterThan(0)
  })
  test('a string is generated successfully if the parameter is greater than ' +
    'the limit of 255 characters in length', () => {
    const str = random.string(Number.MAX_SAFE_INTEGER)
    expect(str).not.toBeNull()
    expect(str.length).toEqual(255)
  })
  test('a string is generated successfully if the parameter is greater than ' +
    'the limit of 255 characters in length by 1', () => {
    const str = random.string(256)
    expect(str).not.toBeNull()
    expect(str.length).toEqual(255)
  })
  test('a string has a length equal to the specified number parameter', () => {
    const len = 8
    const str = random.string(len)
    expect(str).not.toBeNull()
    expect(str.length).toEqual(len)
  })
})
