import { describe, expect, it } from 'bun:test'
import { unwrapIrs } from './irs.js'

describe('unwrapIrs', () => {
  it('should extract target from dest param', () => {
    const value = new URL('http://apps.irs.gov/app/scripts/exit.jsp?dest=http://www.example.com/')
    const expected = 'http://www.example.com/'

    expect(unwrapIrs(value)).toBe(expected)
  })

  it('should extract a percent-encoded target', () => {
    const value = new URL(
      'http://www.irs.gov/app/scripts/exit.jsp?dest=http%3A%2F%2Fwww.example.com%2F',
    )
    const expected = 'http://www.example.com/'

    expect(unwrapIrs(value)).toBe(expected)
  })

  it('should return undefined when dest param is missing', () => {
    const value = new URL('https://apps.irs.gov/app/scripts/exit.jsp')

    expect(unwrapIrs(value)).toBeUndefined()
  })

  it('should return undefined when dest param is empty', () => {
    const value = new URL('https://apps.irs.gov/app/scripts/exit.jsp?dest=')

    expect(unwrapIrs(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://apps.irs.gov/app/scripts/redirect.jsp?dest=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapIrs(value)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL(
      'https://www.example.gov/app/scripts/exit.jsp?dest=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapIrs(value)).toBeUndefined()
  })
})
