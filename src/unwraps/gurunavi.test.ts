import { describe, expect, it } from 'bun:test'
import { unwrapGurunavi } from './gurunavi.js'

describe('unwrapGurunavi', () => {
  it('should extract target from ga_red param', () => {
    const value = new URL(
      'https://gaff.gurunavi.jp/track/gc.php?ga_bid=27&ga_pid=4989&ga_red=https://www.example.com/9zbvwkub0000/',
    )
    const expected = 'https://www.example.com/9zbvwkub0000/'

    expect(unwrapGurunavi(value)).toBe(expected)
  })

  it('should return undefined when ga_red param is missing', () => {
    const value = new URL('https://gaff.gurunavi.jp/track/gc.php?ga_bid=27&ga_pid=4989')

    expect(unwrapGurunavi(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the Gurunavi host', () => {
    const value = new URL(
      'https://gaff.gurunavi.jp/track/gi.php?ga_bid=27&ga_red=https://www.example.com/',
    )

    expect(unwrapGurunavi(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://example.com/track/gc.php?ga_bid=27&ga_red=https://www.example.org/',
    )

    expect(unwrapGurunavi(value)).toBeUndefined()
  })
})
