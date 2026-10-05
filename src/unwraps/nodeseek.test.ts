import { describe, expect, it } from 'bun:test'
import { unwrapNodeseek } from './nodeseek.js'

describe('unwrapNodeseek', () => {
  it('should extract target from to param', () => {
    const url = new URL(
      'https://www.nodeseek.com/jump?to=https%3A%2F%2Fwww.example.com%2Fqqrrooty%2FEZrealm',
    )

    expect(unwrapNodeseek(url)).toBe('https://www.example.com/qqrrooty/EZrealm')
  })

  it('should return undefined when to param is missing', () => {
    const url = new URL('https://www.nodeseek.com/jump?other=value')

    expect(unwrapNodeseek(url)).toBeUndefined()
  })

  it('should return undefined when to param is empty', () => {
    const url = new URL('https://www.nodeseek.com/jump?to=')

    expect(unwrapNodeseek(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://www.nodeseek.com/post-1-1?to=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapNodeseek(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL('https://www.example.com/jump?to=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapNodeseek(url)).toBeUndefined()
  })
})
