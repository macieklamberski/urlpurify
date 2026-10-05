import { describe, expect, it } from 'bun:test'
import { unwrapSbsAd } from './sbsAd.js'

describe('unwrapSbsAd', () => {
  it('should extract a percent-encoded target from u param', () => {
    const url = new URL(
      'http://www2.sbs-ad.com/track/traffic.php?c=28766-1-107&u=https%3A%2F%2Fwww.example.com%2Fmovie%2Fmovie8199.html',
    )

    expect(unwrapSbsAd(url)).toBe('https://www.example.com/movie/movie8199.html')
  })

  it('should extract a half-encoded target from u param', () => {
    const url = new URL(
      'http://www2.sbs-ad.com/track/traffic.php?c=10221-1-159&u=http%3A//www.example.com/info.php?prd=24506',
    )

    expect(unwrapSbsAd(url)).toBe('http://www.example.com/info.php?prd=24506')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('http://www2.sbs-ad.com/track/traffic.php?c=28766-1-107')

    expect(unwrapSbsAd(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the SBS-AD host', () => {
    const url = new URL(
      'http://www2.sbs-ad.com/track/banner.php?c=28766-1-107&u=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapSbsAd(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'http://example.com/track/traffic.php?c=28766-1-107&u=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapSbsAd(url)).toBeUndefined()
  })
})
