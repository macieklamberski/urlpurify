import { describe, expect, it } from 'bun:test'
import { unwrapBytedance } from './bytedance.js'

describe('unwrapBytedance', () => {
  it('should extract target from target param', () => {
    const value = new URL(
      'https://link.wtturl.cn/?target=https%3A%2F%2Fwww.example.com%2Fkitchen%2F&scene=im&aid=497858&lang=zh',
    )
    const expected = 'https://www.example.com/kitchen/'

    expect(unwrapBytedance(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://link.wtturl.cn/?target=https://www.example.com/&scene=im&aid=497858',
    )
    const expected = 'https://www.example.com/'

    expect(unwrapBytedance(value)).toBe(expected)
  })

  it('should extract target on the overseas host', () => {
    const value = new URL(
      'https://sg-link.byteoversea.com/?target=https%3A%2F%2Fwww.example.com&scene=im&aid=495671&lang=en-GB',
    )
    const expected = 'https://www.example.com'

    expect(unwrapBytedance(value)).toBe(expected)
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://link.wtturl.cn/?scene=im&aid=497858')

    expect(unwrapBytedance(value)).toBeUndefined()
  })

  it('should return undefined when target param is empty', () => {
    const value = new URL('https://link.wtturl.cn/?target=&scene=im')

    expect(unwrapBytedance(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://link.wtturl.cn/about?target=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapBytedance(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL('https://link.example.com/?target=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapBytedance(value)).toBeUndefined()
  })
})
