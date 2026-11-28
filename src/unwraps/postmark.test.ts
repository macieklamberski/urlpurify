import { describe, expect, it } from 'bun:test'
import { unwrapPostmark } from './postmark.js'

describe('unwrapPostmark', () => {
  it('should extract an https target from a 3s path', () => {
    const value = new URL(
      'https://click.pstmrk.it/3s/form.example.com%2F243155719717059/cO-A/IXy7AQ/AQ/bd8ddcde-fdf5-460e-a83c-a1ab0ec88814/1/Ts-zTNfg7F',
    )
    const expected = 'https://form.example.com/243155719717059'

    expect(unwrapPostmark(value)).toBe(expected)
  })

  it('should extract an http target from a bare 3 path', () => {
    const value = new URL(
      'https://click.pstmrk.it/3/example.nl/4HuO/wJS8AQ/AQ/bd8ddcde-fdf5-460e-a83c-a1ab0ec88814/1/Ts-zTNfg7F',
    )
    const expected = 'http://example.nl'

    expect(unwrapPostmark(value)).toBe(expected)
  })

  it('should extract an https target from a 2s path', () => {
    const value = new URL('https://click.pstmrk.it/2s/example.com/AQ/-----w/bTkM0XzMBY')
    const expected = 'https://example.com'

    expect(unwrapPostmark(value)).toBe(expected)
  })

  it('should extract an https target from a 3ts path', () => {
    const value = new URL(
      'https://click.pstmrk.it/3ts/example.com%2Fstartups%2Fdashy/sDxB/7R5wAQ/AQ/62c98070-1b4f-4d4c-a7e6-1f2d3c4b5a69/1/Hq4kcZpX3R',
    )
    const expected = 'https://example.com/startups/dashy'

    expect(unwrapPostmark(value)).toBe(expected)
  })

  it('should keep the encoded query of the target', () => {
    const value = new URL('https://click.pstmrk.it/3s/example.com%2Fpage%3Fid%3D5/abc/def')
    const expected = 'https://example.com/page?id=5'

    expect(unwrapPostmark(value)).toBe(expected)
  })

  it('should return undefined for an unrecognised version prefix', () => {
    const value = new URL('https://click.pstmrk.it/4s/example.com%2Farticle/abc/def')

    expect(unwrapPostmark(value)).toBeUndefined()
  })

  it('should return undefined when path has too few segments', () => {
    const value = new URL('https://click.pstmrk.it/3s/example.com%2Farticle')

    expect(unwrapPostmark(value)).toBeUndefined()
  })

  it('should return undefined for non-Postmark hosts', () => {
    const value = new URL('https://example.com/3s/example.org/abc/def')

    expect(unwrapPostmark(value)).toBeUndefined()
  })

  it('should keep a malformed escape in the target as written', () => {
    const value = new URL('https://click.pstmrk.it/3s/example.com%2F100%ZZ/abc/def')
    const expected = 'https://example.com/100%ZZ'

    expect(unwrapPostmark(value)).toBe(expected)
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://click.pstmrk.it/3s/form.example.com%2F243155719717059%23top/cO-A/IXy7AQ/AQ/bd8ddcde-fdf5-460e-a83c-a1ab0ec88814/1/Ts-zTNfg7F',
    )
    const expected = 'https://form.example.com/243155719717059#top'

    expect(unwrapPostmark(value)).toBe(expected)
  })
})
