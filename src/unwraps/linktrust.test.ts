import { describe, expect, it } from 'bun:test'
import { unwrapLinktrust } from './linktrust.js'

describe('unwrapLinktrust', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://trk.shophermedia.net/click.track?CID=437133&AFID=301496&SID=&url=https%3A%2F%2Fwww%2Eexample%2Ecom%2Fcatalog%2Fsale%2Ejsp',
    )

    expect(unwrapLinktrust(url)).toBe('https://www.example.com/catalog/sale.jsp')
  })

  it('should extract target from u param', () => {
    const url = new URL(
      'https://trk.shophermedia.net/click.track?CID=443359&AFID=302178&ADID=2539781&SID=Target+Home+Page&u=https%3A%2F%2Fwww%2Eexample%2Ecom',
    )

    expect(unwrapLinktrust(url)).toBe('https://www.example.com')
  })

  it('should extract target from nonencodedurl param', () => {
    const url = new URL(
      'https://is.ltroute.com/click.track?CID=420837&AFID=426982&SID=JobApplicationReview&nonencodedurl=https://example.com/collections/watches',
    )

    expect(unwrapLinktrust(url)).toBe('https://example.com/collections/watches')
  })

  it('should extract the last nonencodedurl of a nested tracking link', () => {
    const url = new URL(
      'https://partner.logosbible.com/click.track?CID=432198&AFID=464105&nonencodedurl=https://partner.logosbible.com/click.track?CID=432198&AFID=464105&nonencodedurl=https://www.example.com/',
    )

    expect(unwrapLinktrust(url)).toBe('https://www.example.com/')
  })

  it('should return undefined without CID param', () => {
    const url = new URL(
      'https://example.com/click.track?AFID=301496&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapLinktrust(url)).toBeUndefined()
  })

  it('should return undefined without AFID param', () => {
    const url = new URL(
      'https://example.com/click.track?CID=437133&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapLinktrust(url)).toBeUndefined()
  })

  it('should return undefined when no carrier holds a target', () => {
    const url = new URL('https://trk.shophermedia.net/click.track?CID=437133&AFID=301496&SID=')

    expect(unwrapLinktrust(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://trk.shophermedia.net/click.track?CID=437133&AFID=301496&url=javascript%3Aalert(1)',
    )

    expect(unwrapLinktrust(url)).toBeUndefined()
  })

  it('should return undefined for a sibling path', () => {
    const url = new URL(
      'https://trk.shophermedia.net/click.tracker?CID=437133&AFID=301496&url=https%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapLinktrust(url)).toBeUndefined()
  })
})
