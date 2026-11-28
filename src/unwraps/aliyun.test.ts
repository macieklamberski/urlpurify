import { describe, expect, it } from 'bun:test'
import { unwrapAliyun } from './aliyun.js'

describe('unwrapAliyun', () => {
  it('should extract the target from the article redirect', () => {
    const value = new URL(
      'https://yq.aliyun.com/go/articleRenderRedirect?url=https%3A%2F%2Fwww.example.com%2Farticles%2FrichardsonMaturityModel.html',
    )
    const expected = 'https://www.example.com/articles/richardsonMaturityModel.html'

    expect(unwrapAliyun(value)).toBe(expected)
  })

  it('should extract an unencoded target', () => {
    const value = new URL(
      'https://yq.aliyun.com/go/articleRenderRedirect?url=https://www.example.com/cn/corporate-information',
    )
    const expected = 'https://www.example.com/cn/corporate-information'

    expect(unwrapAliyun(value)).toBe(expected)
  })

  it('should return undefined for the redirect without url', () => {
    const value = new URL('https://yq.aliyun.com/go/articleRenderRedirect')

    expect(unwrapAliyun(value)).toBeUndefined()
  })

  it('should return undefined for an article', () => {
    const value = new URL('https://yq.aliyun.com/articles/123?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapAliyun(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/go/articleRenderRedirect?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAliyun(value)).toBeUndefined()
  })
})
