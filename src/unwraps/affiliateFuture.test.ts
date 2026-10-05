import { describe, expect, it } from 'bun:test'
import { unwrapAffiliateFuture } from './affiliateFuture.js'

describe('unwrapAffiliateFuture', () => {
  it('should extract a plain target from url param', () => {
    const url = new URL(
      'https://scripts.affiliatefuture.com/AFClick.asp?affiliateID=347146&merchantID=7042&programmeID=24815&mediaID=0&tracking=&afsource=20&url=https://www.example.com/whiskies/yamazaki-12-year-old-whisky/',
    )

    expect(unwrapAffiliateFuture(url)).toBe(
      'https://www.example.com/whiskies/yamazaki-12-year-old-whisky/',
    )
  })

  it('should extract a percent-encoded target from url param', () => {
    const url = new URL(
      'http://scripts.affiliatefuture.com/AFClick.asp?affiliateID=345179&merchantID=7042&ProgrammeID=25000&mediaID=0&tracking=&url=https%3a%2f%2fwww.example.com%2fgin%2fyuletide-gin',
    )

    expect(unwrapAffiliateFuture(url)).toBe('https://www.example.com/gin/yuletide-gin')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('http://scripts.affiliatefuture.com/AFClick.asp?affiliateID=1&merchantID=2')

    expect(unwrapAffiliateFuture(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracker host', () => {
    const url = new URL(
      'https://scripts.affiliatefuture.com/AFImpression.asp?affiliateID=1&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAffiliateFuture(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/AFClick.asp?affiliateID=1&url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapAffiliateFuture(url)).toBeUndefined()
  })
})
