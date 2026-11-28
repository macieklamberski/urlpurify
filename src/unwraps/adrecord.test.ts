import { describe, expect, it } from 'bun:test'
import { unwrapAdrecord } from './adrecord.js'

describe('unwrapAdrecord', () => {
  it('should extract a percent-encoded target from url param', () => {
    const value = new URL(
      'https://click.adrecord.com/?c=43125&p=898&url=https%3A%2F%2Fwww.example.com%2Fkaffebryggare%2Fbosch-tka8013',
    )
    const expected = 'https://www.example.com/kaffebryggare/bosch-tka8013'

    expect(unwrapAdrecord(value)).toBe(expected)
  })

  it('should extract a plain target from url param', () => {
    const value = new URL(
      'https://click.adrecord.com/?c=18457&p=886&url=https://www.example.com/sv/dam/define-seamless-sports-bra',
    )
    const expected = 'https://www.example.com/sv/dam/define-seamless-sports-bra'

    expect(unwrapAdrecord(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://click.adrecord.com/?c=43125&p=898')

    expect(unwrapAdrecord(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the Adrecord host', () => {
    const value = new URL(
      'https://click.adrecord.com/banner?c=43125&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdrecord(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/?c=43125&p=898&url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapAdrecord(value)).toBeUndefined()
  })
})
