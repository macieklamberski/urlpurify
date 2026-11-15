import { describe, expect, it } from 'bun:test'
import { unwrapBuffer } from './buffer.js'

describe('unwrapBuffer', () => {
  it('should extract a raw url from bufferapp.com/add', () => {
    const value = new URL(
      'https://bufferapp.com/add?url=https://example.com/daredevil-propstore-auction/&text=Daredevil%20Propstore%20Auction',
    )
    const expected = 'https://example.com/daredevil-propstore-auction/'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should extract a percent-encoded url from bufferapp.com/add', () => {
    const value = new URL(
      'https://bufferapp.com/add?url=https%3A%2F%2Fexample.com%2F2021-abu-dhabi-gp-fight-for-pole%2F&text=2021+Abu+Dhabi+GP%3A+Fight+for+pole&via=example&picture=&count=horizontal&source=button',
    )
    const expected = 'https://example.com/2021-abu-dhabi-gp-fight-for-pole/'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should extract a url from buffer.com/add', () => {
    const value = new URL(
      'https://buffer.com/add?url=https%3A%2F%2Fexample.com%2F2018%2F12%2F193-top-11-christmas-gifts-men-2018-podcast.html&title=193%3A%20Top%2011%20Christmas%20Gifts',
    )
    const expected = 'https://example.com/2018/12/193-top-11-christmas-gifts-men-2018-podcast.html'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should keep the query of an encoded target', () => {
    const value = new URL(
      'https://buffer.com/add?url=https%3A%2F%2Fexample.com%2F2024%2F06%2F27%2Fsecond-acts%2F%3Ffbclid%3DIwY2xjawSrVh5',
    )
    const expected = 'https://example.com/2024/06/27/second-acts/?fbclid=IwY2xjawSrVh5'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should extract a url from a path with a trailing slash', () => {
    const value = new URL('https://www.buffer.com/add/?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should extract a url from publish.buffer.com/compose', () => {
    const value = new URL(
      'https://publish.buffer.com/compose?url=https%3A%2F%2Fexample.com%2Fpost&text=Hello',
    )
    const expected = 'https://example.com/post'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://bufferapp.com/Add?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should decode a twice-encoded url', () => {
    const value = new URL('https://bufferapp.com/add?url=https%253A%252F%252Fexample.com%252Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should extract url and ignore a url held in text', () => {
    const value = new URL(
      'https://bufferapp.com/add?text=https%3A%2F%2Fexample.org%2Fother&url=https%3A%2F%2Fexample.com%2Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapBuffer(value)).toBe(expected)
  })

  it('should return undefined for a url held only in text', () => {
    const value = new URL('https://bufferapp.com/add?text=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapBuffer(value)).toBeUndefined()
  })

  it('should return undefined for an empty url', () => {
    const value = new URL('https://bufferapp.com/add?url=&text=Hello')

    expect(unwrapBuffer(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://buffer.com/pricing?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapBuffer(value)).toBeUndefined()
  })

  it('should return undefined for the add path on publish.buffer.com', () => {
    const value = new URL('https://publish.buffer.com/add?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapBuffer(value)).toBeUndefined()
  })

  it('should return undefined for the compose path on buffer.com', () => {
    const value = new URL('https://buffer.com/compose?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapBuffer(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://example.com/add?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapBuffer(value)).toBeUndefined()
  })
})
