import { describe, expect, it } from 'bun:test'
import { unwrapXiaoyuzhou } from './xiaoyuzhou.js'

describe('unwrapXiaoyuzhou', () => {
  it('should extract a target without a scheme', () => {
    const value = new URL(
      'https://dts-api.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/6a69acb056a3f3491ba6d196/media.xyzcdn.net/632bdd5ef9101a1a5422db47/lppmLfBt883nEJUupEj3a1lnPRPm.m4a',
    )
    const expected = 'media.xyzcdn.net/632bdd5ef9101a1a5422db47/lppmLfBt883nEJUupEj3a1lnPRPm.m4a'

    expect(unwrapXiaoyuzhou(value)).toBe(expected)
  })

  it('should keep a target without a scheme behind an http prefix', () => {
    const value = new URL(
      'http://dts-api.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/69f09407740bacea87735df4/media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a',
    )
    const expected = 'media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a'

    expect(unwrapXiaoyuzhou(value)).toBe(expected)
  })

  it('should keep the target query string', () => {
    const value = new URL(
      'https://dts-api.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/69f09407740bacea87735df4/media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a?t=120',
    )
    const expected = 'media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a?t=120'

    expect(unwrapXiaoyuzhou(value)).toBe(expected)
  })

  it('should return undefined for a target outside media.xyzcdn.net', () => {
    const value = new URL(
      'https://dts-api.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/69f09407740bacea87735df4/example.com/episode.mp3',
    )

    expect(unwrapXiaoyuzhou(value)).toBeUndefined()
  })

  it('should return undefined for a target on a host that starts with media.xyzcdn.net', () => {
    const value = new URL(
      'https://dts-api.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/69f09407740bacea87735df4/media.xyzcdn.net.example.com/episode.mp3',
    )

    expect(unwrapXiaoyuzhou(value)).toBeUndefined()
  })

  it('should return undefined for a target that keeps its scheme', () => {
    const value = new URL(
      'https://dts-api.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/69f09407740bacea87735df4/https://media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a',
    )

    expect(unwrapXiaoyuzhou(value)).toBeUndefined()
  })

  it('should return undefined when the episode id is missing', () => {
    const value = new URL(
      'https://dts-api.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a',
    )

    expect(unwrapXiaoyuzhou(value)).toBeUndefined()
  })

  it('should return undefined for an id that is not a 24-digit hex id', () => {
    const value = new URL(
      'https://dts-api.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/69f09407740bacea87735df/media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a',
    )

    expect(unwrapXiaoyuzhou(value)).toBeUndefined()
  })

  it('should return undefined for the prefix below another segment', () => {
    const value = new URL(
      'https://dts-api.xiaoyuzhoufm.com/v1/track/632bdd5ef9101a1a5422db47/69f09407740bacea87735df4/media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a',
    )

    expect(unwrapXiaoyuzhou(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL(
      'https://www.xiaoyuzhoufm.com/track/632bdd5ef9101a1a5422db47/69f09407740bacea87735df4/media.xyzcdn.net/FvOFz_SxU5xJROBoHDhPB9CbwNzB.m4a',
    )

    expect(unwrapXiaoyuzhou(value)).toBeUndefined()
  })
})
