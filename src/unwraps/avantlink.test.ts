import { describe, expect, it } from 'bun:test'
import { unwrapAvantlink } from './avantlink.js'

describe('unwrapAvantlink', () => {
  it('should extract target from url param with short tracking params', () => {
    const url = new URL(
      'https://www.avantlink.com/click.php?tt=ale&ti=12701&pri=0&pw=338869&mi=16393&url=https%3A%2F%2Fexample.com%2Ffirearms%2Frifles%3Fp%3D308864',
    )

    expect(unwrapAvantlink(url)).toBe('https://example.com/firearms/rifles?p=308864')
  })

  it('should extract target from url param with long tracking params', () => {
    const url = new URL(
      'https://www.avantlink.com/click.php?tool_type=cl&merchant_id=7486894c-de29-4e50-8d4e-87ffc84a0095&website_id=a233a62e-236a-4740-bf8f-d345389f23e9&url=https%3A%2F%2Fexample.com%2Fhandguns',
    )

    expect(unwrapAvantlink(url)).toBe('https://example.com/handguns')
  })

  it('should extract target on classic.avantlink.com', () => {
    const url = new URL(
      'https://classic.avantlink.com/click.php?tt=cl&mi=16785&pw=27131&ctc=ybw-gb-4571583055668934700&url=https%3A%2F%2Fexample.com%2Fproducts%2Fsailing-shoes',
    )

    expect(unwrapAvantlink(url)).toBe('https://example.com/products/sailing-shoes')
  })

  it('should extract unencoded target', () => {
    const url = new URL(
      'http://www.avantlink.com/click.php?tt=ml&ti=1045&pw=1403&ctc=deals&url=http://example.com/outdoors/',
    )

    expect(unwrapAvantlink(url)).toBe('http://example.com/outdoors/')
  })

  it('should keep the encoded query of the target', () => {
    const url = new URL(
      'https://www.avantlink.com/click.php?tt=cl&mi=10060&pw=230137&url=https%3A%2F%2Fexample.com%2Fsale%3Fp%3Dbrand%253AEvil%255C%2BBikes%26nf%3D1',
    )

    expect(unwrapAvantlink(url)).toBe('https://example.com/sale?p=brand%3AEvil%5C+Bikes&nf=1')
  })

  it('should return undefined when url param is missing', () => {
    const url = new URL('https://www.avantlink.com/click.php?tt=ml&ti=2666&p=1175&pw=1403')

    expect(unwrapAvantlink(url)).toBeUndefined()
  })

  it('should return undefined when url param is empty', () => {
    const url = new URL('https://www.avantlink.com/click.php?tt=cl&mi=10060&pw=230137&url=')

    expect(unwrapAvantlink(url)).toBeUndefined()
  })

  it('should return undefined for other AvantLink paths', () => {
    const url = new URL('https://www.avantlink.com/signup/?url=https%3A%2F%2Fexample.com%2F')

    expect(unwrapAvantlink(url)).toBeUndefined()
  })

  it('should return undefined for click.php on other hosts', () => {
    const url = new URL('https://example.com/click.php?tt=cl&url=https%3A%2F%2Fexample.org%2F')

    expect(unwrapAvantlink(url)).toBeUndefined()
  })

  it('should extract target from a subdomain no specimen shows', () => {
    const url = new URL(
      'https://www-staging.avantlink.com/click.php?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAvantlink(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://exampleavantlink.com/click.php?url=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapAvantlink(url)).toBeUndefined()
  })
})
