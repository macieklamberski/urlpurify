import { describe, expect, it } from 'bun:test'
import { unwrapIrs } from './irs.js'

describe('unwrapIrs', () => {
  it('should extract target from dest param', () => {
    const url = new URL('http://apps.irs.gov/app/scripts/exit.jsp?dest=http://www.example.com/')

    expect(unwrapIrs(url)).toBe('http://www.example.com/')
  })

  it('should extract a percent-encoded target', () => {
    const url = new URL(
      'http://www.irs.gov/app/scripts/exit.jsp?dest=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapIrs(url)).toBe('http://www.example.com/')
  })

  it('should return undefined when dest param is missing', () => {
    const url = new URL('https://apps.irs.gov/app/scripts/exit.jsp')

    expect(unwrapIrs(url)).toBeUndefined()
  })

  it('should return undefined when dest param is empty', () => {
    const url = new URL('https://apps.irs.gov/app/scripts/exit.jsp?dest=')

    expect(unwrapIrs(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL(
      'https://apps.irs.gov/app/scripts/redirect.jsp?dest=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapIrs(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL(
      'https://www.example.gov/app/scripts/exit.jsp?dest=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapIrs(url)).toBeUndefined()
  })
})
