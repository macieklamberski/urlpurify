import { describe, expect, it } from 'bun:test'
import { unwrapLinktrust } from './linktrust.js'

describe('unwrapLinktrust', () => {
  it('should extract target from url param', () => {
    const value = new URL(
      'https://trk.shophermedia.net/click.track?CID=437133&AFID=301496&SID=&url=https%3A%2F%2Fwww%2Eexample%2Ecom%2Fcatalog%2Fsale%2Ejsp',
    )
    const expected = 'https://www.example.com/catalog/sale.jsp'

    expect(unwrapLinktrust(value)).toBe(expected)
  })

  it('should extract a target encoded twice', () => {
    const value = new URL(
      'https://www.example.com/click.track?CID=437133&AFID=301496&SID=&url=https%253A%252F%252Fexample.org%252Fpage',
    )
    const expected = 'https://example.org/page'

    expect(unwrapLinktrust(value)).toBe(expected)
  })

  it('should keep a plus in an unencoded target', () => {
    const value = new URL(
      'https://www.example.com/click.track?CID=437133&AFID=301496&SID=&url=https://example.org/search/a+b',
    )
    const expected = 'https://example.org/search/a+b'

    expect(unwrapLinktrust(value)).toBe(expected)
  })

  it('should extract target from u param', () => {
    const value = new URL(
      'https://trk.shophermedia.net/click.track?CID=443359&AFID=302178&ADID=2539781&SID=Target+Home+Page&u=https%3A%2F%2Fwww%2Eexample%2Ecom',
    )
    const expected = 'https://www.example.com'

    expect(unwrapLinktrust(value)).toBe(expected)
  })

  it('should extract target from nonencodedurl param', () => {
    const value = new URL(
      'https://is.ltroute.com/click.track?CID=420837&AFID=426982&SID=JobApplicationReview&nonencodedurl=https://example.com/collections/watches',
    )
    const expected = 'https://example.com/collections/watches'

    expect(unwrapLinktrust(value)).toBe(expected)
  })

  it('should extract the last nonencodedurl of a nested tracking link', () => {
    const value = new URL(
      'https://partner.logosbible.com/click.track?CID=432198&AFID=464105&nonencodedurl=https://partner.logosbible.com/click.track?CID=432198&AFID=464105&nonencodedurl=https://www.example.com/',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapLinktrust(value)).toBe(expected)
  })

  it('should return undefined without CID param', () => {
    const value = new URL(
      'https://example.com/click.track?AFID=301496&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapLinktrust(value)).toBeUndefined()
  })

  it('should return undefined without AFID param', () => {
    const value = new URL(
      'https://example.com/click.track?CID=437133&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapLinktrust(value)).toBeUndefined()
  })

  it('should return undefined when no carrier holds a target', () => {
    const value = new URL('https://trk.shophermedia.net/click.track?CID=437133&AFID=301496&SID=')

    expect(unwrapLinktrust(value)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const value = new URL(
      'https://trk.shophermedia.net/click.track?CID=437133&AFID=301496&url=javascript%3Aalert(1)',
    )

    expect(unwrapLinktrust(value)).toBeUndefined()
  })

  it('should return undefined for a sibling path', () => {
    const value = new URL(
      'https://trk.shophermedia.net/click.tracker?CID=437133&AFID=301496&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapLinktrust(value)).toBeUndefined()
  })
})
