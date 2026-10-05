import { describe, expect, it } from 'bun:test'
import { unwrapPostmark } from './postmark.js'

describe('unwrapPostmark', () => {
  it('should extract an https target from a 3s path', () => {
    const url = new URL(
      'https://click.pstmrk.it/3s/form.example.com%2F243155719717059/cO-A/IXy7AQ/AQ/bd8ddcde-fdf5-460e-a83c-a1ab0ec88814/1/Ts-zTNfg7F',
    )

    expect(unwrapPostmark(url)).toBe('https://form.example.com/243155719717059')
  })

  it('should extract an http target from a bare 3 path', () => {
    const url = new URL(
      'https://click.pstmrk.it/3/example.nl/4HuO/wJS8AQ/AQ/bd8ddcde-fdf5-460e-a83c-a1ab0ec88814/1/Ts-zTNfg7F',
    )

    expect(unwrapPostmark(url)).toBe('http://example.nl')
  })

  it('should extract an https target from a 2s path', () => {
    const url = new URL('https://click.pstmrk.it/2s/example.com/AQ/-----w/bTkM0XzMBY')

    expect(unwrapPostmark(url)).toBe('https://example.com')
  })

  it('should extract a target from the track host', () => {
    const url = new URL(
      'https://track.pstmrk.it/3s/www.example.com%2F%40channel/xQnE/eBjEAQ/AQ/a0a74f67-4c03-4c49-bef4-6a78b998a091/1/bjrj_XP6yA',
    )

    expect(unwrapPostmark(url)).toBe('https://www.example.com/@channel')
  })

  it('should keep the encoded query of the target', () => {
    const url = new URL('https://click.pstmrk.it/3s/example.com%2Fpage%3Fid%3D5/abc/def')

    expect(unwrapPostmark(url)).toBe('https://example.com/page?id=5')
  })

  it('should return undefined for an unrecognised version prefix', () => {
    const url = new URL('https://click.pstmrk.it/4s/example.com%2Farticle/abc/def')

    expect(unwrapPostmark(url)).toBeUndefined()
  })

  it('should return undefined when path has too few segments', () => {
    const url = new URL('https://click.pstmrk.it/3s/example.com%2Farticle')

    expect(unwrapPostmark(url)).toBeUndefined()
  })

  it('should return undefined for non-Postmark hosts', () => {
    const url = new URL('https://example.com/3s/example.org/abc/def')

    expect(unwrapPostmark(url)).toBeUndefined()
  })

  it('should return undefined when the encoded path segment is malformed', () => {
    // `%ZZ` is not a valid percent escape and breaks decodeURIComponent.
    const url = new URL('https://click.pstmrk.it/3s/bad%ZZ/abc/def')

    expect(unwrapPostmark(url)).toBeUndefined()
  })
})
