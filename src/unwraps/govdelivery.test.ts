import { describe, expect, it } from 'bun:test'
import { unwrapGovdelivery } from './govdelivery.js'

const prefix =
  'http://links.govdelivery.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&114&&&'

describe('unwrapGovdelivery', () => {
  it('should extract the target after the marker', () => {
    const url = new URL(`${prefix}http://example.com`)

    expect(unwrapGovdelivery(url)).toBe('http://example.com')
  })

  it('should extract the target on https', () => {
    const url = new URL(
      'https://links.govdelivery.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&102&&&https://www.example.com/atlas/index.htm',
    )

    expect(unwrapGovdelivery(url)).toBe('https://www.example.com/atlas/index.htm')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      `${prefix}https://www.example.com/2020census?eml=gd&utm_medium=email&utm_source=govdelivery`,
    )

    expect(unwrapGovdelivery(url)).toBe(
      'https://www.example.com/2020census?eml=gd&utm_medium=email&utm_source=govdelivery',
    )
  })

  it('should keep the fragment of the target', () => {
    const url = new URL(`${prefix}http://example.com/ncr/oira/welcomingweek#top`)

    expect(unwrapGovdelivery(url)).toBe('http://example.com/ncr/oira/welcomingweek#top')
  })

  it('should keep a later marker-like run inside the target', () => {
    const url = new URL(`${prefix}https://example.org/a&&&b?c=1`)

    expect(unwrapGovdelivery(url)).toBe('https://example.org/a&&&b?c=1')
  })

  it('should return undefined for the open-tracking pixel without type=click', () => {
    const url = new URL(
      'http://links.govdelivery.com/track?enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&114&&&http://example.com',
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined without the marker', () => {
    const url = new URL(
      'http://links.govdelivery.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx',
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for a percent-encoded target', () => {
    const url = new URL(
      `${prefix}https%3A%2F%2Fwww.example.com%2Fbusiness%3Futm_content=&utm_medium=email`,
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'http://links.govdelivery.com/tracking?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&114&&&http://example.com',
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL(
      'http://links.example.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&114&&&http://example.com',
    )

    expect(unwrapGovdelivery(url)).toBeUndefined()
  })

  it('should finish quickly on a long run of markers', () => {
    const url = new URL(
      `http://links.govdelivery.com/track?type=click&enid=ZWFzPTE=${'&&&1'.repeat(50_000)}`,
    )
    const start = performance.now()

    unwrapGovdelivery(url)

    expect(performance.now() - start).toBeLessThan(1000)
  })
})
