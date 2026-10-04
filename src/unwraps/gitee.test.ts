import { describe, expect, it } from 'bun:test'
import { unwrapGitee } from './gitee.js'

describe('unwrapGitee', () => {
  it('should extract target from target param', () => {
    const url = new URL('https://gitee.com/link?target=https%3A%2F%2Fexample.com%2Frepo')

    expect(unwrapGitee(url)).toBe('https://example.com/repo')
  })

  it('should return undefined when target param is missing', () => {
    const url = new URL('https://gitee.com/link?other=value')

    expect(unwrapGitee(url)).toBeUndefined()
  })

  it('should return undefined for non-link Gitee paths', () => {
    const url = new URL('https://gitee.com/explore?target=https%3A%2F%2Fexample.com')

    expect(unwrapGitee(url)).toBeUndefined()
  })

  it('should return undefined for non-Gitee hosts', () => {
    const url = new URL('https://example.com/link?target=https%3A%2F%2Fother.com')

    expect(unwrapGitee(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL('https://www.gitee.com/link?target=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGitee(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplegitee.com/link?target=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGitee(url)).toBeUndefined()
  })
})
