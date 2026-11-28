import { describe, expect, it } from 'bun:test'
import { unwrapAllblog } from './allblog.js'

describe('unwrapAllblog', () => {
  it('should extract the target after the post id', () => {
    const value = new URL(
      'http://link.allblog.net/9376153/http://blog.example.com/yang456/140049328619',
    )
    const expected = 'http://blog.example.com/yang456/140049328619'

    expect(unwrapAllblog(value)).toBe(expected)
  })

  it('should extract a target with a single-slash scheme', () => {
    const value = new URL('http://link.allblog.net/6598739/http:/blog.example.com/819')
    const expected = 'http:/blog.example.com/819'

    expect(unwrapAllblog(value)).toBe(expected)
  })

  it('should return undefined for a target without a scheme', () => {
    const value = new URL('http://link.allblog.net/9376153/blog.example.com/yang456')

    expect(unwrapAllblog(value)).toBeUndefined()
  })

  it('should return undefined for a path without a post id', () => {
    const value = new URL('http://link.allblog.net/post/http://blog.example.com/yang456')

    expect(unwrapAllblog(value)).toBeUndefined()
  })

  it('should return undefined for a post id deeper in the path', () => {
    const value = new URL('http://link.allblog.net/post/9376153/http://blog.example.com/yang456')

    expect(unwrapAllblog(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL('http://example.com/9376153/http://blog.example.com/yang456')

    expect(unwrapAllblog(value)).toBeUndefined()
  })
})
