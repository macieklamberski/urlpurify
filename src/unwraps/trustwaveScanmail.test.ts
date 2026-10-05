import { describe, expect, it } from 'bun:test'
import { unwrapTrustwaveScanmail } from './trustwaveScanmail.js'

describe('unwrapTrustwaveScanmail', () => {
  it('should extract target encoded with lowercase escapes', () => {
    const url = new URL(
      'https://scanmail.trustwave.com/?c=12359&d=r4Hr3QKImk33_n4kmJ91sY-Nc87nLtpII95aGw4cEA&u=https%3a%2f%2fwww%2eexample%2ecom%2f',
    )

    expect(unwrapTrustwaveScanmail(url)).toBe('https://www.example.com/')
  })

  it('should extract a plain target', () => {
    const url = new URL(
      'http://scanmail.trustwave.com/?c=10916&d=vZWp3X6GGuy9Ca2jGL8LhRaMgnUHcvyGFM6wZVQxLA&u=http://example.com/page',
    )

    expect(unwrapTrustwaveScanmail(url)).toBe('http://example.com/page')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      'https://scanmail.trustwave.com/?c=8248&d=4qa02KqxZJadHuhFUvy7ZCUfI_2L10yeH0EeBz7FGQ&u=https%3a%2f%2fexample%2ecom%2fsearch%3fq%3dfeeds%26page%3d2',
    )

    expect(unwrapTrustwaveScanmail(url)).toBe('https://example.com/search?q=feeds&page=2')
  })

  it('should extract target encoded twice', () => {
    const url = new URL(
      'https://scanmail.trustwave.com/?c=8248&d=4qa02KqxZJadHuhFUvy7ZCUfI_2L10yeH0EeBz7FGQ&u=https%253a%252f%252fexample.com%252fpage',
    )

    expect(unwrapTrustwaveScanmail(url)).toBe('https://example.com/page')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://scanmail.trustwave.com/?c=1&d=x')

    expect(unwrapTrustwaveScanmail(url)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const url = new URL('https://scanmail.trustwave.com/?c=1&d=x&u=')

    expect(unwrapTrustwaveScanmail(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://scanmail.trustwave.com/report?u=https%3a%2f%2fexample.com%2f')

    expect(unwrapTrustwaveScanmail(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/?u=https%3a%2f%2fexample.org%2f')

    expect(unwrapTrustwaveScanmail(url)).toBeUndefined()
  })
})
