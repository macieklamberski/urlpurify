import { describe, expect, it } from 'bun:test'
import { unwrapIngenious } from './ingenious.js'

describe('unwrapIngenious', () => {
  it('should extract a percent-encoded target from url param', () => {
    const url = new URL(
      'https://pvn.saturn.de/trck/eclick/ea7f1008243bc25a1c4ec20941e8fae8?url=https%3A%2F%2Fwww.example.com%2F&subid=rss',
    )

    expect(unwrapIngenious(url)).toBe('https://www.example.com/')
  })

  it('should extract a plain target from url param', () => {
    const url = new URL(
      'https://pvn.saturn.de/trck/eclick/7412cf7a122f7901d24f26db95f0b13a?subid=rss&url=https://www.example.com/de/product/_apple-iphone-17-pro',
    )

    expect(unwrapIngenious(url)).toBe('https://www.example.com/de/product/_apple-iphone-17-pro')
  })

  it('should decode a base64 target from url64fb param', () => {
    const url = new URL(
      'https://pvn.mediamarkt.de/trck/eclick/bc2c033a08ca185f1d7cc85fb02db46b?prodid=2999526&fid=8&url64fb=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vZGUvcHJvZHVjdC9fbXNpLXByby1tcDM0MWNxd2RlLTI5OTk1MjYuaHRtbA==',
    )

    expect(unwrapIngenious(url)).toBe(
      'https://www.example.com/de/product/_msi-pro-mp341cqwde-2999526.html',
    )
  })

  it('should return undefined for a non-http base64 target', () => {
    const url = new URL(
      'https://pvn.mediamarkt.de/trck/eclick/bc2c033a08ca185f1d7cc85fb02db46b?url64fb=amF2YXNjcmlwdDphbGVydCgxKQ==',
    )

    expect(unwrapIngenious(url)).toBeUndefined()
  })

  it('should return undefined when both carriers are missing', () => {
    const url = new URL(
      'https://pvn.saturn.de/trck/eclick/ea7f1008243bc25a1c4ec20941e8fae8?subid=rss',
    )

    expect(unwrapIngenious(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracking host', () => {
    const url = new URL(
      'https://pvn.saturn.de/trck/eview/ea7f1008243bc25a1c4ec20941e8fae8?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapIngenious(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/trck/eclick/ea7f1008243bc25a1c4ec20941e8fae8?url=https%3A%2F%2Fwww.example.org%2F',
    )

    expect(unwrapIngenious(url)).toBeUndefined()
  })
})
