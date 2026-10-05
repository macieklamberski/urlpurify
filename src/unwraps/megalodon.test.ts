import { describe, expect, it } from 'bun:test'
import { unwrapMegalodon } from './megalodon.js'

describe('unwrapMegalodon', () => {
  it('should extract target from an https snapshot', () => {
    const url = new URL(
      'https://megalodon.jp/2023-0213-1416-54/https://www.example.com:443/co_seko_voice/173.html',
    )

    expect(unwrapMegalodon(url)).toBe('https://www.example.com:443/co_seko_voice/173.html')
  })

  it('should add the http scheme to a target stored without one', () => {
    const url = new URL('http://megalodon.jp/2012-0607-1850-18/www.example.com/cache/page.html')

    expect(unwrapMegalodon(url)).toBe('http://www.example.com/cache/page.html')
  })

  it('should keep the query and fragment of the target', () => {
    const url = new URL(
      'https://megalodon.jp/2024-1027-0030-50/https://example.com:443/status/1850194155626217909?t=rZTzLHtz&s=19#reply',
    )

    expect(unwrapMegalodon(url)).toBe(
      'https://example.com:443/status/1850194155626217909?t=rZTzLHtz&s=19#reply',
    )
  })

  it('should return undefined for a snapshot with no target', () => {
    const url = new URL('https://megalodon.jp/2023-0213-1416-54/')

    expect(unwrapMegalodon(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL('https://megalodon.jp/2023-0213-1416-54/ftp://example.com/file')

    expect(unwrapMegalodon(url)).toBeUndefined()
  })

  it('should return undefined for the snapshot list lookup', () => {
    const url = new URL('https://megalodon.jp/?url=https://www.example.com/')

    expect(unwrapMegalodon(url)).toBeUndefined()
  })

  it('should return undefined for a timestamp of another shape', () => {
    const url = new URL('https://megalodon.jp/20230213141654/https://www.example.com/')

    expect(unwrapMegalodon(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/2023-0213-1416-54/https://www.example.org/')

    expect(unwrapMegalodon(url)).toBeUndefined()
  })
})
