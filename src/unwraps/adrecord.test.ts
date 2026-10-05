import { describe, expect, it } from 'bun:test'
import { unwrapAdrecord } from './adrecord.js'

describe('unwrapAdrecord', () => {
  it('should extract a percent-encoded target from url param', () => {
    const url = new URL(
      'https://click.adrecord.com/?c=43125&p=898&url=https%3A%2F%2Fwww.example.com%2Fkaffebryggare%2Fbosch-tka8013',
    )

    expect(unwrapAdrecord(url)).toBe('https://www.example.com/kaffebryggare/bosch-tka8013')
  })

  it('should extract a plain target from url param', () => {
    const url = new URL(
      'https://click.adrecord.com/?c=18457&p=886&url=https://www.example.com/sv/dam/define-seamless-sports-bra',
    )

    expect(unwrapAdrecord(url)).toBe('https://www.example.com/sv/dam/define-seamless-sports-bra')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://click.adrecord.com/?c=43125&p=898')

    expect(unwrapAdrecord(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Adrecord host', () => {
    const url = new URL(
      'https://click.adrecord.com/banner?c=43125&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapAdrecord(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/?c=43125&p=898&url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapAdrecord(url)).toBeUndefined()
  })
})
