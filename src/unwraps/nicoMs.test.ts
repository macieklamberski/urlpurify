import { describe, expect, it } from 'bun:test'
import { unwrapNicoMs } from './nicoMs.js'

describe('unwrapNicoMs', () => {
  it('should rewrite sm-prefixed ids to the nicovideo watch URL', () => {
    const value = new URL('https://nico.ms/sm12345678')
    const expected = 'https://www.nicovideo.jp/watch/sm12345678'

    expect(unwrapNicoMs(value)).toBe(expected)
  })

  it('should rewrite nm-prefixed ids to the nicovideo watch URL', () => {
    const value = new URL('https://nico.ms/nm9876543')
    const expected = 'https://www.nicovideo.jp/watch/nm9876543'

    expect(unwrapNicoMs(value)).toBe(expected)
  })

  it('should rewrite so-prefixed ids to the nicovideo watch URL', () => {
    const value = new URL('https://nico.ms/so123456')
    const expected = 'https://www.nicovideo.jp/watch/so123456'

    expect(unwrapNicoMs(value)).toBe(expected)
  })

  it('should rewrite im-prefixed ids to the seiga illustration URL', () => {
    const value = new URL('https://nico.ms/im9999999')
    const expected = 'https://seiga.nicovideo.jp/seiga/im9999999'

    expect(unwrapNicoMs(value)).toBe(expected)
  })

  it('should rewrite lv-prefixed ids to the live broadcast URL', () => {
    const value = new URL('http://nico.ms/lv187388398')
    const expected = 'https://live.nicovideo.jp/watch/lv187388398'

    expect(unwrapNicoMs(value)).toBe(expected)
  })

  it('should return undefined for an id below another path segment', () => {
    const value = new URL('https://nico.ms/watch/lv187388398')

    expect(unwrapNicoMs(value)).toBeUndefined()
  })

  it('should return undefined for an id followed by another path segment', () => {
    const value = new URL('https://nico.ms/lv187388398/extra')

    expect(unwrapNicoMs(value)).toBeUndefined()
  })

  it('should return undefined for an unrecognised prefix', () => {
    const value = new URL('https://nico.ms/xx12345')

    expect(unwrapNicoMs(value)).toBeUndefined()
  })

  it('should return undefined for non-nico.ms hosts', () => {
    const value = new URL('https://example.com/sm12345')

    expect(unwrapNicoMs(value)).toBeUndefined()
  })
})
