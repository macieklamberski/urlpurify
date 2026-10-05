import { describe, expect, it } from 'bun:test'
import { unwrapLocWebArchive } from './locWebArchive.js'

describe('unwrapLocWebArchive', () => {
  it('should extract the target from a snapshot in the all collection', () => {
    const url = new URL(
      'http://webarchive.loc.gov/all/20021104074223/http://www.example.org/wcf1/wcf1_home.htm',
    )

    expect(unwrapLocWebArchive(url)).toBe('http://www.example.org/wcf1/wcf1_home.htm')
  })

  it('should extract the target from a snapshot in the legacy collection', () => {
    const url = new URL('https://webarchive.loc.gov/legacy/20020913003847/http://www.example.com/')

    expect(unwrapLocWebArchive(url)).toBe('http://www.example.com/')
  })

  it('should extract the target from a snapshot in the congressional-record collection', () => {
    const url = new URL(
      'http://webarchive.loc.gov/congressional-record/20160304132756/http://www.example.gov/cgi-bin/query',
    )

    expect(unwrapLocWebArchive(url)).toBe('http://www.example.gov/cgi-bin/query')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://webarchive.loc.gov/all/20100407191015/http://www.example.edu/page.php?id=7#authors',
    )

    expect(unwrapLocWebArchive(url)).toBe('http://www.example.edu/page.php?id=7#authors')
  })

  it('should return undefined for the wildcard listing', () => {
    const url = new URL('https://webarchive.loc.gov/all/*/https://www.example.org/')

    expect(unwrapLocWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://webarchive.loc.gov/all/20021104074223/')

    expect(unwrapLocWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://webarchive.loc.gov/all/20021104074223/ftp://example.org/file.txt')

    expect(unwrapLocWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a partial timestamp', () => {
    const url = new URL('https://webarchive.loc.gov/all/2010/http://www.example.org/')

    expect(unwrapLocWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a numbered lcwa collection', () => {
    const url = new URL(
      'http://webarchive.loc.gov/lcwa0006/20230515014734/https://www.example.co.uk/',
    )

    expect(unwrapLocWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a path outside the collections', () => {
    const url = new URL('https://webarchive.loc.gov/search/20021104074223/http://www.example.org/')

    expect(unwrapLocWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for the archive home page', () => {
    const url = new URL('https://webarchive.loc.gov/all/')

    expect(unwrapLocWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://www.loc.gov/all/20021104074223/http://www.example.org/')

    expect(unwrapLocWebArchive(url)).toBeUndefined()
  })
})
