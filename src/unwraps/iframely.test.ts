import { describe, expect, it } from 'bun:test'
import { unwrapIframely } from './iframely.js'

describe('unwrapIframely', () => {
  it('should extract the page from the iframe API', () => {
    const value = new URL(
      'https://cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fvideo.example.com%2FNObkWjQHNm8&v=1&app=1&key=57d2ec5998440ab74c7cf485bffd908c',
    )
    const expected = 'https://video.example.com/NObkWjQHNm8'

    expect(unwrapIframely(value)).toBe(expected)
  })

  it('should extract the page on the iframely.net host', () => {
    const value = new URL(
      'https://iframely.net/api/iframe?url=https%3A%2F%2Fvideo.example.com%2FvkG0KkjPzfs&key=a91f6c63822d2172297a7435cae7a9eb',
    )
    const expected = 'https://video.example.com/vkG0KkjPzfs'

    expect(unwrapIframely(value)).toBe(expected)
  })

  it('should return undefined without a url param', () => {
    const value = new URL('https://cdn.iframe.ly/api/iframe?key=a91f6c63822d2172297a7435cae7a9eb')

    expect(unwrapIframely(value)).toBeUndefined()
  })

  it('should return undefined for the short-id frame', () => {
    const value = new URL('https://cdn.iframe.ly/bJHGjpkY?app=1')

    expect(unwrapIframely(value)).toBeUndefined()
  })

  it('should return undefined for the iframe API path on another host', () => {
    const value = new URL('https://example.com/api/iframe?url=https%3A%2F%2Fvideo.example.com%2Fa')

    expect(unwrapIframely(value)).toBeUndefined()
  })
})
