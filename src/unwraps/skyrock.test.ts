import { describe, expect, it } from 'bun:test'
import { unwrapSkyrock } from './skyrock.js'

describe('unwrapSkyrock', () => {
  it('should extract target from url param', () => {
    const url = new URL('http://www.skyrock.com/r?url=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapSkyrock(url)).toBe('http://www.example.com/')
  })

  it('should extract an unencoded target', () => {
    const url = new URL('http://www.skyrock.com/r?url=http://www.example.com/blog/post')

    expect(unwrapSkyrock(url)).toBe('http://www.example.com/blog/post')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('http://www.skyrock.com/r?socialConnect=8')

    expect(unwrapSkyrock(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('http://www.skyrock.com/r?url=')

    expect(unwrapSkyrock(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('http://www.skyrock.com/blog/?url=http%3A%2F%2Fwww.example.com%2F')

    expect(unwrapSkyrock(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('http://www.example.com/r?url=http%3A%2F%2Fwww.example.org%2F')

    expect(unwrapSkyrock(url)).toBeUndefined()
  })
})
