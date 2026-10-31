import { describe, expect, it } from 'bun:test'
import { unwrapDrupalOembed } from './drupalOembed.js'

describe('unwrapDrupalOembed', () => {
  it('should extract the page from the frame on the site root', () => {
    const value = new URL(
      'https://www.example.org/media/oembed?url=https%3A//video.example.com/watch%3Fv%3DGSgGNh0TdEU&max_width=854&max_height=480&hash=emf9P2lvFDUqGjxvi47pOX7KH0tySfxHpmVklWSoSPw',
    )
    const expected = 'https://video.example.com/watch?v=GSgGNh0TdEU'

    expect(unwrapDrupalOembed(value)).toBe(expected)
  })

  it('should extract the page below a language prefix', () => {
    const value = new URL(
      'https://www.example.org/es/media/oembed?url=https%3A//video.example.com/Z06Kqj2TI9o&max_width=0&max_height=0&hash=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw',
    )
    const expected = 'https://video.example.com/Z06Kqj2TI9o'

    expect(unwrapDrupalOembed(value)).toBe(expected)
  })

  it('should extract the page below the front controller', () => {
    const value = new URL(
      'https://www.example.org/index.php/media/oembed?url=https%3A//video.example.com/Z06Kqj2TI9o&max_width=0&max_height=0&hash=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw',
    )
    const expected = 'https://video.example.com/Z06Kqj2TI9o'

    expect(unwrapDrupalOembed(value)).toBe(expected)
  })

  it('should extract the page next to extra module params', () => {
    const value = new URL(
      'https://www.example.org/media/oembed?url=https%3A//video.example.com/Z06Kqj2TI9o&max_width=0&max_height=0&hash=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw&blazy=1',
    )
    const expected = 'https://video.example.com/Z06Kqj2TI9o'

    expect(unwrapDrupalOembed(value)).toBe(expected)
  })

  it('should read the last url param', () => {
    const value = new URL(
      'https://www.example.org/media/oembed?url=https%3A//video.example.com/a&url=https%3A//video.example.com/b&max_width=0&max_height=0&hash=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw',
    )
    const expected = 'https://video.example.com/b'

    expect(unwrapDrupalOembed(value)).toBe(expected)
  })

  it('should extract the page with a short hash', () => {
    const value = new URL(
      'https://www.example.org/media/oembed?url=https%3A//video.example.com/Z06Kqj2TI9o&hash=abc123',
    )
    const expected = 'https://video.example.com/Z06Kqj2TI9o'

    expect(unwrapDrupalOembed(value)).toBe(expected)
  })

  it('should extract the page from a mixed-case path', () => {
    const value = new URL(
      'https://www.example.org/Media/oEmbed?url=https%3A//video.example.com/Z06Kqj2TI9o&max_width=0&max_height=0&hash=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw',
    )
    const expected = 'https://video.example.com/Z06Kqj2TI9o'

    expect(unwrapDrupalOembed(value)).toBe(expected)
  })

  it('should extract the page with an uppercase hash param', () => {
    const value = new URL(
      'https://www.example.org/media/oembed?url=https%3A//video.example.com/Z06Kqj2TI9o&max_width=0&max_height=0&HASH=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw',
    )
    const expected = 'https://video.example.com/Z06Kqj2TI9o'

    expect(unwrapDrupalOembed(value)).toBe(expected)
  })

  it('should return undefined without a hash', () => {
    const value = new URL(
      'https://www.example.org/media/oembed?url=https%3A//video.example.com/Z06Kqj2TI9o&max_width=0&max_height=0',
    )

    expect(unwrapDrupalOembed(value)).toBeUndefined()
  })

  it('should return undefined for an empty hash', () => {
    const value = new URL(
      'https://www.example.org/media/oembed?url=https%3A//video.example.com/Z06Kqj2TI9o&max_width=0&max_height=0&hash=',
    )

    expect(unwrapDrupalOembed(value)).toBeUndefined()
  })

  it('should return undefined for a url value that is not an http url', () => {
    const value = new URL(
      'https://www.example.org/media/oembed?url=%2Fnode%2F12&max_width=0&max_height=0&hash=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw',
    )

    expect(unwrapDrupalOembed(value)).toBeUndefined()
  })

  it('should return undefined for a path that only ends like the frame', () => {
    const value = new URL(
      'https://www.example.org/social-media/oembed?url=https%3A//video.example.com/Z06Kqj2TI9o&hash=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw',
    )

    expect(unwrapDrupalOembed(value)).toBeUndefined()
  })

  it('should return undefined for a path below the frame', () => {
    const value = new URL(
      'https://www.example.org/media/oembed/preview?url=https%3A//video.example.com/Z06Kqj2TI9o&hash=xOUa97hC51OuWc9cqUXjqr6Yj8h9chGjBIdy5GJGlgw',
    )

    expect(unwrapDrupalOembed(value)).toBeUndefined()
  })
})
