import { describe, expect, it } from 'bun:test'
import { unwrapWindowsLiveFavorites } from './windowsLiveFavorites.js'

describe('unwrapWindowsLiveFavorites', () => {
  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'https://favorites.live.com/quickadd.aspx?marklet=1&mkt=en-us&url=http%3A%2F%2Fregulus21.example.com%2Fpost%2F25751038%2Fsic-escort-gloria-mundi&top=1',
    )
    const expected = 'http://regulus21.example.com/post/25751038/sic-escort-gloria-mundi'

    expect(unwrapWindowsLiveFavorites(value)).toBe(expected)
  })

  it('should extract a target percent-encoded in lowercase hex', () => {
    const value = new URL(
      'https://favorites.live.com/quickadd.aspx?marklet=1&mkt=en-us&url=http%3a%2f%2fwww.example.com%2fArticles%2f1716-video.aspx&title=%3cem%3eVideo%3c%2fem%3e&top=1',
    )
    const expected = 'http://www.example.com/Articles/1716-video.aspx'

    expect(unwrapWindowsLiveFavorites(value)).toBe(expected)
  })

  it('should extract a raw target and leave the title', () => {
    const value = new URL(
      'https://favorites.live.com/quickadd.aspx?marklet=1&mkt=en-us&url=http://prove-parsifal.example.com/&title=Condividi',
    )
    const expected = 'http://prove-parsifal.example.com/'

    expect(unwrapWindowsLiveFavorites(value)).toBe(expected)
  })

  it('should cut a raw target at the first & of its own query', () => {
    const value = new URL(
      'https://favorites.live.com/quickadd.aspx?marklet=1&url=http://www.example.com/blogs/index.php?blog=1&title=cloud_based_hosted_exchange_mailbox_avai&more=1&c=1&tb=1&pb=1&title=Cloud-based',
    )
    const expected = 'http://www.example.com/blogs/index.php?blog=1'

    expect(unwrapWindowsLiveFavorites(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://favorites.live.com/QuickAdd.aspx?url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapWindowsLiveFavorites(value)).toBe(expected)
  })

  it('should decode a twice-encoded target', () => {
    const value = new URL(
      'https://favorites.live.com/quickadd.aspx?url=https%253A%252F%252Fexample.com%252Fpost&title=Post',
    )
    const expected = 'https://example.com/post'

    expect(unwrapWindowsLiveFavorites(value)).toBe(expected)
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://favorites.live.com/quickadd.aspx?url=&title=Post')

    expect(unwrapWindowsLiveFavorites(value)).toBeUndefined()
  })

  it('should return undefined for only the title', () => {
    const value = new URL(
      'https://favorites.live.com/quickadd.aspx?marklet=1&title=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapWindowsLiveFavorites(value)).toBeUndefined()
  })

  it('should return undefined for url on another path', () => {
    const value = new URL(
      'https://favorites.live.com/tour.aspx?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapWindowsLiveFavorites(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://favorites.example.com/quickadd.aspx?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapWindowsLiveFavorites(value)).toBeUndefined()
  })
})
