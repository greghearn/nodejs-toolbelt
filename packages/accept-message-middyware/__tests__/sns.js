'use strict'

const { match } = require('../event-source/sns')

describe('when matching an event and the event', () => {
  test('is empty then should return false', async () => {
    expect(match({})).toEqual(false)
  })
  test('is an empty object should return false', async () => {
    expect(match({})).toEqual(false)
  })
  test('is null should return false', async () => {
    expect(match(null)).toEqual(false)
  })
  test('is undefined should return false', async () => {
    expect(match(undefined)).toEqual(false)
  })
  test('to match = `EventsSource` should return false', async () => {
    const event = { Records: [{ ' EventsSource ': 'aws:sns' }] }
    expect(match(event)).toEqual(false)
  })
  test('to match = `EventsSources` should return false', async () => {
    const event = { Records: [{ ' EventsSources ': 'aws:sns' }] }
    expect(match(event)).toEqual(false)
  })
  test('to match = `EventSources` should return false', async () => {
    const event = { Records: [{ ' EventSources ': 'aws:sns' }] }
    expect(match(event)).toEqual(false)
  })
  test('to match = ` EventSource ` should return false', async () => {
    const event = { Records: [{ ' EventSource ': 'aws:sns' }] }
    expect(match(event)).toEqual(false)
  })
  test('to match = `eventSource` should return true', async () => {
    const event = { Records: [{ eventSource: 'aws:sns' }] }
    expect(match(event)).toEqual(true)
  })
  test('to match = `EVENTSOURCE` should return true', async () => {
    const event = { Records: [{ EVENTSOURCE: 'aws:sns' }] }
    expect(match(event)).toEqual(true)
  })
  test('to match = `EventSource` should return true', async () => {
    const event = { Records: [{ EventSource: 'aws:sns' }] }
    expect(match(event)).toEqual(true)
  })
  test('to match = `eventsource` should return true', async () => {
    const event = { Records: [{ eventsource: 'aws:sns' }] }
    expect(match(event)).toEqual(true)
  })
})
