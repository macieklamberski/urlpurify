import { describe, expect, it } from 'bun:test'
import { unwrapMedium } from './medium.js'

describe('unwrapMedium', () => {
  it('should extract target from url param', () => {
    const value = new URL('https://medium.com/r/?url=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapMedium(value)).toBe(expected)
  })

  it('should extract target from url param without the trailing slash', () => {
    const value = new URL('https://medium.com/r?url=https%3A%2F%2Fexample.com%2Farticle')
    const expected = 'https://example.com/article'

    expect(unwrapMedium(value)).toBe(expected)
  })

  it('should extract target from redirectUrl param on global-identity', () => {
    const value = new URL(
      'https://medium.com/m/global-identity?redirectUrl=https%3A%2F%2Fblog.example.com%2Fan-introduction-129ed0c12112',
    )
    const expected = 'https://blog.example.com/an-introduction-129ed0c12112'

    expect(unwrapMedium(value)).toBe(expected)
  })

  it('should extract target from redirectUrl param on global-identity-2', () => {
    const value = new URL(
      'https://medium.com/m/global-identity-2?redirectUrl=https%3A%2F%2Fblog.example.com%2Fcovenant-emulation-784d428c7446',
    )
    const expected = 'https://blog.example.com/covenant-emulation-784d428c7446'

    expect(unwrapMedium(value)).toBe(expected)
  })

  it('should return undefined when redirectUrl param is empty', () => {
    const value = new URL('https://medium.com/m/global-identity?redirectUrl=')

    expect(unwrapMedium(value)).toBeUndefined()
  })

  it('should return undefined for redirectUrl param on the login-redirect path', () => {
    const value = new URL(
      'https://medium.com/m/login-redirect?redirectUrl=https%3A%2F%2Fexample.com%2Ffavicon.ico',
    )

    expect(unwrapMedium(value)).toBeUndefined()
  })

  it('should return undefined for url param below the redirect path', () => {
    const value = new URL('https://medium.com/r/extra?url=https%3A%2F%2Fexample.com')

    expect(unwrapMedium(value)).toBeUndefined()
  })

  it('should return undefined for non-redirect Medium URLs', () => {
    const value = new URL('https://medium.com/@author/article-slug')

    expect(unwrapMedium(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://medium.com/r/')

    expect(unwrapMedium(value)).toBeUndefined()
  })

  it('should return undefined for non-Medium hosts', () => {
    const value = new URL('https://example.com/r/?url=https%3A%2F%2Fother.com')

    expect(unwrapMedium(value)).toBeUndefined()
  })

  it('should return undefined for url param on a nested r path', () => {
    const value = new URL('https://medium.com/@author/r?url=https%3A%2F%2Fexample.com')

    expect(unwrapMedium(value)).toBeUndefined()
  })

  it('should return undefined for redirectUrl param on a nested global-identity path', () => {
    const value = new URL(
      'https://medium.com/p/m/global-identity?redirectUrl=https%3A%2F%2Fexample.com',
    )

    expect(unwrapMedium(value)).toBeUndefined()
  })

  it('should return undefined for redirectUrl param on a longer global-identity path', () => {
    const value = new URL(
      'https://medium.com/m/global-identity-3?redirectUrl=https%3A%2F%2Fexample.com',
    )

    expect(unwrapMedium(value)).toBeUndefined()
  })
})
