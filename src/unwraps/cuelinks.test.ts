import { describe, expect, it } from 'bun:test'
import { unwrapCuelinks } from './cuelinks.js'

describe('unwrapCuelinks', () => {
  it('should extract target from url param', () => {
    const url = new URL(
      'https://linksredirect.com/?cid=186889&source=linkkit&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapCuelinks(url)).toBe('https://www.example.com/')
  })

  it('should extract a half-encoded target from url param', () => {
    const url = new URL(
      'http://linksredirect.com/?pub_id=9272CL8563&url=http%3A//www.example.com/dp/8183600166/ref%3Dsr_1_2%3Fs%3Dbooks',
    )

    expect(unwrapCuelinks(url)).toBe('http://www.example.com/dp/8183600166/ref=sr_1_2?s=books')
  })

  it('should return undefined when the url sits only in subid', () => {
    const url = new URL(
      'https://linksredirect.com/?cid=2550&subid=https://www.example.com/city/274-chennai/&source=linkkit',
    )

    expect(unwrapCuelinks(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Cuelinks host', () => {
    const url = new URL(
      'https://linksredirect.com/banner?cid=1&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapCuelinks(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/?cid=186889&url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapCuelinks(url)).toBeUndefined()
  })
})
