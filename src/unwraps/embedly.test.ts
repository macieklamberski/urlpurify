import { describe, expect, it } from 'bun:test'
import { unwrapEmbedly } from './embedly.js'

describe('unwrapEmbedly', () => {
  it('should extract target from cdn.embedly.com src param', () => {
    const url = new URL(
      'https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fexample.com%2Fembed',
    )

    expect(unwrapEmbedly(url)).toBe('https://example.com/embed')
  })

  it('should give a protocol-relative src the https scheme', () => {
    const url = new URL(
      'https://cdn.embedly.com/widgets/media.html?src=%2F%2Fe.example.com%2Fembed.html%230%2F94329204&display_name=Issuu&url=https%3A%2F%2Fexample.com%2Fdocs%2Freport&type=text%2Fhtml&schema=issuu',
    )

    expect(unwrapEmbedly(url)).toBe('https://e.example.com/embed.html#0/94329204')
  })

  it('should return undefined for a protocol-relative src without a host', () => {
    const url = new URL('https://cdn.embedly.com/widgets/media.html?src=%2F%2F%2Fembed.html')

    expect(unwrapEmbedly(url)).toBeUndefined()
  })

  it('should return undefined for a root-relative src', () => {
    const url = new URL('https://cdn.embedly.com/widgets/media.html?src=%2Frelative%2Fpath')

    expect(unwrapEmbedly(url)).toBeUndefined()
  })

  it('should return undefined when src param is missing', () => {
    const url = new URL('https://cdn.embedly.com/widgets/media.html?other=value')

    expect(unwrapEmbedly(url)).toBeUndefined()
  })

  it('should return undefined for non-Embedly hosts', () => {
    const url = new URL('https://example.com/widgets/media.html?src=https%3A%2F%2Fother.com')

    expect(unwrapEmbedly(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://cdn.embedly.com/widgets/other.html?src=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapEmbedly(url)).toBeUndefined()
  })
})
