import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapFriendFeed } from './friendFeed.js'

describe('unwrapFriendFeed', () => {
  it('should extract a percent-encoded target from /share?url=', () => {
    const value = new URL(
      'http://friendfeed.com/share?url=http%3A%2F%2Fregulus21.example.com%2Fpost%2F25751038%2Fsic-escort-gloria-mundi&title=Sic+Escort+gloria+mundi.%0A%0A',
    )
    const expected = 'http://regulus21.example.com/post/25751038/sic-escort-gloria-mundi'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should extract a raw target from /share?url=', () => {
    const value = new URL(
      'http://friendfeed.com/share?url=https://web3b.example.com/2009/08/21/installing-wordpress&title=راهنمای',
    )
    const expected = 'https://web3b.example.com/2009/08/21/installing-wordpress'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should extract the target from /share?link= on www.friendfeed.com', () => {
    const value = new URL(
      'http://www.friendfeed.com/share?title=7%20ottobre%3A%20altro%20che%20nuova%20resistenza%21&link=https%3A%2F%2Fwww.example.com%2Fwp%2F7-ottobre-altro-che-nuova-resistenza%2F',
    )
    const expected = 'https://www.example.com/wp/7-ottobre-altro-che-nuova-resistenza/'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should extract the target from the bookmarklet frame fragment', () => {
    const value = new URL(
      'http://friendfeed.com/share/bookmarklet/frame#title=Summer+vacation+ends&url=https://georgi.example.com/2010/08/summer-vacation-ends/',
    )
    const expected = 'https://georgi.example.com/2010/08/summer-vacation-ends/'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should extract the target from the root form', () => {
    const value = new URL(
      'http://friendfeed.com/?url=http%3A%2F%2Fwww.example.com%2Fblog%2F2017%2F02%2F15%2Fcontaminacion-radioactiva%2F&title=Contaminaci%C3%B3n+Radioactiva',
    )
    const expected = 'http://www.example.com/blog/2017/02/15/contaminacion-radioactiva/'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should keep the escapes of a target in the root form', () => {
    const value = new URL(
      'http://friendfeed.com/?url=https%3A%2F%2Fwww.example.com%2Fblog%2F2025%2F11%2F11%2Fsi-existen-%25c2%25bfcomo-serian-otros-universos-5%2F&title=Si+existen',
    )
    const expected =
      'https://www.example.com/blog/2025/11/11/si-existen-%c2%bfcomo-serian-otros-universos-5/'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should extract the target from the root form behind title', () => {
    const value = new URL(
      'http://friendfeed.com/?title=%D0%A1%D0%BC%D0%B5%D1%80%D1%82&url=http%3A%2F%2Fexample.com%2Findex.php%2F2011%2F04%2F18%2Fpost%2F',
    )
    const expected = 'http://example.com/index.php/2011/04/18/post/'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL('http://friendfeed.com/share?url=http%253A%252F%252Fexample.com%252Fpost')
    const expected = 'http://example.com/post'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('http://friendfeed.com/Share?url=http%3A%2F%2Fexample.com%2Fpost')
    const expected = 'http://example.com/post'

    expect(unwrapFriendFeed(value)).toBe(expected)
  })

  it('should never read the title param', () => {
    const value = new URL('http://friendfeed.com/share?title=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapFriendFeed(value)).toBeUndefined()
  })

  it('should never read the title param in the root form', () => {
    const value = new URL('http://friendfeed.com/?title=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapFriendFeed(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('http://friendfeed.com/share?url=&title=Title')

    expect(unwrapFriendFeed(value)).toBeUndefined()
  })

  it('should return undefined for a bookmarklet frame without a fragment url', () => {
    const value = new URL(
      'http://friendfeed.com/share/bookmarklet/frame?url=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapFriendFeed(value)).toBeUndefined()
  })

  it('should give https to a root form target without a scheme', () => {
    const value = 'http://friendfeed.com/?url=example.com/post'
    const expected = 'https://example.com/post'

    expect(purifyUrl(value, { unwrappers: [unwrapFriendFeed] })).toBe(expected)
  })

  it('should return undefined for a user page carrying the url param', () => {
    const value = new URL('http://friendfeed.com/alicetwain?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapFriendFeed(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('http://www.example.com/share?url=http%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapFriendFeed(value)).toBeUndefined()
  })
})
