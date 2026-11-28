import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapGovdelivery } from './govdelivery.js'

const prefix =
  'http://links.govdelivery.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&114&&&'

describe('unwrapGovdelivery', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://links.govdelivery.com/track?type=click&enid=1&&&1&&&www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapGovdelivery] })).toBe(expected)
  })

  it('should extract the target after the marker', () => {
    const value = new URL(`${prefix}http://example.com`)
    const expected = 'http://example.com'

    expect(unwrapGovdelivery(value)).toBe(expected)
  })

  it('should extract the target on https', () => {
    const value = new URL(
      'https://links.govdelivery.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&102&&&https://www.example.com/atlas/index.htm',
    )
    const expected = 'https://www.example.com/atlas/index.htm'

    expect(unwrapGovdelivery(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      `${prefix}https://www.example.com/2020census?eml=gd&utm_medium=email&utm_source=govdelivery`,
    )
    const expected =
      'https://www.example.com/2020census?eml=gd&utm_medium=email&utm_source=govdelivery'

    expect(unwrapGovdelivery(value)).toBe(expected)
  })

  it('should keep the fragment of the target', () => {
    const value = new URL(`${prefix}http://example.com/ncr/oira/welcomingweek#top`)
    const expected = 'http://example.com/ncr/oira/welcomingweek#top'

    expect(unwrapGovdelivery(value)).toBe(expected)
  })

  it('should keep a later marker-like run inside the target', () => {
    const value = new URL(`${prefix}https://example.org/a&&&b?c=1`)
    const expected = 'https://example.org/a&&&b?c=1'

    expect(unwrapGovdelivery(value)).toBe(expected)
  })

  it('should return undefined for the open-tracking pixel without type=click', () => {
    const value = new URL(
      'http://links.govdelivery.com/track?enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&114&&&http://example.com',
    )

    expect(unwrapGovdelivery(value)).toBeUndefined()
  })

  it('should return undefined without the marker', () => {
    const value = new URL(
      'http://links.govdelivery.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx',
    )

    expect(unwrapGovdelivery(value)).toBeUndefined()
  })

  it('should return undefined when the count between the markers is not a number', () => {
    const value = new URL(
      'http://links.govdelivery.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&abc&&&http://example.com',
    )

    expect(unwrapGovdelivery(value)).toBeUndefined()
  })

  it('should decode a percent-encoded target', () => {
    const value = `${prefix}https%3A%2F%2Fwww.example.com%2Fbusiness%3Futm_content=&utm_medium=email`
    const expected = 'https://www.example.com/business?utm_content=&utm_medium=email'

    expect(purifyUrl(value, { unwrappers: [unwrapGovdelivery] })).toBe(expected)
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'http://links.govdelivery.com/tracking?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&114&&&http://example.com',
    )

    expect(unwrapGovdelivery(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'http://links.example.com/track?type=click&enid=ZWFzPTEmbWFpbGluZ2lkPTIwMTMwMzE5LjE2Nzk4MjEx&&&114&&&http://example.com',
    )

    expect(unwrapGovdelivery(value)).toBeUndefined()
  })
})
