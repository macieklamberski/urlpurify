import { describe, expect, it } from 'bun:test'
import { unwrapTechnoratiFaves } from './technoratiFaves.js'

describe('unwrapTechnoratiFaves', () => {
  it('should extract the page from faves', () => {
    const value = new URL(
      'http://www.technorati.com/faves?add=http://www.example.com/News/archives/899',
    )
    const expected = 'http://www.example.com/News/archives/899'

    expect(unwrapTechnoratiFaves(value)).toBe(expected)
  })

  it('should extract a percent-encoded page', () => {
    const value = new URL(
      'http://www.technorati.com/faves?add=http%3A%2F%2Fexample.wordpress.com%2F2011%2F08%2F24%2F',
    )
    const expected = 'http://example.wordpress.com/2011/08/24/'

    expect(unwrapTechnoratiFaves(value)).toBe(expected)
  })

  it('should extract the page from the faves button with sub=addfavbtn', () => {
    const value = new URL(
      'http://technorati.com/faves?sub=addfavbtn&add=http://example.blogspot.com',
    )
    const expected = 'http://example.blogspot.com'

    expect(unwrapTechnoratiFaves(value)).toBe(expected)
  })

  it('should extract the page from faves with a trailing slash', () => {
    const value = new URL('http://technorati.com/faves/?add=http%3A%2F%2Fexample.blog.com%2F')
    const expected = 'http://example.blog.com/'

    expect(unwrapTechnoratiFaves(value)).toBe(expected)
  })

  it('should end the page at the next param', () => {
    const value = new URL(
      'http://technorati.com/faves/?add=https://example.wordpress.com/2009/04/27/see-your-add-in-a-different-lens/&title=Looking',
    )
    const expected = 'https://example.wordpress.com/2009/04/27/see-your-add-in-a-different-lens/'

    expect(unwrapTechnoratiFaves(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL(
      'https://www.technorati.com/faves?add=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapTechnoratiFaves(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('http://technorati.com/Faves?add=http://example.com/post')
    const expected = 'http://example.com/post'

    expect(unwrapTechnoratiFaves(value)).toBe(expected)
  })

  it('should return undefined when the add param is missing', () => {
    const value = new URL('http://technorati.com/faves?sub=addfavbtn')

    expect(unwrapTechnoratiFaves(value)).toBeUndefined()
  })

  it('should return undefined when the add param is empty', () => {
    const value = new URL('http://technorati.com/faves?add=')

    expect(unwrapTechnoratiFaves(value)).toBeUndefined()
  })

  it('should extract the page from a user faves page', () => {
    const value = new URL('http://technorati.com/faves/infodepot?add=http://example.blogspot.com/')
    const expected = 'http://example.blogspot.com/'

    expect(unwrapTechnoratiFaves(value)).toBe(expected)
  })

  it('should return undefined for a user faves tag page', () => {
    const value = new URL(
      'http://technorati.com/faves/infodepot/tag/news?add=http://example.blogspot.com/',
    )

    expect(unwrapTechnoratiFaves(value)).toBeUndefined()
  })

  it('should return undefined for the cosmos search', () => {
    const value = new URL(
      'http://www.technorati.com/cosmos/search.html?add=http://example.com/archives/2004/07/19/rss.html',
    )

    expect(unwrapTechnoratiFaves(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('http://www.example.com/faves?add=http://example.org/post')

    expect(unwrapTechnoratiFaves(value)).toBeUndefined()
  })
})
