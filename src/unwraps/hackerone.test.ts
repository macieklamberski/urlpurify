import { describe, expect, it } from 'bun:test'
import { unwrapHackerone } from './hackerone.js'

describe('unwrapHackerone', () => {
  it('should extract the target from the redirect', () => {
    const value = new URL(
      'https://hackerone.com/redirect?signature=5253515c127b7dd0854a772eda641c3b1e8270f0&url=https%3A%2F%2Fwww.example.pt%2Fbraga%2F%3Fsearch%255Bq%255D%3Dx',
    )
    const expected = 'https://www.example.pt/braga/?search%5Bq%5D=x'

    expect(unwrapHackerone(value)).toBe(expected)
  })

  it('should return undefined for the redirect without url', () => {
    const value = new URL(
      'https://hackerone.com/redirect?signature=5253515c127b7dd0854a772eda641c3b1e8270f0',
    )

    expect(unwrapHackerone(value)).toBeUndefined()
  })

  it('should return undefined for a report', () => {
    const value = new URL('https://hackerone.com/reports/123?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapHackerone(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/redirect?url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapHackerone(value)).toBeUndefined()
  })
})
