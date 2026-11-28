import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapLocWebArchive } from './locWebArchive.js'

describe('unwrapLocWebArchive', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://webarchive.loc.gov/all/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapLocWebArchive] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://webarchive.loc.gov/all/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapLocWebArchive] })).toBe(expected)
  })

  it('should extract the target from a snapshot in the all collection', () => {
    const value = new URL(
      'http://webarchive.loc.gov/all/20021104074223/http://www.example.org/wcf1/wcf1_home.htm',
    )
    const expected = 'http://www.example.org/wcf1/wcf1_home.htm'

    expect(unwrapLocWebArchive(value)).toBe(expected)
  })

  it('should extract the target from a snapshot in the legacy collection', () => {
    const value = new URL(
      'https://webarchive.loc.gov/legacy/20020913003847/http://www.example.com/',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapLocWebArchive(value)).toBe(expected)
  })

  it('should extract the target from a snapshot in the congressional-record collection', () => {
    const value = new URL(
      'http://webarchive.loc.gov/congressional-record/20160304132756/http://www.example.gov/cgi-bin/query',
    )
    const expected = 'http://www.example.gov/cgi-bin/query'

    expect(unwrapLocWebArchive(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://webarchive.loc.gov/all/20100407191015/http://www.example.edu/page.php?id=7#authors',
    )
    const expected = 'http://www.example.edu/page.php?id=7#authors'

    expect(unwrapLocWebArchive(value)).toBe(expected)
  })

  it('should return undefined for the wildcard listing', () => {
    const value = new URL('https://webarchive.loc.gov/all/*/https://www.example.org/')

    expect(unwrapLocWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://webarchive.loc.gov/all/20021104074223/')

    expect(unwrapLocWebArchive(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://webarchive.loc.gov/all/20021104074223/ftp://example.org/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapLocWebArchive] })).toBe(value)
  })

  it('should return undefined for a partial timestamp', () => {
    const value = new URL('https://webarchive.loc.gov/all/2010/http://www.example.org/')

    expect(unwrapLocWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for a numbered lcwa collection', () => {
    const value = new URL(
      'http://webarchive.loc.gov/lcwa0006/20230515014734/https://www.example.co.uk/',
    )

    expect(unwrapLocWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for a path outside the collections', () => {
    const value = new URL(
      'https://webarchive.loc.gov/search/20021104074223/http://www.example.org/',
    )

    expect(unwrapLocWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for the archive home page', () => {
    const value = new URL('https://webarchive.loc.gov/all/')

    expect(unwrapLocWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://www.loc.gov/all/20021104074223/http://www.example.org/')

    expect(unwrapLocWebArchive(value)).toBeUndefined()
  })
})
