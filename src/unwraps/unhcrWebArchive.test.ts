import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapUnhcrWebArchive } from './unhcrWebArchive.js'

describe('unwrapUnhcrWebArchive', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://webarchive.archive.unhcr.org/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapUnhcrWebArchive] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://webarchive.archive.unhcr.org/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapUnhcrWebArchive] })).toBe(expected)
  })

  it('should extract the target from a snapshot', () => {
    const value = new URL(
      'https://webarchive.archive.unhcr.org/20230529095740/https://www.example.org/docid/3ae6ad824c.html',
    )
    const expected = 'https://www.example.org/docid/3ae6ad824c.html'

    expect(unwrapUnhcrWebArchive(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://webarchive.archive.unhcr.org/20230519120741/https://www.example.org/cgi-bin/texis?docid=5757#top',
    )
    const expected = 'https://www.example.org/cgi-bin/texis?docid=5757#top'

    expect(unwrapUnhcrWebArchive(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://webarchive.archive.unhcr.org/20230529095740/')

    expect(unwrapUnhcrWebArchive(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://webarchive.archive.unhcr.org/20230529095740/ftp://example.org/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapUnhcrWebArchive] })).toBe(value)
  })

  it('should return undefined for a partial timestamp', () => {
    const value = new URL('https://webarchive.archive.unhcr.org/2023/https://www.example.org/')

    expect(unwrapUnhcrWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for a path with another segment before the timestamp', () => {
    const value = new URL(
      'https://webarchive.archive.unhcr.org/web/20230529095740/https://www.example.org/',
    )

    expect(unwrapUnhcrWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://www.unhcr.org/20230529095740/https://www.example.org/')

    expect(unwrapUnhcrWebArchive(value)).toBeUndefined()
  })
})
