import { describe, expect, it } from 'bun:test'
import { unwrapGurunavi } from './gurunavi.js'

describe('unwrapGurunavi', () => {
  it('should extract target from ga_red param', () => {
    const url = new URL(
      'https://gaff.gurunavi.jp/track/gc.php?ga_bid=27&ga_pid=4989&ga_red=https://www.example.com/9zbvwkub0000/',
    )

    expect(unwrapGurunavi(url)).toBe('https://www.example.com/9zbvwkub0000/')
  })

  it('should return undefined when ga_red param is missing', () => {
    const url = new URL('https://gaff.gurunavi.jp/track/gc.php?ga_bid=27&ga_pid=4989')

    expect(unwrapGurunavi(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the Gurunavi host', () => {
    const url = new URL(
      'https://gaff.gurunavi.jp/track/gi.php?ga_bid=27&ga_red=https://www.example.com/',
    )

    expect(unwrapGurunavi(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL(
      'https://example.com/track/gc.php?ga_bid=27&ga_red=https://www.example.org/',
    )

    expect(unwrapGurunavi(url)).toBeUndefined()
  })
})
