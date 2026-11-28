import { describe, expect, it } from 'bun:test'
import { unwrapTopsec } from './topsec.js'

describe('unwrapTopsec', () => {
  it('should extract target from u param', () => {
    const value = new URL(
      'https://scanner.topsec.com/?d=4179&r=auto&u=https%3A%2F%2Fwww.example.com%2Ftraining-events%2Fonline-bookings%2F&t=77718a3b5e2d4c1f9a8b7c6d5e4f3a2b1c0d9e8f',
    )
    const expected = 'https://www.example.com/training-events/online-bookings/'

    expect(unwrapTopsec(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://scanner.topsec.com/?d=4179&r=auto&t=77718a3b5e2d4c1f')

    expect(unwrapTopsec(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://scanner.topsec.com/report?u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapTopsec(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/?u=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapTopsec(value)).toBeUndefined()
  })
})
