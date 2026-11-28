import { describe, expect, it } from 'bun:test'
import { unwrapGitee } from './gitee.js'

describe('unwrapGitee', () => {
  it('should extract target from target param', () => {
    const value = new URL('https://gitee.com/link?target=https%3A%2F%2Fexample.com%2Frepo')
    const expected = 'https://example.com/repo'

    expect(unwrapGitee(value)).toBe(expected)
  })

  it('should return undefined when target param is missing', () => {
    const value = new URL('https://gitee.com/link?other=value')

    expect(unwrapGitee(value)).toBeUndefined()
  })

  it('should return undefined for non-link Gitee paths', () => {
    const value = new URL('https://gitee.com/explore?target=https%3A%2F%2Fexample.com')

    expect(unwrapGitee(value)).toBeUndefined()
  })

  it('should return undefined for non-Gitee hosts', () => {
    const value = new URL('https://example.com/link?target=https%3A%2F%2Fother.com')

    expect(unwrapGitee(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL('https://examplegitee.com/link?target=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapGitee(value)).toBeUndefined()
  })
})
