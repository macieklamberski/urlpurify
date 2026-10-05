import { describe, expect, it } from 'bun:test'
import { unwrapLeverAnalytics } from './leverAnalytics.js'

describe('unwrapLeverAnalytics', () => {
  it('should extract target from dest param', () => {
    const url = new URL(
      'https://t.lever-analytics.com/email-link?dest=https%3A%2F%2Fexample.com%2Fjob',
    )

    expect(unwrapLeverAnalytics(url)).toBe('https://example.com/job')
  })

  it('should return undefined when dest param is missing', () => {
    const url = new URL('https://t.lever-analytics.com/email-link?other=value')

    expect(unwrapLeverAnalytics(url)).toBeUndefined()
  })

  it('should return undefined for non-Lever hosts', () => {
    const url = new URL('https://example.com/email-link?dest=https%3A%2F%2Fother.com')

    expect(unwrapLeverAnalytics(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://t.lever-analytics.com/other?dest=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapLeverAnalytics(url)).toBeUndefined()
  })
})
