import { describe, expect, it } from 'bun:test'
import { unwrapWykop } from './wykop.js'

describe('unwrapWykop', () => {
  it('should extract a percent-encoded target from remotelink', () => {
    const value = new URL('https://www.wykop.pl/remotelink/?url=https%3A%2F%2Fwww.example.com%2F')
    const expected = 'https://www.example.com/'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should extract a raw target from remotelink', () => {
    const value = new URL('http://www.wykop.pl/remotelink/?url=https://example.com')
    const expected = 'https://example.com'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should extract a raw target from dodaj and stop at the title', () => {
    const value = new URL(
      'http://www.wykop.pl/dodaj?url=https://example.com/index.php/2010/09/20/wywiad-z-piotrem-paluchem/&title=Wywiad+z+Piotrem+Paluchem',
    )
    const expected = 'https://example.com/index.php/2010/09/20/wywiad-z-piotrem-paluchem/'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should extract a target encoded in lowercase hex from dodaj', () => {
    const value = new URL(
      'http://www.wykop.pl/dodaj?url=http%3a%2f%2fexample.wordpress.com%2f2013%2f01%2f12%2fpowstanie-styczniowe-1863%2f',
    )
    const expected = 'http://example.wordpress.com/2013/01/12/powstanie-styczniowe-1863/'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should extract the target from dodaj/link', () => {
    const value = new URL(
      'http://www.wykop.pl/dodaj/link/?url=https://iz8xjj.example.com/2016/08/11/activations-from-procida-s-island/&title=Activations%20from%20Procida%27s%20island',
    )
    const expected = 'https://iz8xjj.example.com/2016/08/11/activations-from-procida-s-island/'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from dodaj/link', () => {
    const value = new URL(
      'https://www.wykop.pl/dodaj/link/?url=https%3A%2F%2Fwww.example.com%2F399%2F11359%2FArtykul%2F3477933%2Cexplainer-wybory-prezydenckie-2025',
    )
    const expected =
      'https://www.example.com/399/11359/Artykul/3477933,explainer-wybory-prezydenckie-2025'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should extract the target from dodaj-link on bare wykop.pl', () => {
    const value = new URL(
      'https://wykop.pl/dodaj-link?url=https%3A%2F%2Fexample.com%2Fpost&title=Hello',
    )
    const expected = 'https://example.com/post'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should extract a twice-encoded target', () => {
    const value = new URL(
      'https://wykop.pl/dodaj-link?url=https%253A%252F%252Fexample.com%252Fpost',
    )
    const expected = 'https://example.com/post'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should match the path in any case', () => {
    const value = new URL('https://www.wykop.pl/RemoteLink/?url=https%3A%2F%2Fexample.com%2Fpost')
    const expected = 'https://example.com/post'

    expect(unwrapWykop(value)).toBe(expected)
  })

  it('should return undefined when the url param is empty', () => {
    const value = new URL('https://www.wykop.pl/dodaj?url=&title=Hello')

    expect(unwrapWykop(value)).toBeUndefined()
  })

  it('should return undefined for a url held only in desc', () => {
    const value = new URL(
      'https://www.wykop.pl/dodaj?title=Hello&desc=https%3A%2F%2Fexample.com%2Fpost',
    )

    expect(unwrapWykop(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://wykop.pl/link/7654321?url=https%3A%2F%2Fexample.com%2Fpost')

    expect(unwrapWykop(value)).toBeUndefined()
  })

  it('should return undefined for the shape on another host', () => {
    const value = new URL('https://www.example.com/dodaj?url=https%3A%2F%2Fexample.org%2Fpost')

    expect(unwrapWykop(value)).toBeUndefined()
  })
})
