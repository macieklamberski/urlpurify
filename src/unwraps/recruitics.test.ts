import { describe, expect, it } from 'bun:test'
import { unwrapRecruitics } from './recruitics.js'

describe('unwrapRecruitics', () => {
  it('should extract target from rx_url param', () => {
    const value = new URL(
      'https://jsv3.recruitics.com/redirect?rx_url=https%3A%2F%2Fexample.com%2Fjob',
    )
    const expected = 'https://example.com/job'

    expect(unwrapRecruitics(value)).toBe(expected)
  })

  it('should return undefined when rx_url param is missing', () => {
    const value = new URL('https://jsv3.recruitics.com/redirect?other=value')

    expect(unwrapRecruitics(value)).toBeUndefined()
  })

  it('should return undefined for non-recruitics hosts', () => {
    const value = new URL('https://example.com/redirect?rx_url=https%3A%2F%2Fother.com')

    expect(unwrapRecruitics(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://jsv3.recruitics.com/other?rx_url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapRecruitics(value)).toBeUndefined()
  })
})
