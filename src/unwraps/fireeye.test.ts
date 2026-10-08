import { describe, expect, it } from 'bun:test'
import { unwrapFireeye } from './fireeye.js'

describe('unwrapFireeye', () => {
  it('should extract target from the v1 path', () => {
    const url = new URL(
      'https://protect2.fireeye.com/v1/url?k=93407f2f-ccdb4639-9344362f-8681d5b5fa8e-01a4371d5adb092e&q=1&e=98882430-2b46-4dc6-90b8-29eb7702eb4c&u=https%3A%2F%2Fwww.example.com%2Fexperiences%2Fresponse-images-and-sounds-of-a-movement%2F',
    )

    expect(unwrapFireeye(url)).toBe(
      'https://www.example.com/experiences/response-images-and-sounds-of-a-movement/',
    )
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'https://protect2.fireeye.com/v1/url?k=93407f2f-ccdb4639-9344362f-8681d5b5fa8e-01a4371d5adb092e&q=1&e=98882430-2b46-4dc6-90b8-29eb7702eb4c&u=https://example.org/search/a+b',
    )

    expect(unwrapFireeye(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract target from the path without the version', () => {
    const url = new URL(
      'https://protect2.fireeye.com/url?k=a7f45eec-fb661037-a7f48a84-002590f4edde-626350e6a0c3fc1e&q=1&u=http%3A%2F%2Fexample.com%2Ftn.jsp%3Ff%3D001JsaCeX',
    )

    expect(unwrapFireeye(url)).toBe('http://example.com/tn.jsp?f=001JsaCeX')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://protect2.fireeye.com/v1/url?k=31323334-501d2dca&q=1&u=https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dfeeds%26page%3D2',
    )

    expect(unwrapFireeye(url)).toBe('https://example.com/search?q=feeds&page=2')
  })

  it('should extract target when the u param comes first', () => {
    const url = new URL(
      'https://protect2.fireeye.com/v1/url?u=https%3A%2F%2Fexample.com%2Fpage&k=31323334-501d2dca&q=1',
    )

    expect(unwrapFireeye(url)).toBe('https://example.com/page')
  })

  it('should extract a target that is another wrapper', () => {
    const url = new URL(
      'https://protect2.fireeye.com/v1/url?k=31323334-501d2dca&q=1&u=https%3A%2F%2Fnam02.safelinks.protection.outlook.com%2F%3Furl%3Dhttps%253A%252F%252Fexample.com%252F',
    )

    expect(unwrapFireeye(url)).toBe(
      'https://nam02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2F',
    )
  })

  it('should return undefined when the u param is missing', () => {
    const url = new URL('https://protect2.fireeye.com/v1/url?k=31323334-501d2dca&q=1')

    expect(unwrapFireeye(url)).toBeUndefined()
  })

  it('should return undefined when the u param is empty', () => {
    const url = new URL('https://protect2.fireeye.com/v1/url?k=31323334-501d2dca&q=1&u=')

    expect(unwrapFireeye(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const url = new URL(
      'https://protect2.fireeye.com/v1/url?k=31323334-501d2dca&q=1&u=ftp%3A%2F%2Fexample.com%2Ffile.zip',
    )

    expect(unwrapFireeye(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://protect2.fireeye.com/v1/redirect?u=https%3A%2F%2Fexample.com%2F')

    expect(unwrapFireeye(url)).toBeUndefined()
  })

  it('should return undefined for the root of the host', () => {
    const url = new URL('https://protect2.fireeye.com/')

    expect(unwrapFireeye(url)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const url = new URL('https://example.com/v1/url?u=https%3A%2F%2Fexample.org%2F')

    expect(unwrapFireeye(url)).toBeUndefined()
  })
})
