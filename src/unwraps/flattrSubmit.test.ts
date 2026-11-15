import { describe, expect, it } from 'bun:test'
import { unwrapFlattrSubmit } from './flattrSubmit.js'

describe('unwrapFlattrSubmit', () => {
  it('should extract the page from an auto-submit link', () => {
    const value = new URL(
      'https://flattr.com/submit/auto?user_id=horstjens&url=http%3A%2F%2Fexample.com%2Fde:podcast:biertaucher:2017:322&title=Biertaucher%20Folge%20322&language=de_DE',
    )
    const expected = 'http://example.com/de:podcast:biertaucher:2017:322'

    expect(unwrapFlattrSubmit(value)).toBe(expected)
  })

  it('should extract the page when it comes before user_id', () => {
    const value = new URL(
      'https://flattr.com/submit/auto?url=http%3A%2F%2Fwww.example.com%2F&user_id=tfnico',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapFlattrSubmit(value)).toBe(expected)
  })

  it('should extract an unencoded page', () => {
    const value = new URL(
      'https://flattr.com/submit/auto?user_id=example&url=http://www.example.com/2014/03/folge-12/&title=Folge%2012',
    )
    const expected = 'http://www.example.com/2014/03/folge-12/'

    expect(unwrapFlattrSubmit(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL(
      'https://flattr.com/submit/auto?user_id=example&url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFlattrSubmit(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL(
      'https://flattr.com/Submit/Auto?user_id=example&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapFlattrSubmit(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://flattr.com/submit/auto?user_id=example&title=Hello')

    expect(unwrapFlattrSubmit(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://flattr.com/submit/auto?user_id=example&url=&title=Hello')

    expect(unwrapFlattrSubmit(value)).toBeUndefined()
  })

  it('should return undefined for a page in the description', () => {
    const value = new URL(
      'https://flattr.com/submit/auto?user_id=example&description=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapFlattrSubmit(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://flattr.com/profile/https://flattr.com/profile/example')

    expect(unwrapFlattrSubmit(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL(
      'https://example.com/submit/auto?user_id=example&url=https%3A%2F%2Fexample.org%2Fpost',
    )

    expect(unwrapFlattrSubmit(value)).toBeUndefined()
  })
})
