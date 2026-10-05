import { describe, expect, it } from 'bun:test'
import { unwrapBytedance } from './bytedance.js'

describe('unwrapBytedance', () => {
  it('should extract target from target param', () => {
    const url = new URL(
      'https://link.wtturl.cn/?target=https%3A%2F%2Fwww.example.com%2Fkitchen%2F&scene=im&aid=497858&lang=zh',
    )

    expect(unwrapBytedance(url)).toBe('https://www.example.com/kitchen/')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://link.wtturl.cn/?target=https://www.example.com/&scene=im&aid=497858',
    )

    expect(unwrapBytedance(url)).toBe('https://www.example.com/')
  })

  it('should extract target on the overseas host', () => {
    const url = new URL(
      'https://sg-link.byteoversea.com/?target=https%3A%2F%2Fwww.example.com&scene=im&aid=495671&lang=en-GB',
    )

    expect(unwrapBytedance(url)).toBe('https://www.example.com')
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL('https://link.wtturl.cn/?scene=im&aid=497858')

    expect(unwrapBytedance(url)).toBeUndefined()
  })

  it('should return undefined when target param is empty', () => {
    const url = new URL('https://link.wtturl.cn/?target=&scene=im')

    expect(unwrapBytedance(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://link.wtturl.cn/about?target=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapBytedance(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://link.example.com/?target=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapBytedance(url)).toBeUndefined()
  })
})
