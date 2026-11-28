import { describe, expect, it } from 'bun:test'
import { unwrapSkyrock } from './skyrock.js'

describe('unwrapSkyrock', () => {
  it('should extract target from url param', () => {
    const value = new URL('http://www.skyrock.com/r?url=http%3A%2F%2Fwww.example.com%2F')
    const expected = 'http://www.example.com/'

    expect(unwrapSkyrock(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL('http://www.skyrock.com/r?url=http://www.example.com/blog/post')
    const expected = 'http://www.example.com/blog/post'

    expect(unwrapSkyrock(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('http://www.skyrock.com/r?socialConnect=8')

    expect(unwrapSkyrock(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('http://www.skyrock.com/r?url=')

    expect(unwrapSkyrock(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('http://www.skyrock.com/blog/?url=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapSkyrock(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL('http://www.example.com/r?url=http%3A%2F%2Fwww.example.org%2F')

    expect(unwrapSkyrock(value)).toBeUndefined()
  })
})
