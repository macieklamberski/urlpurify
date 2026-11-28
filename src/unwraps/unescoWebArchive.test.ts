import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapUnescoWebArchive } from './unescoWebArchive.js'

describe('unwrapUnescoWebArchive', () => {
  it('should give https to a target without a scheme', () => {
    const value = 'https://webarchive.unesco.org/web/20200101000000/www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapUnescoWebArchive] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://webarchive.unesco.org/web/20200101000000/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapUnescoWebArchive] })).toBe(expected)
  })

  it('should extract the target from a snapshot', () => {
    const value = new URL(
      'https://webarchive.unesco.org/web/20230926050719/https://en.example.org/cultnatlaws/list',
    )
    const expected = 'https://en.example.org/cultnatlaws/list'

    expect(unwrapUnescoWebArchive(value)).toBe(expected)
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://webarchive.unesco.org/web/20230104165710/https://en.example.org/themes/gender?page=2#coverage',
    )
    const expected = 'https://en.example.org/themes/gender?page=2#coverage'

    expect(unwrapUnescoWebArchive(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://webarchive.unesco.org/web/20230926050719/')

    expect(unwrapUnescoWebArchive(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://webarchive.unesco.org/web/20230926050719/ftp://example.org/file.txt'

    expect(purifyUrl(value, { unwrappers: [unwrapUnescoWebArchive] })).toBe(value)
  })

  it('should return undefined for a timestamp at the root', () => {
    const value = new URL('https://webarchive.unesco.org/20151221131410/https://www.example.com/')

    expect(unwrapUnescoWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for a partial timestamp', () => {
    const value = new URL('https://webarchive.unesco.org/web/2023/https://en.example.org/')

    expect(unwrapUnescoWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://webarchive.unesco.org/search/20230926050719/https://en.example.org/',
    )

    expect(unwrapUnescoWebArchive(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://whc.unesco.org/web/20230926050719/https://en.example.org/')

    expect(unwrapUnescoWebArchive(value)).toBeUndefined()
  })
})
