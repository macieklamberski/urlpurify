import { describe, expect, it } from 'bun:test'
import { unwrapSlashdotBookmark } from './slashdotBookmark.js'

describe('unwrapSlashdotBookmark', () => {
  it('should extract a target with only its colon encoded', () => {
    const value = new URL(
      'https://slashdot.org/bookmark.pl?url=https%3A//www.example.com/wa-birds&title=Greetings%20from%20Western%20Australia',
    )
    const expected = 'https://www.example.com/wa-birds'

    expect(unwrapSlashdotBookmark(value)).toBe(expected)
  })

  it('should extract a percent-encoded target after the title and keep its query', () => {
    const value = new URL(
      'http://slashdot.org/bookmark.pl?title=Gulfshore+Life+Weekend+Insider+-+January+21%2C+2010&url=http%3A%2F%2Fus1.example.com%2F%3Fu%3D90b255b20087b1d87f7762948%26id%3Df4f8eaf188',
    )
    const expected = 'http://us1.example.com/?u=90b255b20087b1d87f7762948&id=f4f8eaf188'

    expect(unwrapSlashdotBookmark(value)).toBe(expected)
  })

  it('should extract a raw target on www.slashdot.org', () => {
    const value = new URL(
      'http://www.slashdot.org/bookmark.pl?url=http://blog.example.com/2021/03/23/sravnitelnyj-analiz-avtokresel-gruppy-2-3-3-12-let&title=%D0%A1%D1%80%D0%B0%D0%B2%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9',
    )
    const expected =
      'http://blog.example.com/2021/03/23/sravnitelnyj-analiz-avtokresel-gruppy-2-3-3-12-let'

    expect(unwrapSlashdotBookmark(value)).toBe(expected)
  })

  it('should extract the target from the slashdot-it.pl badge', () => {
    const value = new URL(
      'http://slashdot.org/slashdot-it.pl?op=basic&url=http%3A%2F%2Fexample.blogspot.com%2F2010%2F08%2Fhow-development-time-impacts-roi.html',
    )
    const expected = 'http://example.blogspot.com/2010/08/how-development-time-impacts-roi.html'

    expect(unwrapSlashdotBookmark(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://slashdot.org/bookmark.pl?url=https%253A%252F%252Fexample.com%252Fpost&title=Post',
    )
    const expected = 'https://example.com/post'

    expect(unwrapSlashdotBookmark(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://slashdot.org/Bookmark.pl?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapSlashdotBookmark(value)).toBe(expected)
  })

  it('should return undefined when only the title holds a url', () => {
    const value = new URL('https://slashdot.org/bookmark.pl?title=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapSlashdotBookmark(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://slashdot.org/bookmark.pl?url=&title=Post')

    expect(unwrapSlashdotBookmark(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://slashdot.org/index2.pl?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapSlashdotBookmark(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://www.example.com/bookmark.pl?url=https%3A%2F%2Fexample.org%2Fpost&title=Post',
    )

    expect(unwrapSlashdotBookmark(value)).toBeUndefined()
  })
})
