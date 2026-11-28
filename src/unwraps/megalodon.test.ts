import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapperHosts } from '../utils.js'
import { unwrapMegalodon } from './megalodon.js'

describe('unwrapMegalodon', () => {
  it('should repair a target the CMS spaced after its scheme', () => {
    const value = 'https://megalodon.jp/2020-0101-0000-00/http://%20https://www.example.com/page'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapMegalodon] })).toBe(expected)
  })

  it('should decode a percent-encoded target', () => {
    const value =
      'https://megalodon.jp/2020-0101-0000-00/https%3A%2F%2Fwww.example.com%2Fpage%3Fid%3D1'
    const expected = 'https://www.example.com/page?id=1'

    expect(purifyUrl(value, { unwrappers: [unwrapMegalodon] })).toBe(expected)
  })

  it('should extract target from an https snapshot', () => {
    const value = new URL(
      'https://megalodon.jp/2023-0213-1416-54/https://www.example.com:443/co_seko_voice/173.html',
    )
    const expected = 'https://www.example.com:443/co_seko_voice/173.html'

    expect(unwrapMegalodon(value)).toBe(expected)
  })

  it('should add the http scheme to a target stored without one', () => {
    const value = new URL('http://megalodon.jp/2012-0607-1850-18/www.example.com/cache/page.html')
    const expected = 'http://www.example.com/cache/page.html'

    expect(unwrapMegalodon(value)).toBe(expected)
  })

  it('should extract target from a snapshot on a numbered host', () => {
    const value = new URL(
      'http://s02.megalodon.jp/2008-0219-1451-14/www3.example.com/news/2008/02/19/d20080219000037.html',
    )
    const expected = 'http://www3.example.com/news/2008/02/19/d20080219000037.html'

    expect(unwrapMegalodon(value)).toBe(expected)
  })

  it('should return undefined for a host that only ends with a numbered host', () => {
    const value = new URL('http://xs02.megalodon.jp/2008-0219-1451-14/www3.example.com/news.html')

    expect(unwrapMegalodon(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with a numbered host', () => {
    const value = new URL(
      'http://s02.megalodon.jp.example.com/2008-0219-1451-14/www3.example.com/news.html',
    )

    expect(unwrapMegalodon(value)).toBeUndefined()
  })

  it('should return undefined for a numbered host with three digits', () => {
    const value = new URL('http://s002.megalodon.jp/2008-0219-1451-14/www3.example.com/news.html')

    expect(unwrapMegalodon(value)).toBeUndefined()
  })

  it('should keep the query and fragment of the target', () => {
    const value = new URL(
      'https://megalodon.jp/2024-1027-0030-50/https://example.com:443/status/1850194155626217909?t=rZTzLHtz&s=19#reply',
    )
    const expected = 'https://example.com:443/status/1850194155626217909?t=rZTzLHtz&s=19#reply'

    expect(unwrapMegalodon(value)).toBe(expected)
  })

  it('should return undefined for a snapshot with no target', () => {
    const value = new URL('https://megalodon.jp/2023-0213-1416-54/')

    expect(unwrapMegalodon(value)).toBeUndefined()
  })

  it('should keep the wrapper for a non-http target', () => {
    const value = 'https://megalodon.jp/2023-0213-1416-54/ftp://example.com/file'

    expect(purifyUrl(value, { unwrappers: [unwrapMegalodon] })).toBe(value)
  })

  it('should return undefined for the snapshot list lookup', () => {
    const value = new URL('https://megalodon.jp/?url=https://www.example.com/')

    expect(unwrapMegalodon(value)).toBeUndefined()
  })

  it('should return undefined for a timestamp of another shape', () => {
    const value = new URL('https://megalodon.jp/20230213141654/https://www.example.com/')

    expect(unwrapMegalodon(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/2023-0213-1416-54/https://www.example.org/')

    expect(unwrapMegalodon(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapMegalodon)).toBe(true)
  })
})
