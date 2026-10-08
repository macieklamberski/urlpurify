import { describe, expect, it } from 'bun:test'
import { unwrapDasBlog } from './dasBlog.js'

describe('unwrapDasBlog', () => {
  it('should extract the target from the counter at the blog root', () => {
    const url = new URL(
      'http://www.example.net/ct.ashx?id=68b7e248-b9f5-4d07-bdfe-eb037bcf2cbb&url=http%3a%2f%2fwww.example.com%2fq%2f3922291%2f105999',
    )

    expect(unwrapDasBlog(url)).toBe('http://www.example.com/q/3922291/105999')
  })

  it('should keep a plus in an unencoded target', () => {
    const url = new URL(
      'http://www.example.com/ct.ashx?id=68b7e248-b9f5-4d07-bdfe-eb037bcf2cbb&url=https://example.org/search/a+b',
    )

    expect(unwrapDasBlog(url)).toBe('https://example.org/search/a+b')
  })

  it('should extract the target from the counter under a blog folder', () => {
    const url = new URL(
      'http://www.example.net/weblog/ct.ashx?id=c6ead234-901e-4642-aa46-3c86301d2e71&url=http://www.example.com/',
    )

    expect(unwrapDasBlog(url)).toBe('http://www.example.com/')
  })

  it('should extract the last target from a nested unencoded counter', () => {
    const url = new URL(
      'http://www.example.net/ct.ashx?id=68b7e248-b9f5-4d07-bdfe-eb037bcf2cbb&url=http://www.example.org/ct.ashx?id=c6ead234-901e-4642-aa46-3c86301d2e71&url=http://www.example.com/',
    )

    expect(unwrapDasBlog(url)).toBe('http://www.example.com/')
  })

  it('should return undefined for a non-http target', () => {
    const url = new URL(
      'http://www.example.net/ct.ashx?id=68b7e248-b9f5-4d07-bdfe-eb037bcf2cbb&url=mailto%3aname%40example.com',
    )

    expect(unwrapDasBlog(url)).toBeUndefined()
  })

  it('should return undefined for the counter without url', () => {
    const url = new URL('http://www.example.net/ct.ashx?id=68b7e248-b9f5-4d07-bdfe-eb037bcf2cbb')

    expect(unwrapDasBlog(url)).toBeUndefined()
  })

  it('should return undefined for the counter two folders deep', () => {
    const url = new URL('http://www.example.net/a/blog/ct.ashx?url=http://www.example.com/')

    expect(unwrapDasBlog(url)).toBeUndefined()
  })

  it('should return undefined for another handler', () => {
    const url = new URL('http://www.example.net/redirect.ashx?url=http://www.example.com/')

    expect(unwrapDasBlog(url)).toBeUndefined()
  })
})
