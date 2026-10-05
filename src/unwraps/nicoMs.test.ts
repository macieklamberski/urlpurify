import { describe, expect, it } from 'bun:test'
import { unwrapNicoMs } from './nicoMs.js'

describe('unwrapNicoMs', () => {
  it('should rewrite sm-prefixed ids to the nicovideo watch URL', () => {
    const url = new URL('https://nico.ms/sm12345678')

    expect(unwrapNicoMs(url)).toBe('https://www.nicovideo.jp/watch/sm12345678')
  })

  it('should rewrite nm-prefixed ids to the nicovideo watch URL', () => {
    const url = new URL('https://nico.ms/nm9876543')

    expect(unwrapNicoMs(url)).toBe('https://www.nicovideo.jp/watch/nm9876543')
  })

  it('should rewrite so-prefixed ids to the nicovideo watch URL', () => {
    const url = new URL('https://nico.ms/so123456')

    expect(unwrapNicoMs(url)).toBe('https://www.nicovideo.jp/watch/so123456')
  })

  it('should rewrite im-prefixed ids to the seiga illustration URL', () => {
    const url = new URL('https://nico.ms/im9999999')

    expect(unwrapNicoMs(url)).toBe('https://seiga.nicovideo.jp/seiga/im9999999')
  })

  it('should return undefined for an unrecognised prefix', () => {
    const url = new URL('https://nico.ms/xx12345')

    expect(unwrapNicoMs(url)).toBeUndefined()
  })

  it('should return undefined for non-nico.ms hosts', () => {
    const url = new URL('https://example.com/sm12345')

    expect(unwrapNicoMs(url)).toBeUndefined()
  })
})
