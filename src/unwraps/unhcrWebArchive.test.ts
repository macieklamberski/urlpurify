import { describe, expect, it } from 'bun:test'
import { unwrapUnhcrWebArchive } from './unhcrWebArchive.js'

describe('unwrapUnhcrWebArchive', () => {
  it('should extract the target from a snapshot', () => {
    const url = new URL(
      'https://webarchive.archive.unhcr.org/20230529095740/https://www.example.org/docid/3ae6ad824c.html',
    )

    expect(unwrapUnhcrWebArchive(url)).toBe('https://www.example.org/docid/3ae6ad824c.html')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://webarchive.archive.unhcr.org/20230519120741/https://www.example.org/cgi-bin/texis?docid=5757#top',
    )

    expect(unwrapUnhcrWebArchive(url)).toBe('https://www.example.org/cgi-bin/texis?docid=5757#top')
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://webarchive.archive.unhcr.org/20230529095740/')

    expect(unwrapUnhcrWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'https://webarchive.archive.unhcr.org/20230529095740/ftp://example.org/file.txt',
    )

    expect(unwrapUnhcrWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for a path with another segment before the timestamp', () => {
    const url = new URL(
      'https://webarchive.archive.unhcr.org/web/20230529095740/https://www.example.org/',
    )

    expect(unwrapUnhcrWebArchive(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://www.unhcr.org/20230529095740/https://www.example.org/')

    expect(unwrapUnhcrWebArchive(url)).toBeUndefined()
  })
})
