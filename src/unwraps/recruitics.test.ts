import { describe, expect, it } from 'bun:test'
import { unwrapRecruitics } from './recruitics.js'

describe('unwrapRecruitics', () => {
  it('should extract target from rx_url param', () => {
    const url = new URL(
      'https://jsv3.recruitics.com/redirect?rx_url=https%3A%2F%2Fexample.com%2Fjob',
    )

    expect(unwrapRecruitics(url)).toBe('https://example.com/job')
  })

  it('should return undefined when rx_url param is missing', () => {
    const url = new URL('https://jsv3.recruitics.com/redirect?other=value')

    expect(unwrapRecruitics(url)).toBeUndefined()
  })

  it('should return undefined for non-recruitics hosts', () => {
    const url = new URL('https://example.com/redirect?rx_url=https%3A%2F%2Fother.com')

    expect(unwrapRecruitics(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://jsv3.recruitics.com/other?rx_url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapRecruitics(url)).toBeUndefined()
  })
})
