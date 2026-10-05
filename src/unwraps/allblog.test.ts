import { describe, expect, it } from 'bun:test'
import { unwrapAllblog } from './allblog.js'

describe('unwrapAllblog', () => {
  it('should extract the target after the post id', () => {
    const url = new URL(
      'http://link.allblog.net/9376153/http://blog.example.com/yang456/140049328619',
    )

    expect(unwrapAllblog(url)).toBe('http://blog.example.com/yang456/140049328619')
  })

  it('should return undefined for a target without a scheme', () => {
    const url = new URL('http://link.allblog.net/9376153/blog.example.com/yang456')

    expect(unwrapAllblog(url)).toBeUndefined()
  })

  it('should return undefined for a path without a post id', () => {
    const url = new URL('http://link.allblog.net/post/http://blog.example.com/yang456')

    expect(unwrapAllblog(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('http://example.com/9376153/http://blog.example.com/yang456')

    expect(unwrapAllblog(url)).toBeUndefined()
  })
})
