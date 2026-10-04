import { describe, expect, it } from 'bun:test'
import { unwrapThreadsShim } from './threads.js'

describe('unwrapThreadsShim', () => {
  it('should extract target from l.threads.com', () => {
    const url = new URL('https://l.threads.com/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapThreadsShim(url)).toBe('https://example.com/page')
  })

  it('should extract target from l.threads.net', () => {
    const url = new URL('https://l.threads.net/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapThreadsShim(url)).toBe('https://example.com/page')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://l.threads.com/')

    expect(unwrapThreadsShim(url)).toBeUndefined()
  })

  it('should return undefined for non-Threads hosts', () => {
    const url = new URL('https://example.com/?u=https%3A%2F%2Fother.com')

    expect(unwrapThreadsShim(url)).toBeUndefined()
  })

  it('should return undefined for an unlisted subdomain', () => {
    const url = new URL('https://x.threads.net/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapThreadsShim(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://l.threads.com/intent?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapThreadsShim(url)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL('https://examplethreads.com/?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapThreadsShim(url)).toBeUndefined()
  })
})
