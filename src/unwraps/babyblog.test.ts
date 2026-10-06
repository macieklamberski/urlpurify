import { describe, expect, it } from 'bun:test'
import { unwrapBabyblog } from './babyblog.js'

describe('unwrapBabyblog', () => {
  it('should extract the target from the redirect shim', () => {
    const url = new URL('https://www.babyblog.ru/redirect.php?v=1&l=http%3A%2F%2Fexample.com%2F')

    expect(unwrapBabyblog(url)).toBe('http://example.com/')
  })

  it('should return undefined when the l param is missing', () => {
    const url = new URL('https://www.babyblog.ru/redirect.php?v=1')

    expect(unwrapBabyblog(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://www.babyblog.ru/user/redirect.php?l=http%3A%2F%2Fexample.com%2F')

    expect(unwrapBabyblog(url)).toBeUndefined()
  })
})
