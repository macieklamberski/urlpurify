import { describe, expect, it } from 'bun:test'
import { unwrapLeverAnalytics } from './leverAnalytics.js'

describe('unwrapLeverAnalytics', () => {
  it('should extract target from dest param', () => {
    const value = new URL(
      'https://t.lever-analytics.com/email-link?dest=https%3A%2F%2Fexample.com%2Fjob',
    )
    const expected = 'https://example.com/job'

    expect(unwrapLeverAnalytics(value)).toBe(expected)
  })

  it('should return undefined when dest param is missing', () => {
    const value = new URL('https://t.lever-analytics.com/email-link?other=value')

    expect(unwrapLeverAnalytics(value)).toBeUndefined()
  })

  it('should return undefined for non-Lever hosts', () => {
    const value = new URL('https://example.com/email-link?dest=https%3A%2F%2Fother.com')

    expect(unwrapLeverAnalytics(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://t.lever-analytics.com/other?dest=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapLeverAnalytics(value)).toBeUndefined()
  })
})
