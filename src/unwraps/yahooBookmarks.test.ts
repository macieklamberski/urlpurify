import { describe, expect, it } from 'bun:test'
import { unwrapYahooBookmarks } from './yahooBookmarks.js'

describe('unwrapYahooBookmarks', () => {
  it('should extract the target from the bookmarklet with only its scheme colon encoded', () => {
    const value = new URL(
      'https://bookmarks.yahoo.com/myresults/bookmarklet?u=http%3A//www.example.com/leahs-birds&t=Leah%27s%20Birds',
    )
    const expected = 'http://www.example.com/leahs-birds'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract a target with encoded dots from the MyWeb bookmarklet', () => {
    const value = new URL(
      'http://myweb2.search.yahoo.com/myresults/bookmarklet?t=Why%20I%20Love%20Israel&u=http%3A%2F%2Fexample%2Ecom%2F2008%2F05%2F11%2Fi%2Dlove%2Dthis%2Dcountry%2F',
    )
    const expected = 'http://example.com/2008/05/11/i-love-this-country/'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract a raw target from the bookmarklet on myweb.yahoo.com', () => {
    const value = new URL(
      'http://myweb.yahoo.com/myresults/bookmarklet?u=http://example.com/&t=Condividi',
    )
    const expected = 'http://example.com/'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should cut a raw target at the first & of its own query', () => {
    const value = new URL(
      'http://myweb2.search.yahoo.com/myresults/bookmarklet?u=http://www.example.org/blogs/index.php?blog=1&title=cloud_based_hosted_exchange_mailbox_avai&more=1&c=1&tb=1&pb=1&=Cloud-based',
    )
    const expected = 'http://www.example.org/blogs/index.php?blog=1'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract the target from the toolbar save form', () => {
    const value = new URL(
      'http://bookmarks.yahoo.com/toolbar/savebm?opener=tb&u=https%3A%2F%2Fwww.example.com%2Fchina-not-yet-superpower&t=CHINA%2C%20NOT%20YET%20A%20SUPERPOWER&d=China%20has%20surpassed%20the%20United%20States',
    )
    const expected = 'https://www.example.com/china-not-yet-superpower'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract the target from the Buzz button', () => {
    const value = new URL(
      'http://buzz.yahoo.com/buzz?targetUrl=http%3A%2F%2Fexample.com%2F2011%2F12%2F15%2Fwhats-so-bad-about-sopa%2F&headline=What%27s%20So%20Bad%20About%20SOPA%3F',
    )
    const expected = 'http://example.com/2011/12/15/whats-so-bad-about-sopa/'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should keep the escapes of the target path from the Buzz button', () => {
    const value = new URL(
      'http://buzz.yahoo.com/buzz?targetUrl=http%3A%2F%2Fwww.example.com%2Ftraining-program-%25E2%2580%259Cstress-management%25E2%2580%259D-5th-october-2013&headline=Training+Program',
    )
    const expected =
      'http://www.example.com/training-program-%E2%80%9Cstress-management%E2%80%9D-5th-october-2013'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract a raw target from the Buzz button on uk.buzz.yahoo.com', () => {
    const value = new URL(
      'http://uk.buzz.yahoo.com/buzz?publisherurn=theindepende_417&targetUrl=http://www.example.org/life-style/food-and-drink/news/forget-hummus-2374670.html&title=Forget',
    )
    const expected =
      'http://www.example.org/life-style/food-and-drink/news/forget-hummus-2374670.html'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://bookmarks.yahoo.com/myresults/bookmarklet?u=https%253A%252F%252Fexample.com%252Fpost&t=Post',
    )
    const expected = 'https://example.com/post'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://bookmarks.yahoo.com/MyResults/Bookmarklet?u=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should return undefined when the bookmarklet carries a url only in its title', () => {
    const value = new URL(
      'http://myweb2.search.yahoo.com/myresults/bookmarklet?t=http://example.com/2007/05/dairy-cows-read-writing-on-wall.html',
    )

    expect(unwrapYahooBookmarks(value)).toBeUndefined()
  })

  it('should fall back to guid when targetUrl is empty', () => {
    const value = new URL(
      'http://buzz.yahoo.com/buzz?publisherurn=nbc_philadelp610&guid=http%3A%2F%2Fwww.example.com%2Fnews%2Flocal-beat%2Fstory-99292304.html&targetUrl=',
    )
    const expected = 'http://www.example.com/news/local-beat/story-99292304.html'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract the guid from the Buzz button on fr.buzz.yahoo.com', () => {
    const value = new URL(
      'http://fr.buzz.yahoo.com/buzz?publisherurn=lemondefr_227&guid=http%3A%2F%2Fwww.example.org%2Fopinions%2Farticle%2F2010%2F05%2F06%2Fpendant-ce-temps-en-cote-d-ivoire_1347571_3232.html&targetUrl=',
    )
    const expected =
      'http://www.example.org/opinions/article/2010/05/06/pendant-ce-temps-en-cote-d-ivoire_1347571_3232.html'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract the target from the Buzz submit form', () => {
    const value = new URL(
      'http://buzz.yahoo.com/submit/?submitUrl=http%3A%2F%2Fexample.com%2F2015%2F03%2F31%2Fapril-on-the-cheap-highlights%2F&submitHeadline=April%20on%20the%20Cheap%20Highlights',
    )
    const expected = 'http://example.com/2015/03/31/april-on-the-cheap-highlights/'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should extract a raw target from the Buzz submit form without a trailing slash', () => {
    const value = new URL(
      'http://buzz.yahoo.com/submit?submitUrl=http://www.example.com/blog/7-warning-signs-your-marriage-is-in-trouble/&submitHeadline=7+Warning+Signs',
    )
    const expected = 'http://www.example.com/blog/7-warning-signs-your-marriage-is-in-trouble/'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should read u when submitUrl holds the title', () => {
    const value = new URL(
      'http://buzz.yahoo.com/submit?submitUrl=A+cool+picture&u=https%3A%2F%2Fexample.com%2Fwp%2F%3Fp%3D2704',
    )
    const expected = 'https://example.com/wp/?p=2704'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should read u when submitUrl holds a title with a colon', () => {
    const value = new URL(
      'http://buzz.yahoo.com/submit?submitUrl=1986%3A+the+year+of+Artificial+Intelligence&u=https%3A%2F%2Fexample.com%2Fwp%2F%3Fp%3D2690',
    )
    const expected = 'https://example.com/wp/?p=2690'

    expect(unwrapYahooBookmarks(value)).toBe(expected)
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'http://bookmarks.yahoo.com/config/set_bookmark?.folder=10&u=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapYahooBookmarks(value)).toBeUndefined()
  })

  it('should return undefined for another path on the Buzz host', () => {
    const value = new URL(
      'http://buzz.yahoo.com/article/forbes?targetUrl=https%3A%2F%2Fexample.com%2Fpost&submitUrl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapYahooBookmarks(value)).toBeUndefined()
  })

  it('should return undefined for a path that starts with the Buzz submit path', () => {
    const value = new URL(
      'http://buzz.yahoo.com/submitted?submitUrl=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapYahooBookmarks(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/myresults/bookmarklet?u=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapYahooBookmarks(value)).toBeUndefined()
  })

  it('should return undefined for the toolbar shape on another host', () => {
    const value = new URL(
      'https://www.example.com/toolbar/savebm?u=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapYahooBookmarks(value)).toBeUndefined()
  })

  it('should return undefined for the Buzz shape on another host', () => {
    const value = new URL('https://www.example.com/buzz?targetUrl=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapYahooBookmarks(value)).toBeUndefined()
  })

  it('should return undefined for the Buzz submit shape on another host', () => {
    const value = new URL(
      'https://www.example.com/submit?submitUrl=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapYahooBookmarks(value)).toBeUndefined()
  })
})
