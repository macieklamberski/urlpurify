import { describe, expect, it } from 'bun:test'
import { unwrapAvantlink } from './avantlink.js'

describe('unwrapAvantlink', () => {
  it('should extract target from url param with short tracking params', () => {
    const value = new URL(
      'https://www.avantlink.com/click.php?tt=ale&ti=12701&pri=0&pw=338869&mi=16393&url=https%3A%2F%2Fexample.com%2Ffirearms%2Frifles%3Fp%3D308864',
    )
    const expected = 'https://example.com/firearms/rifles?p=308864'

    expect(unwrapAvantlink(value)).toBe(expected)
  })

  it('should extract target from url param with long tracking params', () => {
    const value = new URL(
      'https://www.avantlink.com/click.php?tool_type=cl&merchant_id=7486894c-de29-4e50-8d4e-87ffc84a0095&website_id=a233a62e-236a-4740-bf8f-d345389f23e9&url=https%3A%2F%2Fexample.com%2Fhandguns',
    )
    const expected = 'https://example.com/handguns'

    expect(unwrapAvantlink(value)).toBe(expected)
  })

  it('should extract unencoded target', () => {
    const value = new URL(
      'http://www.avantlink.com/click.php?tt=ml&ti=1045&pw=1403&ctc=deals&url=http://example.com/outdoors/',
    )
    const expected = 'http://example.com/outdoors/'

    expect(unwrapAvantlink(value)).toBe(expected)
  })

  it('should keep the encoded query of the target', () => {
    const value = new URL(
      'https://www.avantlink.com/click.php?tt=cl&mi=10060&pw=230137&url=https%3A%2F%2Fexample.com%2Fsale%3Fp%3Dbrand%253AEvil%255C%2BBikes%26nf%3D1',
    )
    const expected = 'https://example.com/sale?p=brand%3AEvil%5C+Bikes&nf=1'

    expect(unwrapAvantlink(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://www.avantlink.com/click.php?tt=ml&ti=2666&p=1175&pw=1403')

    expect(unwrapAvantlink(value)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const value = new URL('https://www.avantlink.com/click.php?tt=cl&mi=10060&pw=230137&url=')

    expect(unwrapAvantlink(value)).toBeUndefined()
  })

  it('should return undefined for other AvantLink paths', () => {
    const value = new URL('https://www.avantlink.com/signup/?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAvantlink(value)).toBeUndefined()
  })

  it('should return undefined for click.php on other hosts', () => {
    const value = new URL('https://example.com/click.php?tt=cl&url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapAvantlink(value)).toBeUndefined()
  })
})
