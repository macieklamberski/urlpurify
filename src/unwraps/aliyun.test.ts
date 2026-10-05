import { describe, expect, it } from 'bun:test'
import { unwrapAliyun } from './aliyun.js'

describe('unwrapAliyun', () => {
  it('should extract the target from the article redirect', () => {
    const url = new URL(
      'https://yq.aliyun.com/go/articleRenderRedirect?url=https%3A%2F%2Fwww.example.com%2Farticles%2FrichardsonMaturityModel.html',
    )

    expect(unwrapAliyun(url)).toBe('https://www.example.com/articles/richardsonMaturityModel.html')
  })

  it('should extract an unencoded target', () => {
    const url = new URL(
      'https://yq.aliyun.com/go/articleRenderRedirect?url=https://www.example.com/cn/corporate-information',
    )

    expect(unwrapAliyun(url)).toBe('https://www.example.com/cn/corporate-information')
  })

  it('should return undefined for the redirect without url', () => {
    const url = new URL('https://yq.aliyun.com/go/articleRenderRedirect')

    expect(unwrapAliyun(url)).toBeUndefined()
  })

  it('should return undefined for an article', () => {
    const url = new URL('https://yq.aliyun.com/articles/123?url=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapAliyun(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/go/articleRenderRedirect?url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAliyun(url)).toBeUndefined()
  })
})
