import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapUkWebArchive } from './ukWebArchive.js'

describe('unwrapUkWebArchive', () => {
  it('should give https to a target without a scheme', () => {
    const value =
      'https://www.webarchive.org.uk/wayback/archive/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapUkWebArchive] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://www.webarchive.org.uk/wayback/archive/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapUkWebArchive] })).toBe(expected)
  })

  it('should extract the target from a snapshot', () => {
    const value = new URL(
      'https://www.webarchive.org.uk/wayback/archive/20150401120000/http://www.example.co.uk/about/',
    )
    const expected = 'http://www.example.co.uk/about/'

    expect(unwrapUkWebArchive(value)).toBe(expected)
  })

  it('should extract the target from a mp_ snapshot', () => {
    const value = new URL(
      'https://www.webarchive.org.uk/wayback/archive/20120502083322mp_/http://www.example.co.uk/report.pdf',
    )
    const expected = 'http://www.example.co.uk/report.pdf'

    expect(unwrapUkWebArchive(value)).toBe(expected)
  })

  it('should extract the target from a snapshot under the language segment', () => {
    const value = new URL(
      'https://www.webarchive.org.uk/wayback/en/archive/20190110170142/https://www.example.co.uk/news/',
    )
    const expected = 'https://www.example.co.uk/news/'

    expect(unwrapUkWebArchive(value)).toBe(expected)
  })

  it('should extract the target from a mp_ snapshot under the language segment', () => {
    const value = new URL(
      'https://www.webarchive.org.uk/wayback/en/archive/20190110170142mp_/https://www.example.co.uk/news/',
    )
    const expected = 'https://www.example.co.uk/news/'

    expect(unwrapUkWebArchive(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://www.webarchive.org.uk/wayback/archive/20100811120000/http://www.example.co.uk/page.aspx?id=42#section',
    )
    const expected = 'http://www.example.co.uk/page.aspx?id=42#section'

    expect(unwrapUkWebArchive(value)).toBe(expected)
  })

  it('should return undefined for a partial timestamp', () => {
    const value = new URL(
      'https://www.webarchive.org.uk/wayback/archive/3000/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for a wildcard timestamp', () => {
    const value = new URL(
      'http://www.webarchive.org.uk/wayback/archive/20150401120000*/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value =
      'https://www.webarchive.org.uk/wayback/archive/20150401120000/ftp://example.co.uk/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapUkWebArchive] })).toBe(value)
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://www.webarchive.org.uk/ukwa/archive/20150401120000/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for the snapshot path under another prefix', () => {
    const value = new URL(
      'https://www.webarchive.org.uk/collection/wayback/archive/20150401120000/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/wayback/archive/20150401120000/http://www.example.co.uk/about/',
    )

    expect(unwrapUkWebArchive(value)).toBeUndefined()
  })
})
