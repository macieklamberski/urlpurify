import { describe, expect, it } from 'bun:test'
import { unwrapThreads } from './threads.js'

describe('unwrapThreads', () => {
  it('should extract target from l.threads.com', () => {
    const value = new URL('https://l.threads.com/?u=https%3A%2F%2Fexample.com%2Fpage')
    const expected = 'https://example.com/page'

    expect(unwrapThreads(value)).toBe(expected)
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://l.threads.com/')

    expect(unwrapThreads(value)).toBeUndefined()
  })

  it('should return undefined for non-Threads hosts', () => {
    const value = new URL('https://example.com/?u=https%3A%2F%2Fother.com')

    expect(unwrapThreads(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://l.threads.com/intent?u=https%3A%2F%2Fexample.com%2Fpage')

    expect(unwrapThreads(value)).toBeUndefined()
  })
})
