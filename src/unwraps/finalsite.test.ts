import { describe, expect, it } from 'bun:test'
import { unwrapFinalsite } from './finalsite.js'

describe('unwrapFinalsite', () => {
  it('should extract target from dest param', () => {
    const url = new URL(
      'https://www.mtlsd.org/cf_news/forward.cfm?dest=https%3A%2F%2Fwww%2Eexample%2Eorg%2F%2Fuploaded%2FMMS%2FKennywood%2Epdf&destkey=081A35EA62FBD890AA4F3901F29FCFAB79266FC41A7690754D061BD8B830C102',
    )

    expect(unwrapFinalsite(url)).toBe('https://www.example.org//uploaded/MMS/Kennywood.pdf')
  })

  it('should extract a target encoded twice', () => {
    const url = new URL(
      'https://www.example.com/cf_news/forward.cfm?dest=https%253A%252F%252Fexample.org%252Fpage&destkey=081A35EA62FBD890AA4F3901F29FCFAB79266FC41A7690754D061BD8B830C102',
    )

    expect(unwrapFinalsite(url)).toBe('https://example.org/page')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://www.example.com/cf_news/forward.cfm?dest=https://example.org/search/a+b&destkey=081A35EA62FBD890AA4F3901F29FCFAB79266FC41A7690754D061BD8B830C102',
    )

    expect(unwrapFinalsite(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract target from the root path', () => {
    const url = new URL(
      'http://www.fenn.org/forward.cfm?dest=http%3A%2F%2Fwww%2Eexample%2Eorg%2Ffs%2Fpages%2F565&destkey=37C82DF4D7932986CC53C15C332D5CA72936B4E659601EF12D0DF6F7D24B5206',
    )

    expect(unwrapFinalsite(url)).toBe('http://www.example.org/fs/pages/565')
  })

  it('should keep the percent-encoded query of the target', () => {
    const url = new URL(
      'http://www.hwschools.net/forward.cfm?dest=https%3A%2F%2Fdocs%2Eexample%2Ecom%2Fdocument%2Fd%2F1JqLb8%2Fedit%3Fusp%3Dsharing&destkey=F9EF825CAEBB8A339D85097373C4FC57DEA198C390E3A544F3386E4CC54239E2',
    )

    expect(unwrapFinalsite(url)).toBe('https://docs.example.com/document/d/1JqLb8/edit?usp=sharing')
  })

  it('should extract the last dest when an email link is nested unencoded', () => {
    const url = new URL(
      'https://www.lejardinacademy.org/cf_news/forward.cfm?dest=https://www.lejardinacademy.org/cf_enotify/linkforward.cfm?mailgun=1&n=4527&u=0&e=0&dest=https%3A%2F%2Fwww%2Eexample%2Eorg%2F&destkey=DD2F4B44561DD18E2FC166DD5FB47BC9AB6CC1D11A79CDF8B6E55BE9B4E0B425',
    )

    expect(unwrapFinalsite(url)).toBe('https://www.example.org/')
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://www.mtlsd.org/cf_enotify/linkforward.cfm?dest=https%3A%2F%2Fwww.example.org%2F&destkey=081A35EA',
    )

    expect(unwrapFinalsite(url)).toBeUndefined()
  })

  it('should return undefined without destkey', () => {
    const url = new URL(
      'https://www.mtlsd.org/cf_news/forward.cfm?dest=https%3A%2F%2Fwww.example.org%2F&n=1&u=2&e=3',
    )

    expect(unwrapFinalsite(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://www.mtlsd.org/cf_news/forward.cfm?dest=javascript%3Aalert(1)&destkey=081A35EA',
    )

    expect(unwrapFinalsite(url)).toBeUndefined()
  })

  it('should return undefined when dest param is missing', () => {
    const url = new URL('https://www.mtlsd.org/cf_news/forward.cfm?destkey=081A35EA')

    expect(unwrapFinalsite(url)).toBeUndefined()
  })

  it('should return undefined when dest param is empty', () => {
    const url = new URL('https://www.mtlsd.org/cf_news/forward.cfm?dest=&destkey=081A35EA')

    expect(unwrapFinalsite(url)).toBeUndefined()
  })
})
