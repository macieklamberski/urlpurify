import { describe, expect, it } from 'bun:test'
import { unwrapInstapaperSave } from './instapaperSave.js'

describe('unwrapInstapaperSave', () => {
  it('should extract the page from a save link', () => {
    const value = new URL(
      'http://www.instapaper.com/hello2?url=http%3A%2F%2Fexample.com%2F%3Fu%3Dde9f45d125dffa47919a18815%26id%3Dfd9bc8c35a&title=Digital%20Rights%20in%20Russia',
    )
    const expected = 'http://example.com/?u=de9f45d125dffa47919a18815&id=fd9bc8c35a'

    expect(unwrapInstapaperSave(value)).toBe(expected)
  })

  it('should extract the page beside a title and description', () => {
    const value = new URL(
      'https://www.instapaper.com/hello2?url=https%3A%2F%2Fexample.com%2F2021-qatar-gp-race-pace%2F&title=2021+Qatar+GP%3A+Race+pace&description=Let%27s+take+a+look',
    )
    const expected = 'https://example.com/2021-qatar-gp-race-pace/'

    expect(unwrapInstapaperSave(value)).toBe(expected)
  })

  it('should extract an unencoded page from a save link', () => {
    const value = new URL(
      'http://www.instapaper.com/hello2?url=http://example.com/blog/How-I-built-my-blog-in-one-day',
    )
    const expected = 'http://example.com/blog/How-I-built-my-blog-in-one-day'

    expect(unwrapInstapaperSave(value)).toBe(expected)
  })

  it('should extract the page from the edit form', () => {
    const value = new URL(
      'http://www.instapaper.com/edit?url=https%3A%2F%2Fwww.example.com%2Fduh-nothing-is-free%2F20%2F12%2F2023%2F&title=DUH%21%20Nothing%20is%20FREE',
    )
    const expected = 'https://www.example.com/duh-nothing-is-free/20/12/2023/'

    expect(unwrapInstapaperSave(value)).toBe(expected)
  })

  it('should extract the page on the bare host', () => {
    const value = new URL('https://instapaper.com/hello2?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapInstapaperSave(value)).toBe(expected)
  })

  it('should extract a twice-encoded page', () => {
    const value = new URL(
      'https://www.instapaper.com/hello2?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapInstapaperSave(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.instapaper.com/Hello2?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapInstapaperSave(value)).toBe(expected)
  })

  it('should return undefined when the url param is missing', () => {
    const value = new URL('https://www.instapaper.com/hello2?title=Hello')

    expect(unwrapInstapaperSave(value)).toBeUndefined()
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.instapaper.com/hello2?url=&title=Hello')

    expect(unwrapInstapaperSave(value)).toBeUndefined()
  })

  it('should return undefined for a page held only in the title', () => {
    const value = new URL(
      'https://www.instapaper.com/hello2?title=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapInstapaperSave(value)).toBeUndefined()
  })

  it('should return undefined for a page held only in the description', () => {
    const value = new URL(
      'https://www.instapaper.com/hello2?description=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapInstapaperSave(value)).toBeUndefined()
  })

  it('should return undefined for the text view', () => {
    const value = new URL('https://www.instapaper.com/text?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapInstapaperSave(value)).toBeUndefined()
  })

  it('should return undefined for another path with the url param', () => {
    const value = new URL('https://www.instapaper.com/hello?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapInstapaperSave(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/hello2?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapInstapaperSave(value)).toBeUndefined()
  })
})
